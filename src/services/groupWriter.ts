// services/groupWriter.ts
import * as XLSX from "xlsx";
import { Gymnast } from "@/types/Gymnast";

/**
 * Generate an Excel file with pools and groups, and return a download URL.
 * @param plannedGroups Object where keys = pool names, values = array of groups
 * @returns Blob URL for download
 */
export function writeGroupPlanToExcel(
  plannedGroups: Record<string, Gymnast[][]>
): string {
  if (!plannedGroups || Object.keys(plannedGroups).length === 0) {
    throw new Error(
      "Ingen puljer ble generert – sjekk at Excel-filen har riktige kolonner og verdier."
    );
  }

  const wb = XLSX.utils.book_new();

  // Writing Pool sheets
  for (const [poolName, groups] of Object.entries(plannedGroups)) {
    const rows: any[] = [];
    rows.push(["Navn", "Klubb", "Klasse"]);

    let i = 0;
    groups.forEach((group) => {
      i++;
      rows.push([poolName, "Gruppe " + i]);
      group.forEach((g) => rows.push([g.full_name, g.club, g.category]));
      rows.push([]); // empty line between groups
    });

    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, poolName);
  }

  // Writing competition plan
    const competitionRows: any[] = [];
    competitionRows.push(["Tidsplan", "Fredag:"]);

    competitionRows.push(["KL: 16:00-20:00", "Hallen åpner, og det er fri trening for de som ønsker"]);
    competitionRows.push(["KL: 20:00", "Lagledermøte med teknisk komitè NGTF"]);
    competitionRows.push([""]);
    competitionRows.push([""]);

    // New Day - Pool 1
    competitionRows.push(["Tidsplan", "Lørdag:"]);
    competitionRows.push(["KL: 09:00", "Hallen åpner for Pulje 1"]);
    competitionRows.push(["KL: 09:00-10:20", "Generell og fri oppvarming i alle apparatene"]);
    competitionRows.push(["KL: 10:30", "Konkurransestart"]);
    competitionRows.push(["KL: 12:40", "Premieutdeling for pulje 1"]);
    competitionRows.push([""]);

    // New Pool - 2
    competitionRows.push(["KL: 13:00-14:20", "Pulje 2: Generell og fri oppvarming i alle apparatene"]);
    competitionRows.push(["KL: 14:30:17:00", "Konkurranse"]);
    competitionRows.push(["KL: 17:00", "Premieutdeling pulje 2"]);
    competitionRows.push([""]);
    competitionRows.push([""]);

    // New day, new pool 3
    competitionRows.push(["Tidsplan", "Søndag:"]);
    competitionRows.push(["KL: 09:00", "Hallen åpner for Pulje 3"]);
    competitionRows.push(["KL: 09:00-11:20", "Generell og fri oppvarming i alle apparatene"]);
    competitionRows.push(["KL: 11:30-14:00", "Konkurranse"]);
    //competitionRows.push(["KL: 14:00", "Premieutdeling for pulje 3"]); // Felles premieutdeling for alle ?
    competitionRows.push([""]);

    // New Pool - 4
    competitionRows.push(["KL: 14:15-1540:", "Pulje 4: Generell og fri oppvarming i alle apparatene"]);
    competitionRows.push(["KL: 15:45-18:15", "Konkurranse for pulje 4"]);
    competitionRows.push(["KL: 18:20", "Premieutdeling pulje 3 og 4"]);

    // Adding competition schedule to excel sheet
    const ws = XLSX.utils.aoa_to_sheet(competitionRows);
    XLSX.utils.book_append_sheet(wb, ws, "Konkurranseplan");


  const buffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  return URL.createObjectURL(blob);
}
