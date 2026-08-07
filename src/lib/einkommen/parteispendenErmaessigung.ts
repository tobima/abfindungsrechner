import type { SpendenKonstanten, Veranlagungsart } from '../../constants/types';

export interface ParteispendeErgebnis {
  /** §34g EStG: direkt von der tariflichen ESt abzuziehender Betrag. */
  steuerermaessigung: number;
  /** §10b Abs. 2 EStG: zusätzlicher Sonderausgabenabzug für den die Ermäßigung übersteigenden Spendenbetrag. */
  sonderausgabenabzug: number;
}

/** §34g / §10b Abs. 2 EStG: Parteispenden werden zunächst über eine Steuerermäßigung, darüber hinaus über einen Sonderausgabenabzug begünstigt. */
export function berechneParteispende(
  spendeParteien: number,
  veranlagungsart: Veranlagungsart,
  k: SpendenKonstanten,
): ParteispendeErgebnis {
  const spende = Math.max(0, spendeParteien);
  const zusammen = veranlagungsart === 'zusammen';
  const ermaessigungHoechstbetrag = zusammen
    ? k.parteispendeErmaessigungHoechstbetragZusammen
    : k.parteispendeErmaessigungHoechstbetragEinzeln;
  const sonderausgabenHoechstbetrag = zusammen
    ? k.parteispendeSonderausgabenHoechstbetragZusammen
    : k.parteispendeSonderausgabenHoechstbetragEinzeln;

  const steuerermaessigung = Math.min(spende * k.parteispendeErmaessigungSatz, ermaessigungHoechstbetrag);

  const spendenbasisFuerVolleErmaessigung = ermaessigungHoechstbetrag / k.parteispendeErmaessigungSatz;
  const uebersteigenderBetrag = Math.max(0, spende - spendenbasisFuerVolleErmaessigung);
  const sonderausgabenabzug = Math.min(uebersteigenderBetrag, sonderausgabenHoechstbetrag);

  return { steuerermaessigung, sonderausgabenabzug };
}
