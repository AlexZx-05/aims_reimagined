import { useEffect, useMemo, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import coursesData from "../data/courses";
import creditRules from "../data/creditRules";

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

  // registrationType per course (Regular / Backlog / Improvement / Honours)
  const [regType, setRegType] = useState({}); // { [courseId]: "Backlog" }

  // Auto-save registered courses
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

      const search = searchTerm.trim().toLowerCase();
      const matchSearch =
        !search ||
        course.id.toLowerCase().includes(search) ||
        course.name.toLowerCase().includes(search);

      return matchCategory && matchSearch;
    });
  }, [courses, categoryFilter, searchTerm]);

  const addCourse = (course) => {
    if (submitted) return;

    if (registered.some((c) => c.id === course.id)) return;

    if (course.filledSeats >= course.totalSeats) return;

    const registrationType = regType[course.id] || "Regular";

    if (totalCredits + course.credits > creditRules.max) return;

    setRegistered([...registered, { ...course, registrationType }]);

    setCourses((prev) =>
      prev.map((c) =>
        c.id === course.id
          ? { ...c, filledSeats: c.filledSeats + 1 }
          : c
      )
    );
  };

  const dropCourse = (course) => {
    if (submitted) return;

    setRegistered(registered.filter((c) => c.id !== course.id));

    setCourses((prev) =>
      prev.map((c) =>
        c.id === course.id
          ? { ...c, filledSeats: c.filledSeats - 1 }
          : c
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
    ? "Submitted to Faculty Advisor"
    : registered.length > 0
    ? "Draft in Progress"
    : "Not Started";

  const registrationStatusColor = submitted
    ? "text-green-700"
    : registered.length > 0
    ? "text-yellow-700"
    : "text-red-600";

  const registrationStatusBg = submitted
    ? "bg-green-50 border-green-300"
    : registered.length > 0
    ? "bg-yellow-50 border-yellow-300"
    : "bg-red-50 border-red-300";

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
              Submitted. Add/Drop is now locked.
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold">Available Courses</h2>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              className="px-3 py-2 border rounded-lg bg-gray-50"
              placeholder="Search code or name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="px-3 py-2 border rounded-lg bg-gray-50"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* COURSE TILES */}
        <div className="space-y-4">
          {filteredCourses.map((course) => {
            const isFull = course.filledSeats >= course.totalSeats;
            const alreadyAdded = registered.some((c) => c.id === course.id);
            const creditExceeded =
              totalCredits + course.credits > creditRules.max;
            const regTypeForCourse = regType[course.id] || "Regular";

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
                    <div className="relative group">
                      <span className="cursor-pointer text-blue-700 font-bold text-sm">
                        ⓘ
                      </span>

                      {/* TOOLTIP */}
                      <div className="absolute left-6 top-0 hidden group-hover:block z-20">
                        <div className="p-3 bg-white border rounded-lg shadow-lg w-64">
                          <p className="text-sm font-semibold">{course.id}</p>
                          <p className="text-gray-700 text-sm">{course.name}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            Faculty: {course.faculty}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Category: {course.category}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Credits: {course.credits}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Seats: {course.filledSeats}/{course.totalSeats}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm">{course.faculty}</p>
                  <p className="text-gray-500 text-xs">Category: {course.category}</p>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end gap-2 mt-3 md:mt-0">
                  <select
                    disabled={submitted}
                    className="px-3 py-2 border rounded-lg bg-gray-50 text-sm"
                    value={regTypeForCourse}
                    onChange={(e) =>
                      setRegType((prev) => ({
                        ...prev,
                        [course.id]: e.target.value,
                      }))
                    }
                  >
                    <option value="Regular">Regular</option>
                    <option value="Backlog">Backlog</option>
                    <option value="Improvement">Improvement</option>
                    <option value="Honours">Honours</option>
                  </select>

                  <button
                    onClick={() => addCourse(course)}
                    disabled={submitted || isFull || alreadyAdded || creditExceeded}
                    className={`px-4 py-2 rounded-lg text-white text-sm ${
                      submitted || isFull || alreadyAdded || creditExceeded
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-900 hover:bg-blue-700"
                    }`}
                  >
                    {submitted
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
                  disabled={submitted}
                  className={`px-4 py-2 rounded-lg text-white ${
                    submitted
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-500"
                  }`}
                >
                  {submitted ? "Locked" : "Drop"}
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
