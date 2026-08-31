# Domenemodell og regler

Dette dokumentet beskriver *hva* systemet skal gjøre, uavhengig av kode.
**Les dette før du endrer noe i `src/services/groupPlanner.ts` eller
`src/types/seniorDistribution.ts`.**

## Ordliste

| Begrep | Betydning |
|---|---|
| **Gymnast** | Deltaker. Har navn, fødselsdato, klubb og klasse. |
| **Klubb** | Turnklubben gymnasten representerer. Kommer fra én celle i påmeldingsskjemaet – alle gymnaster i samme fil får samme klubb. |
| **Klasse** (`category`) | Aldersklasse: `rekrutt`, `13-14`, `15-16`, `17-18`, `senior`. |
| **Pulje** | En konkurransebolk som gjennomføres samlet i tid. Én pulje = én økt i hallen. |
| **Gruppe** | Et rotasjonslag *inne i* en pulje. Gruppene roterer mellom apparatene samtidig. |
| **Seedet** | Gymnast rangert blant de beste, plasseres i siste pulje. Gjelder kun NM. |
| **Trener** | Voksen leder, meldes på i samme skjema men skal **ikke** fordeles i puljer. |
| **Konkurransetype** | `NC` (Norgescup), `NMS` (Senior-NM), `NMJ` (Junior-NM). |

Struktur: `Konkurranse → Pulje → Gruppe → Gymnast`

## Konkurransetyper

### Norgescup (`NC`)

Bred breddekonkurranse med alle klasser. Puljene bestemmes av klasse:

| Pulje | Klasser | Maks antall grupper |
|---|---|---|
| Pulje 1 | `rekrutt` | 6 |
| Pulje 2 | `13-14` | 3 |
| Pulje 3 | `15-16` | 3 |
| Pulje 4 | `17-18`, `senior` | 3 |

Fordelingsregler:
- Gruppestørrelsene trenger **ikke** være like – de er ikke låst til et fasttall.
- **Klubber holdes samlet.** En klubbs gymnaster legges i sin helhet i den gruppen som
  har færrest gymnaster akkurat da (greedy "least loaded"-plassering).
- Klubber behandles i rekkefølge etter laveste klasse de har med, deretter alfabetisk –
  slik at fordelingen blir deterministisk.
- Innad i en gruppe sorteres gymnastene etter klasse, deretter klubb.
- Seeding brukes ikke.

Kilde: `generateNorgescupPlan()` og `assignGroupsByClub()` i `groupPlanner.ts`.

### Senior-NM (`NMS`)

Mesterskap for seniorer. Alle deltakere har klassen `senior`.

- Gymnastene deles i **useedet** og **seedet**.
- Useedede går i **Pulje 1**, seedede i **Pulje 2** (den "beste" puljen går sist).
- Antall grupper og **eksakte** gruppestørrelser er slått opp i
  `SENIOR_DISTRIBUTION` i `src/types/seniorDistribution.ts`, med totalt antall
  gymnaster som nøkkel. Tabellen dekker 10–50 gymnaster.

  Eksempel: 33 gymnaster → `unseeded: [11, 10]`, `seeded: [6, 6]`
  = Pulje 1 med to grupper på 11 og 10, Pulje 2 med to grupper på 6 og 6.

- **Gruppestørrelsene er absolutte.** Klubber holdes samlet *så langt det går*, men
  gruppestørrelsen vinner alltid: får ikke hele klubben plass i én gruppe, splittes
  klubben og enkeltgymnastene legges i gruppen med mest ledig kapasitet.
- Klubber plasseres i synkende rekkefølge etter størrelse (størst klubb først),
  med alfabetisk tie-break.

Fordelingen feiler med en `Error` hvis:
- totalt antall gymnaster ikke finnes i tabellen (utenfor 10–50)
- antall seedede/useedede ikke stemmer med tabellens forventning

Dette er tilsiktet: da er påmeldingen feil og må rettes, ikke gjettes på.

Kilde: `generateSeniorPlan()` og `assignGroupsWithTargetSizes()` i `groupPlanner.ts`.

### Junior-NM (`NMJ`)

**Bruker i dag samme logikk og samme fordelingstabell som Senior-NM.** Det er en kjent
forenkling, ikke en bevisst regel. Alle innleste gymnaster får klassen `senior` fordi
malen ikke har egne klassekolonner. Skal Junior-NM få egne størrelser, må det legges
inn en egen tabell og en egen gren i `generateGroupPlan()`.

## Valideringsregler

En rad flagges som "krever manuell sjekk" (men resten av importen fortsetter) når:

| Regel | Gjelder | Gymnasten hoppes over? |
|---|---|---|
| Navn er tomt, `"x"`, eller inneholder siffer | NC + NM | Ja |
| Ingen klasse krysset av | NC | Nei (men tas ikke med i fordelingen) |
| Flere klasser krysset av | NC | Nei – **siste** kryss vinner |
| Markert som både trener og gymnast | NC + NM | Nei |

Rader som alltid ignoreres uten advarsel:
- Eksempelraden `"Eksempel Eksemplsen"` som ligger i malen
- Tomme navnefelt (regnes som slutten på / hull i listen)
- Rene trenere (har kryss for trener, ingen klasse) – de skal ikke i puljer

Radnummeret som vises til brukeren er Excel-radnummeret, slik at det kan slås opp
direkte i klubbens fil.

Kilde: `readNCandGetGymnastsNC()` og `readNCandGetGymnastsNM()` i `excelReader.ts`.

## Tidsplan

Eksporten inneholder et ark `Konkurranseplan Mal` med en tidsplan som er **hardkodet
tekst**, ikke beregnet. Den er ulik for NC og NM. Plassholdere som
`Fredag XX. måned` er ment å fylles ut av arrangøren.

Kilde: `writeGroupPlanToExcel()` i `groupWriter.ts`.

## Invarianter

Disse må holde etter enhver endring:

1. Ingen gymnast dupliseres eller forsvinner mellom import og eksport.
2. For NM: summen av gruppestørrelsene = antall gymnaster, og hver gruppe har nøyaktig
   størrelsen tabellen angir.
3. For NC: hver gymnast havner i nøyaktig én pulje, bestemt av klassen sin.
4. Fordelingen er deterministisk – samme input gir samme output.
5. Trenere havner aldri i en gruppe.
