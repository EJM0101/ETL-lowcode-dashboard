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
    <div className="min-h-screen bg-gray-50 p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-800">ETL Low-Code Dashboard</h1>

      <div className="mb-6">
        <p className="text-gray-600 mb-2">Téléversez un fichier <strong>CSV</strong> pour commencer :</p>
        <input type="file" accept=".csv" onChange={handleFileChange} className="border p-2 rounded" />
      </div>

      {headers.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Règles de transformation</h2>
          {headers.map((col) => (
            <div key={col} className="mb-3">
              <h3 className="font-medium text-gray-800">{col}</h3>
              <label className="mr-4">
                <input type="checkbox" onChange={() => handleRuleChange(col, 'trim')} /> Trim
              </label>
              <label className="mr-4">
                <input type="checkbox" onChange={() => handleRuleChange(col, 'upper')} /> Majuscule
              </label>
              <label>
                Renommer :
                <input
                  type="text"
                  placeholder="Nouveau nom"
                  onChange={(e) => setRules(prev => ({
                    ...prev,
                    [col]: { ...prev[col], rename: e.target.value }
                  }))}
                  className="ml-2 border px-2 py-1 rounded"
                />
              </label>
            </div>
          ))}
          <button
            className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            onClick={applyTransformations}
          >
            Appliquer les transformations
          </button>
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Aperçu des données transformées</h2>
        {preview.length > 0 ? (
          <div className="overflow-auto border rounded">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  {Object.keys(preview[0]).map((col) => (
                    <th key={col} className="px-4 py-2 border">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-t">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-4 py-2 border">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Aucune donnée chargée</p>
        )}
      </div>
    </div>
  );
}