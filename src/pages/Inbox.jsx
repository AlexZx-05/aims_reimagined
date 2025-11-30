import AppLayout from "../layouts/AppLayout";
import coursesData from "../data/courses";
import { Link } from "react-router-dom";

function formatDate(d) {
  try {
    return new Date(d).toLocaleString();
  } catch (e) {
    return "—";
  }
}

export default function Inbox() {
  // derive deadlines from localStorage or fallbacks
  const submissionDeadline = new Date(
    localStorage.getItem("course_deadline") || "2025-12-31T23:59:59"
  );
  const dropDeadline = new Date(
    localStorage.getItem("drop_deadline") || new Date(submissionDeadline.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
  );

  // create a few subject-specific notifications from courses (examples)
  const subjectNotifs = coursesData.slice(0, 6).map((c) => ({
    id: `course-${c.id}`,
    title: `${c.id} — ${c.name}`,
    body: `Seats: ${c.filledSeats}/${c.totalSeats}. Category: ${c.category}.`,
    link: "/course-registration",
    when: null,
  }));

  const notifications = [
    {
      id: "reg-deadline",
      title: "Course Registration Deadline",
      body: `Submit your course registration before ${formatDate(submissionDeadline)}.`,
      link: "/course-registration",
      when: submissionDeadline,
      unread: true,
    },
    {
      id: "drop-deadline",
      title: "Course Drop Deadline",
      body: `Course drops allowed until ${formatDate(dropDeadline)}.`,
      link: "/course-registration",
      when: dropDeadline,
      unread: true,
    },
    ...subjectNotifs,
  ];

  return (
    <AppLayout>
      <h1 className="text-3xl font-semibold mb-6">Inbox</h1>

      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Sidebar */}
        <div className="col-span-3 bg-white rounded-xl border p-4">
          <button className="w-full bg-blue-900 text-white py-2 rounded-lg mb-4">+ Add</button>

          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between"><span>Inbox</span><span>{notifications.length}</span></div>
            <div className="flex justify-between"><span>Sent</span><span>24</span></div>
            <div className="flex justify-between"><span>Draft</span><span>0</span></div>
          </div>
        </div>

        {/* Notifications Area */}
        <div className="col-span-9 bg-white rounded-xl border p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>

          <div className="space-y-4">
            {notifications.map((n) => (
              <div key={n.id} className="p-4 rounded-lg border hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800">{n.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{n.body}</p>
                    {n.when && (
                      <p className="text-xs text-gray-400 mt-1">Due: {formatDate(n.when)}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Link to={n.link || '/'} className="text-sm text-blue-900 hover:underline">Open</Link>
                    {n.unread && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">New</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
