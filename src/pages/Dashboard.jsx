import AppLayout from "../layouts/AppLayout";
import dashboardData from "../data/dashboard";
import { getLoggedInUser } from "../utils/auth";

export default function Dashboard() {
  const user = getLoggedInUser();

  return (
    <AppLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">
          Welcome back, {user?.name} 👋
        </h1>
        <p className="text-gray-600">
          Here’s your academic overview for this semester.
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-600">Current GPA</p>
          <h2 className="text-3xl font-bold">{dashboardData.gpa}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-600">Credits Earned</p>
          <h2 className="text-3xl font-bold">{dashboardData.creditsEarned}</h2>
          <p className="text-sm text-gray-400">out of {dashboardData.totalCredits}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-600">Attendance</p>
          <h2 className="text-3xl font-bold">{dashboardData.attendance}%</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border">
          <p className="text-gray-600">Pending Fees</p>
          <h2 className="text-3xl font-bold text-red-600">₹{dashboardData.pendingFees}</h2>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Courses */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-semibold mb-4">Registered Courses</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-600">
                <th className="py-2">Code</th>
                <th>Name</th>
                <th>Attendance</th>
              </tr>
            </thead>

            <tbody>
              {dashboardData.courses.map((c) => (
                <tr key={c.code} className="border-t">
                  <td className="py-2">{c.code}</td>
                  <td>{c.name}</td>
                  <td className="font-medium">{c.attendance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>

          <div className="space-y-3">
            {dashboardData.notifications.map((note, i) => (
              <div key={i} className="p-3 bg-gray-100 rounded-lg">
                {note}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Events */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>

        <div className="space-y-3">
          {dashboardData.events.map((e, idx) => (
            <div key={idx} className="flex justify-between py-2 border-b">
              <span>{e.title}</span>
              <span className="text-gray-600">{e.date}</span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
