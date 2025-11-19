import { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import gradesData from "../data/grades";

export default function Grades() {
  const [selectedSem, setSelectedSem] = useState(gradesData.semesters[0]);

  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold mb-6">Grades</h1>

      {/* Semester Selector */}
      <div className="mb-6">
        <select
          value={selectedSem.sem}
          onChange={(e) =>
            setSelectedSem(
              gradesData.semesters.find((s) => s.sem === e.target.value)
            )
          }
          className="px-4 py-2 border bg-white rounded-lg shadow-sm focus:border-blue-500"
        >
          {gradesData.semesters.map((s, idx) => (
            <option key={idx} value={s.sem}>
              {s.sem}
            </option>
          ))}
        </select>
      </div>

      {/* GPA Card */}
      <div className="bg-white p-6 rounded-xl shadow border mb-6 w-full max-w-sm">
        <p className="text-gray-600">Semester GPA</p>
        <h2 className="text-4xl font-bold">{selectedSem.gpa}</h2>
      </div>

      {/* Grades Table */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold mb-4">
          {selectedSem.sem} Course Grades
        </h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-gray-600 border-b">
              <th className="py-2">Code</th>
              <th>Name</th>
              <th>Credits</th>
              <th>Grade</th>
            </tr>
          </thead>

          <tbody>
            {selectedSem.courses.map((c) => (
              <tr key={c.code} className="border-b">
                <td className="py-2">{c.code}</td>
                <td>{c.name}</td>
                <td>{c.credits}</td>
                <td className="font-bold">{c.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
