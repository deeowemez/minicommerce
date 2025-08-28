import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import { useAuth } from "../../contexts/AuthContext";

interface Report {
  week: string;
  url: string;
}

const AdminReportViewer: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) return;

      try {
        const idToken = await user.getIdToken(); // firebase
        const { data } = await api.get("/api/admin/reports", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        setReports(data);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    };

    fetchReports();
  }, [user]);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Weekly Reports</h1>
      <ul className="space-y-2 bg-white p-6 rounded shadow max-w-lg">
        {reports.map((r) => (
          <li key={r.week} className="flex justify-between items-center">
          <span>{r.week}</span>
          <button
            className="text-indigo-600 hover:underline"
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
    </section>
  );
};

export default AdminReportViewer;
