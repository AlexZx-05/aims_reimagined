import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../utils/auth";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Home,
  User,
  BookOpen,
  FileCheck,
  GraduationCap,
  Star,
  Bell,
  MessageSquare,
  Briefcase,
  CalendarDays,
  LogOut
} from "lucide-react";


export default function Sidebar({ collapsed, setCollapsed }) {
  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
    { name: "My Details", path: "/account", icon: <User size={20} /> },
    { name: "Academic Registration", path: "/registration", icon: <BookOpen size={20} /> },
    { name: "Course Registration", path: "/course-registration", icon: <FileCheck size={20} /> },
    { name: "Grades", path: "/grades", icon: <GraduationCap size={20} /> },
    { name: "Scholarships", path: "/scholarship", icon: <Star size={20} /> },
    { name: "Favorites", path: "/favorites", icon: <Star size={20} /> },
    { name: "Notifications", path: "/inbox", icon: <Bell size={20} /> },
    { name: "Complaints", path: "/complaints", icon: <MessageSquare size={20} /> },
    { name: "Placements", path: "/placements", icon: <Briefcase size={20} /> },
    { name: "Calendar", path: "/calendar", icon: <CalendarDays size={20} /> },
  ];

  const navigate = useNavigate();
  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div
      className={`fixed left-0 top-0 bottom-0 z-30 w-64 bg-white border-r p-4 flex flex-col transition-transform duration-300 transform ${
        collapsed ? "-translate-x-full" : "translate-x-0"
      }`}
    >
            {/* Floating toggle removed — Navbar contains the toggle now */}

      {/* Links */}
      <nav className="flex-1 space-y-1 relative overflow-auto">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 font-medium transition
              ${isActive ? "bg-blue-900 text-white" : "hover:bg-gray-100"}`
            }
          >
            {/* Icon (placeholder for now) */}
            <span>{link.icon}</span>

            {/* Hide text in collapsed mode */}
            {!collapsed && <span>{link.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout moved to Navbar (kept sidebar minimal) */}
      {/* Cut: small tab to hide the sidebar when open */}
      {!collapsed && (
        <button
          onClick={() => setCollapsed(true)}
          className="absolute left-56 top-20 z-50 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition"
          aria-label="Close sidebar"
          title="Close sidebar"
        >
          ✕
        </button>
      )}
    </div>
  );
}
