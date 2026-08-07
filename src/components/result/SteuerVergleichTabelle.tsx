import { formatEuro, formatProzent } from '../../utils/formatting';
import type { GesamtberechnungErgebnis, SzenarioErgebnis } from '../../lib/types';

interface Props {
  ergebnis: GesamtberechnungErgebnis;
}

function delta(szenario: SzenarioErgebnis, baseline: SzenarioErgebnis): number {
  return szenario.summeSteuern - baseline.summeSteuern;
}

export function SteuerVergleichTabelle({ ergebnis }: Props) {
  const { baseline, mitFuenftelregelung, ohneFuenftelregelung } = ergebnis;

  return (
    <div className="tabelle-wrapper">
      <table className="steuer-tabelle vergleich-tabelle">
        <thead>
          <tr>
            <th scope="col">Position</th>
            <th scope="col" title="Ohne Abfindung">
              Ohne Abf.
            </th>
            <th scope="col" title="Mit Fünftelregelung">
              Mit 1/5-Reg.
            </th>
            <th scope="col" title="Ohne Fünftelregelung">
              Ohne 1/5-Reg.
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Einkommensteuer</th>
            <td>{formatEuro(baseline.estTatsaechlich)}</td>
            <td>{formatEuro(mitFuenftelregelung.estTatsaechlich)}</td>
            <td>{formatEuro(ohneFuenftelregelung.estTatsaechlich)}</td>
          </tr>
          <tr>
            <th scope="row" title="Solidaritätszuschlag">
              Soli
            </th>
            <td>{formatEuro(baseline.soli)}</td>
            <td>{formatEuro(mitFuenftelregelung.soli)}</td>
            <td>{formatEuro(ohneFuenftelregelung.soli)}</td>
          </tr>
          <tr>
            <th scope="row">Kirchensteuer</th>
            <td>{formatEuro(baseline.kirchensteuer)}</td>
            <td>{formatEuro(mitFuenftelregelung.kirchensteuer)}</td>
            <td>{formatEuro(ohneFuenftelregelung.kirchensteuer)}</td>
          </tr>
          <tr className="tabelle-summenzeile">
            <th scope="row">Summe Steuern</th>
            <td>{formatEuro(baseline.summeSteuern)}</td>
            <td>{formatEuro(mitFuenftelregelung.summeSteuern)}</td>
            <td>{formatEuro(ohneFuenftelregelung.summeSteuern)}</td>
          </tr>
          <tr className="tabelle-deltazeile">
            <th scope="row" title="davon durch die Abfindung verursacht">
              davon Abfindung
            </th>
            <td>—</td>
            <td>{formatEuro(delta(mitFuenftelregelung, baseline))}</td>
            <td>{formatEuro(delta(ohneFuenftelregelung, baseline))}</td>
          </tr>
          <tr>
            <th scope="row">Grenzsteuersatz</th>
            <td>{formatProzent(baseline.grenzsteuersatz)}</td>
            <td>{formatProzent(mitFuenftelregelung.grenzsteuersatz)}</td>
            <td>{formatProzent(ohneFuenftelregelung.grenzsteuersatz)}</td>
          </tr>
          <tr>
            <th scope="row" title="Gesamtsteuersatz (effektiv)">
              Gesamtsteuersatz
            </th>
            <td>{formatProzent(baseline.gesamtsteuersatz)}</td>
            <td>{formatProzent(mitFuenftelregelung.gesamtsteuersatz)}</td>
            <td>{formatProzent(ohneFuenftelregelung.gesamtsteuersatz)}</td>
          </tr>
        </tbody>
      </table>
      <p className="field-hint">
        Grenzsteuersatz: Steuersatz auf den letzten Euro des jeweils maßgeblichen Einkommens. Gesamtsteuersatz:
        alle Steuern (ESt, Soli, Kirchensteuer) im Verhältnis zum gesamten zu versteuernden Einkommen
        (bei „Mit"/„Ohne Fünftelregelung" inkl. Abfindung).
      </p>
    </div>
  );
}
