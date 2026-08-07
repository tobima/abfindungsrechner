import { describe, expect, it } from 'vitest';
import { constants2025 } from '../../constants/years/2025';
import { berechneGrundtarif } from './grundtarif';
import { berechneSplittingtarif } from './splittingtarif';

describe('berechneSplittingtarif', () => {
  const k = constants2025.grundtarif;

  it('ist das Zweifache des Grundtarifs auf die Hälfte des zvE', () => {
    for (const zvE of [20000, 50000, 100000, 250000]) {
      expect(berechneSplittingtarif(zvE, k)).toBe(2 * berechneGrundtarif(zvE / 2, k));
    }
  });

  it('verdoppelt effektiv den Grundfreibetrag', () => {
    expect(berechneSplittingtarif(2 * k.grundfreibetrag, k)).toBe(0);
    expect(berechneSplittingtarif(2 * k.grundfreibetrag + 1000, k)).toBeGreaterThan(0);
  });
});
