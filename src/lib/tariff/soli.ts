import type { SoliKonstanten, Veranlagungsart } from '../../constants/types';
import { floorToEuro } from '../../utils/rounding';

/** Solidaritätszuschlagsgesetz: 5,5% oberhalb der Freigrenze, mit Milderungszone. */
export function berechneSoli(est: number, veranlagungsart: Veranlagungsart, k: SoliKonstanten): number {
  const freigrenze = veranlagungsart === 'zusammen' ? k.freigrenzeZusammen : k.freigrenzeEinzeln;
  if (est <= freigrenze) {
    return 0;
  }
  const regulaererSoli = est * k.satz;
  const milderungszoneSoli = (est - freigrenze) * k.milderungszoneSatz;
  return floorToEuro(Math.min(regulaererSoli, milderungszoneSoli));
}
