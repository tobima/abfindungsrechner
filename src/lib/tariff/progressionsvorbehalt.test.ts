import { describe, expect, it } from 'vitest';
import { constants2025 } from '../../constants/years/2025';
import { berechneGrundtarif } from './grundtarif';
import { withProgressionsvorbehalt } from './progressionsvorbehalt';

describe('withProgressionsvorbehalt', () => {
  const k = constants2025.grundtarif;
  const basis = (zvE: number) => berechneGrundtarif(zvE, k);

  it('ist die Identität, wenn keine Lohnersatzleistung vorliegt', () => {
    const tarif = withProgressionsvorbehalt(basis, 0);
    expect(tarif(30000)).toBe(basis(30000));
  });

  it('berechnet den Durchschnittssteuersatz auf zvE+Lohnersatz und wendet ihn auf zvE an (nachgerechnetes Beispiel)', () => {
    // zvE=30.000€, Lohnersatzleistung=10.000€ -> zvE_fiktiv=40.000€, ESt(40.000€)=7.320€ (2025 Grundtarif)
    // Durchschnittssatz = 7.320 / 40.000 = 0,1830 -> angewendet auf 30.000€ = 5.490€
    expect(basis(40000)).toBe(7320);
    const tarif = withProgressionsvorbehalt(basis, 10000);
    expect(tarif(30000)).toBe(5490);
  });

  it('führt zu einer höheren effektiven Steuer als ohne Progressionsvorbehalt (bei positivem Grenzsteuersatz)', () => {
    const tarif = withProgressionsvorbehalt(basis, 10000);
    expect(tarif(30000)).toBeGreaterThan(basis(30000));
  });
});
