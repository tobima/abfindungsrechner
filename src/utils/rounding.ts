/** BMF-Rundungsregel: zu versteuerndes Einkommen und Steuerbeträge werden auf volle Euro abgerundet. */
export function floorToEuro(betrag: number): number {
  return Math.floor(betrag);
}

/** Rundung auf n Nachkommastellen (Standard-kaufmännisch), z.B. für den Durchschnittssteuersatz beim Progressionsvorbehalt. */
export function roundToDecimalPlaces(wert: number, nachkommastellen: number): number {
  const faktor = 10 ** nachkommastellen;
  return Math.round(wert * faktor) / faktor;
}

/** zvE darf für die Tarif-Formeln nicht negativ werden (negative Summen aus Verlustquellen ergeben 0 Steuer, kein Verlustvortrag modelliert). */
export function clampNichtNegativ(wert: number): number {
  return Math.max(0, wert);
}
