import type { InvestitionsabzugsbetragKonstanten } from '../../constants/types';

export interface IabInput {
  gewinnVorAbzug: number;
  geplanteInvestitionskosten: number;
}

/**
 * §7g EStG Investitionsabzugsbetrag: bis zu 50% der geplanten Investitionskosten, gedeckelt auf den
 * gesetzlichen Höchstbetrag, nur wenn der Gewinn vor Abzug die Gewinngrenze nicht übersteigt.
 * Vereinfachung: die 3-Jahres-Investitionsfrist und eine rückwirkende Verzinsung bei Nichtinvestition
 * werden nicht modelliert (Annahme: fristgerechte Investition).
 */
export function berechneInvestitionsabzugsbetrag(
  input: IabInput,
  k: InvestitionsabzugsbetragKonstanten,
): number {
  if (input.gewinnVorAbzug > k.gewinngrenze) {
    return 0;
  }
  const beantragterBetrag = Math.max(0, input.geplanteInvestitionskosten) * k.maxAnteilInvestitionskosten;
  return Math.min(beantragterBetrag, k.hoechstbetrag);
}
