import type { Jahr, YearConstants } from '../types';
import { constants2025 } from './2025';
import { constants2026 } from './2026';

export const YEAR_CONSTANTS: Record<Jahr, YearConstants> = {
  2025: constants2025,
  2026: constants2026,
};

export function getYearConstants(jahr: Jahr): YearConstants {
  return YEAR_CONSTANTS[jahr];
}

export const VERFUEGBARE_JAHRE: Jahr[] = [2025, 2026];
