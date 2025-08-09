import json
from openpyxl import load_workbook
from collections import defaultdict

# LEGG INN TURNERE HER || HUSK Å ENDRE OUTPUT-PATH
with open("turnere.json", "r", encoding="utf-8") as f:
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

    sheet["A8"] = "Lisensnr."
    sheet["B8"] = "Navn"
    sheet["C8"] = "Gymnast"
    sheet["D8"] = "Trener"
    sheet["E8"] = "Født."
    sheet["F8"] = "Rekrutt"
    sheet["G8"] = "13-14"
    sheet["H8"] = "15-16"
    sheet["I8"] = "17-18"
    sheet["J8"] = "Senior"
    sheet["K8"] = "Lunsj lørdag"
    sheet["L8"] = "Lunsj søndag"
    sheet["M8"] = "Transport"
    sheet["N8"] = "Trening fredag"
    sheet["O8"] = "Allergier"
    sheet["P8"] = "Bekreftelse på samtykke vedr foto/film"

    # Write each gymnast's info starting at row 8
    row = 9
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
    output_path = f"./excel-mockdata/pamelding_{sanitized_club}.xlsx"
    workbook.save(output_path)
    output_files.append(output_path)

output_files
