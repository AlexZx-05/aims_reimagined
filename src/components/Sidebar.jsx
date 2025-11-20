import { NavLink, useNavigate  } from "react-router-dom";
import { logoutUser } from "../utils/auth";

export default function Sidebar() {
  const links = [
    {name: "Dashboard", path: "/dashboard" },
    { name: "My Details", path: "/account" },
    {name: "Academic Registration", path: "/registration" },
    {name: "Course Registration", path: "/course-registration" },
    { name: "Grades", path: "/grades" },
    { name: "Scholarships", path: "/scholarship" },
    { name: "Favorites", path: "/favorites" },
    { name: "Notifications", path: "/inbox" },
    { name: "Complaints", path: "/complaints" },
    { name: "Placements", path: "/placements" },
    { name: "Calendar", path: "/calendar" },
  ];
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="w-64 min-h-screen bg-white border-r p-4 flex flex-col">
      <div className="flex justify-center mb-8">
        <img src="/logo.png" className="w-40" alt="AIMS Logo" />
      </div>

      <nav className="flex-1 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg text-gray-700 font-medium ${
                isActive
                  ? "bg-blue-900 text-white"
                  : "hover:bg-gray-100 transition"
              }`
            }
          >
            {link.name}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-6 text-red-600 font-medium"
        >
        ⏻ Logout
      </button>
    </div>
  );
}
