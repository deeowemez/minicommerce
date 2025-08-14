/**
 * src/pages/admin/AdminFileUpload.tsx
 */

import React, { useState } from 'react';

const AdminFileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    // TODO: Get presigned URL from backend, upload to S3
    console.log('Uploading CSV to S3:', file.name);
  };

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Bulk Upload Products via CSV</h1>
      <div className="bg-white p-6 rounded shadow max-w-lg space-y-4">
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button onClick={handleUpload} className="btn btn-primary" disabled={!file}>
          Upload
        </button>
      </div>
    </section>
  );
};

export default AdminFileUpload;
