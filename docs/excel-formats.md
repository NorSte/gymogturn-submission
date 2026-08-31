# Excel-formater (kontrakt)

Kodeleseren bruker **faste rad- og kolonneindekser**. Endres malene i `public/`,
må `src/services/excelReader.ts` og dette dokumentet endres i samme slengen.

Alle indekser under er 0-baserte slik de er i koden; Excel-kolonnebokstaven står i
parentes. Kun **første ark** i arbeidsboken leses.

## Felles for alle maler

| Plassering | Innhold |
|---|---|
| Rad 3, kolonne B (`json[2][1]`) | Klubbnavn. Faller tilbake til `"Ukjent klubb"`. Gjelder alle gymnaster i filen. |
| Rad 4–6, kolonne B | Kontaktperson, e-post, telefon. **Leses ikke** av appen. |
| Rad 11 | Eksempelrad (`Eksempel Eksemplsen`) – hoppes alltid over. |
| Fra rad 12 (`i = 11`) | Én gymnast per rad. Tom celle i navnekolonnen hoppes over. |

## Norgescup – `Pameldingskjema-NC-mal.xlsx`

| Indeks | Kolonne | Innhold | Format |
|---|---|---|---|
| 0 | A | Fullt navn | tekst |
| 1 | B | Fødselsdato / fødselsår | tekst, sendes videre urørt |
| 2 | C | Klasse: rekrutt | `x` |
| 3 | D | Klasse: 13-14 | `x` |
| 4 | E | Klasse: 15-16 | `x` |
| 5 | F | Klasse: 17-18 | `x` |
| 6 | G | Klasse: senior | `x` |
| 7 | H | Trener | `x` |
| 8+ | I → | Måltider, transport, allergi, fototillatelse | **leses ikke** |

Regler:
- Krysset må være bokstaven `x` (store/små spiller ingen rolle) – annen tekst teller ikke.
- Flere kryss i C–G gir advarsel, og **siste** kryss vinner.
- Trener uten klasse tas ikke med i fordelingen.

## Senior-NM og Junior-NM – `Pameldingskjema-SeniorNM-mal.xlsx` / `-JuniorNM-mal.xlsx`

| Indeks | Kolonne | Innhold | Format |
|---|---|---|---|
| 0 | A | Fullt navn | tekst |
| 1 | B | Fødselsdato / fødselsår | tekst |
| 2 | C | Trener | `x` |
| 3–8 | D–I | Måltider, allergi, transport osv. | **leses ikke** |
| 9 | J | Seedet | `x` |

Regler:
- Alle gymnaster får automatisk klassen `senior` – malen har ingen klassekolonner.
- Mangler `x` i J, regnes gymnasten som useedet.
- Antall seedede/useedede må stemme med `SENIOR_DISTRIBUTION`, ellers feiler
  fordelingen med en tydelig feilmelding.

## Utdata – generert fil

Filnavn ved nedlasting: `tentative_groups_and_pools.xlsx`

**Ett ark per pulje**, navngitt `Pulje 1`, `Pulje 2` osv.

Norgescup-ark:
```
Navn        | Klubb  | Klasse
Pulje 1     | Gruppe 1
Ola Nordmann| Bergen TF | rekrutt
...
(tom rad)
Pulje 1     | Gruppe 2
...
```

NM-ark: samme oppsett, men uten kolonnen `Klasse`.

**Ett ark `Konkurranseplan Mal`** med hardkodet tidsplan (ulik for NC og NM),
med plassholdere som `Fredag XX. måned` som arrangøren fyller ut.

## Testdata

`src/data/excel_maker.py` genererer realistiske påmeldingsfiler fra JSON-mockdata.

```bash
pip install -r requirements.txt
cd src/data
python excel_maker.py
```

Scriptet styres av variabler øverst i filen – husk å sette alle tre i sammenheng:
- inputfilen (`turnere.json`, `turnereNmSenior.json`, `turnereNmJunior.json`)
- `template_path` (hvilken mal som fylles ut)
- `konkType` (`NC` / `NMS` / `NMJ`) og utmappen `excelMockdataFOLDERNAME`

Ferdig genererte mapper:

| Mappe | Bruk |
|---|---|
| `excel-mockdata-NY` | Norgescup, gyldige data |
| `excel-mockdata-NY-medFeil` | Norgescup med bevisste feil – tester valideringen |
| `excel-mockdata-NMSenior` | Senior-NM |
| `excel-mockdata-NMJunior` | Junior-NM |

Mockdataene inneholder oppdiktede navn. **Ekte deltakerdata skal aldri committes.**
