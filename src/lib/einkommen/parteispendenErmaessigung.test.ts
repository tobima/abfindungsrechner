import { describe, expect, it } from 'vitest';
import { constants2025 } from '../../constants/years/2025';
import { berechneParteispende } from './parteispendenErmaessigung';

const k = constants2025.spenden;

describe('berechneParteispende (2025, einzeln)', () => {
  it('gewährt 50% Steuerermäßigung unterhalb des Höchstbetrags, keinen zusätzlichen Sonderausgabenabzug', () => {
    const ergebnis = berechneParteispende(1000, 'einzeln', k);
    expect(ergebnis.steuerermaessigung).toBe(500);
    expect(ergebnis.sonderausgabenabzug).toBe(0);
  });

  it('deckelt die Ermäßigung und gewährt für den übersteigenden Betrag einen Sonderausgabenabzug', () => {
    const ergebnis = berechneParteispende(2000, 'einzeln', k);
    expect(ergebnis.steuerermaessigung).toBe(825);
    expect(ergebnis.sonderausgabenabzug).toBe(350);
  });

  it('deckelt auch den zusätzlichen Sonderausgabenabzug', () => {
    const ergebnis = berechneParteispende(5000, 'einzeln', k);
    expect(ergebnis.steuerermaessigung).toBe(825);
    expect(ergebnis.sonderausgabenabzug).toBe(1650);
  });

  it('nutzt bei Zusammenveranlagung die doppelten Höchstbeträge', () => {
    const ergebnis = berechneParteispende(2000, 'zusammen', k);
    expect(ergebnis.steuerermaessigung).toBe(1000);
    expect(ergebnis.sonderausgabenabzug).toBe(0);
  });
});
