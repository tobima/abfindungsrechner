import type { GrundtarifKoeffizienten } from '../../constants/types';
import { clampNichtNegativ, floorToEuro } from '../../utils/rounding';

/** §32a Abs. 1 EStG Grundtarif: liefert die tarifliche Einkommensteuer für ein gegebenes zu versteuerndes Einkommen. */
export function berechneGrundtarif(zvERoh: number, k: GrundtarifKoeffizienten): number {
  const zvE = floorToEuro(clampNichtNegativ(zvERoh));

  if (zvE <= k.grundfreibetrag) {
    return 0;
  }
  if (zvE <= k.zone2Obergrenze) {
    const y = (zvE - k.grundfreibetrag) / 10000;
    return floorToEuro((k.zone2Koeffizient * y + k.zone2Summand) * y);
  }
  if (zvE <= k.zone3Obergrenze) {
    const z = (zvE - k.zone2Obergrenze) / 10000;
    return floorToEuro((k.zone3Koeffizient * z + k.zone3Summand) * z + k.zone3Addend);
  }
  if (zvE <= k.zone4Obergrenze) {
    return floorToEuro(k.zone4Satz * zvE - k.zone4Abzug);
  }
  return floorToEuro(k.zone5Satz * zvE - k.zone5Abzug);
}
