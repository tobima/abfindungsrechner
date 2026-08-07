import { describe, expect, it } from 'vitest';
import { constants2025 } from '../../constants/years/2025';
import { berechneSoli } from './soli';

describe('berechneSoli 2025', () => {
  const k = constants2025.soli;

  it('ist 0 bis zur Freigrenze (einzeln)', () => {
    expect(berechneSoli(19950, 'einzeln', k)).toBe(0);
    expect(berechneSoli(10000, 'einzeln', k)).toBe(0);
  });

  it('ist 0 bis zur Freigrenze (zusammen)', () => {
    expect(berechneSoli(39900, 'zusammen', k)).toBe(0);
  });

  it('greift in der Milderungszone knapp über der Freigrenze (11,9%-Zweig < 5,5%-Zweig)', () => {
    // est=20.000€: regulär 5,5%=1.100€, Milderung 11,9% von 50€=5,95€ -> Milderung greift
    const soli = berechneSoli(20000, 'einzeln', k);
    expect(soli).toBe(5);
    expect(soli).toBeLessThan(20000 * k.satz);
  });

  it('wechselt oberhalb des Übergangspunkts auf den regulären 5,5%-Satz', () => {
    // est=100.000€: regulär 5.500€, Milderung 11,9% von 80.050€=9.525,95€ -> regulärer Satz greift
    expect(berechneSoli(100000, 'einzeln', k)).toBe(5500);
  });

  it('nutzt die höhere Freigrenze bei Zusammenveranlagung', () => {
    expect(berechneSoli(40000, 'zusammen', k)).toBeGreaterThan(0);
    expect(berechneSoli(40000, 'einzeln', k)).toBeGreaterThan(berechneSoli(40000, 'zusammen', k));
  });
});
