import { useReducer } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AccordionSection } from './components/form/AccordionSection';
import { VeranlagungsartUndKinderSection } from './components/form/VeranlagungsartUndKinderSection';
import { EinkommenSection } from './components/form/EinkommenSection';
import { GewerbeUndIABSection } from './components/form/GewerbeUndIABSection';
import { LohnersatzleistungenSection } from './components/form/LohnersatzleistungenSection';
import { VorsorgeaufwendungenSection } from './components/form/VorsorgeaufwendungenSection';
import { SpendenSection } from './components/form/SpendenSection';
import { AbfindungSection } from './components/form/AbfindungSection';
import { KirchensteuerBundeslandSection } from './components/form/KirchensteuerBundeslandSection';
import { ErgebnisUebersicht } from './components/result/ErgebnisUebersicht';
import { SteuerVergleichTabelle } from './components/result/SteuerVergleichTabelle';
import { SozialversicherungsUebersicht } from './components/result/SozialversicherungsUebersicht';
import { BerechnungsAuflistung } from './components/result/BerechnungsAuflistung';
import { formReducer, erstelleInitialState } from './state/formReducer';
import { useSteuerberechnung } from './hooks/useSteuerberechnung';
import { validateFormInput } from './lib/validation';
import type { Jahr } from './constants/types';
import './App.css';

function App() {
  const [input, dispatch] = useReducer(formReducer, undefined, erstelleInitialState);
  const ergebnis = useSteuerberechnung(input);
  const issues = validateFormInput(input);
  const fehler = issues.filter((issue) => issue.schweregrad === 'fehler');

  return (
    <div className="app-shell">
      <Header jahr={input.jahr} onJahrChange={(jahr: Jahr) => dispatch({ type: 'SET_FIELD', field: 'jahr', value: jahr })} />

      <main className="app-main">
        <div className="form-column">
          <AccordionSection title="1. Veranlagungsart & Kinder" defaultOpen>
            <VeranlagungsartUndKinderSection input={input} dispatch={dispatch} />
          </AccordionSection>

          <AccordionSection title="2. Einkommen" description="Weiteres Einkommen, Vermietung/Verpachtung, Sozialversicherung">
            <EinkommenSection input={input} dispatch={dispatch} />
          </AccordionSection>

          <AccordionSection title="3. Gewerbebetrieb / selbständige Arbeit" description="Inkl. Investitionsabzugsbetrag">
            <GewerbeUndIABSection input={input} dispatch={dispatch} />
          </AccordionSection>

          <AccordionSection title="4. Lohnersatzleistungen" description="ALG, Kurzarbeitergeld, Krankengeld — Progressionsvorbehalt">
            <LohnersatzleistungenSection input={input} dispatch={dispatch} />
          </AccordionSection>

          <AccordionSection title="5. Vorsorgeaufwendungen / Rürup">
            <VorsorgeaufwendungenSection input={input} dispatch={dispatch} />
          </AccordionSection>

          <AccordionSection title="6. Spenden" description="Gemeinnützige Organisationen & Parteispenden">
            <SpendenSection input={input} dispatch={dispatch} />
          </AccordionSection>

          <AccordionSection title="7. Abfindung" defaultOpen>
            <AbfindungSection input={input} dispatch={dispatch} />
          </AccordionSection>

          <AccordionSection title="8. Kirchensteuer & Bundesland">
            <KirchensteuerBundeslandSection input={input} dispatch={dispatch} />
          </AccordionSection>
        </div>

        <div className="result-column">
          <div className="result-sticky">
            {fehler.length > 0 ? (
              <div className="ergebnis-fehler">
                <p>Bitte korrigieren Sie folgende Eingaben:</p>
                <ul>
                  {fehler.map((issue) => (
                    <li key={issue.feld}>{issue.meldung}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                <ErgebnisUebersicht ergebnis={ergebnis} abfindung={input.abfindung} />
                <SteuerVergleichTabelle ergebnis={ergebnis} />
                <BerechnungsAuflistung ergebnis={ergebnis} />
                <SozialversicherungsUebersicht ergebnis={ergebnis} />
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
