import { useState, useEffect } from "react";
import AppLayout from "../layouts/AppLayout";
import registrationData from "../data/registration";

export default function Registration() {
  const [status, setStatus] = useState(() => {
    return localStorage.getItem("registration_status") || "Not Started";
  });

  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    localStorage.setItem("registration_status", status);
  }, [status]);

  const startRegistration = () => {
    setStatus("Pending");
    setConfirmed(true);
  };

  const completeRegistration = () => {
    setStatus("Completed");
  };

  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold mb-6">Academic Registration</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <SummaryCard title="Current Semester" value={registrationData.currentSemester} />
        <SummaryCard title="Academic Year" value={registrationData.academicYear} />
        <SummaryCard
          title="Registration Status"
          value={status}
          color={
            status === "Completed"
              ? "text-green-600"
              : status === "Pending"
              ? "text-yellow-600"
              : "text-red-600"
          }
        />
      </div>

      {/* REGISTRATION TIMELINE */}
      <section className="bg-white p-6 rounded-xl shadow border mb-10">
        <h2 className="text-xl font-semibold mb-4">Important Dates</h2>

        <div className="space-y-3">
          {registrationData.windows.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between border-b pb-2 text-gray-700"
            >
              <span>{item.title}</span>
              <span className="font-medium">{item.date}</span>
            </div>
          ))}
        </div>
      </section>

      {/* DOCUMENT DOWNLOADS */}
      <section className="bg-white p-6 rounded-xl shadow border mb-10">
        <h2 className="text-xl font-semibold mb-4">Documents</h2>

        <div className="space-y-3">
          {registrationData.documents.map((doc, idx) => (
            <a
              key={idx}
              href={doc.link}
              target="_blank"
              rel="noreferrer"
              className="block p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-blue-900 font-medium"
            >
              {doc.name}
            </a>
          ))}
        </div>
      </section>

      {/* START REGISTRATION */}
      {status === "Not Started" && (
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-semibold mb-3">Start Registration</h2>
          <p className="text-gray-600 mb-4">
            Please confirm the details before proceeding to course registration.
          </p>

          <button
            className="px-5 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700"
            onClick={startRegistration}
          >
            Begin Registration
          </button>
        </div>
      )}

      {/* IN PROGRESS */}
      {status === "Pending" && (
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-semibold mb-3">Registration In Progress</h2>

          <p className="text-gray-600 mb-4">
            You may now proceed to Course Registration and fees.
          </p>

          <button
            className="px-5 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
            onClick={completeRegistration}
          >
            Mark Registration as Complete
          </button>
        </div>
      )}

      {/* COMPLETED */}
      {status === "Completed" && (
        <div className="bg-green-50 border border-green-300 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-green-700">
            Registration Completed ✔
          </h2>
          <p className="text-gray-700 mt-2">
            You have successfully completed academic registration.
          </p>
        </div>
      )}
    </AppLayout>
  );
}

/* Summary Card Component */
function SummaryCard({ title, value, color = "text-gray-900" }) {
  return (
    <div className="bg-white p-6 border rounded-xl shadow">
      <p className="text-gray-600">{title}</p>
      <h2 className={`text-2xl font-bold ${color}`}>{value}</h2>
    </div>
  );
}
