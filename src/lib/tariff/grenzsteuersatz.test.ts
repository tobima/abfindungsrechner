import { describe, expect, it } from 'vitest';
import { constants2025 } from '../../constants/years/2025';
import { berechneGrundtarif } from './grundtarif';
import { berechneGrenzbelastungWeiteresEinkommen, berechneGrenzsteuersatz } from './grenzsteuersatz';

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

describe('berechneGrenzbelastungWeiteresEinkommen', () => {
  const k = constants2025.grundtarif;
  const tariff = (zvE: number) => berechneGrundtarif(zvE, k);

  it('entspricht dem normalen Grenzsteuersatz, wenn zvE und Fünftel-Punkt in derselben Zone liegen', () => {
    // zvE=100.000€ und zvE+Abfindung/5=105.000€ liegen beide in Zone 4 (42% linear) -> 5*42%-4*42%=42%
    const belastung = berechneGrenzbelastungWeiteresEinkommen(tariff, 100000, 25000);
    expect(belastung).toBeCloseTo(0.42, 5);
  });

  it('übersteigt 100%, wenn die Abfindung den Fünftel-Punkt in eine deutlich höhere Zone hebt (nachgerechnetes Beispiel)', () => {
    // zvE=10.000€ (Grundfreibetragszone, Grenzsteuersatz 0%), Abfindung=500.000€ -> Fünftel-Punkt=110.000€ (Zone 4, 42%)
    // Erwartete Grenzbelastung: 5*0,42 - 4*0 = 2,10 (210%)
    expect(berechneGrenzsteuersatz(tariff, 10000)).toBe(0);
    expect(berechneGrenzsteuersatz(tariff, 110000)).toBeCloseTo(0.42, 5);
    const belastung = berechneGrenzbelastungWeiteresEinkommen(tariff, 10000, 500000);
    expect(belastung).toBeCloseTo(2.1, 5);
    expect(belastung).toBeGreaterThan(1);
  });
});
