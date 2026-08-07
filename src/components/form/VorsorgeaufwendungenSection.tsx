import type { Dispatch } from 'react';
import { NumberField } from './fields/NumberField';
import type { FormAction } from '../../state/formReducer';
import type { FormInput } from '../../lib/types';

interface Props {
  input: FormInput;
  dispatch: Dispatch<FormAction>;
}

export function VorsorgeaufwendungenSection({ input, dispatch }: Props) {
  return (
    <div className="field-group">
      <NumberField
        label="Rürup-/Basisrentenbeiträge (Jahressumme, eigene und ggf. Ehepartner)"
        value={input.ruerupBeitraege}
        onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'ruerupBeitraege', value })}
      />
      <NumberField
        label="Freiwillige Beiträge zur gesetzlichen Rentenversicherung (Jahressumme, eigene und ggf. Ehepartner)"
        value={input.freiwilligeRvBeitraege}
        onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'freiwilligeRvBeitraege', value })}
        hint="Z.B. für Selbständige oder zum freiwilligen Ausgleich von Rentenabschlägen — steuerlich wie Pflichtbeiträge zur gesetzlichen Rentenversicherung behandelt."
      />
      <p className="field-hint">
        Rürup-Beiträge, freiwillige Beiträge zur gesetzlichen Rentenversicherung und die bereits automatisch
        aus Ihrem weiteren Einkommen ermittelten Rentenversicherungspflichtbeiträge sind zu 100% als
        Sonderausgaben abzugsfähig, teilen sich aber einen gemeinsamen Höchstbetrag. Der Rechner kappt die
        Summe automatisch am gesetzlichen Höchstbetrag.
      </p>
    </div>
  );
}
