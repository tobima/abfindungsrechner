const euroFormatter = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const euroFormatterMitCent = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
});

const prozentFormatter = new Intl.NumberFormat('de-DE', {
  style: 'percent',
  maximumFractionDigits: 2,
});

export function formatEuro(betrag: number): string {
  return euroFormatter.format(betrag);
}

export function formatEuroMitCent(betrag: number): string {
  return euroFormatterMitCent.format(betrag);
}

export function formatProzent(anteil: number): string {
  return prozentFormatter.format(anteil);
}
