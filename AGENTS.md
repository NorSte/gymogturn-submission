# AGENTS.md

Instruksjoner for AI-assistenter (Copilot, Cursor, Claude, Codex m.fl.) som jobber i dette repoet.
Les denne først, deretter dokumentene i `docs/` som er relevante for oppgaven.

## Hva er dette?

**Puljeplanleggeren** – en nettapp som leser påmeldingsskjemaer i Excel fra norske
turnklubber (herreturn), fordeler gymnastene i puljer og grupper etter NGTFs regler,
og eksporterer resultatet som en ny Excel-fil.

Kjører helt i nettleseren. Ingen backend, ingen database, ingen brukerinnlogging.
Publisert på https://gymogturn-submission.vercel.app/

## Dokumentasjonskart

| Dokument | Les når du skal ... |
|---|---|
| `docs/product.md` | forstå hvem produktet er for, hvilke problemer det løser, og hva som er utenfor scope |
| `docs/domain.md` | jobbe med puljer, grupper, klasser, seeding eller konkurransetyper – **obligatorisk** ved endring av fordelingslogikk |
| `docs/architecture.md` | forstå kodestruktur, dataflyt og hvor ting hører hjemme |
| `docs/excel-formats.md` | endre lesing eller skriving av Excel – **obligatorisk**, inneholder rad/kolonne-kontrakten |
| `docs/development.md` | kjøre, bygge, teste eller deploye |
| `docs/decisions/` | forstå hvorfor noe er gjort slik det er gjort (ADR-er) |

## Regler for arbeid i dette repoet

1. **Domenet styrer.** Puljestørrelser, klasseinndeling og seeding er bestemt av NGTFs
   reglement – ikke "forbedre" tallene i `src/types/seniorDistribution.ts` eller
   pulje-/gruppegrensene i `groupPlanner.ts` uten at brukeren eksplisitt ber om det.
2. **Excel-formatet er en kontrakt.** Radnummer og kolonneindekser i `excelReader.ts`
   matcher malene i `public/`. Endrer du den ene, må du endre den andre – og oppdatere
   `docs/excel-formats.md`.
3. **Bruk norsk i UI-tekst.** Brukerne er norske klubber og arrangører. Kode, typer og
   kommentarer skrives på engelsk.
4. **Ingen nye avhengigheter** uten at det er nødvendig. Stacken er bevisst liten:
   React + Vite + TypeScript + `xlsx` + Tailwind-klasser.
5. **Ingen personopplysninger ut av nettleseren.** Filene inneholder navn og fødselsdato
   på mindreårige. Ingen opplasting til server, ingen logging til tredjepart, ingen
   ekte deltakerdata committes til repoet – bruk mockdata i `src/data/`.
6. **Oppdater dokumentasjonen i samme endring.** Endrer du domeneregler, dataflyt eller
   filformat: oppdater det tilhørende dokumentet i `docs/` i samme commit.
7. **Alias `@/` peker til `src/`.** Bruk det i importer.

## Mulig fremtidig utvidelse (ikke bestemt)

Det er aktuelt – men **ikke besluttet** – å utvide appen til:

- **Kretskonkurranser** i tillegg til de nasjonale (NC, NM). Egne klasseinndelinger,
  puljestørrelser og maler må da avklares med kretsen/NGTF.
- **Turn kvinner** i tillegg til turn menn. Andre apparater, andre klasser og
  sannsynligvis egne fordelingsregler.

Hva dette betyr for deg som jobber i koden:

- **Ikke implementer noe av dette på eget initiativ.** Reglene finnes ikke skrevet ned
  ennå, og gjetting gir feil fordeling.
- **Ikke skriv logikk som låser oss til dagens antagelser.** Konkret: unngå å hardkode
  "herreturn" eller "nasjonal konkurranse" som en implisitt forutsetning. Konkurranse-
  typen (`NC` / `NMS` / `NMJ`) er allerede en parameter – hold den slik, og hold
  domeneregler i `services/` og `types/` fremfor spredt i `App.tsx`.
- **Ikke bygg generaliseringer "for sikkerhets skyld" heller.** Abstraksjoner uten en
  faktisk andre bruker blir som regel feil. Refaktorer når regelverket foreligger.
- Blir dette besluttet, skal det inn som en ADR i `docs/decisions/` før koding.

## Kjapp start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

Test manuelt med mockdata: last ned malen i appen, eller bruk ferdige filer i
`src/data/excel-mockdata-*`. `excel-mockdata-NY-medFeil` inneholder bevisste feil for
å teste valideringen.

## Kjente svakheter (ikke antatt "riktig" kode)

Se `docs/development.md` → "Kjente svakheter". Disse er reelle problemer, ikke design.
Fiks dem gjerne hvis du er i nærheten, men si fra hva du endret.
