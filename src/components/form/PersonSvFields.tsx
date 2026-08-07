import { NumberField } from './fields/NumberField';
import { Toggle } from './fields/Toggle';
import type { PersonSvFormInput } from '../../lib/types';

interface Props {
  titel: string;
  person: PersonSvFormInput;
  onChange: <K extends keyof PersonSvFormInput>(field: K, value: PersonSvFormInput[K]) => void;
}

export function PersonSvFields({ titel, person, onChange }: Props) {
  return (
    <div className="person-block">
      <h4 className="person-title">{titel}</h4>
      <NumberField
        label="Weiteres Einkommen aus nichtselbständiger Arbeit (Jahresbrutto)"
        value={person.bruttoWeiteresEinkommenJahr}
        onChange={(value) => onChange('bruttoWeiteresEinkommenJahr', value)}
      />
      <NumberField
        label="Tatsächliche Werbungskosten (optional)"
        value={person.werbungskosten}
        onChange={(value) => onChange('werbungskosten', value)}
        hint="Wird nur angesetzt, wenn höher als der gesetzliche Arbeitnehmer-Pauschbetrag — sonst gilt automatisch der Pauschbetrag."
      />
      <Toggle
        label="Rentenversicherungspflichtig"
        checked={person.rentenversicherungspflichtig}
        onChange={(checked) => onChange('rentenversicherungspflichtig', checked)}
        hint="Bei Beamten, Richtern und Berufssoldaten sowie manchen Selbständigen besteht keine Rentenversicherungspflicht."
      />
      <Toggle
        label="Arbeitslosenversicherungspflichtig"
        checked={person.arbeitslosenversicherungspflichtig}
        onChange={(checked) => onChange('arbeitslosenversicherungspflichtig', checked)}
        hint="Bei Beamten und Selbständigen besteht i.d.R. keine Arbeitslosenversicherungspflicht."
      />
      <Toggle
        label="Gesetzlich krankenversichert"
        checked={person.gesetzlichVersichert}
        onChange={(checked) => onChange('gesetzlichVersichert', checked)}
        hint="Bei privater Krankenversicherung individuelle Prämien statt gesetzlicher Beitragssätze angeben."
      />
      {person.gesetzlichVersichert ? (
        <>
          <Toggle
            label="Kinderlos (≥23 Jahre)"
            checked={person.kinderlos}
            onChange={(checked) => onChange('kinderlos', checked)}
            hint="Relevant für den Pflegeversicherungs-Kinderlosenzuschlag."
          />
          <NumberField
            label="Kinder unter 25 Jahren"
            value={person.anzahlKinderUnter25}
            onChange={(value) => onChange('anzahlKinderUnter25', value)}
            suffix="Kinder"
            step={1}
            hint="Ab dem zweiten Kind gibt es einen Beitragsabschlag in der Pflegeversicherung."
          />
          <NumberField
            label="Abweichender Zusatzbeitragssatz der Krankenkasse (optional)"
            value={person.zusatzbeitragSatz ?? 0}
            onChange={(value) => onChange('zusatzbeitragSatz', value === 0 ? undefined : value)}
            suffix="%"
            step={0.1}
            hint="Leer/0 lassen, um den gesetzlichen Durchschnittssatz des Jahres zu verwenden."
          />
        </>
      ) : (
        <>
          <NumberField
            label="Private Krankenversicherung — Jahresprämie"
            value={person.pkvPraemieJahrKv ?? 0}
            onChange={(value) => onChange('pkvPraemieJahrKv', value)}
            hint="Wird als Sonderausgabe unbegrenzt abzugsfähig berücksichtigt (vereinfachend: vollständig als Basisabsicherung behandelt)."
          />
          <NumberField
            label="Private Pflegeversicherung — Jahresprämie"
            value={person.pkvPraemieJahrPv ?? 0}
            onChange={(value) => onChange('pkvPraemieJahrPv', value)}
            hint="Wird als Sonderausgabe unbegrenzt abzugsfähig berücksichtigt."
          />
        </>
      )}
    </div>
  );
}
