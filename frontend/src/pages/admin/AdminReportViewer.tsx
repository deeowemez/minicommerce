/**
 * src/pages/admin/AdminReportViewer.tsx
 */

import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import { useAuth } from "../../contexts/AuthContext";

interface Report {
  week: string;
  url: string;
}

const AdminReportViewer: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return;
      setIsLoading(true);
      setError(null);

      try {
        const idToken = await user.getIdToken(); // firebase
        const { data } = await api.get("/api/admin/reports", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        setReports(data);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
        setError("Failed to fetch reports. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [user])
  return (
    <section className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-3 text-gray-800">Weekly Reports</h1>
      <p className="mb-6 text-gray-500">
        View and download the latest weekly system reports in CSV format.
      </p>

      {isLoading ? (
        <div className="text-gray-500">Loading reports…</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded shadow-sm">
          {error}
        </div>
      ) : reports.length === 0 ? (
        <div className="text-gray-500">No reports available.</div>
      ) : (
        <ul className="space-y-2 bg-white p-6 rounded-xl shadow-md border border-gray-200 max-w-lg">
          {reports.map((r) => (
            <li
              key={r.week}
              className="flex justify-between items-center py-2 border-b last:border-b-0 border-gray-100"
            >
              <span className="text-gray-700">{r.week}</span>
              <button
                className="text-indigo-600 hover:underline font-medium"
                onClick={async () => {
                  if (!user) return;
                  try {
                    const idToken = await user.getIdToken();
                    const res = await api.get(r.url, {
                      headers: { Authorization: `Bearer ${idToken}` },
                      responseType: "blob", // important for binary files
                    });

                    // Create a download link
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `report-${r.week}.csv`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                  } catch (err) {
                    console.error("Failed to download report:", err);
                  }
                }}
              >
                Download CSV
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default AdminReportViewer;
