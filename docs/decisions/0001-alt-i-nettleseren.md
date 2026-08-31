# 0001 – Alt kjører i nettleseren

Status: vedtatt
Dato: 2025-08-31

## Kontekst

Påmeldingsskjemaene inneholder navn og fødselsdato på deltakere, hvorav mange er
mindreårige. En løsning med backend ville krevd sikker lagring, databehandleravtale,
sletterutiner og drift – for en app som brukes noen få ganger i året av en håndfull
arrangører.

## Beslutning

Hele appen kjører klientside. Excel-filer leses med `FileReader` og `xlsx` i
nettleseren, fordelingen regnes ut lokalt, og resultatfilen leveres som en
`Blob`-URL. Ingen server, ingen database, ingen nettverkskall med deltakerdata.

## Konsekvenser

- Ingen personopplysninger forlater brukerens maskin. Enkel personvernhistorie.
- Hosting er gratis og trivielt (statiske filer på Vercel / GitHub Pages).
- Ingen tilstand mellom økter: laster brukeren siden på nytt, må filene lastes inn igjen.
- Ingen felles historikk eller deling mellom arrangører.
- Store filmengder er begrenset av nettleserens minne (i praksis uproblematisk,
  fordelingen støtter maks 50 gymnaster for NM).
- Ønskes deling eller lagring senere, er dette valget det første som må revurderes.
