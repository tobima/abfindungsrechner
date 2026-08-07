import type { SozialversicherungKonstanten } from '../../constants/types';
import { gedeckeltesBruttoRvAv } from './beitragsbemessungsgrenze';

/**
 * Nicht jeder ist rentenversicherungspflichtig (z.B. Beamte, bestimmte Selbständige) —
 * ohne Versicherungspflicht fällt kein Beitrag an.
 */
export function berechneRvBeitragArbeitnehmer(
  bruttoJahr: number,
  rentenversicherungspflichtig: boolean,
  k: SozialversicherungKonstanten,
): number {
  if (!rentenversicherungspflichtig) {
    return 0;
  }
  return gedeckeltesBruttoRvAv(bruttoJahr, k) * k.rvSatzArbeitnehmer;
}

/** Gesamtbeitrag (Arbeitnehmer- + Arbeitgeberanteil) — bei der RV paritätisch, also einfach das Doppelte des AN-Anteils. */
export function berechneRvBeitragGesamt(
  bruttoJahr: number,
  rentenversicherungspflichtig: boolean,
  k: SozialversicherungKonstanten,
): number {
  return 2 * berechneRvBeitragArbeitnehmer(bruttoJahr, rentenversicherungspflichtig, k);
}
