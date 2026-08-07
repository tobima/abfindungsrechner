import type { FormInput } from './types';

export interface ValidationIssue {
  feld: string;
  meldung: string;
  schweregrad: 'fehler' | 'warnung';
}

function pruefeNichtNegativ(wert: number, feld: string, meldung: string, issues: ValidationIssue[]): void {
  if (wert < 0) {
    issues.push({ feld, meldung, schweregrad: 'fehler' });
  }
}

export function validateFormInput(input: FormInput): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  pruefeNichtNegativ(input.abfindung, 'abfindung', 'Die Abfindung darf nicht negativ sein.', issues);
  if (input.abfindung === 0) {
    issues.push({
      feld: 'abfindung',
      meldung: 'Ohne Abfindung liefert der Vergleich keine aussagekräftigen Ergebnisse.',
      schweregrad: 'warnung',
    });
  }

  if (input.anzahlKinder < 0 || input.anzahlKinder > 10) {
    issues.push({
      feld: 'anzahlKinder',
      meldung: 'Die Anzahl der Kinderfreibeträge muss zwischen 0 und 10 liegen.',
      schweregrad: 'fehler',
    });
  } else if (Math.round(input.anzahlKinder * 2) !== input.anzahlKinder * 2) {
    issues.push({
      feld: 'anzahlKinder',
      meldung: 'Kinderfreibeträge werden nur in Schritten von 0,5 gewährt.',
      schweregrad: 'fehler',
    });
  }

  pruefeNichtNegativ(
    input.sozialversicherungEigen.bruttoWeiteresEinkommenJahr,
    'bruttoWeiteresEinkommenEigen',
    'Das weitere Einkommen darf nicht negativ sein.',
    issues,
  );
  if (input.veranlagungsart === 'zusammen') {
    pruefeNichtNegativ(
      input.sozialversicherungPartner.bruttoWeiteresEinkommenJahr,
      'bruttoWeiteresEinkommenPartner',
      'Das weitere Einkommen des Ehepartners darf nicht negativ sein.',
      issues,
    );
  }

  pruefeNichtNegativ(input.lohnersatzleistungen, 'lohnersatzleistungen', 'Lohnersatzleistungen dürfen nicht negativ sein.', issues);
  pruefeNichtNegativ(input.ruerupBeitraege, 'ruerupBeitraege', 'Rürup-Beiträge dürfen nicht negativ sein.', issues);
  pruefeNichtNegativ(
    input.freiwilligeRvBeitraege,
    'freiwilligeRvBeitraege',
    'Freiwillige Rentenversicherungsbeiträge dürfen nicht negativ sein.',
    issues,
  );
  pruefeNichtNegativ(
    input.ausschuettungenTeileinkuenfteverfahren,
    'ausschuettungenTeileinkuenfteverfahren',
    'Ausschüttungen dürfen nicht negativ sein.',
    issues,
  );
  pruefeNichtNegativ(
    input.sozialversicherungEigen.werbungskosten,
    'werbungskostenEigen',
    'Werbungskosten dürfen nicht negativ sein.',
    issues,
  );
  if (input.veranlagungsart === 'zusammen') {
    pruefeNichtNegativ(
      input.sozialversicherungPartner.werbungskosten,
      'werbungskostenPartner',
      'Werbungskosten des Ehepartners dürfen nicht negativ sein.',
      issues,
    );
  }
  pruefeNichtNegativ(input.spendeGemeinnuetzig, 'spendeGemeinnuetzig', 'Spenden dürfen nicht negativ sein.', issues);
  pruefeNichtNegativ(input.spendeParteien, 'spendeParteien', 'Parteispenden dürfen nicht negativ sein.', issues);

  if (input.investitionskostenEigen < 0) {
    issues.push({
      feld: 'investitionskostenEigen',
      meldung: 'Geplante Investitionskosten dürfen nicht negativ sein.',
      schweregrad: 'fehler',
    });
  }

  return issues;
}
