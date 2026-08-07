import { formatEuro } from '../../utils/formatting';
import type { GesamtberechnungErgebnis, SzenarioErgebnis } from '../../lib/types';

interface Props {
  ergebnis: GesamtberechnungErgebnis;
}

function KindergeldFussnote({ szenario, kindergeldJahr }: { szenario: SzenarioErgebnis; kindergeldJahr: number }) {
  if (!szenario.kinderfreibetragAngewandt) {
    return null;
  }
  return (
    <tr>
      <td colSpan={2} className="berechnung-fussnote">
        Enthält {formatEuro(kindergeldJahr)} verrechnetes Kindergeld — der Kinderfreibetrag war günstiger als der
        Kindergeldbezug, daher wird das erhaltene Kindergeld hier der Einkommensteuer hinzugerechnet.
      </td>
    </tr>
  );
}

export function BerechnungsAuflistung({ ergebnis }: Props) {
  return (
    <div className="tabelle-wrapper">
      <h3 className="berechnung-titel">Berechnung im Detail</h3>
      <p className="field-hint">Grundlage für die Steuerberechnung, jeweils ohne die Abfindung selbst.</p>
      <table className="steuer-tabelle berechnung-tabelle">
        <tbody>
          <tr>
            <th scope="row">Summe der Einkünfte</th>
            <td>{formatEuro(ergebnis.summeDerEinkuenfte)}</td>
          </tr>
          <tr>
            <th scope="row">./. Sonderausgaben Altersvorsorge (Rürup + ges. Rentenvers., Pflicht + freiwillig)</th>
            <td>−{formatEuro(ergebnis.altersvorsorgeSonderausgaben)}</td>
          </tr>
          <tr>
            <th scope="row">./. Sonderausgaben Basisvorsorge Kranken-/Pflegeversicherung</th>
            <td>−{formatEuro(ergebnis.basisvorsorgeSonderausgaben)}</td>
          </tr>
          <tr>
            <th scope="row">./. Sonderausgaben Spenden</th>
            <td>−{formatEuro(ergebnis.spendenSonderausgaben)}</td>
          </tr>
          <tr className="tabelle-summenzeile">
            <th scope="row">= zu versteuerndes Einkommen (vor Kinderfreibetrag)</th>
            <td>{formatEuro(ergebnis.zvEVarianteA)}</td>
          </tr>
          <tr>
            <th scope="row">./. Kinderfreibetrag (falls günstiger als Kindergeld)</th>
            <td>−{formatEuro(ergebnis.kinderfreibetragGesamt)}</td>
          </tr>
          <tr className="tabelle-summenzeile">
            <th scope="row">= zu versteuerndes Einkommen (mit Kinderfreibetrag)</th>
            <td>{formatEuro(ergebnis.zvEVarianteB)}</td>
          </tr>
          <tr>
            <th scope="row">Kindergeld pro Jahr (Vergleichswert Günstigerprüfung)</th>
            <td>{formatEuro(ergebnis.kindergeldJahr)}</td>
          </tr>
          <tr>
            <th scope="row">Steuerermäßigung Parteispenden (§34g EStG)</th>
            <td>{formatEuro(ergebnis.parteispendeSteuerermaessigung)}</td>
          </tr>
        </tbody>
      </table>

      <h3 className="berechnung-titel berechnung-titel-abstand">Fünftelregelung</h3>
      <table className="steuer-tabelle berechnung-tabelle">
        <tbody>
          <tr>
            <th scope="row">Einkommensteuer ohne Abfindung</th>
            <td>{formatEuro(ergebnis.baseline.estTatsaechlich)}</td>
          </tr>
          <KindergeldFussnote szenario={ergebnis.baseline} kindergeldJahr={ergebnis.kindergeldJahr} />
          <tr>
            <th scope="row">Einkommen zzgl. 1/5 der Abfindung (zvE)</th>
            <td>{formatEuro(ergebnis.zvEMitEinemFuenftelAbfindung)}</td>
          </tr>
          <tr>
            <th scope="row">Einkommensteuer auf dieses Einkommen</th>
            <td>{formatEuro(ergebnis.estMitEinemFuenftelAbfindung)}</td>
          </tr>
          <tr className="tabelle-summenzeile">
            <th scope="row">Einkommensteuer gesamt nach Fünftelregelung</th>
            <td>{formatEuro(ergebnis.mitFuenftelregelung.estTatsaechlich)}</td>
          </tr>
          <KindergeldFussnote szenario={ergebnis.mitFuenftelregelung} kindergeldJahr={ergebnis.kindergeldJahr} />
          <tr className="tabelle-deltazeile">
            <th scope="row">davon nur auf die Abfindung entfallend</th>
            <td>{formatEuro(ergebnis.steuerNurAufAbfindungMitFuenftelregelung)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
