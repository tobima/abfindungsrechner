import type { TariffFn } from '../tariff/tariffFn';

export interface FuenftelregelungErgebnis {
  estOhne: number;
  zvEMitEinemFuenftel: number;
  estMitEinemFuenftel: number;
  estMitFuenftelregelung: number;
  estOhneFuenftelregelung: number;
  steuerAufAbfindungMitFuenftelregelung: number;
  steuervorteilDurchFuenftelregelung: number;
}

/**
 * §34 EStG Fünftelregelung: die Abfindung wird gedanklich in fünf gleiche Teile gesplittet, um den
 * Progressionseffekt der Einmalzahlung abzufedern. Vergleicht das Ergebnis zusätzlich mit der
 * regulären Besteuerung der vollen Abfindung im selben Jahr.
 */
export function berechneFuenftelregelung(
  tariff: TariffFn,
  zvENormal: number,
  abfindung: number,
): FuenftelregelungErgebnis {
  const estOhne = tariff(zvENormal);
  const zvEMitEinemFuenftel = zvENormal + abfindung / 5;
  const estMitEinemFuenftel = tariff(zvEMitEinemFuenftel);
  const steuerAufAbfindungMitFuenftelregelung = (estMitEinemFuenftel - estOhne) * 5;
  const estMitFuenftelregelung = estOhne + steuerAufAbfindungMitFuenftelregelung;
  const estOhneFuenftelregelung = tariff(zvENormal + abfindung);
  const steuervorteilDurchFuenftelregelung = estOhneFuenftelregelung - estMitFuenftelregelung;

  return {
    estOhne,
    zvEMitEinemFuenftel,
    estMitEinemFuenftel,
    estMitFuenftelregelung,
    estOhneFuenftelregelung,
    steuerAufAbfindungMitFuenftelregelung,
    steuervorteilDurchFuenftelregelung,
  };
}
