import { VERFUEGBARE_JAHRE } from '../../constants/years';
import type { Jahr } from '../../constants/types';

interface Props {
  jahr: Jahr;
  onJahrChange: (jahr: Jahr) => void;
}

export function Header({ jahr, onJahrChange }: Props) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div>
          <h1 className="app-title">Abfindungsrechner</h1>
          <p className="app-subtitle">Steuerliche Auswirkung einer Abfindung — mit Fünftelregelung</p>
        </div>
        <label className="field jahr-select">
          <span className="field-label">Steuerjahr</span>
          <select
            className="field-input"
            value={jahr}
            onChange={(e) => onJahrChange(Number(e.target.value) as Jahr)}
          >
            {VERFUEGBARE_JAHRE.map((j) => (
              <option key={j} value={j}>
                {j}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
}
