# Abfindungsrechner

Webanwendung zur Berechnung der steuerlichen Auswirkung einer Abfindung — mit Fünftelregelung (§34 EStG),
Progressionsvorbehalt, Sozialversicherung, Sonderausgaben (Rürup, Basisvorsorge, Spenden) und weiteren
Einkunftsarten.

Live: https://tobima.github.io/abfindungsrechner/

## Entwicklung

```bash
npm install
npm run dev      # Dev-Server
npm run test     # Testsuite (Vitest)
npm run build    # Produktions-Build nach dist/
```

## Deployment

Der Push auf `main` löst automatisch einen Deploy nach GitHub Pages aus (siehe
`.github/workflows/deploy.yml`). Damit das funktioniert, muss in den Repository-Einstellungen unter
**Settings → Pages** als Quelle **GitHub Actions** ausgewählt sein.

## Disclaimer

Diese Berechnung dient nur der Orientierung und ersetzt keine individuelle steuerliche Beratung. Sie
basiert auf vereinfachten Annahmen zum deutschen Steuer- und Sozialversicherungsrecht.
