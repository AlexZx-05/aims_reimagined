import { getLoggedInUser } from "../utils/auth";

export default function Navbar() {
  const user = getLoggedInUser();

  return (
    <div className="w-full h-16 bg-white border-b flex items-center justify-between px-6">
      <input
        type="text"
        placeholder="Search"
        className="w-80 px-4 py-2 bg-gray-100 rounded-full border border-gray-200 outline-none"
      />

      <div className="flex items-center gap-6">
        <span className="font-medium text-gray-700">Raichur ▾</span>

        <div className="flex items-center gap-3">
          <img
            src={user?.avatar || "/avatar.jpg"}
            className="w-10 h-10 rounded-full object-cover"
            alt="Profile"
          />
          <div>
            <p className="font-semibold">{user?.name}</p>
            <p className="text-gray-500 text-sm capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
