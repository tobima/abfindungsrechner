import { useEffect, useRef, useState } from 'react';

interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  step?: number;
  min?: number;
  hint?: string;
}

function nachkommastellenErlaubt(step?: number): boolean {
  return step !== undefined && !Number.isInteger(step);
}

/**
 * Entfernt alles außer Ziffern, einem führenden Minus (falls erlaubt) und einem Dezimaltrennzeichen,
 * und ermittelt zugleich, wie viele Ausgabezeichen vor der ursprünglichen Cursor-Position liegen —
 * im selben Durchlauf, damit beide Werte garantiert konsistent zueinander sind.
 */
function bereinigeEingabe(
  text: string,
  erlaubeMinus: boolean,
  erlaubeDezimal: boolean,
  cursorPosition: number,
): { bereinigt: string; ausgabePositionAmCursor: number } {
  let ergebnis = '';
  let kommaGesehen = false;
  let ausgabePositionAmCursor = 0;
  for (let i = 0; i < text.length; i++) {
    const zeichen = text[i];
    if (zeichen === '-' && i === 0 && erlaubeMinus && ergebnis === '') {
      ergebnis += zeichen;
    } else if (/\d/.test(zeichen)) {
      ergebnis += zeichen;
    } else if (erlaubeDezimal && (zeichen === ',' || zeichen === '.') && !kommaGesehen) {
      ergebnis += ',';
      kommaGesehen = true;
    }
    if (i < cursorPosition) {
      ausgabePositionAmCursor = ergebnis.length;
    }
  }
  return { bereinigt: ergebnis, ausgabePositionAmCursor };
}

/** Formatiert eine bereinigte Zahl-Zeichenkette mit Tausenderpunkten nach deutscher Konvention. */
function formatiereMitTausenderpunkt(bereinigt: string): string {
  const negativ = bereinigt.startsWith('-');
  const ohneVorzeichen = negativ ? bereinigt.slice(1) : bereinigt;
  const [ganzzahl, nachkomma] = ohneVorzeichen.split(',');
  const ganzzahlFormatiert = (ganzzahl || '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const ergebnis = nachkomma !== undefined ? `${ganzzahlFormatiert},${nachkomma}` : ganzzahlFormatiert;
  return (negativ ? '-' : '') + ergebnis;
}

function parseZahl(bereinigt: string): number {
  const zahl = parseFloat(bereinigt.replace(',', '.'));
  return Number.isFinite(zahl) ? zahl : 0;
}

/** Findet die Cursor-Position im formatierten String, die derselben Anzahl "echter" (Nicht-Punkt-)Zeichen entspricht. */
function positionInFormatiert(formatiert: string, bereinigtPosition: number): number {
  if (bereinigtPosition <= 0) return 0;
  let zaehler = 0;
  for (let i = 0; i < formatiert.length; i++) {
    if (formatiert[i] !== '.') {
      zaehler++;
      if (zaehler === bereinigtPosition) return i + 1;
    }
  }
  return formatiert.length;
}

function formatiereWert(value: number): string {
  const rohwert = Number.isFinite(value) ? value : 0;
  return formatiereMitTausenderpunkt(rohwert.toString().replace('.', ','));
}

export function NumberField({ label, value, onChange, suffix = '€', step = 100, min = 0, hint }: NumberFieldProps) {
  const erlaubeMinus = min < 0;
  const erlaubeDezimal = nachkommastellenErlaubt(step);
  const inputRef = useRef<HTMLInputElement>(null);
  const istFokussiert = useRef(false);
  const [text, setText] = useState(() => formatiereWert(value));

  useEffect(() => {
    if (istFokussiert.current) return;
    setText(formatiereWert(value));
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const eingabe = e.target.value;
    const cursorPosition = e.target.selectionStart ?? eingabe.length;

    const { bereinigt, ausgabePositionAmCursor } = bereinigeEingabe(eingabe, erlaubeMinus, erlaubeDezimal, cursorPosition);
    const formatiert = formatiereMitTausenderpunkt(bereinigt);
    const zahl = Math.max(min, parseZahl(bereinigt));

    setText(formatiert);
    onChange(zahl);

    requestAnimationFrame(() => {
      const neuePosition = positionInFormatiert(formatiert, ausgabePositionAmCursor);
      inputRef.current?.setSelectionRange(neuePosition, neuePosition);
    });
  }

  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <div className="field-input-group">
        <input
          ref={inputRef}
          type="text"
          inputMode={erlaubeMinus || erlaubeDezimal ? 'decimal' : 'numeric'}
          className="field-input"
          value={text}
          onChange={handleChange}
          onFocus={(e) => {
            istFokussiert.current = true;
            e.target.select();
          }}
          onBlur={() => {
            istFokussiert.current = false;
            setText(formatiereWert(value));
          }}
        />
        <span className="field-suffix">{suffix}</span>
      </div>
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}
