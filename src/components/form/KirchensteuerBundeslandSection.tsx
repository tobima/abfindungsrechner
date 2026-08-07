import type { Dispatch } from 'react';
import { Toggle } from './fields/Toggle';
import { SelectField } from './fields/Select';
import { BUNDESLAENDER } from '../../constants/bundeslaender';
import type { FormAction } from '../../state/formReducer';
import type { FormInput } from '../../lib/types';

interface Props {
  input: FormInput;
  dispatch: Dispatch<FormAction>;
}

export function KirchensteuerBundeslandSection({ input, dispatch }: Props) {
  return (
    <div className="field-group">
      <Toggle
        label="Kirchensteuerpflichtig"
        checked={input.kirchensteuerpflichtig}
        onChange={(checked) => dispatch({ type: 'SET_FIELD', field: 'kirchensteuerpflichtig', value: checked })}
      />
      <SelectField
        label="Bundesland"
        value={input.bundesland}
        options={BUNDESLAENDER}
        onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'bundesland', value })}
      />
      <p className="field-hint">
        8% Kirchensteuer in Bayern und Baden-Württemberg, 9% in allen anderen Bundesländern (vereinfacht,
        ohne Berücksichtigung einzelner Bistums-Sonderregelungen).
      </p>
    </div>
  );
}
