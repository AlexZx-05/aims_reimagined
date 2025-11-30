import { useEffect, useMemo, useState, useRef } from "react";
import AppLayout from "../layouts/AppLayout";
import coursesData from "../data/courses";
import creditRules from "../data/creditRules";

function CustomSelect({
  value,
  onChange,
  options = [],
  disabled = false,
  className = "",
  placeholder = "",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function handleDocClick(e) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  return (
    <div
      ref={rootRef}
      className={`relative text-sm ${className}`}
      aria-expanded={open}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((s) => !s)}
        className={`w-full text-left px-4 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow flex items-center justify-between ${
          disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-md"
        }`}
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        <svg
          className="w-4 h-4 ml-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && !disabled && (
        <ul
          role="listbox"
          className="absolute right-0 left-0 mt-2 max-h-56 overflow-auto bg-white border rounded-lg shadow-lg z-50 py-1"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer truncate ${
                opt.value === value
                  ? "bg-blue-50 text-blue-800 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function CourseRegistration() {
  const [registered, setRegistered] = useState(() => {
    const saved = localStorage.getItem("registered_courses");
    return saved ? JSON.parse(saved) : [];
  });

  const [courses, setCourses] = useState(coursesData);
  const [submitted, setSubmitted] = useState(
    localStorage.getItem("course_submitted") === "true"
  );
  const [lastSaved, setLastSaved] = useState(
    localStorage.getItem("course_last_saved") || null
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [creditTypeFilter, setCreditTypeFilter] = useState("All");

  const [regType, setRegType] = useState({}); // { [courseId]: "Backlog" }
  const [hoverInfo, setHoverInfo] = useState(null);

  const submissionDeadline = new Date(
    localStorage.getItem("course_deadline") || "2025-12-31T23:59:59"
  );
  const isBeforeDeadline = new Date() <= submissionDeadline;

  useEffect(() => {
    localStorage.setItem("registered_courses", JSON.stringify(registered));
    const now = new Date().toLocaleString();
    localStorage.setItem("course_last_saved", now);
    setLastSaved(now);
  }, [registered]);

  const totalCredits = registered.reduce((sum, c) => sum + (c.credits || 0), 0);

  const categoryOptions = useMemo(() => {
    const set = new Set();
    courses.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ["All", ...Array.from(set)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchCategory =
        categoryFilter === "All" ||
        (course.category && course.category === categoryFilter);

      const matchSemester =
        semesterFilter === "All" ||
        (course.semester && course.semester.toString() === semesterFilter);

      const matchCreditType =
        creditTypeFilter === "All" ||
        (course.creditType && course.creditType === creditTypeFilter);

      const search = searchTerm.trim().toLowerCase();
      const matchSearch =
        !search ||
        course.id.toLowerCase().includes(search) ||
        course.name.toLowerCase().includes(search);

      return matchCategory && matchSearch && matchSemester && matchCreditType;
    });
  }, [courses, categoryFilter, searchTerm, semesterFilter, creditTypeFilter]);

  const addCourse = (course) => {
    if (submitted && !isBeforeDeadline) return;
    if (registered.some((c) => c.id === course.id)) return;
    if (course.filledSeats >= course.totalSeats) return;
    const registrationType = regType[course.id] || "Departmental Core";
    if (totalCredits + course.credits > creditRules.max) return;

    setRegistered([...registered, { ...course, registrationType }]);

    setCourses((prev) =>
      prev.map((c) =>
        c.id === course.id ? { ...c, filledSeats: c.filledSeats + 1 } : c
      )
    );
  };

  const dropCourse = (course) => {
    if (submitted && !isBeforeDeadline) return;

    setRegistered(registered.filter((c) => c.id !== course.id));

    setCourses((prev) =>
      prev.map((c) =>
        c.id === course.id ? { ...c, filledSeats: c.filledSeats - 1 } : c
      )
    );
  };

  const handleSaveDraft = () => {
    const now = new Date().toLocaleString();
    localStorage.setItem("course_draft", JSON.stringify(registered));
    localStorage.setItem("course_last_saved", now);
    setLastSaved(now);
  };

  const handleSubmit = () => {
    if (registered.length === 0) return;
    setSubmitted(true);
    localStorage.setItem("course_submitted", "true");
  };

  const creditsTooLow =
    totalCredits > 0 && totalCredits < creditRules.min && !submitted;

  const progressWidth =
    creditRules.max > 0
      ? Math.min(100, (totalCredits / creditRules.max) * 100)
      : 0;

  const registrationStatus = submitted
    ? isBeforeDeadline
      ? "Submitted (Editable until deadline)"
      : "Submitted to Faculty Advisor"
    : registered.length > 0
    ? "Draft in Progress"
    : "Not Started";

  const registrationStatusColor = submitted
    ? isBeforeDeadline
      ? "text-blue-700"
      : "text-green-700"
    : registered.length > 0
    ? "text-yellow-700"
    : "text-red-600";

  const registrationStatusBg = submitted
    ? isBeforeDeadline
      ? "bg-blue-50 border-blue-200"
      : "bg-green-50 border-green-300"
    : registered.length > 0
    ? "bg-yellow-50 border-yellow-300"
    : "bg-red-50 border-red-300";

  const categoryFilterOptions = useMemo(
    () => categoryOptions.map((c) => ({ value: c, label: c === "All" ? "All Categories" : c })),
    [categoryOptions]
  );

  const semesterFilterOptions = [
    { value: "All", label: "All Semesters" },
    { value: "1", label: "Semester 1" },
    { value: "2", label: "Semester 2" },
    { value: "3", label: "Semester 3" },
    { value: "4", label: "Semester 4" },
    { value: "5", label: "Semester 5" },
    { value: "6", label: "Semester 6" },
    { value: "7", label: "Semester 7" },
    { value: "8", label: "Semester 8" },
  ];

  const creditTypeFilterOptions = [
    { value: "All", label: "All Credit Types" },
    { value: "1", label: "1 Credit" },
    { value: "3", label: "3 Credits" },
    { value: "4", label: "4 Credits" },
  ];

  const regTypeOptions = [
    { value: "Departmental Core", label: "Departmental Core" },
    { value: "Backlog", label: "Backlog" },
    { value: "Improvement", label: "Improvement" },
    { value: "Honours", label: "Honours" },
  ];

  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold mb-6">Course Registration</h1>

      {/* TOP ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* CREDIT SUMMARY */}
        <div className="bg-white p-5 rounded-xl shadow border lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Credit Summary</h2>
            <button
              onClick={handleSaveDraft}
              className="px-3 py-1 text-sm rounded-lg border bg-gray-50 hover:bg-gray-100"
            >
              Save Draft
            </button>
          </div>

          <p className="text-gray-700">
            Registered Credits:
            <span className="font-bold"> {totalCredits}</span> /{" "}
            {creditRules.max}
          </p>
          <p className="text-sm text-gray-500">
            Minimum required: {creditRules.min} credits
          </p>

          <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
            <div
              className="bg-blue-800 h-3 rounded-full"
              style={{ width: `${progressWidth}%` }}
            ></div>
          </div>

          {creditsTooLow && (
            <p className="mt-2 text-sm text-red-600">
              You have fewer than the minimum required credits.
            </p>
          )}

          {lastSaved && (
            <p className="mt-2 text-xs text-gray-500">Last saved: {lastSaved}</p>
          )}
        </div>

        {/* STATUS BOX */}
        <div
          className={`bg-white p-5 rounded-xl shadow border ${registrationStatusBg}`}
        >
          <p className="text-gray-600 text-sm mb-1">Registration Status</p>
          <p className={`text-lg font-semibold ${registrationStatusColor}`}>
            {registrationStatus}
          </p>

          {submitted && (
            <p className="mt-2 text-sm text-gray-700">
              {isBeforeDeadline
                ? `Submitted. You can still edit courses until ${submissionDeadline.toLocaleString()}.`
                : "Submitted. Add/Drop is now locked."}
            </p>
          )}
          {!submitted && registered.length > 0 && (
            <p className="mt-2 text-sm text-gray-700">
              You can still make changes.
            </p>
          )}
          {!submitted && registered.length === 0 && (
            <p className="mt-2 text-sm text-gray-700">
              Start adding courses below.
            </p>
          )}
        </div>
      </div>

      {/* COURSE LIST */}
      <section className="bg-white p-6 rounded-xl shadow border mb-10">
        <div className="flex flex-col md:flex-row md:items:center md:justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold">Courses</h2>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              className="px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-400 flex-1 max-h-[40px]"
              placeholder="Search code or name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div style={{ minWidth: 200 }}>
              <CustomSelect
                value={categoryFilter}
                onChange={(v) => setCategoryFilter(v)}
                options={categoryFilterOptions}
                placeholder="All Categories"
              />
            </div>

            <div style={{ minWidth: 180 }}>
              <CustomSelect
                value={semesterFilter}
                onChange={(v) => setSemesterFilter(v)}
                options={semesterFilterOptions}
                placeholder="All Semesters"
              />
            </div>

            <div style={{ minWidth: 180 }}>
              <CustomSelect
                value={creditTypeFilter}
                onChange={(v) => setCreditTypeFilter(v)}
                options={creditTypeFilterOptions}
                placeholder="All Credit Types"
              />
            </div>
          </div>
        </div>

        {/* COURSE TILES */}
        <div className="space-y-4">
          {filteredCourses.map((course) => {
            const isFull = course.filledSeats >= course.totalSeats;
            const alreadyAdded = registered.some((c) => c.id === course.id);
            const creditExceeded =
              totalCredits + course.credits > creditRules.max;
            const regTypeForCourse = regType[course.id] || "Departmental Core";
            const vacantSeats = course.totalSeats - course.filledSeats;

            return (
              <div
                key={course.id}
                className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-sm transition bg-white"
              >
                {/* LEFT */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{course.name}</h3>

                    {/* INFO ICON */}
                    <div
                      className="relative group"
                      onMouseEnter={() => setHoverInfo(course.id)}
                      onMouseLeave={() => setHoverInfo(null)}
                    >
                      <span className="cursor-pointer text-blue-600 hover:text-blue-800 font-bold text-lg bg-blue-50 hover:bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md">
                        ⓘ
                      </span>

                      {/* ENHANCED TOOLTIP (visible on hover or while hovered state is set) */}
                      <div
                        className={`absolute left-6 top-0 z-20 ${hoverInfo === course.id ? 'block' : 'hidden'} group-hover:block`}
                        onMouseEnter={() => setHoverInfo(course.id)}
                        onMouseLeave={() => setHoverInfo(null)}
                      >
                        <div className="p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-xl w-80">
                          {/* Header */}
                          <div className="border-b border-gray-200 pb-3 mb-3">
                            <p className="text-sm font-bold text-gray-900">{course.id}</p>
                            <p className="text-gray-700 text-sm font-semibold mt-1">{course.name}</p>
                          </div>

                          {/* Instructor & Category */}
                          <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-gray-100">
                            <div>
                              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Instructor</p>
                              <p className="text-sm text-gray-900 font-medium">{course.faculty}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Category</p>
                              <p className="text-sm text-gray-900 font-medium">{course.category}</p>
                            </div>
                          </div>

                          {/* Semester & Credits */}
                          <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-gray-100">
                            <div>
                              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Semester</p>
                              <p className="text-sm text-gray-900 font-medium">Sem {course.semester}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Credits</p>
                              <p className="text-sm text-gray-900 font-medium">{course.creditType} Cr</p>
                            </div>
                          </div>

                          {/* Seat Information */}
                          <div className="mb-3 pb-3 border-b border-gray-100">
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Seat Information</p>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Total Seats:</span>
                                <span className="text-sm font-semibold text-gray-900">{course.totalSeats}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Filled Seats:</span>
                                <span className="text-sm font-semibold text-orange-600">{course.filledSeats}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Vacant Seats:</span>
                                <span className={`text-sm font-semibold ${vacantSeats === 0 ? 'text-red-600' : 'text-green-600'}`}>
                                  {vacantSeats}
                                </span>
                              </div>
                              <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-2 transition-all ${isFull ? 'bg-red-500' : course.filledSeats / course.totalSeats > 0.75 ? 'bg-orange-500' : 'bg-green-500'}`}
                                  style={{ width: `${(course.filledSeats / course.totalSeats) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Registration Dates (new) */}
                          <div>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Registration & Drop Dates</p>
                            <div className="space-y-1 text-sm text-gray-700">
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-600">Registration Starts:</span>
                                <span className="font-medium">{course.registrationDate ?? "N/A"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-600">Registration Ends:</span>
                                <span className="font-medium">{course.registrationEndDate ?? "N/A"}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-600">Drop Deadline:</span>
                                <span className="font-medium">{course.dropDate ?? "N/A"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* previously visible details removed — now they only live inside the tooltip */}
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end gap-2 mt-3 md:mt-0">
                  <div className="flex gap-2">
                    <div style={{ minWidth: 160 }}>
                      <CustomSelect
                        disabled={submitted && !isBeforeDeadline}
                        value={regTypeForCourse}
                        onChange={(v) =>
                          setRegType((prev) => ({
                            ...prev,
                            [course.id]: v,
                          }))
                        }
                        options={regTypeOptions}
                      />
                    </div>

                    <button
                      onClick={() => addCourse(course)}
                      disabled={(submitted && !isBeforeDeadline) || isFull || alreadyAdded || creditExceeded}
                      className={`px-4 py-2 rounded-lg text-white text-sm ${
                        (submitted && !isBeforeDeadline) || isFull || alreadyAdded || creditExceeded
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-900 hover:bg-blue-700"
                      }`}
                    >
                      {submitted && !isBeforeDeadline
                        ? "Locked"
                        : alreadyAdded
                        ? "Added"
                        : isFull
                        ? "Full"
                        : creditExceeded
                        ? "Limit Exceeded"
                        : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* REGISTERED COURSES */}
      <section className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold mb-4">Registered Courses</h2>

        {registered.length === 0 && (
          <p className="text-gray-500">No courses registered yet.</p>
        )}

        <div className="space-y-4">
          {registered.map((course) => (
            <div
              key={course.id}
              className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div>
                <h3 className="text-lg font-bold">
                  {course.id} — {course.name}
                </h3>
                <p className="text-gray-600 text-sm">{course.faculty}</p>
                <p className="text-sm text-gray-500">
                  Category: {course.category}
                </p>
                <p className="text-sm text-gray-500">
                  Registration Type:{" "}
                  <span className="font-semibold">
                    {course.registrationType}
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-4">
                <p className="font-medium">{course.credits} Credits</p>
                <button
                  onClick={() => dropCourse(course)}
                  disabled={submitted && !isBeforeDeadline}
                  className={`px-4 py-2 rounded-lg text-white ${
                    submitted && !isBeforeDeadline
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-500"
                  }`}
                >
                  {submitted && !isBeforeDeadline ? "Locked" : "Drop"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {!submitted && registered.length > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600"
            >
              Submit to Faculty Advisor
            </button>
          </div>
        )}
      </section>
    </AppLayout>
  );
}
