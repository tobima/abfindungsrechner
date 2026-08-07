import { describe, expect, it } from 'vitest';
import { constants2026 } from '../../constants/years/2026';
import { berechneAvBeitragArbeitnehmer } from './arbeitslosenversicherung';
import { berechneKvBeitragArbeitnehmer } from './krankenversicherung';
import { berechnePvBeitragArbeitnehmer } from './pflegeversicherung';
import { berechneRvBeitragArbeitnehmer, berechneRvBeitragGesamt } from './rentenversicherung';
import { berechneSvFuerPerson } from './svGesamt';

const k = constants2026.sozialversicherung;

describe('Rentenversicherung', () => {
  it('berechnet den AN-Anteil unterhalb der BBG', () => {
    expect(berechneRvBeitragArbeitnehmer(50000, true, k)).toBeCloseTo(4650, 5);
  });

  it('deckelt an der Beitragsbemessungsgrenze', () => {
    expect(berechneRvBeitragArbeitnehmer(150000, true, k)).toBeCloseTo(k.bbgRvAvJahr * k.rvSatzArbeitnehmer, 5);
  });

  it('Gesamtbeitrag ist das Doppelte des AN-Anteils (paritätische Finanzierung)', () => {
    expect(berechneRvBeitragGesamt(50000, true, k)).toBeCloseTo(2 * berechneRvBeitragArbeitnehmer(50000, true, k), 5);
  });

  it('ist 0, wenn keine Rentenversicherungspflicht besteht (z.B. Beamte)', () => {
    expect(berechneRvBeitragArbeitnehmer(50000, false, k)).toBe(0);
    expect(berechneRvBeitragGesamt(50000, false, k)).toBe(0);
  });
});

describe('Arbeitslosenversicherung', () => {
  it('berechnet den AN-Anteil und deckelt an der BBG', () => {
    expect(berechneAvBeitragArbeitnehmer(50000, true, k)).toBeCloseTo(650, 5);
    expect(berechneAvBeitragArbeitnehmer(150000, true, k)).toBeCloseTo(k.bbgRvAvJahr * k.avSatzArbeitnehmer, 5);
  });

  it('ist 0, wenn keine Arbeitslosenversicherungspflicht besteht', () => {
    expect(berechneAvBeitragArbeitnehmer(50000, false, k)).toBe(0);
  });
});

describe('Krankenversicherung', () => {
  it('berechnet den AN-Anteil (allgemeiner Satz + Zusatzbeitrag, hälftig) für gesetzlich Versicherte', () => {
    const beitrag = berechneKvBeitragArbeitnehmer(
      { bruttoJahr: 50000, gesetzlichVersichert: true },
      k,
    );
    expect(beitrag).toBeCloseTo(50000 * ((k.kvAllgemeinerSatz + k.kvDurchschnittlicherZusatzbeitrag) / 2), 5);
  });

  it('deckelt an der KV/PV-Beitragsbemessungsgrenze', () => {
    const beitrag = berechneKvBeitragArbeitnehmer(
      { bruttoJahr: 200000, gesetzlichVersichert: true },
      k,
    );
    expect(beitrag).toBeCloseTo(
      k.bbgKvPvJahr * ((k.kvAllgemeinerSatz + k.kvDurchschnittlicherZusatzbeitrag) / 2),
      5,
    );
  });

  it('nutzt die individuelle Prämie bei privater Krankenversicherung, unabhängig vom Brutto', () => {
    const beitrag = berechneKvBeitragArbeitnehmer(
      { bruttoJahr: 200000, gesetzlichVersichert: false, pkvPraemieJahr: 4200 },
      k,
    );
    expect(beitrag).toBe(4200);
  });
});

describe('Pflegeversicherung', () => {
  it('wendet den Kinderlosenzuschlag an', () => {
    const beitrag = berechnePvBeitragArbeitnehmer(
      { bruttoJahr: 50000, gesetzlichVersichert: true, kinderlos: true, anzahlKinderUnter25: 0 },
      k,
    );
    expect(beitrag).toBeCloseTo(50000 * (k.pvGrundsatzArbeitnehmer + k.pvKinderlosenzuschlag), 5);
  });

  it('gewährt beim ersten Kind noch keinen Abschlag', () => {
    const beitrag = berechnePvBeitragArbeitnehmer(
      { bruttoJahr: 50000, gesetzlichVersichert: true, kinderlos: false, anzahlKinderUnter25: 1 },
      k,
    );
    expect(beitrag).toBeCloseTo(50000 * k.pvGrundsatzArbeitnehmer, 5);
  });

  it('gewährt ab dem zweiten Kind einen Abschlag pro Kind', () => {
    const beitrag = berechnePvBeitragArbeitnehmer(
      { bruttoJahr: 50000, gesetzlichVersichert: true, kinderlos: false, anzahlKinderUnter25: 3 },
      k,
    );
    expect(beitrag).toBeCloseTo(50000 * (k.pvGrundsatzArbeitnehmer - 2 * k.pvAbschlagProKind), 5);
  });

  it('deckelt den Abschlag auf maximal 4 Kinder', () => {
    const beitrag = berechnePvBeitragArbeitnehmer(
      { bruttoJahr: 50000, gesetzlichVersichert: true, kinderlos: false, anzahlKinderUnter25: 10 },
      k,
    );
    expect(beitrag).toBeCloseTo(
      50000 * (k.pvGrundsatzArbeitnehmer - k.pvAbschlagMaxKinder * k.pvAbschlagProKind),
      5,
    );
  });
});

describe('berechneSvFuerPerson', () => {
  it('summiert RV+AV+KV+PV (Arbeitnehmeranteile) korrekt', () => {
    const ergebnis = berechneSvFuerPerson(
      {
        bruttoWeiteresEinkommenJahr: 50000,
        rentenversicherungspflichtig: true,
        arbeitslosenversicherungspflichtig: true,
        gesetzlichVersichert: true,
        kinderlos: true,
        anzahlKinderUnter25: 0,
      },
      k,
    );
    expect(ergebnis.summeArbeitnehmer).toBeCloseTo(
      ergebnis.rvArbeitnehmer + ergebnis.av + ergebnis.kv + ergebnis.pv,
      5,
    );
    expect(ergebnis.rvGesamt).toBeCloseTo(2 * ergebnis.rvArbeitnehmer, 5);
  });

  it('lässt RV/AV auf 0, wenn keine entsprechende Versicherungspflicht besteht (z.B. Beamte)', () => {
    const ergebnis = berechneSvFuerPerson(
      {
        bruttoWeiteresEinkommenJahr: 50000,
        rentenversicherungspflichtig: false,
        arbeitslosenversicherungspflichtig: false,
        gesetzlichVersichert: true,
        kinderlos: true,
        anzahlKinderUnter25: 0,
      },
      k,
    );
    expect(ergebnis.rvArbeitnehmer).toBe(0);
    expect(ergebnis.rvGesamt).toBe(0);
    expect(ergebnis.av).toBe(0);
    expect(ergebnis.kv).toBeGreaterThan(0);
  });
});
