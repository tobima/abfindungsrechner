import type { GrundtarifKoeffizienten, Veranlagungsart } from '../../constants/types';
import { berechneGrundtarif } from './grundtarif';
import { berechneSplittingtarif } from './splittingtarif';

/** Eine Tarif-Funktion bildet zvE auf die tarifliche Einkommensteuer ab. */
export type TariffFn = (zvE: number) => number;

export function buildTariffFn(veranlagungsart: Veranlagungsart, k: GrundtarifKoeffizienten): TariffFn {
  return veranlagungsart === 'zusammen'
    ? (zvE) => berechneSplittingtarif(zvE, k)
    : (zvE) => berechneGrundtarif(zvE, k);
}
