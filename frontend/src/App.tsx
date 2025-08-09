/*
app.tsx — Your main component

This is the root React component of your application. It usually contains:

    Your app layout (header, form, pages, etc.)

    Your routing (if using react-router)

    Any top-level state or context providers
*/

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { readGymnastsFromExcel } from "@/services/excelReader";
import { generateGroupPlan } from "@/services/groupPlanner";
import { Gymnast } from "@/types/Gymnast";

const App = () => {
  const [started, setStarted] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      setFiles(event.dataTransfer.files);
      setDownloadUrl(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(event.target.files);
      setDownloadUrl(null);
    }
  };

  const handleClearFiles = () => {
    setFiles(null);
    setDownloadUrl(null);
  };

  const handleUpload = async () => {
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const allGymnasts: Gymnast[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const gymnastsFromFile = await readGymnastsFromExcel(file);
        console.log(`File ${file.name} → ${gymnastsFromFile.length} gymnasts`);
        allGymnasts.push(...gymnastsFromFile);
      }

      const planned = generateGroupPlan(allGymnasts);
      console.log("Generated plan:", planned);

      if (Object.keys(planned).length === 0) {
        throw new Error("Ingen puljer ble generert – sjekk at Excel-filen har riktige kolonner og verdier.");
      }

      const wb = XLSX.utils.book_new();

      for (const [poolName, groups] of Object.entries(planned)) {
        const rows: any[] = [];
        
        // Pushing header row
        rows.push(["Navn", "Klubb", "Klasse"]);
          let i = 0
          groups.forEach((group) => {
            i++
            // Pushing Pool and group
            rows.push([poolName, "Gruppe " + i]);
            group.forEach((g) => {
              // Pushing gymnasts
              rows.push([g.full_name, g.club, g.category]);
            });

          rows.push([]);
        });
        const ws = XLSX.utils.aoa_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, ws, poolName);
      }

      const buffer = XLSX.write(wb, { type: "array", bookType: "xlsx" });
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      console.error("❌ Processing failed:", err);
      alert("Noe gikk galt: " + (err instanceof Error ? err.message : "Ukjent feil"));
    } finally {
      setUploading(false);
    }
  };


  if (!started) {
    return (
      <div className="h-screen flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-3xl font-bold mb-4">Velkommen til Puljeplanleggeren</h1>
        <p className="text-gray-600 mb-8">Last opp Excel-filer for å generere puljer og grupper automatisk.</p>
        <button
          onClick={() => setStarted(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
        >
          🚀 Start planlegging - Turn menn
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative w-full">
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => setStarted(false)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-lg font-semibold px-4 py-2 rounded-md bg-blue-100 hover:bg-blue-200 transition-shadow shadow-sm hover:shadow-md"
        >
          <img
            src="./NGTFlogo400.png"
            alt="Tilbake til start"
            className="h-[75px] w-[75px] object-contain"
          />
          <span className="hidden sm:inline text-sm font-medium">Tilbake til start</span>
        </button>
      </div>

      <div className="p-8 flex flex-col items-center">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8 mt-16">
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Konkurranseoppsett – Excel Import
          </h1>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-600 hover:border-blue-500 transition-colors mb-4"
          >
            <p className="text-lg">Dra og slipp Excel-filer her</p>
            <p className="text-sm text-gray-400">(eller velg filer manuelt under)</p>
          </div>

          <input
            type="file"
            accept=".xlsx"
            multiple
            onChange={handleFileChange}
            className="mb-4 w-full file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-lg file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />

          {files && (
            <div className="mb-4">
              <ul className="text-sm text-gray-700 list-disc list-inside">
                {Array.from(files).map((file, index) => (
                  <li key={index}>📄 {file.name}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!files || uploading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 transition"
          >
            {uploading ? "⏳ Jobber med fordeling..." : "🚀 Last opp og prosesser"}
          </button>

          {files && (
            <button
              onClick={handleClearFiles}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
            >
              🗑️ Tøm filer
            </button>
          )}

          {downloadUrl && (
            <div className="mt-6 text-center">
              <a
                href={downloadUrl}
                download="planned_groups_and_pools.xlsx"
                className="inline-block bg-green-100 text-green-800 font-medium py-2 px-4 rounded-lg hover:bg-green-200 transition"
              >
                📥 Last ned pulje- og gruppeoversikt
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
