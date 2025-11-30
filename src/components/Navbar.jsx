import { getLoggedInUser, logoutUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Navbar({ collapsed, setCollapsed }) {
  const user = getLoggedInUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="sticky top-0 z-40 h-16 bg-white border-b flex items-center px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger / toggle button */}
        <button
          onClick={() => setCollapsed?.(!collapsed)}
          aria-label="Toggle sidebar"
          className="p-2 rounded-md hover:bg-gray-100 transition"
        >
          <span className="block w-5 h-0.5 bg-gray-700 mb-1"></span>
          <span className="block w-5 h-0.5 bg-gray-700 mb-1"></span>
          <span className="block w-5 h-0.5 bg-gray-700"></span>
        </button>

        {/* Logo image from sidebar (shown next to hamburger) */}
        <img src="/logo.png" alt="AIMS" className="w-40 h-auto object-contain py-2" />
      </div>

      {/* Center: search input */}
      <div className="flex-1 flex justify-center">
        <input
          type="text"
          placeholder="Search"
          className="w-96 px-4 py-2 bg-gray-100 rounded-full border border-gray-200 outline-none"
        />
      </div>

      {/* Right: region label, profile and logout */}
      <div className="flex items-center gap-4">
        <span className="font-medium text-gray-700 mr-2">Raichur ▾</span>

        <div className="flex items-center gap-3">
          <img
            src={user?.photo || user?.avatar || "/logo.png"}
            className="w-10 h-10 rounded-full object-cover"
            alt="Profile"
          />
          <div className="mr-3">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-gray-500 text-sm capitalize">{user?.role}</p>
          </div>

          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm rounded-md text-gray-700 hover:text-white hover:bg-red-600 transition"
            title="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
