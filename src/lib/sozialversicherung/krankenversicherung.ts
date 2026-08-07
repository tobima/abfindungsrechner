import type { SozialversicherungKonstanten } from '../../constants/types';
import { gedeckeltesBruttoKvPv } from './beitragsbemessungsgrenze';

export interface KrankenversicherungInput {
  bruttoJahr: number;
  gesetzlichVersichert: boolean;
  /** Nur relevant bei privater Krankenversicherung: die individuelle Jahresprämie. */
  pkvPraemieJahr?: number;
  /** Optionaler kassenindividueller Zusatzbeitragssatz; ohne Angabe wird der durchschnittliche Satz des Jahres verwendet. */
  zusatzbeitragSatz?: number;
}

export function berechneKvBeitragArbeitnehmer(
  input: KrankenversicherungInput,
  k: SozialversicherungKonstanten,
): number {
  if (!input.gesetzlichVersichert) {
    return Math.max(0, input.pkvPraemieJahr ?? 0);
  }
  const zusatzbeitrag = input.zusatzbeitragSatz ?? k.kvDurchschnittlicherZusatzbeitrag;
  const satzArbeitnehmer = (k.kvAllgemeinerSatz + zusatzbeitrag) / 2;
  return gedeckeltesBruttoKvPv(input.bruttoJahr, k) * satzArbeitnehmer;
}
