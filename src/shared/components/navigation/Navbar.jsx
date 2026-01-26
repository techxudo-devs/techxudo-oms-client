import React from "react";
import {
  LogOut,
  Menu,
  Bell,
  Search,
  ChevronRight,
  Command,
  Slash,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useLogoutMutation } from "../../store/features/userApiSlice";
import { useDispatch } from "react-redux";
import { logout } from "../../store/features/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";
import { cn } from "@/lib/utils"; // Assuming you have utils, or standard class merger

export function Navbar({ expanded, setExpanded }) {
  const { user, role } = useAuth();
  const { theme } = useTheme(); // We will use theme for accents, not full background
  const [logoutMutation] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Generate a mock breadcrumb based on route
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentPage =
    pathSegments.length > 0
      ? pathSegments[pathSegments.length - 1].charAt(0).toUpperCase() +
        pathSegments[pathSegments.length - 1].slice(1)
      : "Dashboard";

  const handleLogout = async () => {
    try {
      const refreshToken = JSON.parse(
        localStorage.getItem("userInfo"),
      )?.refreshToken;
      await logoutMutation({ refreshToken }).unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-30 h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md transition-all duration-300 ease-in-out",
        expanded ? "md:ml-[240px]" : "md:ml-[72px]",
      )}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* --- Left: Breadcrumbs & Toggle --- */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 -ml-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Context / Breadcrumb */}
          <div className="hidden sm:flex items-center text-sm text-gray-500">
            <span className="flex items-center gap-1 hover:text-gray-900 transition-colors cursor-pointer">
              <span className="font-medium">Workspace</span>
            </span>
            <Slash className="h-4 w-4 text-gray-300 mx-2 -rotate-12" />
            <span className="font-semibold text-gray-900">{currentPage}</span>
          </div>
        </div>

        {/* --- Center: Command Search (Desktop) --- */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full h-9 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-gray-300 transition-all"
              placeholder="Search or type command..."
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-gray-200 bg-gray-100 text-[10px] font-medium text-gray-500">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Right: Actions & Profile --- */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Search Icon */}
          <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Search className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors group">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white scale-100 transition-transform group-hover:scale-110" />
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200 hidden sm:block" />

          {/* Profile Dropdown Trigger */}
          <div className="flex items-center gap-3 pl-1">
            <div className="hidden text-right lg:block">
              <div className="text-sm font-medium text-gray-900 leading-none">
                {user?.fullName || "User"}
              </div>
              <div className="text-[11px] font-medium text-gray-500 mt-1 capitalize">
                {role}
              </div>
            </div>

            <div className="group relative cursor-pointer">
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?background=random&color=fff&name=${user?.fullName || "User"}`}
                  alt="Profile"
                  className="h-8 w-8 rounded-full ring-2 ring-white shadow-sm object-cover group-hover:ring-2 group-hover:ring-gray-200 transition-all"
                />
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              {/* Quick Logout (Ideally this is a DropdownMenu, but keeping simple for snippet) */}
              <button
                onClick={handleLogout}
                className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 border border-gray-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                title="Logout"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
