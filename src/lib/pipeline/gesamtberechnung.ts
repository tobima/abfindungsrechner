import { getYearConstants } from '../../constants/years';
import { berechneKinderfreibetragGesamt, berechneKindergeldJahr, pruefeGuenstigerePruefung } from '../einkommen/kinderfreibetrag';
import { berechneSummeDerEinkuenfte } from '../einkommen/einkuenfteAggregation';
import {
  berechneAltersvorsorgeSonderausgaben,
  berechneBasisvorsorgeSonderausgaben,
  berechneSpendenSonderausgaben,
} from '../einkommen/sonderausgaben';
import { berechneParteispende } from '../einkommen/parteispendenErmaessigung';
import { berechneFuenftelregelung, type FuenftelregelungErgebnis } from '../fuenftelregelung/fuenftelregelung';
import { buildTariffFn } from '../tariff/tariffFn';
import { withProgressionsvorbehalt } from '../tariff/progressionsvorbehalt';
import { berechneSoli } from '../tariff/soli';
import { berechneKirchensteuer } from '../tariff/kirchensteuer';
import { berechneGrenzsteuersatz } from '../tariff/grenzsteuersatz';
import { berechneSvFuerPerson, type PersonSvErgebnis } from '../sozialversicherung/svGesamt';
import type { FormInput, GesamtberechnungErgebnis, SzenarioErgebnis } from '../types';
import { floorToEuro } from '../../utils/rounding';

function wendeSteuerermaessigungAn(est: number, ermaessigung: number): number {
  return Math.max(0, floorToEuro(est - ermaessigung));
}

export function berechneGesamtergebnis(input: FormInput): GesamtberechnungErgebnis {
  const k = getYearConstants(input.jahr);
  const zusammen = input.veranlagungsart === 'zusammen';

  // Stage 1b: Sozialversicherung, unabhängig vom ESt-Pfad, Abfindung fließt nie ein.
  const svEigen: PersonSvErgebnis = berechneSvFuerPerson(input.sozialversicherungEigen, k.sozialversicherung);
  const svPartner: PersonSvErgebnis | null = zusammen
    ? berechneSvFuerPerson(input.sozialversicherungPartner, k.sozialversicherung)
    : null;

  // Stage 1: Summe der Einkünfte (inkl. IAB auf Gewerbegewinn).
  const einkuenfte = berechneSummeDerEinkuenfte(
    {
      veranlagungsart: input.veranlagungsart,
      bruttoWeiteresEinkommenEigen: input.sozialversicherungEigen.bruttoWeiteresEinkommenJahr,
      werbungskostenEigen: input.sozialversicherungEigen.werbungskosten,
      bruttoWeiteresEinkommenPartner: input.sozialversicherungPartner.bruttoWeiteresEinkommenJahr,
      werbungskostenPartner: input.sozialversicherungPartner.werbungskosten,
      vermietungUndVerpachtung: input.vermietungUndVerpachtung,
      gewinnGewerbeEigenVorIab: input.gewinnGewerbeEigenVorIab,
      investitionskostenEigen: input.investitionskostenEigen,
      gewinnGewerbePartnerVorIab: input.gewinnGewerbePartnerVorIab,
      investitionskostenPartner: input.investitionskostenPartner,
      ausschuettungenTeileinkuenfteverfahren: input.ausschuettungenTeileinkuenfteverfahren,
    },
    k.arbeitnehmerPauschbetrag,
    k.investitionsabzugsbetrag,
  );

  // Parteispende: Ermäßigung (wirkt später direkt auf die ESt) und Sonderausgabenanteil (wirkt auf die zvE) trennen.
  const parteispende = berechneParteispende(input.spendeParteien, input.veranlagungsart, k.spenden);

  // Stage 2: Sonderausgabenabzug (Altersvorsorge getrennt von Spenden, jeweils eigener Deckel).
  const rvBeitragGesamt = svEigen.rvGesamt + (svPartner?.rvGesamt ?? 0);
  const altersvorsorgeSonderausgaben = berechneAltersvorsorgeSonderausgaben(
    {
      ruerupBeitraege: input.ruerupBeitraege,
      rvBeitragGesamt,
      freiwilligeRvBeitraege: input.freiwilligeRvBeitraege,
    },
    input.veranlagungsart,
    k.vorsorgeaufwendungen,
  );
  // Die Abfindung zählt zum Gesamtbetrag der Einkünfte dazu — die Fünftelregelung ist nur eine
  // Tarifvorschrift und schließt sie nicht aus der Bemessungsgrundlage für den Spenden-Deckel aus.
  const gesamtbetragDerEinkuenfteMitAbfindung = einkuenfte.summeDerEinkuenfte + input.abfindung;
  const spendenSonderausgabenGemeinnuetzig = berechneSpendenSonderausgaben(
    input.spendeGemeinnuetzig,
    gesamtbetragDerEinkuenfteMitAbfindung,
    k.spenden,
  );
  const spendenSonderausgaben = spendenSonderausgabenGemeinnuetzig + parteispende.sonderausgabenabzug;

  // §10 Abs. 1 Nr. 3 EStG: Basiskranken-/Pflegeversicherungsbeiträge (gesetzlich oder privat), unbegrenzt abzugsfähig.
  const basisvorsorgeSonderausgaben = berechneBasisvorsorgeSonderausgaben({
    kvEigen: svEigen.kv,
    pvEigen: svEigen.pv,
    kvPartner: svPartner?.kv ?? 0,
    pvPartner: svPartner?.pv ?? 0,
  });

  // Stage 3: zvE in zwei Varianten (mit/ohne Kinderfreibetrag) für die spätere Günstigerprüfung.
  const kinderfreibetragGesamt = berechneKinderfreibetragGesamt(input.anzahlKinder, k.kinder);
  const kindergeldJahr = berechneKindergeldJahr(input.anzahlKinder, k.kinder);
  const zvEVarianteA =
    einkuenfte.summeDerEinkuenfte - altersvorsorgeSonderausgaben - spendenSonderausgaben - basisvorsorgeSonderausgaben;
  const zvEVarianteB = zvEVarianteA - kinderfreibetragGesamt;

  // Stage 4: effektive Tarif-Funktion (Grund-/Splittingtarif, ggf. mit Progressionsvorbehalt).
  const basisTarif = buildTariffFn(input.veranlagungsart, k.grundtarif);
  const tariffEffektiv = withProgressionsvorbehalt(basisTarif, input.lohnersatzleistungen);

  // Stage 5: Fünftelregelung je Variante A/B.
  const fuenftelA = berechneFuenftelregelung(tariffEffektiv, zvEVarianteA, input.abfindung);
  const fuenftelB = berechneFuenftelregelung(tariffEffektiv, zvEVarianteB, input.abfindung);

  function szenario(
    getEstA: (f: FuenftelregelungErgebnis) => number,
    getEstB: (f: FuenftelregelungErgebnis) => number,
    /** Zuschlag zum zvE der gewählten Variante, an dem der Grenzsteuersatz dieses Szenarios abgelesen wird. */
    zvEZuschlagGrenz: number,
    /** Zuschlag zum zvE der gewählten Variante, der als Bemessungsgrundlage für den Gesamtsteuersatz dient. */
    zvEZuschlagDurchschnitt: number,
  ): SzenarioErgebnis {
    // Stage 5b: Parteispenden-Steuerermäßigung direkt von der ESt abziehen (beide Varianten).
    const estAMitErmaessigung = wendeSteuerermaessigungAn(getEstA(fuenftelA), parteispende.steuerermaessigung);
    const estBMitErmaessigung = wendeSteuerermaessigungAn(getEstB(fuenftelB), parteispende.steuerermaessigung);

    // Stage 6: Kinderfreibetrag-Günstigerprüfung bestimmt die tatsächliche ESt-Zahllast.
    const guenstiger = pruefeGuenstigerePruefung(estAMitErmaessigung, estBMitErmaessigung, kindergeldJahr);

    // Stage 7: Soli/Kirchensteuer IMMER auf Basis von Variante B (unabhängig von der Günstigerprüfung).
    const soli = berechneSoli(estBMitErmaessigung, input.veranlagungsart, k.soli);
    const kirchensteuer = berechneKirchensteuer(
      estBMitErmaessigung,
      input.bundesland,
      input.kirchensteuerpflichtig,
      k.kirchensteuer,
    );

    const summeSteuern = guenstiger.ergebnisEst + soli + kirchensteuer;

    const zvEBasis = guenstiger.angewandt === 'kinderfreibetrag' ? zvEVarianteB : zvEVarianteA;
    const grenzsteuersatz = berechneGrenzsteuersatz(tariffEffektiv, zvEBasis + zvEZuschlagGrenz);
    const zvEDurchschnitt = zvEBasis + zvEZuschlagDurchschnitt;
    const gesamtsteuersatz = zvEDurchschnitt > 0 ? summeSteuern / zvEDurchschnitt : 0;

    return {
      estVarianteA: estAMitErmaessigung,
      estVarianteB: estBMitErmaessigung,
      estTatsaechlich: guenstiger.ergebnisEst,
      kinderfreibetragAngewandt: guenstiger.angewandt === 'kinderfreibetrag',
      soli,
      kirchensteuer,
      summeSteuern,
      grenzsteuersatz,
      gesamtsteuersatz,
    };
  }

  const baseline = szenario((f) => f.estOhne, (f) => f.estOhne, 0, 0);
  // Grenzsteuersatz "Mit Fünftelregelung" wird am vollen Gesamteinkommen (zvE + Abfindung) abgelesen,
  // nicht am Fünftel-Zwischenwert: die Fünftelregelung ändert nur die Berechnungsmethode der Steuer,
  // nicht die Progressionsstufe/das Gesamteinkommen, in der/dem man sich tatsächlich befindet.
  const mitFuenftelregelung = szenario(
    (f) => f.estMitFuenftelregelung,
    (f) => f.estMitFuenftelregelung,
    input.abfindung,
    input.abfindung,
  );
  const ohneFuenftelregelung = szenario(
    (f) => f.estOhneFuenftelregelung,
    (f) => f.estOhneFuenftelregelung,
    input.abfindung,
    input.abfindung,
  );

  // Zwischenschritte der Fünftelregelung, aus derselben Variante (A/B) wie die tatsächliche ESt (Stage 6).
  const fuenftelGewaehlt = mitFuenftelregelung.kinderfreibetragAngewandt ? fuenftelB : fuenftelA;
  const zvEMitEinemFuenftelAbfindung = fuenftelGewaehlt.zvEMitEinemFuenftel;
  const estMitEinemFuenftelAbfindung = fuenftelGewaehlt.estMitEinemFuenftel;
  const steuerNurAufAbfindungMitFuenftelregelung = fuenftelGewaehlt.steuerAufAbfindungMitFuenftelregelung;

  // Stage 8: Netto-Abfindung je Szenario und Gesamt-Steuerersparnis durch die Fünftelregelung.
  const belastungMit = mitFuenftelregelung.summeSteuern - baseline.summeSteuern;
  const belastungOhne = ohneFuenftelregelung.summeSteuern - baseline.summeSteuern;

  return {
    jahr: input.jahr,
    veranlagungsart: input.veranlagungsart,
    summeDerEinkuenfte: einkuenfte.summeDerEinkuenfte,
    altersvorsorgeSonderausgaben,
    basisvorsorgeSonderausgaben,
    spendenSonderausgaben,
    parteispendeSteuerermaessigung: parteispende.steuerermaessigung,
    kinderfreibetragGesamt,
    kindergeldJahr,
    zvEVarianteA,
    zvEVarianteB,
    zvEMitEinemFuenftelAbfindung,
    estMitEinemFuenftelAbfindung,
    steuerNurAufAbfindungMitFuenftelregelung,
    baseline,
    mitFuenftelregelung,
    ohneFuenftelregelung,
    nettoAbfindungMitFuenftelregelung: input.abfindung - belastungMit,
    nettoAbfindungOhneFuenftelregelung: input.abfindung - belastungOhne,
    steuerersparnisDurchFuenftelregelung: belastungOhne - belastungMit,
    sozialversicherung: {
      eigen: svEigen,
      partner: svPartner,
    },
  };
}
