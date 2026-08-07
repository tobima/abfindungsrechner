import { describe, expect, it } from 'vitest';
import { constants2025 } from '../../constants/years/2025';
import { berechneGrundtarif } from './grundtarif';
import { berechneGrenzsteuersatz } from './grenzsteuersatz';

describe('berechneGrenzsteuersatz', () => {
  const k = constants2025.grundtarif;
  const tariff = (zvE: number) => berechneGrundtarif(zvE, k);

  it('ist 0 unterhalb des Grundfreibetrags', () => {
    expect(berechneGrenzsteuersatz(tariff, 5000)).toBe(0);
  });

  it('entspricht dem linearen Grenzsteuersatz in Zone 4 (42%)', () => {
    expect(berechneGrenzsteuersatz(tariff, 100000)).toBeCloseTo(0.42, 5);
  });

  it('entspricht dem Spitzensteuersatz in Zone 5 (45%)', () => {
    expect(berechneGrenzsteuersatz(tariff, 300000)).toBeCloseTo(0.45, 5);
  });

  it('liegt in der Progressionszone zwischen 14% und 42%', () => {
    const satz = berechneGrenzsteuersatz(tariff, 15000);
    expect(satz).toBeGreaterThan(0.14);
    expect(satz).toBeLessThan(0.42);
  });
});
