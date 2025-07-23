import * as XLSX from 'xlsx';

import { Gymnast } from '@/types/Gymnast';

export function readGymnastsFromExcel(file: File): Promise<Gymnast[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][];

      const gymnasts: Gymnast[] = [];

      const club = json[2]?.[2] || "Ukjent klubb"; // Cell C3
      for (let i = 7; i < json.length; i++) { // Row 8 is index 7
        const row = json[i];
        const license_number = row[0];
        const full_name = row[1];
        const dob = row[4];
        


        if (!license_number) continue;

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

        if (!category) continue;
        
        const formattedDob = typeof dob === 'string'
          ? dob
          : dob instanceof Date
          ? dob.toLocaleDateString('no-NO')
          : String(dob);

        gymnasts.push({
          license_number: String(license_number),
          full_name: String(full_name),
          dob: formattedDob,
          club,
          category
        });
      }
      console.log("✅ Gymnasts extracted from Excel:", gymnasts);
      resolve(gymnasts);
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}
