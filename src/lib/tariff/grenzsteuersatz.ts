import type { TariffFn } from './tariffFn';

/**
 * Numerische Näherung des Grenzsteuersatzes: Steueranstieg je zusätzlichem Euro am gegebenen zvE.
 * Ein Intervall von 100€ statt 1€ vermeidet Rauschen durch die Euro-Rundung der Tarif-Funktion,
 * ohne die Zonen-Zugehörigkeit in der Praxis zu verfälschen.
 */
export function berechneGrenzsteuersatz(tariff: TariffFn, zvE: number): number {
  const intervall = 100;
  const estUnten = tariff(zvE);
  const estOben = tariff(zvE + intervall);
  return (estOben - estUnten) / intervall;
}
