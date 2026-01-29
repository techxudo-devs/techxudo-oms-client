import React, { useState, useCallback } from "react";
import {
  Search,
  RefreshCw,
  UserPlus,
  Users2,
  FileText,
  Briefcase,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import CreateEmployeeForm from "../components/employee-manage/CreateEmployeeForm";
import PageLayout from "../../shared/components/layout/PagesLayout";
import EmployeeTable from "../components/employee-manage/EmployeeTable";
import { useManageEmployee } from "../hooks/useManageEmployee";
import EmploymentRecordsTable from "../components/employment/EmploymentRecordsTable";
import EmploymentFormReviewModal from "../components/employment/EmploymentFormReviewModal";
import { useEmploymentRecords } from "../hooks/useEmploymentRecords";
import { toast } from "sonner";
import {
  useReviewEmploymentFormMutation,
  useRequestEmploymentFormRevisionMutation,
} from "@/features/employe/employment/api/employmentApiSlice";

// --- Constants ---
const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "admin", label: "Admin" },
  { value: "employee", label: "Employee" },
];

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <Card>
    <CardContent className="p-6 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="h-5 w-5" />
      </div>
    </CardContent>
  </Card>
);

const EmployeeManagement = () => {
  const [activeTab, setActiveTab] = useState("directory");
  const [showForm, setShowForm] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Employment Records Hook ---
  const {
    forms,
    total: totalForms,
    currentPage,
    totalPages,
    isFetching: isFetchingForms,
    refetch: refetchForms,
    statusFilter,
    setStatusFilter,
    searchTerm: formSearchTerm,
    setSearchTerm: setFormSearchTerm,
    setPage: setFormsPage,
    statusOptions,
  } = useEmploymentRecords();

  const [reviewingFormId, setReviewingFormId] = useState(null);
  const [reviewEmploymentForm] = useReviewEmploymentFormMutation();
  const [requestingFormId, setRequestingFormId] = useState(null);
  const [requestEmploymentFormRevision] =
    useRequestEmploymentFormRevisionMutation();

  // --- Active Employee Hook ---
  const {
    employees,
    isLoading,
    searchTerm: employeeSearchTerm,
    setSearchTerm: setEmployeeSearchTerm,
    roleFilter,
    setRoleFilter,
    removeEmployee,
    blockEmployeeAccess,
    unblockEmployeeAccess,
    handleRefresh,
  } = useManageEmployee();

  // --- Handlers ---
  const handleView = (employee) => console.log("View employee:", employee);
  const handleEdit = (employee) => console.log("Edit employee:", employee);

  const handleReview = useCallback(
    async (formId, status) => {
      if (!formId) return;
      setReviewingFormId(formId);
      try {
        await reviewEmploymentForm({ id: formId, status }).unwrap();
        toast.success(
          status === "approved"
            ? "Form approved successfully"
            : "Form rejected successfully",
        );
        refetchForms();
      } catch (error) {
        toast.error(
          error?.data?.error ||
            error?.message ||
            "Failed to update form status",
        );
      } finally {
        setReviewingFormId(null);
      }
    },
    [reviewEmploymentForm, refetchForms],
  );

  const handleOpenDetails = useCallback((formId) => {
    setSelectedFormId(formId);
    setIsModalOpen(true);
  }, []);

  const handleRequestRevision = useCallback(
    async (formId, fields, notes) => {
      if (!formId) return;
      setRequestingFormId(formId);
      try {
        await requestEmploymentFormRevision({
          id: formId,
          fields,
          notes,
        }).unwrap();
        toast.success("Revision requested and candidate notified");
        refetchForms();
      } catch (error) {
        toast.error(
          error?.data?.error || error?.message || "Failed to request revision",
        );
      } finally {
        setRequestingFormId(null);
      }
    },
    [requestEmploymentFormRevision, refetchForms],
  );

  // Quick stats calculation (mock logic or derived from real data if available)
  const pendingReviews = forms.filter(
    (f) => f.status === "pending_review",
  ).length;

  return (
    <PageLayout
      title="People & Employment"
      subtitle="Manage your team directory and onboarding pipeline"
      icon={Users2}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setActiveTab("onboarding")}
            className={activeTab === "onboarding" ? "bg-gray-100" : ""}
          >
            Review Applications
          </Button>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* --- KPI Stats Row --- */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Employees"
            value={employees?.length || 0}
            icon={Users2}
            colorClass="bg-blue-50 text-blue-600"
          />
          <StatCard
            title="Onboarding"
            value={totalForms}
            icon={FileText}
            colorClass="bg-purple-50 text-purple-600"
          />
          <StatCard
            title="Pending Review"
            value={pendingReviews}
            icon={AlertCircle}
            colorClass="bg-amber-50 text-amber-600"
          />
          <StatCard
            title="Active Now"
            value={employees?.filter((e) => !e.isBlocked).length || 0}
            icon={CheckCircle2}
            colorClass="bg-green-50 text-green-600"
          />
        </div>

        {/* --- Main Content Tabs --- */}
        <Tabs
          defaultValue="directory"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-4"
        >
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2">
              <TabsTrigger value="directory">Employee Directory</TabsTrigger>
              <TabsTrigger value="onboarding">
                Onboarding Pipeline
                {pendingReviews > 0 && (
                  <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                    {pendingReviews}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* 1. Employee Directory Tab */}
          <TabsContent value="directory" className="space-y-4">
            {showForm && (
              <Card className="border-blue-100 bg-blue-50/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold text-blue-900">
                      Add New Team Member
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-blue-700 hover:bg-blue-100"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <CreateEmployeeForm
                    onSuccess={() => {
                      setShowForm(false);
                      handleRefresh();
                    }}
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center gap-2">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search by name or email..."
                      className="pl-9"
                      value={employeeSearchTerm}
                      onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="gap-2"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${
                      isLoading.employees ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
              </div>
              <EmployeeTable
                employees={employees}
                isLoading={isLoading.employees}
                onEdit={handleEdit}
                onDelete={removeEmployee}
                onBlock={blockEmployeeAccess}
                onUnblock={unblockEmployeeAccess}
                onView={handleView}
              />
            </Card>
          </TabsContent>

          {/* 2. Onboarding Pipeline Tab */}
          <TabsContent value="onboarding" className="space-y-4">
            <Card>
              <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-1 items-center gap-2">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search candidates..."
                      className="pl-9"
                      value={formSearchTerm}
                      onChange={(e) => setFormSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Filter Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refetchForms}
                  className="gap-2"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${
                      isFetchingForms ? "animate-spin" : ""
                    }`}
                  />
                  Refresh Records
                </Button>
              </div>

              <EmploymentRecordsTable
                forms={forms}
                isLoading={isFetchingForms}
                onReview={handleReview}
                reviewingId={reviewingFormId}
                onViewDetails={handleOpenDetails}
              />

              {/* Pagination Footer */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t p-4">
                  <p className="text-xs text-gray-500">
                    Showing {(currentPage - 1) * 10 + 1}-
                    {Math.min(currentPage * 10, totalForms)} of {totalForms}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFormsPage(Math.max(currentPage - 1, 1))}
                      disabled={currentPage <= 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFormsPage(Math.min(currentPage + 1, totalPages))
                      }
                      disabled={currentPage >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Helper Info Box */}
            <div className="flex gap-4 rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
              <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
              <div className="space-y-1">
                <p className="font-semibold">Workflow Guidance</p>
                <ul className="list-inside list-disc space-y-1 text-blue-800/80">
                  <li>
                    Review submitted forms and verify identity documents (CNIC).
                  </li>
                  <li>
                    Approved candidates are automatically moved to the Hired
                    stage.
                  </li>
                  <li>
                    Use the <strong>Request Revision</strong> feature if
                    documents are unclear.
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* --- Modals --- */}
        <EmploymentFormReviewModal
          open={isModalOpen}
          onOpenChange={(value) => setIsModalOpen(value)}
          formId={selectedFormId}
          onApprove={handleReview}
          onReject={handleReview}
          onRequestRevision={handleRequestRevision}
          requestingId={requestingFormId}
        />
      </div>
    </PageLayout>
  );
};

export default EmployeeManagement;
