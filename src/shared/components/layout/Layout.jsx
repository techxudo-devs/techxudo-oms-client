import React, { useState, useCallback, useEffect } from "react";
import { Navbar } from "../navigation/Navbar";
import { Sidebar } from "../navigation/Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [expanded, setExpanded] = useState(true);

  // Handle responsive sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setExpanded(false);
      } else {
        setExpanded(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSetExpanded = useCallback((value) => {
    setExpanded(value);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="relative">
        <Navbar expanded={expanded} setExpanded={handleSetExpanded} />
      </div>
      <div className="flex flex-1 relative">
        <Sidebar expanded={expanded} setExpanded={handleSetExpanded} />

        {/* Mobile Overlay */}
        {expanded && (
          <div
            className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-30 transition-opacity"
            onClick={() => setExpanded(false)}
          />
        )}

        {/* Main Content */}
        <main
          className={`
            flex-1 transition-all duration-300 ease-in-out
            ${expanded ? "md:ml-[230px]" : "md:ml-[72px]"}
            w-full min-h-[calc(100vh-4rem)]
          `}
        >
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
