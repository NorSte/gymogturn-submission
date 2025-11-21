import * as XLSX from 'xlsx';

import { Gymnast } from '@/types/Gymnast';

export function readGymnastsFromExcel(file: File, competitionType: string): Promise<{ valid: Gymnast[], invalid: {row:number; name?:string; errors:string[]}[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];
      
      // Enten NC | NMS | NMJ
      if(competitionType == "NC"){
        const [valid, invalid] = readNCandGetGymnastsNC(json);
        console.log(valid)
        console.log(invalid)

        // Uploading the gymnasts and the invalid inputs
        resolve({ valid, invalid });
        return;
      }else if(competitionType == "NMS"){
        const [valid, invalid] = readNCandGetGymnastsNMS(json);
      }

    };

    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}




function readNCandGetGymnastsNC(json: string[][]): [Gymnast[], { row: number; name?: string; club?: string; errors: string[] }[]] {
  const gymnasts: Gymnast[] = [];
  const invalidGymnasts: { 
        row: number; 
        name?: string;
        club?: string;
        errors: string[]; 
      }[] = [];

  const club = json[2]?.[1] || "Ukjent klubb"; // Cell C3
  for (let i = 11; i < json.length; i++) { // Index 11 is Row 12      

    const row = json[i];
    const full_name = row[0];
    const dob = row[1];
    const is_coach = (typeof row[7] === "string" && row[7].toLowerCase() === "x");
      
    // Skipping Eksempel Eksemplsen if not changed
    if(full_name == "Eksempel Eksemplsen"){continue;}
    if(!full_name){continue;}

    const categoryMap = {
      2: "rekrutt",
      3: "13-14",
      4: "15-16",
      5: "17-18",
      6: "senior"
    };
    
    // Giving gymnasts category
    // IF gymnast got two categories, the first one is APPLIED
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
    const hasNumberinName = /\d/.test(nameStr);

    // Invalid if empty, "x", or contains digits
    if (nameStr === "" || nameStr.toLowerCase() === "x" || hasNumberinName) {
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

    // Validate gymnast also be coach 
    if (is_coach && category) {
      console.warn(`⚠️ ${full_name} from ${club} is marked as both gymnast and coach`);
      invalidGymnasts.push({
        row: i+1,
        name: full_name,
        club: club,
        errors: ["Is both gymnast and coach."]
      })
    }

    // Check if gymnast have category or is coach
    if (!is_coach && !category) {
      console.warn(`⚠️ ${full_name} from ${club} does not have category`);
      invalidGymnasts.push({
        row: i+1,
        name: full_name,
        club: club,
        errors: ["has no category."]
      })
    }
    // Skips if it is a coach
    if (!category) continue;

    // Adding gymnasts
    gymnasts.push({
      full_name: String(full_name),
      dob: dob,
      club,
      category
    });
  }

  // Printing Gymnasts and invalid gymnasts, and lastly returning
  console.log("Gymnasts extracted from Excel:", gymnasts);
  console.log("Gymnasts with invalid output:", invalidGymnasts);

  return [gymnasts, invalidGymnasts];
}

function readNCandGetGymnastsNMS(json: string[][]): [Gymnast[], { row: number; name?: string; club?: string; errors: string[] }[]] {
  const gymnasts: Gymnast[] = [];
  const invalidGymnasts: { 
        row: number; 
        name?: string;
        club?: string;
        errors: string[]; 
      }[] = [];

  const club = json[2]?.[1] || "Ukjent klubb"; // Cell B3
  for (let i = 9; i < json.length; i++) { // Index 10 is Row 11      

    const row = json[i];
    const full_name = row[0];
    const dob = row[1];
    const is_coach = (typeof row[7] === "string" && row[7].toLowerCase() === "x");
      
    // Skipping Eksempel Eksemplsen if not changed
    if(full_name == "Eksempel Eksemplsen"){continue;}
    if(!full_name){continue;}
    

    // SEEDING !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


    // Validating gymnast name
    const nameStr = typeof full_name === "string" ? full_name.trim() : "";

    // Regex to detect numbers in the name
    const hasNumberinName = /\d/.test(nameStr);

    // Invalid if empty, "x", or contains digits
    if (nameStr === "" || nameStr.toLowerCase() === "x" || hasNumberinName) {
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

    // Validate gymnast also be coach 
    if (is_coach && category) {
      console.warn(`⚠️ ${full_name} from ${club} is marked as both gymnast and coach`);
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
      full_name: String(full_name),
      dob: dob,
      club,
      category
    });
  }

  // Printing Gymnasts and invalid gymnasts, and lastly returning
  console.log("Gymnasts extracted from Excel:", gymnasts);
  console.log("Gymnasts with invalid output:", invalidGymnasts);

  return [gymnasts, invalidGymnasts];
  }
