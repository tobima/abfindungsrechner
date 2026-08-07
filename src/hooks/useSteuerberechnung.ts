import { useMemo } from 'react';
import { berechneGesamtergebnis } from '../lib/pipeline/gesamtberechnung';
import type { FormInput } from '../lib/types';

export function useSteuerberechnung(input: FormInput) {
  return useMemo(() => berechneGesamtergebnis(input), [input]);
}
