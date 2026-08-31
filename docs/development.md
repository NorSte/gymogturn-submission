# Utvikling

## Komme i gang

```bash
npm install
npm run dev        # http://localhost:5173
```

Python-scriptet for testdata er valgfritt:

```bash
pip install -r requirements.txt   # openpyxl, pandas
```

## Kommandoer

| Kommando | Gjør |
|---|---|
| `npm run dev` | Utviklingsserver med hot reload |
| `npm run build` | Produksjonsbygg til `dist/` |
| `npm run preview` | Server produksjonsbygget lokalt |
| `npm run build:electron` | Bygg med relative stier (`base: './'`) |
| `npm run deploy` | Publiser `dist/` til GitHub Pages |

Merk: `build:electron` bruker `VITE_BASE_PATH=... vite build`, som er
Unix-syntaks og ikke virker i PowerShell uten `cross-env` eller
`$env:VITE_BASE_PATH='./'; vite build`.

## Deploy

Produksjon kjører på Vercel: https://gymogturn-submission.vercel.app/
`vite.config.ts` har `base: '/'`. For GitHub Pages må `base` settes til
`'/pamelding/'` (utkommentert linje i filen).

## Testing

Det finnes **ingen automatiske tester** i dag. Verifiser manuelt:

1. Velg konkurransetype i dropdownen.
2. Dra inn alle filene fra en `src/data/excel-mockdata-*`-mappe.
3. Trykk "Last opp og prosesser".
4. Sjekk at antall gymnaster i eksporten stemmer med antallet i inputfilene.
5. Kjør `excel-mockdata-NY-medFeil` og sjekk at feillisten dukker opp i UI-et.

Legges det til tester, er `services/`-funksjonene det naturlige stedet å starte –
de er rene funksjoner uten React eller I/O.

## Konvensjoner

- **Importer** bruker aliaset `@/` → `src/` (definert i både `vite.config.ts` og
  `tsconfig.json`).
- **Kode og kommentarer på engelsk**, **UI-tekst på norsk**.
- **Domeneregler hører hjemme i `services/` og `types/`**, aldri i komponenter.
- **Ingen personopplysninger** i repoet eller ut av nettleseren.
- Oppdater dokumentet i `docs/` som beskriver det du endrer, i samme commit.

## Kjente svakheter

Dette er reelle problemer, ikke tilsiktet design. Ta dem gjerne når du er i området.

- `App.tsx`: `useState<"NMJ" | "NMS" | "NC">("")` – starttilstanden `""` er ikke
  del av typen. Bør være `"NMJ" | "NMS" | "NC" | ""`.
- Ingen validering av at konkurransetype faktisk er valgt før prosessering.
- Junior-NM (`NMJ`) gjenbruker Senior-NMs fordelingstabell – se `domain.md`.
- `excelReader.ts`: kommentaren sier `// Cell C3`, men koden leser faktisk **B3**.
  Koden er riktig, kommentaren er feil.
- `readNCandGetGymnastsNC` / `readNCandGetGymnastsNM` er nesten identiske og bør
  refaktoreres til én leser med et kolonneoppsett som parameter.
- Feilhåndtering i UI-et bruker `alert()`.
- Mye `console.log` i produksjonskoden.
- Avhengigheten `ci` i `package.json` ser ut til å være installert ved et uhell.
- Etterlatte Vim-swapfiler i reporoten (`.components.json.swp` m.fl.) bør slettes og
  legges i `.gitignore`.
- `src/data/` med mockdata og Python-script ligger inne i `src/` og blir med i
  TypeScript-scopet; hører egentlig hjemme i en `test-data/`-mappe utenfor `src/`.
