import { clampNichtNegativ, floorToEuro, roundToDecimalPlaces } from '../../utils/rounding';
import type { TariffFn } from './tariffFn';

/**
 * §32b EStG Durchschnittssteuersatz-Methode: Lohnersatzleistungen erhöhen fiktiv die Bemessungsgrundlage,
 * der daraus ermittelte Durchschnittssteuersatz wird auf das tatsächliche (reguläre) zvE angewendet.
 * Vereinfachung: keine zusätzliche Werbungskosten-Pauschale auf die Lohnersatzleistung angesetzt.
 */
export function withProgressionsvorbehalt(basis: TariffFn, lohnersatzleistungen: number): TariffFn {
  if (lohnersatzleistungen <= 0) {
    return basis;
  }
  return (zvE: number) => {
    const zvERegulaer = clampNichtNegativ(zvE);
    const zvEFiktiv = zvERegulaer + lohnersatzleistungen;
    if (zvEFiktiv <= 0) {
      return 0;
    }
    const estFiktiv = basis(zvEFiktiv);
    const durchschnittssatz = roundToDecimalPlaces(estFiktiv / zvEFiktiv, 4);
    return floorToEuro(durchschnittssatz * zvERegulaer);
  };
}
