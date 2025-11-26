import { createContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  adminNavItems,
  employeeNavItems,
  bottomNavItems,
} from "./SidebarNavItems";
import { SidebarItem } from "./SidebarItems";
import { useAuth } from "../../hooks/useAuth";

export const SidebarContext = createContext();

const logoVariants = {
  expanded: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  collapsed: {
    opacity: 1,
    scale: 0.95,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const sidebarVariants = {
  expanded: {
    width: "240px",
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  collapsed: {
    width: "72px",
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};

export function Sidebar({ expanded, setExpanded }) {
  const { user, role } = useAuth();
  const navList = role === "admin" ? adminNavItems : employeeNavItems;

  return (
    <motion.aside
      initial={false}
      animate={expanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      className="h-screen fixed top-0 left-0 z-40"
    >
      <nav className="h-full flex flex-col  bg-gradient-to-b from-slate-50 to-white border-r border-gray-200/80 ">
        {/* Logo Section with Toggle Button */}
        <div className="h-16 flex items-center justify-center px-3 relative">
          <motion.div
            animate={expanded ? "expanded" : "collapsed"}
            variants={logoVariants}
            className="flex items-center gap-3 "
          >
            {expanded ? (
              <div className="flex  items-center gap-2">
                <div className="size-10 rounded-lg bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl italic">
                    TX
                  </span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-brand-primary to-blue-600 bg-clip-text text-transparent">
                  Techxudo
                </span>
              </div>
            ) : (
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">T</span>
              </div>
            )}
          </motion.div>

          {/* Toggle Button - Only visible on large screens */}
        </div>

        {/* Navigation Items */}
        <SidebarContext.Provider value={{ expanded }}>
          <div className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <ul className="space-y-1">
              {navList.map((item, index) => (
                <SidebarItem key={index} item={item} />
              ))}
            </ul>

            {/* Divider */}
            <div className="my-4 px-2">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            {/* Bottom Items */}
            <ul className="space-y-1">
              {bottomNavItems.map((item, index) => (
                <SidebarItem key={index} item={item} />
              ))}
            </ul>
          </div>
        </SidebarContext.Provider>

        {/* User Profile Section */}
        <div className="border-t border-gray-200/60 p-3 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={`https://ui-avatars.com/api/?background=6366f1&color=fff&name=${
                  user?.fullName || "User"
                }&bold=true`}
                alt="User Avatar"
                className="w-10 h-10 rounded-full ring-2 ring-brand-primary/20 shadow-sm"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
            </div>

            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0"
                >
                  <h4 className="font-semibold capitalize text-sm text-gray-900 truncate">
                    {user?.fullName || "User"}
                  </h4>
                  <span className="text-xs text-gray-500 capitalize">
                    {role}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </motion.aside>
  );
}
