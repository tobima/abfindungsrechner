import { describe, expect, it } from 'vitest';
import { berechneGesamtergebnis } from './gesamtberechnung';
import type { FormInput, PersonSvFormInput } from '../types';

function leerePerson(overrides: Partial<PersonSvFormInput> = {}): PersonSvFormInput {
  return {
    bruttoWeiteresEinkommenJahr: 0,
    werbungskosten: 0,
    rentenversicherungspflichtig: true,
    arbeitslosenversicherungspflichtig: true,
    gesetzlichVersichert: true,
    kinderlos: true,
    anzahlKinderUnter25: 0,
    ...overrides,
  };
}

function baseInput(overrides: Partial<FormInput> = {}): FormInput {
  return {
    jahr: 2025,
    veranlagungsart: 'einzeln',
    anzahlKinder: 0,
    vermietungUndVerpachtung: 0,
    ausschuettungenTeileinkuenfteverfahren: 0,
    gewinnGewerbeEigenVorIab: 0,
    investitionskostenEigen: 0,
    gewinnGewerbePartnerVorIab: 0,
    investitionskostenPartner: 0,
    lohnersatzleistungen: 0,
    ruerupBeitraege: 0,
    freiwilligeRvBeitraege: 0,
    spendeGemeinnuetzig: 0,
    spendeParteien: 0,
    abfindung: 0,
    kirchensteuerpflichtig: false,
    bundesland: 'Nordrhein-Westfalen',
    sozialversicherungEigen: leerePerson(),
    sozialversicherungPartner: leerePerson(),
    ...overrides,
  };
}

describe('berechneGesamtergebnis — Szenario 1: Single ohne Progressionsvorbehalt', () => {
  it('liefert einen positiven Steuervorteil durch die Fünftelregelung', () => {
    const ergebnis = berechneGesamtergebnis(
      baseInput({
        sozialversicherungEigen: leerePerson({ bruttoWeiteresEinkommenJahr: 40000 }),
        abfindung: 60000,
      }),
    );

    expect(ergebnis.steuerersparnisDurchFuenftelregelung).toBeGreaterThan(0);
    expect(ergebnis.nettoAbfindungMitFuenftelregelung).toBeGreaterThan(ergebnis.nettoAbfindungOhneFuenftelregelung);
    expect(ergebnis.nettoAbfindungMitFuenftelregelung).toBeLessThan(60000);
    expect(ergebnis.sozialversicherung.partner).toBeNull();
    // SV-Beiträge auf weiteres Einkommen fallen an, obwohl die Abfindung selbst sozialversicherungsfrei ist.
    expect(ergebnis.sozialversicherung.eigen.summeArbeitnehmer).toBeGreaterThan(0);
  });

  it('liefert plausible Grenz- und Gesamtsteuersätze je Szenario', () => {
    const ergebnis = berechneGesamtergebnis(
      baseInput({
        sozialversicherungEigen: leerePerson({ bruttoWeiteresEinkommenJahr: 40000 }),
        abfindung: 60000,
      }),
    );

    // Progressiver Tarif: Durchschnittssteuersatz liegt stets unterhalb des Grenzsteuersatzes.
    expect(ergebnis.baseline.gesamtsteuersatz).toBeLessThan(ergebnis.baseline.grenzsteuersatz);
    expect(ergebnis.ohneFuenftelregelung.gesamtsteuersatz).toBeLessThan(ergebnis.ohneFuenftelregelung.grenzsteuersatz);

    // Grenzsteuersatz auf ein höheres Einkommen (Abfindung voll dazugerechnet) ist mindestens so hoch wie ohne Abfindung.
    expect(ergebnis.ohneFuenftelregelung.grenzsteuersatz).toBeGreaterThanOrEqual(ergebnis.baseline.grenzsteuersatz);

    // Alle Sätze liegen in einem plausiblen Bereich zwischen 0% und 45%.
    for (const szenario of [ergebnis.baseline, ergebnis.mitFuenftelregelung, ergebnis.ohneFuenftelregelung]) {
      expect(szenario.grenzsteuersatz).toBeGreaterThanOrEqual(0);
      expect(szenario.grenzsteuersatz).toBeLessThanOrEqual(0.45);
      expect(szenario.gesamtsteuersatz).toBeGreaterThanOrEqual(0);
      expect(szenario.gesamtsteuersatz).toBeLessThanOrEqual(0.45);
    }

    // Die Fünftelregelung senkt den effektiven Gesamtsteuersatz auf dasselbe Gesamteinkommen.
    expect(ergebnis.mitFuenftelregelung.gesamtsteuersatz).toBeLessThan(ergebnis.ohneFuenftelregelung.gesamtsteuersatz);

    // Der Grenzsteuersatz beschreibt die Progressionsstufe beim tatsächlichen Gesamteinkommen (zvE + Abfindung) —
    // die Fünftelregelung ändert nur die Berechnungsmethode, nicht diese Progressionsstufe, daher identisch
    // zum Grenzsteuersatz "Ohne Fünftelregelung" (gleiche Kinderfreibetrag-Variante vorausgesetzt).
    expect(ergebnis.mitFuenftelregelung.grenzsteuersatz).toBeCloseTo(ergebnis.ohneFuenftelregelung.grenzsteuersatz, 5);
  });

  it('weist eine Grenzbelastung von deutlich über 100% aus, wenn die Abfindung den Fünftel-Punkt in eine hohe Progressionszone hebt', () => {
    // zvE=10.000€ liegt in der Grundfreibetragszone (0% Grenzsteuersatz), eine sehr hohe Abfindung
    // hebt den Fünftel-Punkt (zvE+Abfindung/5) weit in die 42%-Zone -> Falleneffekt der Fünftelregelung.
    const ergebnis = berechneGesamtergebnis(
      baseInput({
        sozialversicherungEigen: leerePerson({ bruttoWeiteresEinkommenJahr: 11230 }), // 11.230-1.230=10.000€ zvE
        abfindung: 500000,
      }),
    );

    expect(ergebnis.grenzbelastungWeiteresEinkommenMitFuenftelregelung).toBeGreaterThan(1);
  });

  it('liefert 0 Grenzbelastung auf weiteres Einkommen ohne Abfindung', () => {
    const ergebnis = berechneGesamtergebnis(
      baseInput({ sozialversicherungEigen: leerePerson({ bruttoWeiteresEinkommenJahr: 40000 }), abfindung: 0 }),
    );
    expect(ergebnis.grenzbelastungWeiteresEinkommenMitFuenftelregelung).toBe(0);
  });

  it('liefert konsistente Fünftelregelung-Zwischenwerte (zvE+1/5, dazugehörige ESt, Steuer nur auf die Abfindung)', () => {
    const ergebnis = berechneGesamtergebnis(
      baseInput({
        sozialversicherungEigen: leerePerson({ bruttoWeiteresEinkommenJahr: 40000 }),
        abfindung: 60000,
      }),
    );

    expect(ergebnis.zvEMitEinemFuenftelAbfindung).toBeCloseTo(ergebnis.zvEVarianteB + 60000 / 5, 0);
    expect(ergebnis.estMitEinemFuenftelAbfindung).toBeGreaterThan(ergebnis.baseline.estTatsaechlich);
    expect(ergebnis.steuerNurAufAbfindungMitFuenftelregelung).toBeCloseTo(
      ergebnis.mitFuenftelregelung.estVarianteB - ergebnis.baseline.estVarianteB,
      0,
    );
  });

  it('lässt bei fehlender RV-/AV-Pflicht (z.B. Beamte) keine Beiträge anfallen und keinen RV-Anteil in die Sonderausgaben einfließen', () => {
    const mitPflicht = berechneGesamtergebnis(
      baseInput({
        sozialversicherungEigen: leerePerson({ bruttoWeiteresEinkommenJahr: 40000 }),
        abfindung: 60000,
      }),
    );
    const ohnePflicht = berechneGesamtergebnis(
      baseInput({
        sozialversicherungEigen: leerePerson({
          bruttoWeiteresEinkommenJahr: 40000,
          rentenversicherungspflichtig: false,
          arbeitslosenversicherungspflichtig: false,
        }),
        abfindung: 60000,
      }),
    );

    expect(ohnePflicht.sozialversicherung.eigen.rvArbeitnehmer).toBe(0);
    expect(ohnePflicht.sozialversicherung.eigen.av).toBe(0);
    expect(ohnePflicht.sozialversicherung.eigen.kv).toBeGreaterThan(0);
    expect(ohnePflicht.altersvorsorgeSonderausgaben).toBeLessThan(mitPflicht.altersvorsorgeSonderausgaben);
  });

  it('berücksichtigt freiwillige Beiträge zur gesetzlichen Rentenversicherung als Sonderausgaben (gemeinsamer Höchstbetrag mit Rürup/Pflichtbeiträgen)', () => {
    const ohneFreiwillig = berechneGesamtergebnis(
      baseInput({
        sozialversicherungEigen: leerePerson({ bruttoWeiteresEinkommenJahr: 40000 }),
        abfindung: 60000,
      }),
    );
    const mitFreiwillig = berechneGesamtergebnis(
      baseInput({
        sozialversicherungEigen: leerePerson({ bruttoWeiteresEinkommenJahr: 40000 }),
        freiwilligeRvBeitraege: 5000,
        abfindung: 60000,
      }),
    );

    expect(mitFreiwillig.altersvorsorgeSonderausgaben).toBe(ohneFreiwillig.altersvorsorgeSonderausgaben + 5000);
    expect(mitFreiwillig.zvEVarianteA).toBe(ohneFreiwillig.zvEVarianteA - 5000);

    // Deckelung: freiwillige Beiträge über den verbleibenden Höchstbetrag hinaus wirken sich nicht mehr aus.
    const weitHueberHoechstbetrag = berechneGesamtergebnis(
      baseInput({
        sozialversicherungEigen: leerePerson({ bruttoWeiteresEinkommenJahr: 40000 }),
        ruerupBeitraege: 100000,
        freiwilligeRvBeitraege: 100000,
        abfindung: 60000,
      }),
    );
    expect(weitHueberHoechstbetrag.altersvorsorgeSonderausgaben).toBeLessThanOrEqual(29344);
  });

  it('besteuert Ausschüttungen aus Unternehmensbeteiligungen nur zu 60% (Teileinkünfteverfahren)', () => {
    const ohneAusschuettung = berechneGesamtergebnis(
      baseInput({
        sozialversicherungEigen: leerePerson({ bruttoWeiteresEinkommenJahr: 40000 }),
        abfindung: 60000,
      }),
    );
    const mitAusschuettung = berechneGesamtergebnis(
      baseInput({
        sozialversicherungEigen: leerePerson({ bruttoWeiteresEinkommenJahr: 40000 }),
        ausschuettungenTeileinkuenfteverfahren: 10000,
        abfindung: 60000,
      }),
    );

    expect(mitAusschuettung.summeDerEinkuenfte).toBe(ohneAusschuettung.summeDerEinkuenfte + 6000);
    expect(mitAusschuettung.zvEVarianteA).toBe(ohneAusschuettung.zvEVarianteA + 6000);
  });

  it('setzt bei nichtselbständiger Arbeit die höheren tatsächlichen Werbungskosten statt des Pauschbetrags an', () => {
    const mitPauschbetrag = berechneGesamtergebnis(
      baseInput({
        sozialversicherungEigen: leerePerson({ bruttoWeiteresEinkommenJahr: 40000 }),
        abfindung: 60000,
      }),
    );
    const mitHoeherenWerbungskosten = berechneGesamtergebnis(
      baseInput({
        sozialversicherungEigen: leerePerson({ bruttoWeiteresEinkommenJahr: 40000, werbungskosten: 3000 }),
        abfindung: 60000,
      }),
    );

    expect(mitHoeherenWerbungskosten.zvEVarianteA).toBeLessThan(mitPauschbetrag.zvEVarianteA);
  });

  it('bezieht die Abfindung in die 20%-GdE-Bemessungsgrundlage für den Spendenabzug ein', () => {
    // GdE ohne Abfindung: 40.000€ - 1.230€ Pauschbetrag = 38.770€ -> 20% = 7.754€ (zu wenig für 15.000€ Spende)
    // GdE inkl. Abfindung: 38.770€ + 60.000€ = 98.770€ -> 20% = 19.754€ (reicht für die volle Spende)
    const ergebnis = berechneGesamtergebnis(
      baseInput({
        sozialversicherungEigen: leerePerson({ bruttoWeiteresEinkommenJahr: 40000 }),
        spendeGemeinnuetzig: 15000,
        abfindung: 60000,
      }),
    );

    expect(ergebnis.spendenSonderausgaben).toBe(15000);
    expect(ergebnis.spendenSonderausgaben).toBeGreaterThan(0.2 * ergebnis.summeDerEinkuenfte);
  });

  it('berücksichtigt Beiträge zur privaten Kranken-/Pflegeversicherung als unbegrenzte Sonderausgabe', () => {
    const niedrigePraemie = berechneGesamtergebnis(
      baseInput({
        sozialversicherungEigen: leerePerson({
          bruttoWeiteresEinkommenJahr: 40000,
          gesetzlichVersichert: false,
          pkvPraemieJahrKv: 2000,
          pkvPraemieJahrPv: 500,
        }),
        abfindung: 60000,
      }),
    );
    const hoehePraemie = berechneGesamtergebnis(
      baseInput({
        sozialversicherungEigen: leerePerson({
          bruttoWeiteresEinkommenJahr: 40000,
          gesetzlichVersichert: false,
          pkvPraemieJahrKv: 5000,
          pkvPraemieJahrPv: 1200,
        }),
        abfindung: 60000,
      }),
    );

    expect(niedrigePraemie.basisvorsorgeSonderausgaben).toBe(2500);
    expect(hoehePraemie.basisvorsorgeSonderausgaben).toBe(6200);
    expect(hoehePraemie.zvEVarianteA).toBeLessThan(niedrigePraemie.zvEVarianteA);
  });

  it('ergibt ohne Abfindung keinen Unterschied zwischen den Szenarien', () => {
    const ergebnis = berechneGesamtergebnis(
      baseInput({ sozialversicherungEigen: leerePerson({ bruttoWeiteresEinkommenJahr: 40000 }), abfindung: 0 }),
    );
    expect(ergebnis.mitFuenftelregelung.summeSteuern).toBe(ergebnis.baseline.summeSteuern);
    expect(ergebnis.ohneFuenftelregelung.summeSteuern).toBe(ergebnis.baseline.summeSteuern);
    expect(ergebnis.steuerersparnisDurchFuenftelregelung).toBe(0);
  });
});

describe('berechneGesamtergebnis — Szenario 2: Verheiratet mit Kindern, Progressionsvorbehalt, Rürup, IAB', () => {
  it('berechnet ein konsistentes Gesamtergebnis ohne zu werfen', () => {
    const ergebnis = berechneGesamtergebnis(
      baseInput({
        veranlagungsart: 'zusammen',
        anzahlKinder: 2,
        sozialversicherungEigen: leerePerson({ bruttoWeiteresEinkommenJahr: 30000, kinderlos: false, anzahlKinderUnter25: 2 }),
        sozialversicherungPartner: leerePerson({ bruttoWeiteresEinkommenJahr: 20000, kinderlos: false, anzahlKinderUnter25: 2 }),
        lohnersatzleistungen: 8000,
        ruerupBeitraege: 5000,
        gewinnGewerbeEigenVorIab: 40000,
        investitionskostenEigen: 10000,
        spendeGemeinnuetzig: 500,
        spendeParteien: 1000,
        kirchensteuerpflichtig: true,
        bundesland: 'Bayern',
        abfindung: 80000,
      }),
    );

    expect(Number.isFinite(ergebnis.zvEVarianteB)).toBe(true);
    expect(ergebnis.zvEVarianteB).toBeLessThan(ergebnis.zvEVarianteA); // Kinderfreibetrag mindert zvE
    expect(ergebnis.altersvorsorgeSonderausgaben).toBeGreaterThan(0);
    expect(ergebnis.parteispendeSteuerermaessigung).toBeGreaterThan(0);
    expect(ergebnis.sozialversicherung.partner).not.toBeNull();
    expect(ergebnis.mitFuenftelregelung.summeSteuern).toBeGreaterThan(0);
    expect(ergebnis.nettoAbfindungMitFuenftelregelung).toBeLessThan(80000);
    expect(ergebnis.nettoAbfindungMitFuenftelregelung).toBeGreaterThan(0);
  });

  it('wendet bei Zusammenveranlagung die 8%-Kirchensteuer für Bayern an', () => {
    const ergebnis = berechneGesamtergebnis(
      baseInput({
        veranlagungsart: 'zusammen',
        sozialversicherungEigen: leerePerson({ bruttoWeiteresEinkommenJahr: 60000 }),
        sozialversicherungPartner: leerePerson({ bruttoWeiteresEinkommenJahr: 40000 }),
        kirchensteuerpflichtig: true,
        bundesland: 'Bayern',
        abfindung: 20000,
      }),
    );
    expect(ergebnis.mitFuenftelregelung.kirchensteuer).toBeGreaterThan(0);
  });
});

describe('berechneGesamtergebnis — Kinderfreibetrag-Günstigerprüfung', () => {
  it('wählt bei hohem Einkommen den Kinderfreibetrag (steuerliche Ersparnis übersteigt Kindergeld)', () => {
    const ergebnis = berechneGesamtergebnis(
      baseInput({
        anzahlKinder: 2,
        sozialversicherungEigen: leerePerson({ bruttoWeiteresEinkommenJahr: 150000 }),
        abfindung: 30000,
      }),
    );
    expect(ergebnis.baseline.kinderfreibetragAngewandt).toBe(true);
  });
});
