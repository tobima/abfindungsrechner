import type { Dispatch } from 'react';
import { NumberField } from './fields/NumberField';
import type { FormAction } from '../../state/formReducer';
import type { FormInput } from '../../lib/types';

interface Props {
  input: FormInput;
  dispatch: Dispatch<FormAction>;
}

export function AbfindungSection({ input, dispatch }: Props) {
  return (
    <div className="field-group">
      <NumberField
        label="Höhe der Abfindung"
        value={input.abfindung}
        onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'abfindung', value })}
        step={1000}
      />
      <p className="field-hint">
        Der Rechner geht von einer Einmalzahlung in einem Kalenderjahr aus (Voraussetzung für die
        Fünftelregelung). Die Abfindung selbst ist sozialversicherungsfrei.
      </p>
    </div>
  );
}
