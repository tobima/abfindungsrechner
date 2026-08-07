import { describe, expect, it } from 'vitest';
import { constants2025 } from '../../constants/years/2025';
import { constants2026 } from '../../constants/years/2026';
import { berechneGrundtarif } from './grundtarif';

describe('berechneGrundtarif 2025', () => {
  const k = constants2025.grundtarif;

  it('liefert 0 unterhalb und am Grundfreibetrag', () => {
    expect(berechneGrundtarif(0, k)).toBe(0);
    expect(berechneGrundtarif(12000, k)).toBe(0);
    expect(berechneGrundtarif(12096, k)).toBe(0);
  });

  it('stimmt mit unabhängig veröffentlichten Referenzwerten überein (finanz-tools.de)', () => {
    expect(berechneGrundtarif(30000, k)).toBe(4303);
    expect(berechneGrundtarif(50000, k)).toBe(10691);
    expect(berechneGrundtarif(70000, k)).toBe(18488);
  });

  it('ist an den Zonengrenzen stetig (keine Sprünge > 1€ durch Rundung)', () => {
    const grenzen = [k.grundfreibetrag, k.zone2Obergrenze, k.zone3Obergrenze, k.zone4Obergrenze];
    for (const grenze of grenzen) {
      const unten = berechneGrundtarif(grenze, k);
      const oben = berechneGrundtarif(grenze + 1, k);
      expect(oben - unten).toBeGreaterThanOrEqual(0);
      expect(oben - unten).toBeLessThan(2);
    }
  });

  it('ist monoton steigend', () => {
    let vorherig = 0;
    for (let zvE = 0; zvE <= 300000; zvE += 5000) {
      const est = berechneGrundtarif(zvE, k);
      expect(est).toBeGreaterThanOrEqual(vorherig);
      vorherig = est;
    }
  });

  it('behandelt negative zvE als 0', () => {
    expect(berechneGrundtarif(-5000, k)).toBe(0);
  });

  it('Spitzensteuersatz-Zone: 45% Grenzsteuersatz oberhalb 277.826€', () => {
    const est1 = berechneGrundtarif(300000, k);
    const est2 = berechneGrundtarif(310000, k);
    expect(est2 - est1).toBe(4500); // 10.000 * 45%
  });
});

describe('berechneGrundtarif 2026', () => {
  const k = constants2026.grundtarif;

  it('liefert 0 am/unterhalb des Grundfreibetrags', () => {
    expect(berechneGrundtarif(12348, k)).toBe(0);
  });

  it('ist an den Zonengrenzen stetig', () => {
    const grenzen = [k.grundfreibetrag, k.zone2Obergrenze, k.zone3Obergrenze, k.zone4Obergrenze];
    for (const grenze of grenzen) {
      const unten = berechneGrundtarif(grenze, k);
      const oben = berechneGrundtarif(grenze + 1, k);
      expect(oben - unten).toBeGreaterThanOrEqual(0);
      expect(oben - unten).toBeLessThan(2);
    }
  });

  it('ist monoton steigend', () => {
    let vorherig = 0;
    for (let zvE = 0; zvE <= 300000; zvE += 5000) {
      const est = berechneGrundtarif(zvE, k);
      expect(est).toBeGreaterThanOrEqual(vorherig);
      vorherig = est;
    }
  });
});
