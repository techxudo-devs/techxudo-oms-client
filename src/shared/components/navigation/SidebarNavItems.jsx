import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Calendar,
  FileText,
  Clock,
  User,
  Settings,
  DollarSign,
  DownloadCloud,
  Banknote,
  UserPlus,
  Briefcase,
} from "lucide-react";

/* ------------------------------
   ADMIN NAVIGATION
------------------------------ */
export const adminNavItems = [
  {
    text: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/admin/dashboard",
  },
  {
    text: "Employees",
    icon: <Users size={20} />,
    path: "/admin/employees",
  },
  {
    text: "Hiring",
    icon: <UserPlus size={20} />,
    path: "/admin/hiring",
  },
  {
    text: "Documents",
    icon: <DownloadCloud size={20} />,
    path: "/admin/request",
  },
  {
    text: "Leave Management",
    icon: <Calendar size={20} />,
    path: "/admin/leave",
  },
  {
    text: "Attendance",
    icon: <Clock size={20} />,
    path: "/admin/attendance",
  },
  {
    text: "Salary Management",
    icon: <Banknote size={20} />,
    path: "/admin/salary",
  },
  {
    text: "Company Profile",
    icon: <Briefcase size={20} />,
    path: "/admin/company-profile",
  },
];

/* ------------------------------
   EMPLOYEE NAVIGATION
------------------------------ */
export const employeeNavItems = [
  {
    text: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/employee/dashboard",
  },
  {
    text: "Documents",
    icon: <FileText size={20} />,
    path: "/employee/documents",
  },
  {
    text: "My Tasks",
    icon: <ClipboardList size={20} />,
    path: "/employee/tasks",
  },
  {
    text: "Attendance",
    icon: <Clock size={20} />,
    path: "/employee/attendance",
  },
  {
    text: "Leave Requests",
    icon: <Calendar size={20} />,
    path: "/employee/leave",
  },
  {
    text: "Work Reports",
    icon: <FileText size={20} />,
    path: "/employee/reports",
  },
  {
    text: "Salary",
    icon: <DollarSign size={20} />,
    path: "/employee/salary",
  },
];

/* ------------------------------
   BOTTOM NAV (COMMON)
------------------------------ */
export const bottomNavItems = [
  {
    text: "Profile",
    icon: <User size={20} />,
    path: "/profile",
  },
  {
    text: "Settings",
    icon: <Settings size={20} />,
    path: "/settings",
  },
];
