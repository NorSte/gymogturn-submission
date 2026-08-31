# Puljeplanleggeren

Nettapp for norske turnklubber og arrangører: leser inn påmeldingsskjemaer i Excel,
fordeler gymnastene i puljer og grupper etter NGTFs regler, og eksporterer resultatet
til en ny Excel-fil.

Alt kjører i nettleseren – ingen data sendes til noen server.

**Live:** https://gymogturn-submission.vercel.app/

## Funksjoner

- Last ned riktig Excel-mal for Norgescup, Senior-NM eller Junior-NM
- Dra og slipp inn flere utfylte skjemaer samtidig
- Automatisk validering av påmeldingene med liste over rader som må sjekkes
- Automatisk pulje- og gruppefordeling som holder klubber samlet
- Eksport til Excel med ett ark per pulje og en tidsplanmal

## Kom i gang

```bash
npm install
npm run dev
```

## Dokumentasjon

| Dokument | Innhold |
|---|---|
| [AGENTS.md](AGENTS.md) | Instruksjoner for AI-assistenter og nye utviklere |
| [docs/product.md](docs/product.md) | Hva produktet er, hvem det er for, hva som er utenfor scope |
| [docs/domain.md](docs/domain.md) | Puljer, grupper, klasser, seeding og fordelingsregler |
| [docs/architecture.md](docs/architecture.md) | Kodestruktur og dataflyt |
| [docs/excel-formats.md](docs/excel-formats.md) | Rad- og kolonnekontrakten for inn- og utfiler |
| [docs/development.md](docs/development.md) | Kommandoer, testing, konvensjoner, kjente svakheter |
| [docs/decisions/](docs/decisions/) | Arkitekturbeslutninger og begrunnelser |

## Lisens / bruk

Laget av [Nore Stene](https://github.com/NorSte) for bruk i norsk turnmiljø.
