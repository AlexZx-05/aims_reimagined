import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import coursesData from "../data/courses";
import creditRules from "../data/creditRules";

export default function CourseRegistration() {
  const [registered, setRegistered] = useState(() => {
    const saved = localStorage.getItem("registered_courses");
    return saved ? JSON.parse(saved) : [];
  });

  const [courses, setCourses] = useState(coursesData);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("registered_courses", JSON.stringify(registered));
  }, [registered]);

  const totalCredits = registered.reduce((sum, c) => sum + c.credits, 0);

  const addCourse = (course) => {
    // Already added
    if (registered.some((c) => c.id === course.id)) return;

    // Seats full
    if (course.filledSeats >= course.totalSeats) return;

    // Credit limit
    if (totalCredits + course.credits > creditRules.max) return;

    // Add course
    setRegistered([...registered, course]);

    // Increase filled seats
    setCourses((prev) =>
      prev.map((c) =>
        c.id === course.id
          ? { ...c, filledSeats: c.filledSeats + 1 }
          : c
      )
    );
  };

  const dropCourse = (course) => {
    // Remove from registered list
    setRegistered(registered.filter((c) => c.id !== course.id));

    // Decrease filled seats
    setCourses((prev) =>
      prev.map((c) =>
        c.id === course.id
          ? { ...c, filledSeats: c.filledSeats - 1 }
          : c
      )
    );
  };

  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold mb-6">Course Registration</h1>

      {/* CREDIT SUMMARY */}
      <div className="bg-white p-5 rounded-xl shadow border mb-8">
        <h2 className="text-xl font-semibold mb-2">Credit Summary</h2>

        <p className="text-gray-700">
          Registered Credits:{" "}
          <span className="font-bold">{totalCredits}</span> /{" "}
          {creditRules.max}
        </p>

        <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
          <div
            className="bg-blue-800 h-3 rounded-full"
            style={{ width: `${(totalCredits / creditRules.max) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* AVAILABLE COURSES */}
      <section className="bg-white p-6 rounded-xl shadow border mb-10">
        <h2 className="text-xl font-semibold mb-4">Available Courses</h2>

        <div className="space-y-4">
          {courses.map((course) => {
            const isFull = course.filledSeats >= course.totalSeats;
            const alreadyAdded = registered.some((c) => c.id === course.id);
            const creditExceeded =
              totalCredits + course.credits > creditRules.max;

            return (
              <div
                key={course.id}
                className="p-4 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-bold">
                    {course.id} — {course.name}
                  </h3>
                  <p className="text-gray-600">{course.faculty}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Seats: {course.filledSeats}/{course.totalSeats}
                  </p>
                  <p className="text-sm text-gray-500">
                    Credits: {course.credits}
                  </p>
                </div>

                <button
                  onClick={() => addCourse(course)}
                  disabled={isFull || alreadyAdded || creditExceeded}
                  className={`px-4 py-2 rounded-lg text-white ${
                    isFull || alreadyAdded || creditExceeded
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-900 hover:bg-blue-700"
                  }`}
                >
                  {alreadyAdded
                    ? "Added"
                    : isFull
                    ? "Full"
                    : creditExceeded
                    ? "Limit Exceeded"
                    : "Add"}
                </button>
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
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold">{course.id}</h3>
                <p>{course.name}</p>
                <p className="text-gray-600 text-sm">{course.faculty}</p>
              </div>

              <div className="flex items-center gap-4">
                <p className="font-medium">{course.credits} Credits</p>
                <button
                  onClick={() => dropCourse(course)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
                >
                  Drop
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppLayout>
  );
}
