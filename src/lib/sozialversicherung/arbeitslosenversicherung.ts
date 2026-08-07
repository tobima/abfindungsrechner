import type { SozialversicherungKonstanten } from '../../constants/types';
import { gedeckeltesBruttoRvAv } from './beitragsbemessungsgrenze';

/**
 * Nicht jeder ist arbeitslosenversicherungspflichtig (z.B. Beamte, bestimmte Selbständige) —
 * ohne Versicherungspflicht fällt kein Beitrag an.
 */
export function berechneAvBeitragArbeitnehmer(
  bruttoJahr: number,
  arbeitslosenversicherungspflichtig: boolean,
  k: SozialversicherungKonstanten,
): number {
  if (!arbeitslosenversicherungspflichtig) {
    return 0;
  }
  return gedeckeltesBruttoRvAv(bruttoJahr, k) * k.avSatzArbeitnehmer;
}
