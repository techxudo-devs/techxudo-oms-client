import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Calendar,
  FileText,
  Clock,
  Briefcase,
  User,
  Settings,
  DollarSign,
  DownloadCloud,
  Pin,
  PinIcon,
} from "lucide-react";

export const navItems = [
  {
    text: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/admin/dashboard",
    roles: ["admin"],
  },
  {
    text: "Employees",
    icon: <Users size={20} />,
    path: "/admin/employees",
    roles: ["admin"],
  },
  {
    text: "Documents",
    icon: <DownloadCloud size={20} />,
    path: "/admin/documents",
    roles: ["admin"],
  },
  {
    text: "Documents Ruquests",
    icon: <Pin size={20} />,
    path: "/admin/request",
    roles: ["admin"],
  },

  {
    text: "Leave Management",
    icon: <Calendar size={20} />,
    path: "/admin/leave",
    roles: ["admin"],
  },
  {
    text: "Attendance",
    icon: <Clock size={20} />,
    path: "/admin/attendance",
    roles: ["admin"],
  },
  {
    text: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/employee/dashboard",
    roles: ["employee"],
  },
  {
    text: "My Documents",
    icon: <FileText size={20} />,
    path: "/employee/documents",
    roles: ["employee"],
  },
  {
    text: "Request Documents",
    icon: <PinIcon size={20} />,
    path: "/employee/requests",
    roles: ["employee"],
  },
  {
    text: "My Tasks",
    icon: <ClipboardList size={20} />,
    path: "/employee/tasks",
    roles: ["employee"],
  },
  {
    text: "Attendance",
    icon: <Clock size={20} />,
    path: "/employee/attendance",
    roles: ["employee"],
  },
  {
    text: "Leave Requests",
    icon: <Calendar size={20} />,
    path: "/employee/leave",
    roles: ["employee"],
  },
  {
    text: "Work Reports",
    icon: <FileText size={20} />,
    path: "/employee/reports",
    roles: ["employee"],
  },
  {
    text: "Salary",
    icon: <DollarSign size={20} />,
    path: "/employee/salary",
    roles: ["employee"],
  },
];

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
