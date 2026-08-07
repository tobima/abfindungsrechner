import { describe, expect, it } from 'vitest';
import { constants2025 } from '../../constants/years/2025';
import {
  berechneKinderfreibetragGesamt,
  berechneKindergeldJahr,
  pruefeGuenstigerePruefung,
} from './kinderfreibetrag';

const k = constants2025.kinder;

describe('berechneKinderfreibetragGesamt / berechneKindergeldJahr', () => {
  it('skaliert linear mit der Kinderzahl', () => {
    expect(berechneKinderfreibetragGesamt(2, k)).toBe(2 * k.freibetragKombiniertProKind);
    expect(berechneKindergeldJahr(2, k)).toBe(2 * k.kindergeldProMonat * 12);
  });
});

describe('pruefeGuenstigerePruefung', () => {
  it('wählt den Kinderfreibetrag, wenn die Steuerersparnis das Kindergeld übersteigt', () => {
    // Ersparnis durch Freibetrag: 5000€, Kindergeld: 3060€ (255*12) -> Freibetrag lohnt sich
    const ergebnis = pruefeGuenstigerePruefung(20000, 15000, 3060);
    expect(ergebnis.angewandt).toBe('kinderfreibetrag');
    expect(ergebnis.ergebnisEst).toBe(18060);
  });

  it('wählt das Kindergeld, wenn die Steuerersparnis geringer als das Kindergeld ist', () => {
    // Ersparnis durch Freibetrag: nur 1000€, Kindergeld: 3060€ -> Kindergeld bleibt günstiger
    const ergebnis = pruefeGuenstigerePruefung(20000, 19000, 3060);
    expect(ergebnis.angewandt).toBe('kindergeld');
    expect(ergebnis.ergebnisEst).toBe(20000);
  });
});
