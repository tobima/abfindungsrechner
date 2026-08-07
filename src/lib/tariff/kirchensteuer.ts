import type { Bundesland } from '../../constants/bundeslaender';
import type { KirchensteuerKonstanten } from '../../constants/types';
import { floorToEuro } from '../../utils/rounding';

export function berechneKirchensteuer(
  est: number,
  bundesland: Bundesland,
  kirchensteuerpflichtig: boolean,
  k: KirchensteuerKonstanten,
): number {
  if (!kirchensteuerpflichtig) {
    return 0;
  }
  const satz = k.satzAchtProzentLaender.includes(bundesland) ? k.satzAcht : k.satzNeun;
  return floorToEuro(est * satz);
}
