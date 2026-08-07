interface NumberFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
  step?: number;
  min?: number;
  hint?: string;
}

export function NumberField({ label, value, onChange, suffix = '€', step = 100, min = 0, hint }: NumberFieldProps) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <div className="field-input-group">
        <input
          type="number"
          className="field-input"
          value={Number.isFinite(value) ? value : 0}
          step={step}
          min={min}
          onChange={(e) => {
            const parsed = e.target.valueAsNumber;
            onChange(Number.isNaN(parsed) ? 0 : parsed);
          }}
        />
        <span className="field-suffix">{suffix}</span>
      </div>
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}
