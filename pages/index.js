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
    <div className="min-h-screen bg-gray-50 text-gray-800 px-4 md:px-12 py-10">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-indigo-700">ETL Low-Code Dashboard</h1>
        <p className="text-lg mt-2 text-gray-500">
          Plateforme intuitive pour l'extraction, transformation et chargement de données CSV.
        </p>
      </header>

      <main className="space-y-12 max-w-6xl mx-auto">
        {/* Upload Section */}
        <section className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Téléverser un fichier CSV</h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm border border-gray-300 rounded-md shadow-sm file:bg-indigo-50 file:text-indigo-700 file:px-4 file:py-2 file:mr-4 file:border-0 file:rounded file:font-semibold hover:file:bg-indigo-100"
          />
        </section>

        {/* Transformation Rules */}
        {headers.length > 0 && (
          <section className="bg-white rounded-xl shadow p-6 border border-indigo-100">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-6">2. Configurer les règles de transformation</h2>
            <div className="space-y-6">
              {headers.map(col => (
                <div key={col} className="border-b pb-4">
                  <p className="font-semibold text-gray-700">{col}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" onChange={() => handleRuleChange(col, 'trim')} />
                      <span>Trim</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" onChange={() => handleRuleChange(col, 'upper')} />
                      <span>Majuscule</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <span>Renommer :</span>
                      <input
                        type="text"
                        placeholder="nouveau nom"
                        className="border rounded px-2 py-1 text-sm"
                        onChange={(e) => setRules(prev => ({
                          ...prev,
                          [col]: { ...prev[col], rename: e.target.value }
                        }))}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={applyTransformations}
              className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 shadow"
            >
              Appliquer les transformations
            </button>
          </section>
        )}

        {/* Data Preview */}
        <section className="bg-white rounded-xl shadow p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Aperçu des données transformées</h2>
          {preview.length === 0 ? (
            <p className="text-gray-500">Aucune donnée chargée</p>
          ) : (
            <div className="overflow-auto rounded border border-gray-200">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    {Object.keys(preview[0]).map((col, i) => (
                      <th key={i} className="px-4 py-2 border">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 border-t">
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="px-4 py-2 border">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}