import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import Layout from "./layout/Layout";
import PrivateRoute from "./layout/PrivateRoute";

// Auth Pages
import Login from "../../pages/auth/Login";

// Admin Pages
import AdminDashboard from "../../admin/pages/AdminDashboard";
import EmployeeManagement from "../../admin/pages/EmployeeManagement";
import DocumentManagement from "../../admin/pages/document/DocumentManagementPage";
import UnifiedAdminDocumentManagement from "../../admin/pages/document/UnifiedAdminDocumentManagement";
import AdminLeaveDashboard from "../../admin/pages/leave/AdminLeaveDashboard";
import AdminDocumentRequestDashboard from "@/admin/pages/document-requests/AdminDocumentRequestDashboard";
import AdminAttendanceDashboard from "@/admin/pages/attendance/AdminAttendanceDashboard";
import AllAttendancePage from "@/admin/pages/attendance/AllAttendancePage";
import ReportsPage from "@/admin/pages/attendance/ReportsPage";
import QRCodePage from "@/admin/pages/attendance/QRCodePage";
import SettingsPage from "@/admin/pages/attendance/SettingsPage";
import ManualEntryPage from "@/admin/pages/attendance/ManualEntryPage";
import AdminSalaryDashboard from "@/admin/pages/salary/AdminSalaryDashboard";
import AllSalariesPage from "@/admin/pages/salary/AllSalariesPage";
import CreateSalaryPage from "@/admin/pages/salary/CreateSalaryPage";
import BulkGeneratePage from "@/admin/pages/salary/BulkGeneratePage";

// Employee Pages
import EmployeeDashboard from "../../employee/pages/EmployeeDashboard";
import DocumentDashboard from "@/employee/pages/document/DocumentDashboard";
import DocumentSigningPage from "../../employee/pages/document/DocumentSigningPage";
import UnifiedDocumentManagement from "@/employee/pages/document/UnifiedDocumentManagement";
import { OnboardingPage } from "../../employee/pages/OnBoardingPage";
import LeaveManagementPage from "@/employee/pages/LeaveManagementPage";
import DocumentRequestManagement from "@/employee/pages/document-requests/DocumentRequestManagement";
import AttendancePage from "@/employee/pages/attendance/AttendancePage";
import AttendanceHistoryPage from "@/employee/pages/attendance/AttendanceHistoryPage";
import SalaryHistoryPage from "@/employee/pages/salary/SalaryHistoryPage";
import LandingPage from "@/pages/public/LandingPage";
import RegisterPage from "@/pages/public/RegisterPage";

// Admin Hiring Pages
import HiringManagementPage from "@/features/admin/hiring/pages/HiringManagementPage";
// Employment Flow Pages (Public - Token-based access)
import AppointmentLetterView from "@/features/employe/employment/pages/AppointmentLetterView";
import EmploymentFormPage from "@/features/employe/employment/pages/EmploymentFormPage";
import ContractSigningPage from "@/features/employe/employment/pages/ContractSigningPage";
import SetPasswordPage from "@/features/employe/employment/pages/SetPasswordPage";
// Route configurations
const adminRoutes = [
  { path: "/admin/dashboard", element: <AdminDashboard /> },
  { path: "/admin/employees", element: <EmployeeManagement /> },
  { path: "/admin/documents", element: <UnifiedAdminDocumentManagement /> },
  { path: "/admin/leave", element: <AdminLeaveDashboard /> },
  { path: "/admin/request", element: <UnifiedAdminDocumentManagement /> },
  { path: "/admin/attendance", element: <AdminAttendanceDashboard /> },
  { path: "/admin/attendance/all", element: <AllAttendancePage /> },
  { path: "/admin/attendance/reports", element: <ReportsPage /> },
  { path: "/admin/attendance/qr", element: <QRCodePage /> },
  { path: "/admin/attendance/manual-entry", element: <ManualEntryPage /> },
  { path: "/admin/attendance/settings", element: <SettingsPage /> },
  { path: "/admin/salary", element: <AdminSalaryDashboard /> },
  { path: "/admin/salary/all", element: <AllSalariesPage /> },
  { path: "/admin/salary/create", element: <CreateSalaryPage /> },
  { path: "/admin/salary/bulk-generate", element: <BulkGeneratePage /> },
  // Unified Hiring Management Route
  { path: "/admin/hiring", element: <HiringManagementPage /> },
];

const employeeRoutes = [
  { path: "/employee/dashboard", element: <EmployeeDashboard /> },
  { path: "/employee/documents", element: <UnifiedDocumentManagement /> },
  { path: "/employee/documents/:id/sign", element: <DocumentSigningPage /> },
  { path: "/employee/requests", element: <UnifiedDocumentManagement /> },
  { path: "/employee/attendance", element: <AttendancePage /> },
  { path: "/employee/attendance/history", element: <AttendanceHistoryPage /> },
  { path: "/employee/leave", element: <LeaveManagementPage /> },
  {
    path: "/employee/tasks",
    element: <div className="p-6">My Tasks - Coming Soon</div>,
  },
  {
    path: "/employee/reports",
    element: <div className="p-6">Work Reports - Coming Soon</div>,
  },
  { path: "/employee/salary", element: <SalaryHistoryPage /> },
];

const sharedRoutes = [
  {
    path: "/profile",
    element: <div className="p-6">Profile - Coming Soon</div>,
  },
  {
    path: "/settings",
    element: <div className="p-6">Settings - Coming Soon</div>,
  },
];

const AppRoutes = () => {
  const { user, isAdmin, setupCompleted } = useAuth();

  const redirectToDashboard = () =>
    isAdmin ? "/admin/dashboard" : "/employee/dashboard";

  // If user is logged in but setup incomplete, redirect to setup
  const shouldRedirectToSetup = user && setupCompleted === false;

  const renderRoutes = (routesArray) =>
    routesArray.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ));

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/register"
        element={
          user ? (
            shouldRedirectToSetup ? (
              <Navigate to="/setup" replace />
            ) : (
              <Navigate to={redirectToDashboard()} replace />
            )
          ) : (
            <RegisterPage />
          )
        }
      />
      <Route path="/onboarding/:token" element={<OnboardingPage />} />

      {/* Employment Flow Routes - Public (Token-based access) */}
      <Route
        path="/onboarding/appointment/:token"
        element={<AppointmentLetterView />}
      />
      <Route path="/employment/form/:token" element={<EmploymentFormPage />} />
      <Route
        path="/employment/contract/:token"
        element={<ContractSigningPage />}
      />
      <Route
        path="/employment/set-password/:token"
        element={<SetPasswordPage />}
      />

      {/* Admin Routes - Setup wizard shown as modal if incomplete */}
      <Route element={<PrivateRoute allowAdmin />}>
        <Route element={<Layout />}>{renderRoutes(adminRoutes)}</Route>
      </Route>

      {/* Employee Routes - Block if setup incomplete (employees can't access until org setup done) */}
      <Route element={<PrivateRoute allowEmployee />}>
        <Route
          element={
            shouldRedirectToSetup ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Layout />
            )
          }
        >
          {renderRoutes(employeeRoutes)}
        </Route>
      </Route>

      {/* Shared Routes - Block if setup incomplete */}
      <Route element={<PrivateRoute allowBoth />}>
        <Route
          element={
            shouldRedirectToSetup ? (
              <Navigate to="/setup" replace />
            ) : (
              <Layout />
            )
          }
        >
          {renderRoutes(sharedRoutes)}
        </Route>
      </Route>

      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
