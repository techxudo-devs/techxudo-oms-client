import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarContext } from "./Sidebar";

export const SidebarItem = ({ item }) => {
  const { expanded } = useContext(SidebarContext);

  return (
    <li>
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group relative ${
            isActive
              ? "bg-gradient-to-r from-brand-primary to-blue-600 text-white "
              : "text-gray-700 hover:bg-gray-100 hover:text-brand-primary"
          }`
        }
      >
        {({ isActive }) => (
          <>
            {/* Active Indicator */}
            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              />
            )}

            {/* Icon */}
            <span
              className={`flex-shrink-0 transition-transform duration-200 ${
                isActive ? "scale-110" : "group-hover:scale-110"
              }`}
            >
              {item.icon}
            </span>

            {/* Text Label */}
            <AnimatePresence mode="wait">
              {expanded && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {item.text}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Tooltip for collapsed state */}
            {!expanded && (
              <div className="fixed left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg pointer-events-none">
                {item.text}
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            )}
          </>
        )}
      </NavLink>
    </li>
  );
};
