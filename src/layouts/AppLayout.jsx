import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  // When Sidebar is fixed (w-20 when collapsed, w-64 when expanded),
  // the main content should have margin-left equal to that width.
  // collapsed === true  -> sidebar width = w-20  -> ml-20
  // collapsed === false -> sidebar width = w-64  -> ml-64
  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className={`flex-1 min-h-screen transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"}`}
      >
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
