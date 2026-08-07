import type { GrundtarifKoeffizienten } from '../../constants/types';
import { berechneGrundtarif } from './grundtarif';

/** §32a Abs. 5 EStG Splittingtarif: das Zweifache der Steuer auf die Hälfte des gemeinsam zu versteuernden Einkommens. */
export function berechneSplittingtarif(zvE: number, k: GrundtarifKoeffizienten): number {
  return 2 * berechneGrundtarif(zvE / 2, k);
}
