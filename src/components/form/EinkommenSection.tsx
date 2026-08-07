import type { Dispatch } from 'react';
import { NumberField } from './fields/NumberField';
import { PersonSvFields } from './PersonSvFields';
import type { FormAction } from '../../state/formReducer';
import type { FormInput, PersonSvFormInput } from '../../lib/types';

interface Props {
  input: FormInput;
  dispatch: Dispatch<FormAction>;
}

export function EinkommenSection({ input, dispatch }: Props) {
  function onEigenChange<K extends keyof PersonSvFormInput>(field: K, value: PersonSvFormInput[K]) {
    dispatch({ type: 'SET_SV_FIELD', person: 'sozialversicherungEigen', field, value });
  }
  function onPartnerChange<K extends keyof PersonSvFormInput>(field: K, value: PersonSvFormInput[K]) {
    dispatch({ type: 'SET_SV_FIELD', person: 'sozialversicherungPartner', field, value });
  }

  return (
    <div className="field-group">
      <PersonSvFields titel="Eigenes Einkommen" person={input.sozialversicherungEigen} onChange={onEigenChange} />

      {input.veranlagungsart === 'zusammen' && (
        <PersonSvFields
          titel="Einkommen des Ehepartners"
          person={input.sozialversicherungPartner}
          onChange={onPartnerChange}
        />
      )}

      <NumberField
        label="Einkünfte aus Vermietung und Verpachtung"
        value={input.vermietungUndVerpachtung}
        onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'vermietungUndVerpachtung', value })}
        step={100}
        min={-1000000}
        hint="Verluste als negative Zahl eingeben."
      />

      <NumberField
        label="Ausschüttungen aus Unternehmensbeteiligungen (Teileinkünfteverfahren)"
        value={input.ausschuettungenTeileinkuenfteverfahren}
        onChange={(value) =>
          dispatch({ type: 'SET_FIELD', field: 'ausschuettungenTeileinkuenfteverfahren', value })
        }
        hint="Bruttoausschüttung eintragen — 60% werden mit dem persönlichen Steuersatz versteuert, 40% bleiben steuerfrei (§3 Nr. 40 EStG). Gilt z.B. bei im Betriebsvermögen gehaltenen Anteilen oder Antrag zur Regelbesteuerung nach §32d Abs. 2 EStG, nicht bei der Abgeltungsteuer unterliegenden Kapitalerträgen."
      />
    </div>
  );
}
