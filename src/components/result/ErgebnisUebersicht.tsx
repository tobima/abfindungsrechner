import { formatEuro } from '../../utils/formatting';
import type { GesamtberechnungErgebnis } from '../../lib/types';

interface Props {
  ergebnis: GesamtberechnungErgebnis;
  abfindung: number;
}

export function ErgebnisUebersicht({ ergebnis, abfindung }: Props) {
  return (
    <div className="ergebnis-uebersicht">
      <div className="ergebnis-karten">
        <div className="ergebnis-karte ergebnis-karte-hervorgehoben">
          <span className="ergebnis-karte-label">Mit Fünftelregelung</span>
          <span className="ergebnis-karte-betrag">{formatEuro(ergebnis.nettoAbfindungMitFuenftelregelung)}</span>
          <span className="ergebnis-karte-sublabel">Netto von {formatEuro(abfindung)} Abfindung</span>
        </div>
        <div className="ergebnis-karte">
          <span className="ergebnis-karte-label">Ohne Fünftelregelung</span>
          <span className="ergebnis-karte-betrag">{formatEuro(ergebnis.nettoAbfindungOhneFuenftelregelung)}</span>
          <span className="ergebnis-karte-sublabel">Reguläre Besteuerung der vollen Abfindung</span>
        </div>
      </div>
      <div className="ergebnis-callout">
        Steuerersparnis durch die Fünftelregelung:{' '}
        <strong>{formatEuro(ergebnis.steuerersparnisDurchFuenftelregelung)}</strong>
      </div>
    </div>
  );
}
