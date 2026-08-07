import type { Dispatch } from 'react';
import { NumberField } from './fields/NumberField';
import type { FormAction } from '../../state/formReducer';
import type { FormInput } from '../../lib/types';

interface Props {
  input: FormInput;
  dispatch: Dispatch<FormAction>;
}

export function GewerbeUndIABSection({ input, dispatch }: Props) {
  return (
    <div className="field-group">
      <p className="field-hint">
        Der Investitionsabzugsbetrag (§7g EStG) mindert den Gewinn um bis zu 50% der geplanten
        Investitionskosten, maximal 200.000€, sofern der Gewinn vor Abzug 200.000€ nicht übersteigt.
        Vereinfachung: eine fristgerechte Investition innerhalb von drei Jahren wird angenommen.
      </p>

      <div className="person-block">
        <h4 className="person-title">Eigener Gewerbebetrieb / selbständige Arbeit</h4>
        <NumberField
          label="Gewinn vor Investitionsabzugsbetrag"
          value={input.gewinnGewerbeEigenVorIab}
          onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'gewinnGewerbeEigenVorIab', value })}
        />
        <NumberField
          label="Geplante Investitionskosten"
          value={input.investitionskostenEigen}
          onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'investitionskostenEigen', value })}
        />
      </div>

      {input.veranlagungsart === 'zusammen' && (
        <div className="person-block">
          <h4 className="person-title">Gewerbebetrieb / selbständige Arbeit des Ehepartners</h4>
          <NumberField
            label="Gewinn vor Investitionsabzugsbetrag"
            value={input.gewinnGewerbePartnerVorIab}
            onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'gewinnGewerbePartnerVorIab', value })}
          />
          <NumberField
            label="Geplante Investitionskosten"
            value={input.investitionskostenPartner}
            onChange={(value) => dispatch({ type: 'SET_FIELD', field: 'investitionskostenPartner', value })}
          />
        </div>
      )}
    </div>
  );
}
