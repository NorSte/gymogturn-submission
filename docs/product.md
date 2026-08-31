# Produktbeskrivelse – Puljeplanleggeren

## Problemet

Når en norsk turnklubb arrangerer en konkurranse i herreturn, får arrangøren inn ett
Excel-påmeldingsskjema per klubb. Arrangøren må så manuelt:

1. Samle alle gymnaster fra alle klubbene i én liste
2. Luke ut feil i skjemaene (manglende klasse, dobbeltføring, trener markert som gymnast)
3. Dele gymnastene inn i **puljer** (konkurransebolker) og **grupper** (rotasjonslag)
   etter NGTFs regler
4. Lage en tidsplan

Dette tar timer, gjøres i Excel for hånd, og er lett å gjøre feil i.

## Løsningen

En nettapp der arrangøren:

1. Velger konkurransetype (Norgescup, Senior-NM eller Junior-NM)
2. Laster ned den riktige Excel-malen og sender den til klubbene
3. Drar og slipper inn alle utfylte skjemaer fra klubbene
4. Får ut én Excel-fil med ferdig pulje- og gruppeinndeling + en tidsplanmal,
   pluss en liste på skjermen over gymnaster som må sjekkes manuelt

Alt skjer lokalt i nettleseren.

## Brukere

| Bruker | Behov |
|---|---|
| **Arrangør / teknisk komité** (primærbruker) | Rask, regelriktig puljeinndeling og en tidsplan å ta utgangspunkt i |
| **Klubbkontakt** | En tydelig mal å fylle ut, slik at påmeldingen ikke blir avvist |
| **NGTF** | At fordelingen følger reglementet konsistent på tvers av arrangører |

## Kjernefunksjoner

- **Excel-mal per konkurransetype** – nedlastbar direkte i appen
- **Import av flere filer samtidig** – drag & drop eller filvelger, med deduplisering
- **Validering** – fanger opp navn med tall, tomme navn, gymnast uten klasse,
  gymnast med flere klasser, og personer markert som både trener og gymnast
- **Automatisk fordeling** – klubbvis samling der det er mulig, med riktige
  pulje- og gruppestørrelser (se `domain.md`)
- **Excel-eksport** – ett ark per pulje + ett ark med tidsplanmal

## Suksesskriterier

- Arrangøren går fra "alle skjemaene er inne" til "ferdig puljeoppsett" på minutter
- Ingen gymnast forsvinner: antall inn = antall ut + antall flagget som ugyldige
- Resultatet er redigerbart i Excel etterpå – appen er et utgangspunkt, ikke en fasit

## Utenfor scope

Bevisst *ikke* del av produktet:

- Innlogging, brukerkontoer, lagring mellom økter
- Backend, database eller API
- Poengregistrering, resultatlister eller dommersystem
- Kvinneturn / andre grener enn herreturn (per i dag)
- Ferdig, endelig tidsplan – appen leverer en **mal** med plassholdere som
  arrangøren justerer selv
- E-postutsending eller påmeldingsinnsamling

## Status og retning

MVP er i bruk for Norgescup og Senior-NM. Junior-NM bruker foreløpig samme
fordelingslogikk som Senior-NM (se `domain.md` → "Junior-NM").

Nærliggende ønsker, ikke implementert:
- Egen fordelingstabell for Junior-NM
- Mulighet for å redigere fordelingen i appen før eksport
- Støtte for flere gymnastikkgrener
