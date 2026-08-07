import type { SozialversicherungKonstanten } from '../../constants/types';
import { gedeckeltesBruttoKvPv } from './beitragsbemessungsgrenze';

export interface PflegeversicherungInput {
  bruttoJahr: number;
  gesetzlichVersichert: boolean;
  /** Nur relevant bei privater Pflegeversicherung: die individuelle Jahresprämie. */
  pkvPraemieJahr?: number;
  /** Kinderlos und mindestens 23 Jahre alt (Vereinfachung: Alter wird nicht separat geprüft). */
  kinderlos: boolean;
  /** Anzahl leiblicher/adoptierter/Stief-/Pflegekinder unter 25 Jahren, für den Beitragsabschlag ab dem 2. Kind. */
  anzahlKinderUnter25: number;
}

export function berechnePvBeitragArbeitnehmer(
  input: PflegeversicherungInput,
  k: SozialversicherungKonstanten,
): number {
  if (!input.gesetzlichVersichert) {
    return Math.max(0, input.pkvPraemieJahr ?? 0);
  }
  const kinderFuerAbschlag = Math.min(Math.max(input.anzahlKinderUnter25 - 1, 0), k.pvAbschlagMaxKinder);
  const abschlag = kinderFuerAbschlag * k.pvAbschlagProKind;
  const zuschlag = input.kinderlos ? k.pvKinderlosenzuschlag : 0;
  const satzArbeitnehmer = Math.max(0, k.pvGrundsatzArbeitnehmer + zuschlag - abschlag);
  return gedeckeltesBruttoKvPv(input.bruttoJahr, k) * satzArbeitnehmer;
}
