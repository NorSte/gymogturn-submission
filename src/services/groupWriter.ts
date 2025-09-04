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

  const buffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  return URL.createObjectURL(blob);
}
