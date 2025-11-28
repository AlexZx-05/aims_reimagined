import { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import gradesData from "../data/grades";

export default function Grades() {
  const [selectedSem, setSelectedSem] = useState(null);

  const allSemesters = gradesData.semesters;
  const cgpa = gradesData.cgpa;

  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold mb-6">Grades</h1>

      {/* ----- CGPA CARD ----- */}
      <div className="bg-white p-6 rounded-xl shadow border mb-8 w-full max-w-md">
        <p className="text-gray-600">Cumulative GPA</p>
        <h2 className="text-5xl font-bold text-blue-900">{cgpa}</h2>
      </div>

      {/* ----- SEMESTER LIST (MAIN PAGE) ----- */}
      {!selectedSem && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Completed Semesters</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allSemesters.map((sem, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedSem(sem)}
                className="bg-white p-6 rounded-xl shadow border hover:shadow-md transition cursor-pointer"
              >
                <h3 className="text-lg font-semibold">{sem.sem}</h3>
                <p className="text-gray-600 mt-1">
                  GPA: <span className="font-bold">{sem.gpa}</span>
                </p>
                <p className="text-gray-600 text-sm">
                  Courses: {sem.courses.length}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----- SEMESTER DETAILS PAGE ----- */}
      {selectedSem && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              {selectedSem.sem} – Detailed Grades
            </h2>

            <button
              onClick={() => setSelectedSem(null)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              ← Back to All Semesters
            </button>
          </div>

          {/* Semester GPA */}
          <div className="bg-white p-6 rounded-xl shadow border mb-6 w-full max-w-sm">
            <p className="text-gray-600">Semester GPA</p>
            <h2 className="text-4xl font-bold text-blue-900">
              {selectedSem.gpa}
            </h2>
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
                    <td className="py-2 font-medium">{c.code}</td>
                    <td>{c.name}</td>
                    <td>{c.credits}</td>

                    {/* Color-coded grade */}
                    <td
                      className={`
                        font-bold
                        ${
                          c.grade === "A" || c.grade === "A+"
                            ? "text-green-600"
                            : c.grade === "B" || c.grade === "C"
                            ? "text-yellow-600"
                            : c.grade === "F"
                            ? "text-red-600"
                            : "text-gray-800"
                        }
                      `}
                    >
                      {c.grade}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
