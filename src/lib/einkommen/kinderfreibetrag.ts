import type { KinderKonstanten } from '../../constants/types';

export function berechneKinderfreibetragGesamt(anzahlKinder: number, k: KinderKonstanten): number {
  return Math.max(0, anzahlKinder) * k.freibetragKombiniertProKind;
}

export function berechneKindergeldJahr(anzahlKinder: number, k: KinderKonstanten): number {
  return Math.max(0, anzahlKinder) * k.kindergeldProMonat * 12;
}

export type KinderfreibetragGuenstigerePruefungErgebnis = {
  angewandt: 'kinderfreibetrag' | 'kindergeld';
  ergebnisEst: number;
};

/**
 * Günstigerprüfung: Der Kinderfreibetrag wird für die tatsächliche ESt-Zahllast nur angewendet, wenn die
 * Steuerersparnis größer ist als das während des Jahres bereits ausgezahlte Kindergeld (das dann verrechnet wird).
 */
export function pruefeGuenstigerePruefung(
  estOhneKinderfreibetrag: number,
  estMitKinderfreibetrag: number,
  kindergeldJahr: number,
): KinderfreibetragGuenstigerePruefungErgebnis {
  const ergebnisMitKinderfreibetrag = estMitKinderfreibetrag + kindergeldJahr;
  if (ergebnisMitKinderfreibetrag < estOhneKinderfreibetrag) {
    return { angewandt: 'kinderfreibetrag', ergebnisEst: ergebnisMitKinderfreibetrag };
  }
  return { angewandt: 'kindergeld', ergebnisEst: estOhneKinderfreibetrag };
}
