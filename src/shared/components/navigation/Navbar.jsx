import React from "react";
import { LogOut, Menu, X, Bell, Search, Building2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useLogoutMutation } from "../../store/features/userApiSlice";
import { useDispatch } from "react-redux";
import { logout } from "../../store/features/authSlice";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext.jsx";

export function Navbar({ expanded, setExpanded }) {
  const { user, role } = useAuth();
  const { logo, companyName, theme } = useTheme();
  const [logoutMutation] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      // Still logout locally even if server request fails
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <nav
      style={{ backgroundColor: theme.primaryColor }}
      className={`sticky top-0 rounded-b-[30px] backdrop-blur-xl border-b border-gray-200/80 z-50 transition-all duration-300 ease-in-out ${
        expanded ? "md:ml-[240px]" : "md:ml-[72px]"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left Section - Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle - Only visible on small screens */}
          <button
            onClick={() => setExpanded(!expanded)}
            className=" p-2 rounded-lg text-white cursor-pointer hover:bg-gray-100 text-gray-600 hover:text-brand-primary transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/20 active:scale-95"
            title="Toggle Menu"
          >
            {expanded ? <Menu size={22} /> : <Menu size={22} />}
          </button>

          {/* Search Bar (Desktop) */}
        </div>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Button (Mobile) */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-brand-primary transition-all"
            title="Search"
          >
            <Search size={20} />
          </button>

          {/* Notifications */}
          <button
            className="relative p-2 text-white rounded-lg hover:bg-gray-100 text-gray-600 hover:text-brand-primary transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
            title="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-white hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20"
            title="Logout"
          >
            <LogOut size={20} />
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 hidden sm:block" />

          {/* User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 pl-2">
            <div className="relative">
              <img
                src={`https://ui-avatars.com/api/?background=6366f1&color=fff&name=${
                  user?.fullName || "User"
                }&bold=true`}
                alt="User Avatar"
                className="w-9 h-9 rounded-full ring-2 ring-brand-primary/20 shadow-sm cursor-pointer hover:ring-brand-primary/40 transition-all"
              />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white shadow-sm" />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-white capitalize leading-tight">
                {user?.fullName}
              </p>
              <p className="text-xs text-gray-200 capitalize">{role}</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
