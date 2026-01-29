import React, { useState, useCallback } from "react";
import { Search, RefreshCw, UserPlus, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "admin", label: "Admin" },
  { value: "employee", label: "Employee" },
];

const EmployeeManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    forms,
    total,
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
          error?.data?.error || error?.message || "Failed to update form status",
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

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedFormId(null);
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

  return (
    <PageLayout
      title="Employment"
      subtitle="Track the onboarding pipeline and manage the active team"
      icon={Users2}
      actions={
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => setShowForm((prev) => !prev)}
        >
          <UserPlus className="h-4 w-4" />
          {showForm ? "Hide form" : "Add employee"}
        </Button>
      }
    >
      <div className="space-y-6">
        <section className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Employment pipeline</p>
              <h2 className="text-xl font-semibold text-gray-900">
                Hired candidates
              </h2>
              <p className="text-xs text-gray-500">
                Showing {forms.length} of {total} records
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Input
                  placeholder="Search by name, email, phone"
                  className="pr-10"
                  value={formSearchTerm}
                  onChange={(e) => setFormSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
              <Select
              >
                <SelectTrigger className="min-w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
                onClick={refetchForms}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isFetchingForms ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
          <EmploymentRecordsTable
            forms={forms}
            isLoading={isFetchingForms}
            onReview={handleReview}
            reviewingId={reviewingFormId}
            onViewDetails={handleOpenDetails}
          />
          <div className="rounded-xl bg-slate-50/60 p-4 text-xs text-gray-600">
            <p className="font-semibold text-gray-800">Process guidance:</p>
            <p>1. Review the submitted form and mark as approved/rejected.</p>
            <p>
              2. Approved candidates receive an appointment letter via the
              hiring board (Admin &gt; Hiring).
            </p>
            <p>3. Send the employment contract and request e-signature.</p>
            <p>4. Once signed, the user receives credentials and onboarding links.</p>
          </div>
          {totalPages > 1 && (
            <div className="flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Page {currentPage} of {totalPages} ({total} records)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setFormsPage(Math.max(currentPage - 1, 1))}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
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
        </section>

        {showForm && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Create new employee
            </h2>
            <CreateEmployeeForm
              onSuccess={() => {
                setShowForm(false);
                handleRefresh();
              }}
            />
          </div>
        )}

        <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">Active staff</p>
              <h2 className="text-xl font-semibold text-gray-900">
                Employee directory
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Input
                  placeholder="Search employees..."
                  className="pr-10 w-full sm:w-auto"
                  value={employeeSearchTerm}
                  onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="min-w-[160px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
                onClick={handleRefresh}
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading.employees ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
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
        </section>
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
