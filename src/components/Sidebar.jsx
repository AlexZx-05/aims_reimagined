import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  BookOpen,
  FileCheck,
  GraduationCap,
  Star,
  Bell,
  MessageSquare,
  Briefcase,
  CalendarDays,
  Menu // Hamburger icon
} from "lucide-react";

export default function Sidebar({ collapsed, setCollapsed }) {
  const links = [
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
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  const handleDashboardClick = () => {
    setCollapsed(!collapsed); // Toggle sidebar
    navigate("/dashboard");
  };

  // This will run when any NavLink is clicked.
  // It toggles the collapsed state (same as Dashboard behavior).
  const handleLinkClick = () => {
    setCollapsed(!collapsed);
    // don't call navigate here — NavLink handles navigation
  };

  return (
    // Sidebar is fixed so it overlays the app; content must account for its width (ml-20 or ml-64)
    <aside
      className={`fixed left-0 top-0 bottom-0 z-30 bg-white border-r flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <nav className="flex-1 space-y-1 p-2 relative overflow-y-auto overflow-x-hidden pt-4">
        {/* Dashboard toggle item */}
        <button
          onClick={handleDashboardClick}
          className={`w-full flex items-center gap-3 py-2 rounded-lg font-medium transition-colors mb-1
            ${isDashboard ? "bg-blue-900 text-white" : "text-gray-700 hover:bg-gray-100"}
            ${collapsed ? "justify-center gap-0 px-0" : "px-3"}
          `}
          title={collapsed ? "Dashboard" : ""}
          aria-expanded={!collapsed}
        >
          <span className={`flex-shrink-0 ${collapsed ? "mx-auto" : ""}`}>
            <Menu size={20} />
          </span>

          <span
            className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${
              collapsed ? "w-0 opacity-0" : "w-auto opacity-100 ml-1"
            }`}
          >
            Dashboard
          </span>
        </button>

        {/* Links */}
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            onClick={handleLinkClick}               // <-- toggle on click
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 rounded-lg text-gray-700 font-medium transition-colors mb-1
               ${isActive ? "bg-blue-900 text-white" : "hover:bg-gray-100"}
               ${collapsed ? "justify-center gap-0 px-0" : "px-3"}`
            }
            title={collapsed ? link.name : ""}
            role="button"
            aria-pressed={!collapsed}               // indicates the sidebar is expanded (not pressed) — optional
          >
            <span className={`flex-shrink-0 ${collapsed ? "mx-auto" : ""}`}>{link.icon}</span>

            <span
              className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${
                collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
              }`}
            >
              {link.name}
            </span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
