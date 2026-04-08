import json
import os
from openpyxl import load_workbook
from collections import defaultdict

# LEGG INN TURNERE HER || HUSK Å ENDRE OUTPUT-PATH
with open("turnereNmSenior.json", "r", encoding="utf-8") as f:
    gymnasts = json.load(f)

# Group gymnasts by club
club_groups = defaultdict(list)
for gymnast in gymnasts:
   club_groups[gymnast["club"]].append(gymnast)

# HUSK RIKTIG TYPE KONKURRANSE
template_path = "Pameldingsmal-SeniorNM.xlsx"
output_files = []
konkType = "NMS" # NMS  | NC  | NMJ 

# Mapping categories to columns
category_columns = {
    "rekrutt": "C",
    "13-14": "D",
    "15-16": "E",
    "17-18": "F",
    "senior": "G",
    "trener": "H"
}

# Write data for each club
for club, members in club_groups.items():
    # Load the Excel template
    workbook = load_workbook(template_path)
    sheet = workbook.active

    # Insert contact details
    sheet["B3"] = club  # Club name
    sheet["B4"] = "Kontaktperson Navn"
    sheet["B5"] = "kontakt@example.com"
    sheet["B6"] = "12345678"

    """
    sheet["A9"] = "Navn"
    sheet["B9"] = "Trener"
    sheet["C9"] = "Fødselår"
    sheet["D9"] = "Rekrutt."
    sheet["E9"] = "13-14"
    sheet["F9"] = "15-16"
    sheet["G9"] = "17-18"
    sheet["H9"] = "Senior"
    sheet["I9"] = "Trener"
    sheet["J9"] = "Middag Fredag"
    sheet["K9"] = "Lunsj Lørdag"
    sheet["L9"] = "Middag Lørdag"
    sheet["L9"] = "Lunsj Søndag"
    sheet["M9"] = "Transport"
    sheet["N9"] = "Trening fredag"
    sheet["O9"] = "Allergier"
    sheet["P9"] = "Foto/filmtillatelse"
    """

    # Write each gymnast's info starting at row index 11, which is row 12 after Eksempel Eksempelsen
    row = 12
    for member in members:
        sheet[f"A{row}"] = member["fullName"]
        sheet[f"B{row}"] = member["dob"]

        # This is making the excel file in the NC format
        if (konkType == "NC"):
            if (member["category"]) == "trener":
                sheet[f"H{row}"] = "x"

            # Writing in Gymnast category C-G
            if member["category"] in category_columns:
                sheet[f"{category_columns[member['category']]}{row}"] = "x"

            # Writing in meals, allergies and permissions I-N for NC
            for col in ["I", "J", "K", "L", "M", "N"]: sheet[f"{col}{row}"] = "x"
            sheet[f"M{row}"] = "ingen"

            row += 1

        elif(konkType == "NMS"):
            if (member["category"]) == "trener":
                sheet[f"C{row}"] = "x"
            
            # For D-I
            for col in ["D", "E", "F", "G", "I"]: sheet[f"{col}{row}"] = "x"
            sheet[f"H{row}"] = "ingen"
            
            row += 1


    # Save the new file
    excelMockdataFOLDERNAME = "./excel-mockdata-NMSenior"
    sanitized_club = club.replace(" ", "_").replace("/", "_")
    os.makedirs(excelMockdataFOLDERNAME, exist_ok=True)
    output_path = f"{excelMockdataFOLDERNAME}/pamelding_{sanitized_club}.xlsx"
    workbook.save(output_path)
    output_files.append(output_path)

output_files
