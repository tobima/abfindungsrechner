import type { FormInput, PersonSvFormInput } from '../lib/types';

export function erstelleInitialState(): FormInput {
  const leerePerson: PersonSvFormInput = {
    bruttoWeiteresEinkommenJahr: 0,
    werbungskosten: 0,
    rentenversicherungspflichtig: true,
    arbeitslosenversicherungspflichtig: true,
    gesetzlichVersichert: true,
    pkvPraemieJahrKv: 0,
    pkvPraemieJahrPv: 0,
    kinderlos: true,
    anzahlKinderUnter25: 0,
    zusatzbeitragSatz: undefined,
  };

  return {
    jahr: 2026,
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
    sozialversicherungEigen: { ...leerePerson },
    sozialversicherungPartner: { ...leerePerson },
  };
}

export type FormAction =
  | { type: 'SET_FIELD'; field: keyof FormInput; value: FormInput[keyof FormInput] }
  | {
      type: 'SET_SV_FIELD';
      person: 'sozialversicherungEigen' | 'sozialversicherungPartner';
      field: keyof PersonSvFormInput;
      value: PersonSvFormInput[keyof PersonSvFormInput];
    };

export function formReducer(state: FormInput, action: FormAction): FormInput {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_SV_FIELD':
      return {
        ...state,
        [action.person]: { ...state[action.person], [action.field]: action.value },
      };
    default:
      return state;
  }
}
