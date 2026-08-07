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

/**
 * §34 EStG-Falleneffekt: Die Fünftelregelung leitet die Steuer auf die Abfindung aus der Differenz
 * ESt(zvE+Abfindung/5) − ESt(zvE) ab und multipliziert sie mit 5. Bleibt die Abfindung unverändert und
 * steigt nur das reguläre zvE um einen Euro, steigt die Gesamtsteuer daher um
 * 5 × Grenzsteuersatz(zvE+Abfindung/5) − 4 × Grenzsteuersatz(zvE) — das kann 100% deutlich übersteigen,
 * wenn der "Fünftel-Punkt" bereits in einer höheren Progressionszone liegt als das reguläre zvE selbst.
 */
export function berechneGrenzbelastungWeiteresEinkommen(
  tariff: TariffFn,
  zvE: number,
  abfindung: number,
): number {
  const grenzsatzAmFuenftelPunkt = berechneGrenzsteuersatz(tariff, zvE + abfindung / 5);
  const grenzsatzAmZvE = berechneGrenzsteuersatz(tariff, zvE);
  return 5 * grenzsatzAmFuenftelPunkt - 4 * grenzsatzAmZvE;
}
