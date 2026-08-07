import { describe, expect, it } from 'vitest';
import { constants2025 } from '../../constants/years/2025';
import { berechneKirchensteuer } from './kirchensteuer';

describe('berechneKirchensteuer', () => {
  const k = constants2025.kirchensteuer;

  it('ist 0, wenn nicht kirchensteuerpflichtig', () => {
    expect(berechneKirchensteuer(10000, 'Bayern', false, k)).toBe(0);
  });

  it('nutzt 8% in Bayern und Baden-Württemberg', () => {
    expect(berechneKirchensteuer(10000, 'Bayern', true, k)).toBe(800);
    expect(berechneKirchensteuer(10000, 'Baden-Württemberg', true, k)).toBe(800);
  });

  it('nutzt 9% in allen anderen Bundesländern', () => {
    expect(berechneKirchensteuer(10000, 'Nordrhein-Westfalen', true, k)).toBe(900);
    expect(berechneKirchensteuer(10000, 'Berlin', true, k)).toBe(900);
  });
});
