/**
 * src/pages/admin/AdminFileUpload.tsx
 */

import React, { useState, useEffect } from 'react';
import { parseAndValidateCSV } from '../../utils/validateCSV';

const AdminFileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const savedCsv = localStorage.getItem("csvData");
    const savedFileName = localStorage.getItem("csvFileName");

    if (savedCsv) {
      setCsvData(JSON.parse(savedCsv));
      if (savedFileName) {
        setFile(new File([], savedFileName));
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      parseCsvPreview(selectedFile);
    }
  };

  // Lightweight preview parser — array of arrays
  const parseCsvPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text
        .trim()
        .split(/\r?\n/)
        .map((row) => row.split(',').map((cell) => cell.trim()));
      setCsvData(rows);
      localStorage.setItem("csvData", JSON.stringify(rows));
      localStorage.setItem("csvFileName", file.name);
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    if (!file) return;
    console.log('Selected file:', file.name);

    console.log('CSV data ready for upload:', csvData);

    // Parse + validate before any upload
    const { validRows, errors } = await parseAndValidateCSV(file);
    setErrors(errors.map((err: any) => typeof err === 'string' ? err : err.message ?? String(err)));

    if (errors.length) {
      console.warn('Validation errors:', errors);
      return;
    }

    console.log('Validated rows ready for S3/Lambda:', validRows);
    // TODO: Get presigned URL & upload file to S3 → trigger Lambda pipeline
  };

  return (
    <section className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-3 text-gray-800">
        Bulk Upload Products via CSV
      </h1>
      <p className="mb-6 text-gray-500">
        Add, update, or delete multiple products in the catalog. CSV should have columns:
      </p>

      <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-6">
        <li><strong>id</strong> — required for update/delete, blank for add (system will generate)</li>
        <li><strong>name</strong> — the product title</li>
        <li><strong>description</strong> — a short summary</li>
        <li><strong>price</strong> — numeric value (no currency symbols)</li>
        <li><strong>image_url</strong> — direct link to product image</li>
        <li><strong>action</strong> — one of: add, update, delete</li>
      </ul>

      {/* File Upload Box */}
      <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-xl shadow-md border border-gray-200 max-w-xl">
        <label
          htmlFor="file-upload"
          className="cursor-pointer px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium text-sm shadow-sm hover:bg-indigo-800 transition"
        >
          Choose CSV
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        {file && (
          <span className="flex items-center text-sm text-gray-600 truncate max-w-[200px]">
            {file.name}
          </span>
        )}
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded">
          <h3 className="font-semibold mb-2">Validation Errors</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {errors.map((err, idx) => <li key={idx}>{err}</li>)}
          </ul>
        </div>
      )}

      {/* CSV Preview */}
      {csvData.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">CSV Preview</h2>
          <div className="overflow-y-auto max-h-[53vh] rounded-xl border border-gray-200 shadow-lg bg-white">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-gray-100 sticky top-0 shadow-sm">
                <tr>
                  {csvData[0].map((header, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-2 text-left font-medium text-gray-700 border-b border-gray-200"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {csvData.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50 transition">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-2 text-gray-600">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={handleUpload}
          disabled={!file}
          className="cursor-pointer px-6 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-800 disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md transition"
        >
          Upload
        </button>
      </div>
    </section>
  );
};

export default AdminFileUpload;
