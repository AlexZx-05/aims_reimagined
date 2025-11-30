import { getLoggedInUser, logoutUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Navbar({ collapsed }) {
  const user = getLoggedInUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div
      // Added transition and marginLeft to push navbar when sidebar expands
      className={`sticky top-0 z-20 h-16 bg-white border-b flex items-center px-6 transition-all duration-300 ${
        collapsed ? "ml-20" : "ml-64"
      }`}
    >
      {/* Left side empty now (toggle moved to sidebar) */}
      <div className="flex items-center gap-3"></div>

      {/* Center: search input */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search"
          className="w-96 px-4 py-2 bg-gray-100 rounded-full border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100 transition"
        />
      </div>

      {/* Right: profile and logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="mr-1 text-right">
            <p className="font-semibold text-sm">{user?.name}</p>
          </div>
          <img
            src={user?.photo || user?.avatar || "/logo.png"}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
            alt="Profile"
          />

          <button
            onClick={handleLogout}
            className="ml-2 px-4 py-2 text-sm rounded-md text-gray-700 hover:text-white hover:bg-red-600 transition"
            title="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}