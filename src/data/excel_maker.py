import json
from openpyxl import load_workbook
from collections import defaultdict

# LEGG INN TURNERE HER || HUSK Å ENDRE OUTPUT-PATH
with open("ifact2Turnere.json", "r", encoding="utf-8") as f:
    gymnasts = json.load(f)

# Group gymnasts by club
club_groups = defaultdict(list)
for gymnast in gymnasts:
   club_groups[gymnast["club"]].append(gymnast)

# Load the template Excel file
template_path = "Pameldingskjema-mal.xlsx"
output_files = []

# Mapping categories to columns
category_columns = {
    "rekrutt": "F",
    "13-14": "G",
    "15-16": "H",
    "17-18": "I",
    "senior": "J",
    "trener": "D"
}

# Write data for each club
for club, members in club_groups.items():
    # Load the Excel template
    workbook = load_workbook(template_path)
    sheet = workbook.active

    # Insert contact details
    sheet["C3"] = club  # Club name
    sheet["C4"] = "Kontaktperson Navn"
    sheet["C5"] = "kontakt@example.com"
    sheet["C6"] = "12345678"

    sheet["A9"] = "Lisensnr."
    sheet["B9"] = "Navn"
    sheet["C9"] = "Gymnast"
    sheet["D9"] = "Trener"
    sheet["E9"] = "Født."
    sheet["F9"] = "Rekrutt"
    sheet["G9"] = "13-14"
    sheet["H9"] = "15-16"
    sheet["I9"] = "17-18"
    sheet["J9"] = "Senior"
    sheet["K9"] = "Lunsj lørdag"
    sheet["L9"] = "Lunsj søndag"
    sheet["M9"] = "Transport"
    sheet["N9"] = "Trening fredag"
    sheet["O9"] = "Allergier"
    sheet["P9"] = "Foto/filmtillatelse"

    # Write each gymnast's info starting at row 10
    row = 10
    for member in members:
        sheet[f"A{row}"] = member["licenseNumber"]
        sheet[f"B{row}"] = member["fullName"]

        if (member["category"])!= "trener":
            sheet[f"C{row}"] = "x"
        else:
            sheet[f"C{row}"] = ""  # Gymnast - left empty

        if (member["category"])== "trener":
            sheet[f"D{row}"] = "x"
        else:
            sheet[f"D{row}"] = ""  # Trener - left empty

        sheet[f"E{row}"] = member["dob"]

        # f - j
        if member["category"] in category_columns:
            sheet[f"{category_columns[member['category']]}{row}"] = "x"

        # For K-P
        for col in ["K", "L", "M", "N", "P"]: sheet[f"{col}{row}"] = "x"
        sheet[f"O{row}"] = "ingen"

        row += 1

    # Save the new file
    sanitized_club = club.replace(" ", "_").replace("/", "_")
    output_path = f"./excel-mockdata2/pamelding_{sanitized_club}.xlsx"
    workbook.save(output_path)
    output_files.append(output_path)

output_files
