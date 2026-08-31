# 0002 – Fordelingsregler som datatabell

Status: vedtatt
Dato: 2025-08-31

## Kontekst

NGTFs regler for hvor mange grupper en NM-pulje skal ha, og hvor mange gymnaster
det skal være i hver, følger ingen enkel formel. Tallene er forhandlet frem og
justert manuelt for hvert deltakerantall (f.eks. 33 deltakere → grupper på
11, 10, 6 og 6). Et forsøk på å utlede dem algoritmisk vil gi feil svar.

## Beslutning

Reglene ligger som en eksplisitt oppslagstabell, `SENIOR_DISTRIBUTION` i
`src/types/seniorDistribution.ts`, med totalt deltakerantall som nøkkel og
eksakte gruppestørrelser som verdi. Tabellen dekker 10–50 deltakere.

Er deltakerantallet utenfor tabellen, eller stemmer ikke antall seedede med
tabellen, kaster fordelingen en feil i stedet for å gjette.

## Konsekvenser

- Tabellen kan sammenlignes direkte mot reglementet av en ikke-utvikler.
- Endringer i reglementet er en dataendring, ikke en logikkendring.
- Tabellen må utvides manuelt hvis konkurranser vokser forbi 50 deltakere.
- Fordelingsalgoritmen må respektere størrelsene absolutt – klubbsamling er
  et *ønske*, gruppestørrelsen er et *krav*.
- **Tallene skal ikke "ryddes opp i" eller gjøres jevnere.** De ser vilkårlige ut
  fordi de er det.
