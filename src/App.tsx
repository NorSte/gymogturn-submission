/*
app.tsx — Your main component

This is the root React component of your application. It usually contains:

    Your app layout (header, form, pages, etc.)

    Your routing (if using react-router)

    Any top-level state or context providers
*/

import React, { useRef, useState } from "react";
import { readGymnastsFromExcel } from "@/services/excelReader";
import { generateGroupPlan } from "@/services/groupPlanner";
import { writeGroupPlanToExcel } from "@/services/groupWriter";
import { Gymnast } from "@/types/Gymnast";
import SignatureBadge  from "./components/SignatureBadge";

const App = () => {
  const [started, setStarted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [invalidGymnasts, setInvalidGymnasts] = useState<
    { row: number; name?: string; club?: string; errors: string[] }[]
  >([]);
  const [competitionType, setCompetitionType] = useState<"NMJ" | "NMS" | "NC">("NC");
  const fileInputRef = useRef<HTMLInputElement>(null);


   // Prepend new files, dedupe by name+size+lastModified, clear download link
  const mergeFiles = (incoming: FileList | File[]) => {
    const newOnes = Array.from(incoming);
    const combined = [...newOnes, ...files]; // prepend new first
    const seen = new Set<string>();
    const deduped: File[] = [];
    for (const f of combined) {
      const key = `${f.name}-${f.size}-${f.lastModified}`;
      if (!seen.has(key)) {
        seen.add(key);
        deduped.push(f);
      }
    }
    setFiles(deduped);
    setDownloadUrl(null);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      mergeFiles(event.dataTransfer.files);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      mergeFiles(event.target.files);
      // allow picking the same file again next time
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleClearFiles = () => {
    setFiles([]);
    setDownloadUrl(null);
    setInvalidGymnasts([])
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    try {
      const allGymnasts: Gymnast[] = [];
      const allInvalid: { row: number; name?: string; errors: string[] }[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { valid, invalid } = await readGymnastsFromExcel(file, competitionType);
        console.log(`File ${file.name} → ${valid.length} valid, ${invalid.length} invalid`);
        allGymnasts.push(...valid);
        allInvalid.push(...invalid);
      }

      setInvalidGymnasts(allInvalid);

      const planned = generateGroupPlan(allGymnasts, competitionType);
      console.log("Generated plan:", planned);

      // Now delegate Excel writing
      const url = writeGroupPlanToExcel(planned, competitionType);
      setDownloadUrl(url);

    } catch (err) {
      console.error("❌ Processing failed:", err);
      alert("Noe gikk galt: " + (err instanceof Error ? err.message : "Ukjent feil"));
    } finally {
      setUploading(false);
    }
  };

  // Adding dynamic templateFile for the different competition types
  const templateFile = (() => {
  switch (competitionType) {
    case "NMS":
      return "/Påmeldingsmal-SeniorNM.xlsx";
    case "NMJ":
      return "/Påmeldingsmal-SeniorNM.xlsx"; 
    default:
      return "/Påmeldingsmal-NC.xlsx";
  }})();

  if (!started) {
    return (
      <div className="h-screen relative">
        {/* centered content */}
        <div className="flex flex-col justify-center items-center text-center px-6 h-full">
          <h1 className="text-3xl font-bold mb-4">Velkommen til Puljeplanleggeren</h1>
          <p className="text-gray-600 mb-8">Last opp Excel-filer for å generere puljer og grupper automatisk.</p>
          <button
            onClick={() => setStarted(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
          >
            🚀 Start planlegging - Turn menn
          </button>
        </div>

        {/* pinned bottom-right */}
        <SignatureBadge text="" logoSrc="/NorSte.jpg" href="https://github.com/NorSte" />
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
            src="/NGTFlogo400.png"
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
            onClick={() => {
              // ensures picking the same file fires onChange
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            onChange={handleFileChange}
            className="mb-4 w-full file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-lg file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />

          {files.length > 0 && (
            <div className="mb-8">
              <ul className="text-sm text-gray-700 list-disc list-inside">
                {files.map((file) => (
                  <li key={`${file.name}-${file.size}-${file.lastModified}`}>📄 {file.name}</li>
                ))}
              </ul>
              <div className="text-sm text-gray-600 mb-1">
                {files.length} fil{files.length === 1 ? "" : "er"} klare for opplasting
              </div>
            </div>
          )}

          {/*Adding process and empty sumbissions buttons*/}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleUpload}
              disabled={!files.length || uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50 transition"
            >
              {uploading ? "⏳ Jobber med fordeling..." : "🚀 Last opp og prosesser"}
            </button>

            <button
              onClick={handleClearFiles}
              disabled={!files.length || uploading}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
            >
              🗑️ Tøm filer
            </button>

            {/*adding dropdown menu*/}
            <select
              value={competitionType}
              onChange={(e) => setCompetitionType(e.target.value as "NC" | "NMS" | "NMJ")}
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="NC">Norgescup</option>
              <option value="NMS">SeniorNM</option>
              <option value="NMJ">JuniorNM</option>
            </select>

            {/*adding exceltemplate url*/}
            {/*Burde kanskje legge til en link til hvor Excel-malene ligger*/}
            <a
              href={templateFile}
              download
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition text-center"
            >
              📄 Last ned mal 
            </a>
          </div>

          {downloadUrl && (
            <div style={{ marginBottom: "2rem", textAlign: "center" }}>
              <a
                href={downloadUrl}
                download="planned_groups_and_pools.xlsx"
                className="inline-block bg-green-100 text-green-800 font-medium py-2 px-4 rounded-lg hover:bg-green-200 transition"
              >
                📥 Last ned pulje- og gruppeoversikt
              </a>
            </div>
          )}

          {/* 👇 New block for invalids */}
          {invalidGymnasts.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <h2 className="text-red-400 font-semibold mb-2">
                ⚠️ Gymnaster som krever manuell sjekk ({invalidGymnasts.length})
              </h2>
              <ul className="text-sm text-red-800 list-disc list-inside">
                {invalidGymnasts.map((g, idx) => (
                  <li key={idx}>
                    {g.club ? `${g.club} – ` : ""}
                    Rad {g.row} – {g.name || "Ukjent navn"} → {g.errors.join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>


      <SignatureBadge
          text=""
          logoSrc="/NorSte.jpg"
          href="https://github.com/NorSte" // optional (clickable if set)
        />
    </div>
  );
};

export default App;
