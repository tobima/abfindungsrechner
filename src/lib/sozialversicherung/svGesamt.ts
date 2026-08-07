import type { SozialversicherungKonstanten } from '../../constants/types';
import { berechneAvBeitragArbeitnehmer } from './arbeitslosenversicherung';
import { berechneKvBeitragArbeitnehmer } from './krankenversicherung';
import { berechnePvBeitragArbeitnehmer } from './pflegeversicherung';
import { berechneRvBeitragArbeitnehmer, berechneRvBeitragGesamt } from './rentenversicherung';

export interface PersonSvInput {
  bruttoWeiteresEinkommenJahr: number;
  rentenversicherungspflichtig: boolean;
  arbeitslosenversicherungspflichtig: boolean;
  gesetzlichVersichert: boolean;
  pkvPraemieJahrKv?: number;
  pkvPraemieJahrPv?: number;
  kinderlos: boolean;
  anzahlKinderUnter25: number;
  zusatzbeitragSatz?: number;
}

export interface PersonSvErgebnis {
  rvArbeitnehmer: number;
  rvGesamt: number;
  av: number;
  kv: number;
  pv: number;
  summeArbeitnehmer: number;
}

export function berechneSvFuerPerson(
  input: PersonSvInput,
  k: SozialversicherungKonstanten,
): PersonSvErgebnis {
  const rvArbeitnehmer = berechneRvBeitragArbeitnehmer(
    input.bruttoWeiteresEinkommenJahr,
    input.rentenversicherungspflichtig,
    k,
  );
  const rvGesamt = berechneRvBeitragGesamt(input.bruttoWeiteresEinkommenJahr, input.rentenversicherungspflichtig, k);
  const av = berechneAvBeitragArbeitnehmer(
    input.bruttoWeiteresEinkommenJahr,
    input.arbeitslosenversicherungspflichtig,
    k,
  );
  const kv = berechneKvBeitragArbeitnehmer(
    {
      bruttoJahr: input.bruttoWeiteresEinkommenJahr,
      gesetzlichVersichert: input.gesetzlichVersichert,
      pkvPraemieJahr: input.pkvPraemieJahrKv,
      zusatzbeitragSatz: input.zusatzbeitragSatz,
    },
    k,
  );
  const pv = berechnePvBeitragArbeitnehmer(
    {
      bruttoJahr: input.bruttoWeiteresEinkommenJahr,
      gesetzlichVersichert: input.gesetzlichVersichert,
      pkvPraemieJahr: input.pkvPraemieJahrPv,
      kinderlos: input.kinderlos,
      anzahlKinderUnter25: input.anzahlKinderUnter25,
    },
    k,
  );

  return {
    rvArbeitnehmer,
    rvGesamt,
    av,
    kv,
    pv,
    summeArbeitnehmer: rvArbeitnehmer + av + kv + pv,
  };
}
