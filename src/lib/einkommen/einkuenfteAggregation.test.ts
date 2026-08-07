import { describe, expect, it } from 'vitest';
import { constants2026 } from '../../constants/years/2026';
import { berechneSummeDerEinkuenfte, type EinkuenfteInput } from './einkuenfteAggregation';

const iabK = constants2026.investitionsabzugsbetrag;
const pauschbetrag = constants2026.arbeitnehmerPauschbetrag;

function baseInput(overrides: Partial<EinkuenfteInput> = {}): EinkuenfteInput {
  return {
    veranlagungsart: 'einzeln',
    bruttoWeiteresEinkommenEigen: 0,
    werbungskostenEigen: 0,
    bruttoWeiteresEinkommenPartner: 0,
    werbungskostenPartner: 0,
    vermietungUndVerpachtung: 0,
    gewinnGewerbeEigenVorIab: 0,
    investitionskostenEigen: 0,
    gewinnGewerbePartnerVorIab: 0,
    investitionskostenPartner: 0,
    ausschuettungenTeileinkuenfteverfahren: 0,
    ...overrides,
  };
}

describe('berechneSummeDerEinkuenfte', () => {
  it('zieht den Arbeitnehmer-Pauschbetrag vom eigenen Einkommen ab', () => {
    const ergebnis = berechneSummeDerEinkuenfte(
      baseInput({ bruttoWeiteresEinkommenEigen: 40000 }),
      pauschbetrag,
      iabK,
    );
    expect(ergebnis.einkuenfteNsAEigen).toBe(40000 - pauschbetrag);
    expect(ergebnis.summeDerEinkuenfte).toBe(40000 - pauschbetrag);
  });

  it('ignoriert Partnereinkommen bei Einzelveranlagung', () => {
    const ergebnis = berechneSummeDerEinkuenfte(
      baseInput({ bruttoWeiteresEinkommenEigen: 40000, bruttoWeiteresEinkommenPartner: 60000 }),
      pauschbetrag,
      iabK,
    );
    expect(ergebnis.einkuenfteNsAPartner).toBe(0);
  });

  it('berücksichtigt Partnereinkommen bei Zusammenveranlagung', () => {
    const ergebnis = berechneSummeDerEinkuenfte(
      baseInput({
        veranlagungsart: 'zusammen',
        bruttoWeiteresEinkommenEigen: 40000,
        bruttoWeiteresEinkommenPartner: 60000,
      }),
      pauschbetrag,
      iabK,
    );
    expect(ergebnis.einkuenfteNsAPartner).toBe(60000 - pauschbetrag);
    expect(ergebnis.summeDerEinkuenfte).toBe(40000 - pauschbetrag + (60000 - pauschbetrag));
  });

  it('lässt Vermietungsverluste negativ in die Summe einfließen', () => {
    const ergebnis = berechneSummeDerEinkuenfte(
      baseInput({ bruttoWeiteresEinkommenEigen: 40000, vermietungUndVerpachtung: -5000 }),
      pauschbetrag,
      iabK,
    );
    expect(ergebnis.summeDerEinkuenfte).toBe(40000 - pauschbetrag - 5000);
  });

  it('mindert den Gewerbegewinn um den Investitionsabzugsbetrag', () => {
    const ergebnis = berechneSummeDerEinkuenfte(
      baseInput({ gewinnGewerbeEigenVorIab: 50000, investitionskostenEigen: 20000 }),
      pauschbetrag,
      iabK,
    );
    expect(ergebnis.iabEigen).toBe(10000);
    expect(ergebnis.gewinnGewerbeEigenNachIab).toBe(40000);
    expect(ergebnis.summeDerEinkuenfte).toBe(40000);
  });

  it('zieht bei nichtselbständiger Arbeit den Pauschbetrag ab, wenn keine höheren Werbungskosten angegeben sind', () => {
    const ergebnis = berechneSummeDerEinkuenfte(
      baseInput({ bruttoWeiteresEinkommenEigen: 40000, werbungskostenEigen: 500 }),
      pauschbetrag,
      iabK,
    );
    expect(ergebnis.einkuenfteNsAEigen).toBe(40000 - pauschbetrag);
  });

  it('zieht bei nichtselbständiger Arbeit die tatsächlichen Werbungskosten ab, wenn sie höher als der Pauschbetrag sind', () => {
    const ergebnis = berechneSummeDerEinkuenfte(
      baseInput({ bruttoWeiteresEinkommenEigen: 40000, werbungskostenEigen: 3000 }),
      pauschbetrag,
      iabK,
    );
    expect(ergebnis.einkuenfteNsAEigen).toBe(40000 - 3000);
  });

  it('berücksichtigt Ausschüttungen aus Unternehmensbeteiligungen zu 60% (Teileinkünfteverfahren)', () => {
    const ergebnis = berechneSummeDerEinkuenfte(
      baseInput({ ausschuettungenTeileinkuenfteverfahren: 10000 }),
      pauschbetrag,
      iabK,
    );
    expect(ergebnis.einkuenfteAusAusschuettungen).toBe(6000);
    expect(ergebnis.summeDerEinkuenfte).toBe(6000);
  });
});
