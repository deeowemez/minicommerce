/**
 * src/pages/admin/AdminReportViewer.tsx
 */


import React, { useEffect, useState } from 'react';

interface Report {
  name: string;
  url: string;
}

const AdminReportViewer: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    // TODO: Fetch list of reports from S3 via backend API
    setReports([
      { name: 'sales-report-2025-08.csv', url: '#' },
      { name: 'user-signups-2025-08.csv', url: '#' },
    ]);
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <ul className="space-y-2 bg-white p-6 rounded shadow max-w-lg">
        {reports.map((report) => (
          <li key={report.name} className="flex justify-between items-center">
            <span>{report.name}</span>
            <a href={report.url} className="text-indigo-600 hover:underline" download>
              Download
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AdminReportViewer;
