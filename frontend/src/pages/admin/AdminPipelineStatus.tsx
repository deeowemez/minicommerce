/**
 * src/pages/admin/AdminPipelineSatus.tsx
 */


import React, { useEffect, useState } from 'react';

interface PipelineStatus {
  stepName: string;
  status: 'RUNNING' | 'SUCCEEDED' | 'FAILED';
  lastUpdated: string;
}

const AdminPipelineStatus: React.FC = () => {
  const [statuses, setStatuses] = useState<PipelineStatus[]>([]);

  useEffect(() => {
    // TODO: Fetch pipeline execution details from Step Functions or CloudWatch
    setStatuses([
      { stepName: 'ValidateCSV', status: 'SUCCEEDED', lastUpdated: new Date().toISOString() },
      { stepName: 'InsertToDB', status: 'RUNNING', lastUpdated: new Date().toISOString() },
    ]);
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Pipeline Status</h1>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Step</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {statuses.map((s) => (
            <tr key={s.stepName} className="border-t">
              <td className="px-4 py-2">{s.stepName}</td>
              <td className="px-4 py-2">{s.status}</td>
              <td className="px-4 py-2">{new Date(s.lastUpdated).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AdminPipelineStatus;
