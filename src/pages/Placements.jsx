import { useEffect, useRef, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import placementsData from "../data/placements";

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Placements() {
  const { companies, userCGPA } = placementsData;

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem("applications");
    return saved ? JSON.parse(saved) : [];
  });

  const [resume, setResume] = useState(() => {
    try {
      const raw = localStorage.getItem("user_resume");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // modal state for company info
  const [activeCompany, setActiveCompany] = useState(null);

  // used when user clicks "Upload & Apply" so we know which company to auto-apply after upload
  const pendingApplyRef = useRef(null);

  // hidden file input refs
  const resumeInputRef = useRef(null);
  const perCompanyInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    if (resume) localStorage.setItem("user_resume", JSON.stringify(resume));
    else localStorage.removeItem("user_resume");
  }, [resume]);

  const handleResumeFile = (file, cb) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const obj = {
        name: file.name,
        type: file.type,
        size: file.size,
        dataUrl,
        uploadedAt: new Date().toISOString(),
      };
      setResume(obj);
      if (cb) cb(obj);
    };
    reader.readAsDataURL(file);
  };

  // global resume upload
  const handleResumeUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    handleResumeFile(file, () => {
      // if there is a pending apply, apply now
      const companyToApply = pendingApplyRef.current;
      if (companyToApply) {
        pendingApplyRef.current = null;
        applyToCompany(companyToApply);
      }
    });
  };

  const removeResume = () => {
    setResume(null);
  };

  const eligible = companies.filter((c) => userCGPA >= c.minCGPA);

  const applyToCompany = (company) => {
    if (applications.some((a) => a.id === company.id)) return;

    // require resume to apply
    if (!resume) {
      // if no resume, ask user to upload and then auto-apply
      // store pending and trigger file input
      pendingApplyRef.current = company;
      if (perCompanyInputRef.current) perCompanyInputRef.current.click();
      return;
    }

    const newApp = {
      id: company.id,
      name: company.name,
      role: company.role,
      status: "Applied",
      date: new Date().toLocaleDateString("en-IN"),
    };

    setApplications((prev) => [newApp, ...prev]);
  };

  // triggered by "Apply (Upload & Apply)" input when user chooses file for that flow
  const handlePerCompanyUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    handleResumeFile(file, () => {
      const companyToApply = pendingApplyRef.current;
      if (companyToApply) {
        pendingApplyRef.current = null;
        applyToCompany(companyToApply);
      }
    });
  };

  // helper: apply using existing resume (direct)
  const applyUsingResume = (company) => {
    if (!resume) return;
    applyToCompany(company);
  };

  // modal close
  const closeModal = () => setActiveCompany(null);

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

        {/* Resume card: simplified vertical layout */}
        <div className="bg-white p-6 shadow border rounded-xl">
          <p className="text-gray-600 mb-3">Resume</p>

          <div className="flex flex-col items-start gap-3">
            {resume ? (
              <>
                <p className="text-sm font-medium truncate" title={resume.name}>
                  {resume.name}
                </p>

                <div className="flex flex-col w-full sm:w-auto gap-2">
                  <a
                    href={resume.dataUrl}
                    download={resume.name}
                    className="inline-block px-3 py-2 text-sm text-blue-900 hover:underline rounded-md"
                  >
                    Download
                  </a>

                  <button
                    onClick={removeResume}
                    className="inline-block px-3 py-2 bg-red-600 text-white rounded-md text-sm"
                  >
                    Remove
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-500">No resume uploaded</p>

                <div className="flex flex-col w-full sm:w-auto gap-2">
                  <label className="cursor-pointer inline-block px-3 py-2 bg-blue-900 text-white rounded-md text-sm">
                    Upload Resume
                    <input
                      ref={resumeInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleResumeUpload}
                    />
                  </label>

                  <p className="text-xs text-gray-500">PDF or DOCX, max 2MB recommended</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Eligible Companies — vertical list */}
      <h2 className="text-2xl font-semibold mb-4">Eligible Companies</h2>

      <div className="space-y-4 mb-8">
        {eligible.map((c) => {
          const applied = applications.some((a) => a.id === c.id);
          return (
            <div key={c.id} className="bg-white p-6 rounded-xl shadow border flex items-start gap-6">
              <div className="flex-shrink-0">
                {c.logo ? (
                  <img
                    src={c.logo}
                    onError={(e) => (e.currentTarget.src = "/logo.png")}
                    className="w-20 h-20 object-contain rounded"
                    alt={`${c.name} logo`}
                  />
                ) : (
                  <div className="w-20 h-20 rounded bg-gray-100 flex items-center justify-center text-gray-700 font-semibold text-xl">
                    {getInitials(c.name)}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  {/* LEFT: name (with info icon right after it) + metadata */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold truncate">{c.name}</h3>

                      {/* INFO ICON inline right after company name */}
                      <button
                        onClick={() => setActiveCompany(c)}
                        className="cursor-pointer text-blue-600 hover:text-blue-800 font-semibold text-base bg-blue-50 hover:bg-blue-100 rounded-full w-7 h-7 flex items-center justify-center transition-all duration-200"
                        title="View job details"
                        aria-label={`View details for ${c.name}`}
                      >
                        ⓘ
                      </button>
                    </div>

                    <p className="text-gray-600">{c.role}</p>
                    <p className="text-sm text-gray-500 mt-1 truncate">
                      {c.location} • {c.ctc}
                    </p>
                  </div>

                  {/* RIGHT: actions */}
                  <div className="flex flex-col items-end gap-2 ml-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => applyUsingResume(c)}
                        disabled={!resume || applied}
                        className={`px-4 py-2 rounded-lg text-white text-sm ${
                          applied
                            ? "bg-gray-400 cursor-not-allowed"
                            : resume
                            ? "bg-blue-900 hover:bg-blue-700"
                            : "bg-gray-300 cursor-not-allowed"
                        }`}
                        title={applied ? "Already applied" : "Apply using uploaded resume"}
                      >
                        {applied ? "Applied" : "Apply (Use Resume)"}
                      </button>

                      <label className="px-3 py-2 rounded-lg border text-sm cursor-pointer bg-white hover:shadow-sm">
                        Upload & Apply
                        <input
                          ref={perCompanyInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={handlePerCompanyUpload}
                        />
                      </label>
                    </div>

                    {/* small meta row */}
                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-4">
                      <div>
                        Min CGPA: <span className="font-medium text-gray-700">{c.minCGPA}</span>
                      </div>
                      <div>
                        Assessment: <span className="font-medium text-gray-700">{c.assessmentDate}</span>
                      </div>
                      <div>
                        Timeline: <span className="font-medium text-gray-700">{c.interviewTimeline}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Applications Section */}
      <h2 className="text-2xl font-semibold mb-4">Your Applications</h2>

      <div className="space-y-4 mb-12">
        {applications.length === 0 && <p className="text-gray-500">You have not applied to any companies yet.</p>}

        {applications.map((app) => (
          <div key={app.id} className="bg-white p-4 rounded-xl shadow border flex justify-between items-center">
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

      {/* Company Modal (big popup) */}
      {activeCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal}></div>

          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl p-6 z-10 overflow-auto max-h-[90vh]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center text-gray-700 font-semibold text-xl">
                  {getInitials(activeCompany.name)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{activeCompany.name}</h3>
                  <p className="text-gray-600">
                    {activeCompany.role} • {activeCompany.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={closeModal} className="px-3 py-1 rounded-md text-sm bg-gray-100">
                  Close
                </button>
              </div>
            </div>

            <hr className="my-4" />

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-1">Job Description</h4>
                <p>{activeCompany.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-1">Requirements</h4>
                <ul className="list-disc ml-5">
                  {activeCompany.requirements && activeCompany.requirements.map((r, idx) => <li key={idx}>{r}</li>)}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Assessment Date</p>
                  <p className="font-medium">{activeCompany.assessmentDate}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Interview Timeline</p>
                  <p className="font-medium">{activeCompany.interviewTimeline}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">CTC</p>
                  <p className="font-medium">{activeCompany.ctc}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  // apply directly from modal using resume if present
                  applyToCompany(activeCompany);
                  closeModal();
                }}
                className="px-4 py-2 rounded-lg bg-blue-900 text-white"
                disabled={!resume || applications.some((a) => a.id === activeCompany.id)}
              >
                {applications.some((a) => a.id === activeCompany.id)
                  ? "Already Applied"
                  : resume
                  ? "Apply (Use Resume)"
                  : "Upload Resume First"}
              </button>

              <label className="px-4 py-2 rounded-lg border cursor-pointer bg-white">
                Upload & Apply
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    pendingApplyRef.current = activeCompany;
                    handlePerCompanyUpload(e);
                    closeModal();
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
