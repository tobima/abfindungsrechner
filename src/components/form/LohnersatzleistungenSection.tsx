import type { Dispatch } from 'react';
import { NumberField } from './fields/NumberField';
import type { FormAction } from '../../state/formReducer';
import type { FormInput } from '../../lib/types';

interface Props {
  input: FormInput;
  dispatch: Dispatch<FormAction>;
}

export function LohnersatzleistungenSection({ input, dispatch }: Props) {
  return (
    <div className="field-group">
      <NumberField
        label="Arbeitslosengeld, Kurzarbeitergeld, Krankengeld u.ä. (Jahressumme)"
        value={input.lohnersatzleistungen}
        onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'lohnersatzleistungen', value })}
      />
      <p className="field-hint">
        Diese Leistungen sind selbst steuerfrei, erhöhen aber über den <em>Progressionsvorbehalt</em> den
        Steuersatz auf Ihr übriges Einkommen: Der Rechner ermittelt einen fiktiven Durchschnittssteuersatz auf
        Ihr Einkommen inklusive dieser Leistungen und wendet ihn auf Ihr tatsächliches Einkommen an.
      </p>
    </div>
  );
}
