import type { Dispatch } from 'react';
import { NumberField } from './fields/NumberField';
import type { FormAction } from '../../state/formReducer';
import type { FormInput } from '../../lib/types';

interface Props {
  input: FormInput;
  dispatch: Dispatch<FormAction>;
}

export function SpendenSection({ input, dispatch }: Props) {
  return (
    <div className="field-group">
      <NumberField
        label="Spenden an gemeinnützige/kirchliche/wissenschaftliche Organisationen"
        value={input.spendeGemeinnuetzig}
        onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'spendeGemeinnuetzig', value })}
        hint="Sonderausgabenabzug bis zu 20% des Gesamtbetrags der Einkünfte — die Abfindung zählt hierbei mit, auch wenn sie über die Fünftelregelung begünstigt besteuert wird."
      />
      <NumberField
        label="Spenden an politische Parteien / unabhängige Wählervereinigungen"
        value={input.spendeParteien}
        onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'spendeParteien', value })}
        hint="Werden steuerlich anders behandelt: zunächst als direkte Steuerermäßigung (50%, gedeckelt), darüber hinaus als zusätzlicher Sonderausgabenabzug."
      />
    </div>
  );
}
