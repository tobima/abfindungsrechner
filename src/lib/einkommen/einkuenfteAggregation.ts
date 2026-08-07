import type { InvestitionsabzugsbetragKonstanten, Veranlagungsart } from '../../constants/types';
import { berechneInvestitionsabzugsbetrag } from './investitionsabzugsbetrag';

/** §3 Nr. 40 EStG Teileinkünfteverfahren: 60% der Ausschüttung sind steuerpflichtig, 40% steuerfrei. */
const TEILEINKUENFTEVERFAHREN_STEUERPFLICHTIGER_ANTEIL = 0.6;

export interface EinkuenfteInput {
  veranlagungsart: Veranlagungsart;
  bruttoWeiteresEinkommenEigen: number;
  werbungskostenEigen: number;
  bruttoWeiteresEinkommenPartner: number;
  werbungskostenPartner: number;
  vermietungUndVerpachtung: number;
  gewinnGewerbeEigenVorIab: number;
  investitionskostenEigen: number;
  gewinnGewerbePartnerVorIab: number;
  investitionskostenPartner: number;
  ausschuettungenTeileinkuenfteverfahren: number;
}

export interface EinkuenfteErgebnis {
  einkuenfteNsAEigen: number;
  einkuenfteNsAPartner: number;
  einkuenfteVuV: number;
  iabEigen: number;
  gewinnGewerbeEigenNachIab: number;
  iabPartner: number;
  gewinnGewerbePartnerNachIab: number;
  einkuenfteAusAusschuettungen: number;
  summeDerEinkuenfte: number;
}

/**
 * §9a EStG: vom Arbeitslohn wird der Arbeitnehmer-Pauschbetrag abgezogen, es sei denn, die
 * nachgewiesenen tatsächlichen Werbungskosten sind höher (Günstigerprüfung).
 */
function berechneEinkuenfteNsA(bruttoJahr: number, werbungskosten: number, arbeitnehmerPauschbetrag: number): number {
  const abzug = Math.max(arbeitnehmerPauschbetrag, Math.max(0, werbungskosten));
  return Math.max(0, bruttoJahr - abzug);
}

/** Stage 1 der Berechnungs-Pipeline: aggregiert alle Einkunftsarten zur Summe der Einkünfte (GdE). */
export function berechneSummeDerEinkuenfte(
  input: EinkuenfteInput,
  arbeitnehmerPauschbetrag: number,
  iabKonstanten: InvestitionsabzugsbetragKonstanten,
): EinkuenfteErgebnis {
  const zusammen = input.veranlagungsart === 'zusammen';

  const einkuenfteNsAEigen = berechneEinkuenfteNsA(
    input.bruttoWeiteresEinkommenEigen,
    input.werbungskostenEigen,
    arbeitnehmerPauschbetrag,
  );
  const einkuenfteNsAPartner = zusammen
    ? berechneEinkuenfteNsA(input.bruttoWeiteresEinkommenPartner, input.werbungskostenPartner, arbeitnehmerPauschbetrag)
    : 0;

  const iabEigen = berechneInvestitionsabzugsbetrag(
    { gewinnVorAbzug: input.gewinnGewerbeEigenVorIab, geplanteInvestitionskosten: input.investitionskostenEigen },
    iabKonstanten,
  );
  const gewinnGewerbeEigenNachIab = input.gewinnGewerbeEigenVorIab - iabEigen;

  const iabPartner = zusammen
    ? berechneInvestitionsabzugsbetrag(
        {
          gewinnVorAbzug: input.gewinnGewerbePartnerVorIab,
          geplanteInvestitionskosten: input.investitionskostenPartner,
        },
        iabKonstanten,
      )
    : 0;
  const gewinnGewerbePartnerNachIab = zusammen ? input.gewinnGewerbePartnerVorIab - iabPartner : 0;

  const einkuenfteAusAusschuettungen =
    Math.max(0, input.ausschuettungenTeileinkuenfteverfahren) * TEILEINKUENFTEVERFAHREN_STEUERPFLICHTIGER_ANTEIL;

  const summeDerEinkuenfte =
    einkuenfteNsAEigen +
    einkuenfteNsAPartner +
    input.vermietungUndVerpachtung +
    gewinnGewerbeEigenNachIab +
    gewinnGewerbePartnerNachIab +
    einkuenfteAusAusschuettungen;

  return {
    einkuenfteNsAEigen,
    einkuenfteNsAPartner,
    einkuenfteVuV: input.vermietungUndVerpachtung,
    iabEigen,
    gewinnGewerbeEigenNachIab,
    iabPartner,
    gewinnGewerbePartnerNachIab,
    einkuenfteAusAusschuettungen,
    summeDerEinkuenfte,
  };
}
