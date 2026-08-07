import { describe, expect, it } from 'vitest';
import { constants2025 } from '../../constants/years/2025';
import {
  berechneAltersvorsorgeSonderausgaben,
  berechneBasisvorsorgeSonderausgaben,
  berechneSpendenSonderausgaben,
} from './sonderausgaben';

describe('berechneAltersvorsorgeSonderausgaben', () => {
  const k = constants2025.vorsorgeaufwendungen;

  it('summiert Rürup- und gesetzliche RV-Beiträge unterhalb des Höchstbetrags', () => {
    expect(
      berechneAltersvorsorgeSonderausgaben(
        { ruerupBeitraege: 10000, rvBeitragGesamt: 15000, freiwilligeRvBeitraege: 0 },
        'einzeln',
        k,
      ),
    ).toBe(25000);
  });

  it('bezieht freiwillige RV-Beiträge in dieselbe Summe mit ein', () => {
    expect(
      berechneAltersvorsorgeSonderausgaben(
        { ruerupBeitraege: 5000, rvBeitragGesamt: 5000, freiwilligeRvBeitraege: 4000 },
        'einzeln',
        k,
      ),
    ).toBe(14000);
  });

  it('deckelt die Summe (inkl. freiwilliger RV-Beiträge) auf den Höchstbetrag (Einzelveranlagung)', () => {
    expect(
      berechneAltersvorsorgeSonderausgaben(
        { ruerupBeitraege: 20000, rvBeitragGesamt: 15000, freiwilligeRvBeitraege: 10000 },
        'einzeln',
        k,
      ),
    ).toBe(k.hoechstbetragEinzeln);
  });

  it('nutzt den doppelten Höchstbetrag bei Zusammenveranlagung', () => {
    expect(
      berechneAltersvorsorgeSonderausgaben(
        { ruerupBeitraege: 40000, rvBeitragGesamt: 30000, freiwilligeRvBeitraege: 0 },
        'zusammen',
        k,
      ),
    ).toBe(k.hoechstbetragZusammen);
  });
});

describe('berechneSpendenSonderausgaben', () => {
  const k = constants2025.spenden;

  it('lässt Spenden unterhalb des 20%-GdE-Deckels voll zu', () => {
    expect(berechneSpendenSonderausgaben(5000, 50000, k)).toBe(5000);
  });

  it('deckelt Spenden auf 20% des Gesamtbetrags der Einkünfte', () => {
    expect(berechneSpendenSonderausgaben(15000, 50000, k)).toBe(10000);
  });
});

describe('berechneBasisvorsorgeSonderausgaben', () => {
  it('summiert KV- und PV-Beiträge beider Personen ohne Deckelung', () => {
    expect(
      berechneBasisvorsorgeSonderausgaben({ kvEigen: 4000, pvEigen: 1000, kvPartner: 3000, pvPartner: 800 }),
    ).toBe(8800);
  });

  it('funktioniert auch ohne Ehepartner (0-Werte)', () => {
    expect(berechneBasisvorsorgeSonderausgaben({ kvEigen: 4000, pvEigen: 1000, kvPartner: 0, pvPartner: 0 })).toBe(
      5000,
    );
  });
});
