import type { SozialversicherungKonstanten } from '../../constants/types';

export function gedeckeltesBruttoRvAv(bruttoJahr: number, k: SozialversicherungKonstanten): number {
  return Math.min(Math.max(0, bruttoJahr), k.bbgRvAvJahr);
}

export function gedeckeltesBruttoKvPv(bruttoJahr: number, k: SozialversicherungKonstanten): number {
  return Math.min(Math.max(0, bruttoJahr), k.bbgKvPvJahr);
}
