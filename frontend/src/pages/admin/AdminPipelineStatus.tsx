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
    <section className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-3 text-gray-800">Pipeline Status</h1>
      <p className="mb-6 text-gray-500">
        Monitor the current execution state of your AWS Step Functions pipeline.
      </p>

      {statuses.length === 0 ? (
        <div className="text-gray-500">No pipeline data available.</div>
      ) : (
        <div className="overflow-y-auto rounded-xl border border-gray-200 shadow-lg bg-white max-w-4xl">
          <table className="min-w-full text-sm border-collapse">
            <thead className="bg-gray-100 sticky top-0 shadow-sm">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">
                  Step
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">
                  Status
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {statuses.map((s) => (
                <tr key={s.stepName} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 text-gray-600">{s.stepName}</td>
                  <td
                    className={`px-4 py-2 font-medium ${s.status === "SUCCEEDED"
                      ? "text-green-600"
                      : s.status === "RUNNING"
                        ? "text-blue-600"
                        : "text-red-600"
                      }`}
                  >
                    {s.status}
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {new Date(s.lastUpdated).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );

};

export default AdminPipelineStatus;
