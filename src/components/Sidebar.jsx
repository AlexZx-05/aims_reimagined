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
      className={`relative min-h-screen bg-white border-r p-4 flex flex-col transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}`}
    >
            {/* Floating Toggle Button */}
      <div className="absolute right-[-12px] flex items-center">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="bg-white border shadow px-1 py-1 rounded-full hover:bg-gray-100 transition"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>


      {/* Logo */}
      <div className="flex justify-center mb-8">
        <img
          src="/logo.png"
          className={`${collapsed ? "w-12" : "w-40"} transition-all`}
          alt="AIMS Logo"
        />
      </div>

      {/* Links */}
      <nav className="flex-1 space-y-1 relative">
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

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-6 text-red-600 font-medium flex items-center gap-2"
      >
        <span>⏻</span>
        {!collapsed && <span>Logout</span>}
      </button>
    </div>
  );
}
