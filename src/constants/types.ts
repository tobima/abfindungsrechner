export type Jahr = 2025 | 2026;

export type Veranlagungsart = 'einzeln' | 'zusammen';

export interface GrundtarifKoeffizienten {
  grundfreibetrag: number;
  zone2Obergrenze: number;
  zone3Obergrenze: number;
  zone4Obergrenze: number;
  zone2Koeffizient: number;
  zone2Summand: number;
  zone3Koeffizient: number;
  zone3Summand: number;
  zone3Addend: number;
  zone4Satz: number;
  zone4Abzug: number;
  zone5Satz: number;
  zone5Abzug: number;
}

export interface SoliKonstanten {
  satz: number;
  milderungszoneSatz: number;
  freigrenzeEinzeln: number;
  freigrenzeZusammen: number;
}

export interface KirchensteuerKonstanten {
  satzAchtProzentLaender: readonly string[];
  satzAcht: number;
  satzNeun: number;
}

export interface KinderKonstanten {
  freibetragKombiniertProKind: number;
  kindergeldProMonat: number;
}

export interface VorsorgeaufwendungenKonstanten {
  hoechstbetragEinzeln: number;
  hoechstbetragZusammen: number;
}

export interface SpendenKonstanten {
  gemeinnuetzigMaxAnteilGdE: number;
  parteispendeErmaessigungSatz: number;
  /** §34g EStG: Deckel für die direkte Steuerermäßigung (50% der Spende bis zu diesem Betrag) */
  parteispendeErmaessigungHoechstbetragEinzeln: number;
  parteispendeErmaessigungHoechstbetragZusammen: number;
  /** §10b Abs. 2 EStG: zusätzlicher Sonderausgabenabzug für den die Ermäßigung übersteigenden Spendenbetrag */
  parteispendeSonderausgabenHoechstbetragEinzeln: number;
  parteispendeSonderausgabenHoechstbetragZusammen: number;
}

export interface InvestitionsabzugsbetragKonstanten {
  maxAnteilInvestitionskosten: number;
  hoechstbetrag: number;
  gewinngrenze: number;
}

export interface SozialversicherungKonstanten {
  bbgRvAvJahr: number;
  bbgKvPvJahr: number;
  rvSatzArbeitnehmer: number;
  avSatzArbeitnehmer: number;
  kvAllgemeinerSatz: number;
  kvDurchschnittlicherZusatzbeitrag: number;
  pvGrundsatzArbeitnehmer: number;
  pvKinderlosenzuschlag: number;
  pvAbschlagProKind: number;
  pvAbschlagMaxKinder: number;
}

export interface YearConstants {
  jahr: Jahr;
  grundtarif: GrundtarifKoeffizienten;
  soli: SoliKonstanten;
  kirchensteuer: KirchensteuerKonstanten;
  kinder: KinderKonstanten;
  vorsorgeaufwendungen: VorsorgeaufwendungenKonstanten;
  spenden: SpendenKonstanten;
  investitionsabzugsbetrag: InvestitionsabzugsbetragKonstanten;
  sozialversicherung: SozialversicherungKonstanten;
  arbeitnehmerPauschbetrag: number;
}
