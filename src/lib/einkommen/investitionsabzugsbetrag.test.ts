import { describe, expect, it } from 'vitest';
import { constants2026 } from '../../constants/years/2026';
import { berechneInvestitionsabzugsbetrag } from './investitionsabzugsbetrag';

const k = constants2026.investitionsabzugsbetrag;

describe('berechneInvestitionsabzugsbetrag', () => {
  it('gewährt 50% der geplanten Investitionskosten unterhalb des Höchstbetrags', () => {
    expect(berechneInvestitionsabzugsbetrag({ gewinnVorAbzug: 50000, geplanteInvestitionskosten: 20000 }, k)).toBe(
      10000,
    );
  });

  it('deckelt auf den gesetzlichen Höchstbetrag (200.000€)', () => {
    expect(
      berechneInvestitionsabzugsbetrag({ gewinnVorAbzug: 50000, geplanteInvestitionskosten: 1000000 }, k),
    ).toBe(k.hoechstbetrag);
  });

  it('verweigert den Abzug, wenn der Gewinn die Gewinngrenze übersteigt', () => {
    expect(
      berechneInvestitionsabzugsbetrag({ gewinnVorAbzug: 250000, geplanteInvestitionskosten: 50000 }, k),
    ).toBe(0);
  });

  it('gewährt den Abzug noch exakt an der Gewinngrenze', () => {
    expect(
      berechneInvestitionsabzugsbetrag({ gewinnVorAbzug: k.gewinngrenze, geplanteInvestitionskosten: 10000 }, k),
    ).toBeGreaterThan(0);
  });
});
