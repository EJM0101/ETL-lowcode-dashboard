import React, { useState } from 'react';

export default function Home() {
  const [data, setData] = useState([]);
  const [preview, setPreview] = useState([]);
  const [rules, setRules] = useState({});
  const [headers, setHeaders] = useState([]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const text = await file.text();
    const rows = text.trim().split('\n');
    const header = rows[0].split(',').map(h => h.replace(/"/g, '').trim());
    setHeaders(header);

    const parsed = rows.slice(1).map(line => {
      const cols = line.split(',');
      const obj = {};
      header.forEach((h, i) => obj[h] = cols[i]?.replace(/"/g, '').trim());
      return obj;
    });

    setData(parsed);
    setPreview(parsed);
  };

  const handleRuleChange = (col, action) => {
    setRules(prev => ({
      ...prev,
      [col]: {
        ...prev[col],
        [action]: !prev[col]?.[action]
      }
    }));
  };

  const applyTransformations = () => {
    const transformed = data.map(row => {
      const newRow = {};
      for (let key in row) {
        let val = row[key];
        if (rules[key]?.trim) val = val.trim();
        if (rules[key]?.upper) val = val.toUpperCase();
        const newKey = rules[key]?.rename || key;
        newRow[newKey] = val;
      }
      return newRow;
    });
    setPreview(transformed);
  };

  return (
    <style>
          @tailwind base;
@tailwind components;
@tailwind utilities;

/* Styles globaux personnalisés */
body {
  @apply bg-gray-50 text-gray-800 font-sans;
}

h1, h2 {
  @apply text-gray-900;
}

input[type="file"] {
  @apply border border-gray-300 rounded px-2 py-1;
}

table th, table td {
  @apply border px-3 py-2 text-sm;
}
   </style>
    <div className="min-h-screen bg-white text-gray-800 px-4 py-10 md:px-10 lg:px-20">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-10">
        ETL Low-Code Dashboard
      </h1>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Upload */}
        <div className="bg-gray-100 border border-gray-300 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">1. Téléversez un fichier CSV</h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>

        {/* Transformations */}
        {headers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">2. Définir les règles de transformation</h2>
            <div className="space-y-4">
              {headers.map(col => (
                <div key={col} className="border-b pb-3">
                  <p className="font-medium text-indigo-800 mb-2">{col}</p>
                  <div className="flex flex-wrap gap-4 items-center">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" onChange={() => handleRuleChange(col, 'trim')} />
                      Trim
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" onChange={() => handleRuleChange(col, 'upper')} />
                      Majuscule
                    </label>
                    <label className="flex items-center gap-2">
                      Renommer :
                      <input
                        type="text"
                        placeholder="nouveau nom"
                        onChange={(e) =>
                          setRules(prev => ({
                            ...prev,
                            [col]: { ...prev[col], rename: e.target.value }
                          }))
                        }
                        className="border px-2 py-1 rounded"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={applyTransformations}
              className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            >
              Appliquer les transformations
            </button>
          </div>
        )}

        {/* Preview */}
        <div className="bg-white border border-gray-300 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">3. Aperçu des données transformées</h2>
          {preview.length === 0 ? (
            <p className="text-gray-500">Aucune donnée chargée</p>
          ) : (
            <div className="overflow-auto">
              <table className="min-w-full border text-sm text-left">
                <thead>
                  <tr className="bg-gray-100">
                    {Object.keys(preview[0]).map((col, i) => (
                      <th key={i} className="border px-3 py-2">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="border px-3 py-2">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}