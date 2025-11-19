import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AppLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
