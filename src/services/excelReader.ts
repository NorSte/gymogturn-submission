import * as XLSX from 'xlsx';

import { Gymnast } from '@/types/Gymnast';

export function readGymnastsFromExcel(file: File): Promise<{ valid: Gymnast[], invalid: {row:number; name?:string; errors:string[]}[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];

      const gymnasts: Gymnast[] = [];
      const invalidGymnasts: { 
        row: number; 
        name?: string;
        club?: string;
        errors: string[]; 
      }[] = [];

      const club = json[2]?.[2] || "Ukjent klubb"; // Cell C3
      for (let i = 9; i < json.length; i++) { // Row 10 is index 9
        const row = json[i];
        const license_number = row[0];
        const full_name = row[1];
        const is_coach = (typeof row[3] === "string" && row[3].toLowerCase() === "x");
        const dob = row[4];
        
        // If both license number AND name are missing → skip row entirely
        if (!license_number && !full_name) {
          continue;
        }

        const categoryMap = {
          5: "rekrutt",
          6: "13-14",
          7: "15-16",
          8: "17-18",
          9: "senior"
        };
        
        // Giving gymnasts category
        let category: string | null = null;
        for (const colIndex in categoryMap) {
          const val = row[parseInt(colIndex)];
          if (typeof val === 'string' && val.toLowerCase() === 'x') {
            category = categoryMap[colIndex];
            break;
          }
        }

        // Validating gymnast name
        const nameStr = typeof full_name === "string" ? full_name.trim() : "";

        // Regex to detect numbers in the name
        const hasNumber = /\d/.test(nameStr);

        // Invalid if empty, "x", or contains digits
        if (nameStr === "" || nameStr.toLowerCase() === "x" || hasNumber) {
          console.warn(`⚠️ Invalid name in for club ${club} at row ${i + 1}`);
          invalidGymnasts.push({
            row: i + 1,
            club: club,
            errors: [
              `Invalid name input (name: "${full_name}")`
            ]
          });
          continue; // skip this gymnast
        }

        let parsedDob: Date | null = null;
        if (dob instanceof Date) {
          // If cell is of "Date" Type
          parsedDob = dob;
        } else if (typeof dob === "string") {
          // Check if passes norwegian Check
          parsedDob = parseNorwegianDate(dob);
        } else {
          // could be number or undefined
          parsedDob = null;
        }

        if (!parsedDob) {
          console.warn(`⚠️ Invalid DOB for ${full_name} in row ${i + 1}`);
          invalidGymnasts.push({
            row: i + 1,
            name: full_name,
            club: club,
            errors: ["Invalid Date of birth: " + dob]
          });
          continue;
        }
        // Nice formatted DOB for saving
        const formattedDob = parsedDob.toLocaleDateString("no-NO");

        // Validate gymnast also be coach 
        if (is_coach && category) {
          console.warn(`⚠️ ${full_name} is marked as both gymnast and coach`);
          invalidGymnasts.push({
            row: i+1,
            name: full_name,
            club: club,
            errors: ["Is both gymnast and coach."]
          })
        }

        // Skips gymnasts with no category
        if (!category) continue;

        // Adding gymnasts
        gymnasts.push({
          license_number: String(license_number),
          full_name: String(full_name),
          dob: formattedDob,
          club,
          category
        });
      }

      console.log("Gymnasts extracted from Excel:", gymnasts);
      console.log("Gymnasts with invalid output:", invalidGymnasts);

      // Uploading the gymnasts and the invalid inputs
      resolve({ valid: gymnasts, invalid: invalidGymnasts });
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

function parseNorwegianDate(input: string): Date | null {
  const match = input.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (!match) return null;

  const [_, day, month, year] = match;
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return isNaN(d.getTime()) ? null : d;
}

