import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";

export default function Complaints() {
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem("complaints");
    return saved ? JSON.parse(saved) : [];
  });

  const [category, setCategory] = useState("Hostel");
  const [description, setDescription] = useState("");

  // Save to localStorage whenever complaints change
  useEffect(() => {
    localStorage.setItem("complaints", JSON.stringify(complaints));
  }, [complaints]);

  const handleSubmit = () => {
    if (!description.trim()) return;

    const ticket = {
      id: "CMP-" + Math.floor(100000 + Math.random() * 900000),
      category,
      description,
      date: new Date().toLocaleDateString("en-IN"),
      status: "Pending",
    };

    setComplaints([ticket, ...complaints]);

    // Clear form
    setDescription("");
    setCategory("Hostel");
  };

  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold mb-6">Complaints</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Complaint Form */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-semibold mb-4">Submit New Complaint</h2>

          <div className="space-y-4">
            <div>
              <label className="font-medium text-gray-600">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-gray-50"
              >
                <option>Hostel</option>
                <option>Academic</option>
                <option>Fees</option>
                <option>Ragging</option>
                <option>Administration</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="font-medium text-gray-600">
                Complaint Description
              </label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue..."
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 outline-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Submit Complaint
            </button>
          </div>
        </div>

        {/* Complaints List */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-semibold mb-4">Your Complaints</h2>

          {complaints.length === 0 && (
            <p className="text-gray-500">No complaints submitted yet.</p>
          )}

          <div className="space-y-4">
            {complaints.map((cmp) => (
              <div
                key={cmp.id}
                className="p-4 border rounded-lg bg-gray-50"
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold">{cmp.id}</p>
                  <span
                    className={`px-3 py-1 rounded-lg text-white text-sm ${
                      cmp.status === "Resolved"
                        ? "bg-green-600"
                        : "bg-yellow-500"
                    }`}
                  >
                    {cmp.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-1">{cmp.category}</p>
                <p className="text-gray-700 mb-2">{cmp.description}</p>

                <p className="text-gray-500 text-xs">Filed on {cmp.date}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
