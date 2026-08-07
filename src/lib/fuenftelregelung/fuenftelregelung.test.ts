import { describe, expect, it } from 'vitest';
import { constants2025 } from '../../constants/years/2025';
import { berechneGrundtarif } from '../tariff/grundtarif';
import { berechneFuenftelregelung } from './fuenftelregelung';

describe('berechneFuenftelregelung', () => {
  const k = constants2025.grundtarif;
  const tariff = (zvE: number) => berechneGrundtarif(zvE, k);

  it('reduziert die Steuerlast gegenüber der regulären Besteuerung (nachgerechnetes Beispiel: zvE=40.000€, Abfindung=60.000€)', () => {
    const ergebnis = berechneFuenftelregelung(tariff, 40000, 60000);
    expect(ergebnis.estOhne).toBe(7320);
    expect(ergebnis.zvEMitEinemFuenftel).toBe(52000);
    expect(ergebnis.estMitEinemFuenftel).toBe(11407);
    expect(ergebnis.steuerAufAbfindungMitFuenftelregelung).toBe(20435);
    expect(ergebnis.estMitFuenftelregelung).toBe(27755);
    expect(ergebnis.estOhneFuenftelregelung).toBe(31088);
    expect(ergebnis.steuervorteilDurchFuenftelregelung).toBe(3333);
  });

  it('liefert keinen Vorteil, wenn keine Abfindung gezahlt wird', () => {
    const ergebnis = berechneFuenftelregelung(tariff, 40000, 0);
    expect(ergebnis.steuervorteilDurchFuenftelregelung).toBe(0);
    expect(ergebnis.estMitFuenftelregelung).toBe(ergebnis.estOhne);
  });

  it('liefert (annähernd) keinen Vorteil, wenn das zvE bereits durchgehend im Spitzensteuersatz liegt', () => {
    // Bei konstantem Grenzsteuersatz (45%) über den gesamten Abfindungsbereich hinweg ist die
    // Fünftelregelung wirkungslos, da sich der marginale Steuersatz durch die Streckung nicht ändert.
    const ergebnis = berechneFuenftelregelung(tariff, 400000, 50000);
    expect(ergebnis.steuervorteilDurchFuenftelregelung).toBe(0);
  });
});
