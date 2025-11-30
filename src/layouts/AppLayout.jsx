import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`flex-1 transition-all duration-300 ${collapsed ? "ml-0" : "ml-64"}`}>
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
