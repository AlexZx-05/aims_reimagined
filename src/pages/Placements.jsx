import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import placementsData from "../data/placements";

export default function Placements() {
  const { companies, userCGPA } = placementsData;

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem("applications");
    return saved ? JSON.parse(saved) : [];
  });

  // Save applications in localStorage
  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(applications));
  }, [applications]);

  const eligible = companies.filter((c) => userCGPA >= c.minCGPA);

  const applyToCompany = (company) => {
    if (applications.some((a) => a.id === company.id)) return;

    const newApp = {
      ...company,
      status: "Applied",
      date: new Date().toLocaleDateString("en-IN"),
    };

    setApplications([newApp, ...applications]);
  };

  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold mb-6">Placements</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 shadow border rounded-xl">
          <p className="text-gray-600">Eligible Companies</p>
          <h2 className="text-3xl font-bold">{eligible.length}</h2>
        </div>

        <div className="bg-white p-6 shadow border rounded-xl">
          <p className="text-gray-600">Applied</p>
          <h2 className="text-3xl font-bold">{applications.length}</h2>
        </div>

        <div className="bg-white p-6 shadow border rounded-xl">
          <p className="text-gray-600">CGPA</p>
          <h2 className="text-3xl font-bold">{userCGPA}</h2>
        </div>

        <div className="bg-white p-6 shadow border rounded-xl">
          <p className="text-gray-600">Resume Score</p>
          <h2 className="text-3xl font-bold">82%</h2>
        </div>
      </div>

      {/* Eligible Companies Section */}
      <h2 className="text-2xl font-semibold mb-4">Eligible Companies</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {eligible.map((c) => (
          <div
            key={c.id}
            className="bg-white p-6 rounded-xl shadow border flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-bold">{c.name}</h3>
              <p className="text-gray-600">{c.role}</p>
              <p className="text-gray-600 text-sm mt-1">
                {c.location} • {c.ctc}
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <img src={c.logo} className="w-16 h-16 object-contain" alt="" />

              {applications.some((a) => a.id === c.id) ? (
                <span className="px-4 py-2 bg-gray-300 rounded-lg text-sm">
                  Applied
                </span>
              ) : (
                <button
                  onClick={() => applyToCompany(c)}
                  className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Applications Section */}
      <h2 className="text-2xl font-semibold mb-4">Your Applications</h2>

      <div className="space-y-4">
        {applications.length === 0 && (
          <p className="text-gray-500">You have not applied to any companies yet.</p>
        )}

        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white p-4 rounded-xl shadow border flex justify-between items-center"
          >
            <div>
              <p className="font-bold text-lg">{app.name}</p>
              <p className="text-gray-600">{app.role}</p>
              <p className="text-gray-500 text-sm mt-1">Applied on {app.date}</p>
            </div>

            <span
              className={`px-4 py-2 rounded-lg text-white text-sm ${
                app.status === "Shortlisted"
                  ? "bg-green-600"
                  : app.status === "Rejected"
                  ? "bg-red-600"
                  : "bg-yellow-500"
              }`}
            >
              {app.status}
            </span>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
