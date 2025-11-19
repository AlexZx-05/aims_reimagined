import { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import scholarshipsData from "../data/scholarships";

export default function Scholarships() {
  const [applied, setApplied] = useState(scholarshipsData.applied);

  const handleApply = (sch) => {
    // Prevent double apply
    if (applied.some((a) => a.name === sch.name)) return;

    const newApp = {
      name: sch.name,
      status: "Pending",
      date: new Date().toLocaleDateString("en-IN"),
    };

    setApplied([newApp, ...applied]);
  };

  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold mb-6">Scholarships</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Available Scholarships */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-semibold mb-4">Available Scholarships</h2>

          <div className="space-y-4">
            {scholarshipsData.available.map((sch) => (
              <div
                key={sch.id}
                className="border p-4 rounded-lg hover:bg-gray-50 transition"
              >
                <h3 className="font-semibold text-lg">{sch.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{sch.description}</p>

                <p className="text-sm">
                  <span className="font-medium">Amount:</span> {sch.amount}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Deadline:</span> {sch.deadline}
                </p>

                <button
                  onClick={() => handleApply(sch)}
                  className="mt-3 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Applied Scholarships */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-semibold mb-4">Your Applications</h2>

          <div className="space-y-4">
            {applied.length === 0 && (
              <p className="text-gray-500">No applications yet.</p>
            )}

            {applied.map((app, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-lg flex justify-between"
              >
                <div>
                  <h3 className="font-semibold">{app.name}</h3>
                  <p className="text-gray-500 text-sm">Applied on {app.date}</p>
                </div>

                <span
                  className={`px-3 py-1 rounded-lg text-white text-sm ${
                    app.status === "Approved"
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
        </div>

      </div>
    </AppLayout>
  );
}
