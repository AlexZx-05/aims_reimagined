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
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-400 hover:shadow-md cursor-pointer appearance-none font-medium"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231f2937' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.7rem center',
                  backgroundSize: '1.2em 1.2em',
                  paddingRight: '2.5rem'
                }}
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
