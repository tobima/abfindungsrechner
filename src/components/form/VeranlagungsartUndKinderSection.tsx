import type { Dispatch } from 'react';
import { NumberField } from './fields/NumberField';
import type { FormAction } from '../../state/formReducer';
import type { FormInput } from '../../lib/types';
import type { Veranlagungsart } from '../../constants/types';

interface Props {
  input: FormInput;
  dispatch: Dispatch<FormAction>;
}

export function VeranlagungsartUndKinderSection({ input, dispatch }: Props) {
  const setVeranlagungsart = (veranlagungsart: Veranlagungsart) =>
    dispatch({ type: 'SET_FIELD', field: 'veranlagungsart', value: veranlagungsart });

  return (
    <div className="field-group">
      <fieldset className="field radio-group">
        <legend className="field-label">Veranlagungsart</legend>
        <label className="radio-option">
          <input
            type="radio"
            name="veranlagungsart"
            checked={input.veranlagungsart === 'einzeln'}
            onChange={() => setVeranlagungsart('einzeln')}
          />
          Einzelveranlagung (ledig, geschieden, dauernd getrennt lebend)
        </label>
        <label className="radio-option">
          <input
            type="radio"
            name="veranlagungsart"
            checked={input.veranlagungsart === 'zusammen'}
            onChange={() => setVeranlagungsart('zusammen')}
          />
          Zusammenveranlagung (verheiratet/verpartnert)
        </label>
        <p className="field-hint">
          Maßgeblich ist die Veranlagungsart, nicht die Steuerklasse — die Steuerklasse steuert nur den
          monatlichen Lohnsteuerabzug, nicht die tatsächliche Jahressteuerschuld, die dieser Rechner ermittelt.
        </p>
      </fieldset>

      <NumberField
        label="Kinderfreibeträge (Anzahl Kinder)"
        value={input.anzahlKinder}
        onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'anzahlKinder', value })}
        suffix="Kinder"
        step={0.5}
        min={0}
        hint="In Schritten von 0,5 — z.B. 0,5, wenn nur ein Elternteil den halben Freibetrag geltend macht."
      />
    </div>
  );
}
