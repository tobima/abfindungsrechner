import type { SpendenKonstanten, Veranlagungsart, VorsorgeaufwendungenKonstanten } from '../../constants/types';

export interface AltersvorsorgeInput {
  /** Eigene (und ggf. Ehepartner-) Rürup-/Basisrentenbeiträge des Jahres. */
  ruerupBeitraege: number;
  /** Gesetzliche Rentenversicherungspflichtbeiträge (Arbeitnehmer- + Arbeitgeberanteil), aus dem SV-Block. */
  rvBeitragGesamt: number;
  /** Freiwillige Beiträge zur gesetzlichen Rentenversicherung (§7 SGB VI), eigene und ggf. Ehepartner. */
  freiwilligeRvBeitraege: number;
}

/**
 * §10 Abs. 1 Nr. 2 / Abs. 3 EStG: Rürup-Beiträge, gesetzliche Rentenversicherungspflichtbeiträge und
 * freiwillige Beiträge zur gesetzlichen Rentenversicherung teilen sich einen gemeinsamen Höchstbetrag,
 * alle zu 100% abzugsfähig.
 */
export function berechneAltersvorsorgeSonderausgaben(
  input: AltersvorsorgeInput,
  veranlagungsart: Veranlagungsart,
  k: VorsorgeaufwendungenKonstanten,
): number {
  const hoechstbetrag = veranlagungsart === 'zusammen' ? k.hoechstbetragZusammen : k.hoechstbetragEinzeln;
  const summe =
    Math.max(0, input.ruerupBeitraege) +
    Math.max(0, input.rvBeitragGesamt) +
    Math.max(0, input.freiwilligeRvBeitraege);
  return Math.min(hoechstbetrag, summe);
}

/**
 * §10b Abs. 1 EStG: Spenden an gemeinnützige/kirchliche/wissenschaftliche Organisationen, gedeckelt auf 20%
 * des Gesamtbetrags der Einkünfte. Die Abfindung zählt zum Gesamtbetrag der Einkünfte dazu — die
 * Fünftelregelung ist nur eine Tarifvorschrift zur Steuerberechnung, sie schließt die Abfindung nicht aus
 * der Bemessungsgrundlage für diesen Deckel aus.
 */
export function berechneSpendenSonderausgaben(
  spendeGemeinnuetzig: number,
  gesamtbetragDerEinkuenfte: number,
  k: SpendenKonstanten,
): number {
  const deckel = Math.max(0, gesamtbetragDerEinkuenfte) * k.gemeinnuetzigMaxAnteilGdE;
  return Math.min(Math.max(0, spendeGemeinnuetzig), deckel);
}

export interface BasisvorsorgeInput {
  kvEigen: number;
  pvEigen: number;
  kvPartner: number;
  pvPartner: number;
}

/**
 * §10 Abs. 1 Nr. 3 EStG: Beiträge zur Basiskranken- und (gesetzlichen) Pflegeversicherung sind unbegrenzt
 * als Sonderausgaben abzugsfähig — das gilt für gesetzliche Pflichtbeiträge ebenso wie für die Beiträge zu
 * einer privaten Kranken-/Pflegeversicherung (vereinfachend wird hier die volle eingegebene Prämie als
 * Basisabsicherung behandelt, ohne Aufteilung in Basis- und Komfortanteil).
 */
export function berechneBasisvorsorgeSonderausgaben(input: BasisvorsorgeInput): number {
  return (
    Math.max(0, input.kvEigen) +
    Math.max(0, input.pvEigen) +
    Math.max(0, input.kvPartner) +
    Math.max(0, input.pvPartner)
  );
}
