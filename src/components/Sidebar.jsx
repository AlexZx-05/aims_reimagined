import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
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
  Heart,
  Menu, // Hamburger icon
  Download
} from "lucide-react";

export default function Sidebar({ collapsed, setCollapsed }) {
  const links = [
    { name: "My Details", path: "/account", icon: <User size={20} /> },
    { name: "Academic Registration", path: "/registration", icon: <BookOpen size={20} /> },
    { name: "Course Registration", path: "/course-registration", icon: <FileCheck size={20} /> },
    { name: "Grades", path: "/grades", icon: <GraduationCap size={20} /> },
    { name: "Scholarships", path: "/scholarship", icon: <Star size={20} /> },
    { name: "Favorites", path: "/favorites", icon: <Heart size={20} /> },
    { name: "Notifications", path: "/inbox", icon: <Bell size={20} /> },
    /*{ name: "Complaints", path: "/complaints", icon: <MessageSquare size={20} /> },*/
    { name: "Placements", path: "/placements", icon: <Briefcase size={20} /> },
    { name: "Calendar", path: "/calendar", icon: <CalendarDays size={20} /> },
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  // PWA install prompt state
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const beforeHandler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const installedHandler = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", beforeHandler);
    window.addEventListener("appinstalled", installedHandler);

    // Check if already installed (standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (isStandalone) setIsInstalled(true);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeHandler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  useEffect(() => {
    // Listen for the custom event dispatched from index.html in case the
    // beforeinstallprompt fired before this component mounted.
    const onDeferred = (ev) => {
      const payload = ev?.detail || window.deferredPrompt || null;
      if (payload) {
        try {
          // prevent default if not already done
          if (payload.preventDefault) payload.preventDefault();
        } catch (err) {}
        setDeferredPrompt(payload);
      }
    };

    const onInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('pwa-beforeinstallprompt', onDeferred);
    window.addEventListener('pwa-installed', onInstalled);

    // if index.html already set window.deferredPrompt earlier, pick it up
    if (!deferredPrompt && window.deferredPrompt) {
      setDeferredPrompt(window.deferredPrompt);
    }

    if (!isInstalled && window.isPWAInstalled) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('pwa-beforeinstallprompt', onDeferred);
      window.removeEventListener('pwa-installed', onInstalled);
    };
  }, [deferredPrompt, isInstalled]);

  const handleInstallClick = async () => {
    // Prefer the saved event, but fall back to window.deferredPrompt
    const promptEvent = deferredPrompt || window.deferredPrompt;
    if (!promptEvent) {
      // nothing to do; could show instructions for iOS
      return;
    }

    try {
      promptEvent.prompt();
      const choiceResult = await promptEvent.userChoice;
      if (choiceResult && choiceResult.outcome === "accepted") {
        setIsInstalled(true);
      }
    } catch (err) {
      // ignore
    } finally {
      setDeferredPrompt(null);
      try { window.deferredPrompt = null; } catch (e) {}
    }
  };

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

      {/* Install button (shows when PWA prompt is available and not already installed) */}
      {!isInstalled && (
        <div className="border-t p-2 space-y-1">
          <button
            onClick={handleInstallClick}
            disabled={!deferredPrompt}
            className={`w-full flex items-center gap-3 py-3 rounded-lg font-medium transition-colors ${collapsed ? 'justify-center gap-0 px-0' : 'px-3'} ${!deferredPrompt ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            title={collapsed ? 'Install AIMS' : ''}
            aria-label="Install AIMS app"
          >
            <span className={`flex-shrink-0 ${collapsed ? 'mx-auto' : ''}`}>
              <Download size={20} />
            </span>
            <span className={`whitespace-nowrap transition-all duration-300 overflow-hidden ${collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              Install App
            </span>
          </button>
        </div>
      )}
    </aside>
  );
}
