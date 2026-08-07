import { formatEuro } from '../../utils/formatting';
import type { PersonSvErgebnis } from '../../lib/sozialversicherung/svGesamt';
import type { GesamtberechnungErgebnis } from '../../lib/types';

interface Props {
  ergebnis: GesamtberechnungErgebnis;
}

function PersonZeile({ titel, sv }: { titel: string; sv: PersonSvErgebnis }) {
  return (
    <tr>
      <th scope="row">{titel}</th>
      <td>{formatEuro(sv.rvArbeitnehmer)}</td>
      <td>{formatEuro(sv.av)}</td>
      <td>{formatEuro(sv.kv)}</td>
      <td>{formatEuro(sv.pv)}</td>
      <td>{formatEuro(sv.summeArbeitnehmer)}</td>
    </tr>
  );
}

export function SozialversicherungsUebersicht({ ergebnis }: Props) {
  const { eigen, partner } = ergebnis.sozialversicherung;

  return (
    <div className="sv-block">
      <p className="field-hint">
        Sozialversicherungsbeiträge (Arbeitnehmeranteile) auf Ihr weiteres Einkommen aus nichtselbständiger
        Arbeit. <strong>Die Abfindung selbst ist sozialversicherungsfrei</strong> und fließt hier nicht ein.
      </p>
      <div className="tabelle-wrapper">
        <table className="steuer-tabelle">
          <thead>
            <tr>
              <th scope="col">Person</th>
              <th scope="col" title="Rentenversicherung">
                RV
              </th>
              <th scope="col" title="Arbeitslosenversicherung">
                AV
              </th>
              <th scope="col" title="Krankenversicherung">
                KV
              </th>
              <th scope="col" title="Pflegeversicherung">
                PV
              </th>
              <th scope="col">Summe</th>
            </tr>
          </thead>
          <tbody>
            <PersonZeile titel="Eigen" sv={eigen} />
            {partner && <PersonZeile titel="Ehepartner" sv={partner} />}
          </tbody>
        </table>
      </div>
    </div>
  );
}
