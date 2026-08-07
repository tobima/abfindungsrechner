import type { Bundesland } from '../constants/bundeslaender';
import type { Jahr, Veranlagungsart } from '../constants/types';
import type { PersonSvErgebnis } from './sozialversicherung/svGesamt';

export interface PersonSvFormInput {
  bruttoWeiteresEinkommenJahr: number;
  /** Tatsächliche Werbungskosten; wird nur angesetzt, wenn höher als der Arbeitnehmer-Pauschbetrag (§9a EStG). */
  werbungskosten: number;
  rentenversicherungspflichtig: boolean;
  arbeitslosenversicherungspflichtig: boolean;
  gesetzlichVersichert: boolean;
  pkvPraemieJahrKv?: number;
  pkvPraemieJahrPv?: number;
  kinderlos: boolean;
  anzahlKinderUnter25: number;
  zusatzbeitragSatz?: number;
}

export interface FormInput {
  jahr: Jahr;
  veranlagungsart: Veranlagungsart;
  anzahlKinder: number;

  vermietungUndVerpachtung: number;
  /** Ausschüttungen aus Unternehmensbeteiligungen, für die das Teileinkünfteverfahren beantragt/anwendbar ist (§3 Nr. 40 EStG) — 60% davon sind steuerpflichtig. */
  ausschuettungenTeileinkuenfteverfahren: number;

  gewinnGewerbeEigenVorIab: number;
  investitionskostenEigen: number;
  gewinnGewerbePartnerVorIab: number;
  investitionskostenPartner: number;

  lohnersatzleistungen: number;
  ruerupBeitraege: number;
  freiwilligeRvBeitraege: number;

  spendeGemeinnuetzig: number;
  spendeParteien: number;

  abfindung: number;

  kirchensteuerpflichtig: boolean;
  bundesland: Bundesland;

  sozialversicherungEigen: PersonSvFormInput;
  sozialversicherungPartner: PersonSvFormInput;
}

export interface SzenarioErgebnis {
  estVarianteA: number;
  estVarianteB: number;
  estTatsaechlich: number;
  kinderfreibetragAngewandt: boolean;
  soli: number;
  kirchensteuer: number;
  summeSteuern: number;
  /** Grenzsteuersatz am für dieses Szenario maßgeblichen zvE (inkl. ggf. Progressionsvorbehalt). */
  grenzsteuersatz: number;
  /** Effektiver Gesamtsteuersatz: Summe aller Steuern bezogen auf das für dieses Szenario maßgebliche zu versteuernde Einkommen. */
  gesamtsteuersatz: number;
}

export interface GesamtberechnungErgebnis {
  jahr: Jahr;
  veranlagungsart: Veranlagungsart;
  summeDerEinkuenfte: number;
  altersvorsorgeSonderausgaben: number;
  /** §10 Abs. 1 Nr. 3 EStG: Basiskranken-/Pflegeversicherungsbeiträge (gesetzlich oder privat), unbegrenzt abzugsfähig. */
  basisvorsorgeSonderausgaben: number;
  spendenSonderausgaben: number;
  parteispendeSteuerermaessigung: number;
  kinderfreibetragGesamt: number;
  kindergeldJahr: number;
  zvEVarianteA: number;
  zvEVarianteB: number;
  /** zvE zzgl. eines Fünftels der Abfindung (Zwischenschritt der Fünftelregelung), der tatsächlich angewandten Variante. */
  zvEMitEinemFuenftelAbfindung: number;
  /** Einkommensteuer auf zvEMitEinemFuenftelAbfindung — der Zwischenwert, aus dem die Steuer auf die Abfindung abgeleitet wird. */
  estMitEinemFuenftelAbfindung: number;
  /** Nur der auf die Abfindung entfallende Steueranteil unter der Fünftelregelung (Differenz × 5). */
  steuerNurAufAbfindungMitFuenftelregelung: number;
  /**
   * §34 EStG-Falleneffekt: Grenzbelastung auf einen zusätzlichen Euro regulären Einkommens, während die
   * Abfindung unverändert bleibt und weiter über die Fünftelregelung versteuert wird. Kann durch die
   * ×5-Multiplikation der Fünftelregelung-Formel deutlich über 100% liegen.
   */
  grenzbelastungWeiteresEinkommenMitFuenftelregelung: number;
  baseline: SzenarioErgebnis;
  mitFuenftelregelung: SzenarioErgebnis;
  ohneFuenftelregelung: SzenarioErgebnis;
  nettoAbfindungMitFuenftelregelung: number;
  nettoAbfindungOhneFuenftelregelung: number;
  steuerersparnisDurchFuenftelregelung: number;
  sozialversicherung: {
    eigen: PersonSvErgebnis;
    partner: PersonSvErgebnis | null;
  };
}
