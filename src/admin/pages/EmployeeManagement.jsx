import React, { useState } from "react";
import { UserPlus, Users2, Search, RefreshCw } from "lucide-react";
import CreateEmployeeForm from "../components/employee-manage/CreateEmployeeForm";
import PageLayout from "../../shared/components/layout/PagesLayout";
import EmployeeTable from "../components/employee-manage/EmployeeTable";
import { useManageEmployee } from "../hooks/useManageEmployee";
import { Button } from "@/components/ui/button";

const EmployeeManagement = () => {
  const [showForm, setShowForm] = useState(false);

  const {
    employees,
    isLoading,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    removeEmployee,
    blockEmployeeAccess,
    unblockEmployeeAccess,
    handleRefresh,
  } = useManageEmployee();

  const handleView = (employee) => console.log("View employee:", employee);
  const handleEdit = (employee) => console.log("Edit employee:", employee);

  return (
    <PageLayout
      title={"Employee Management"}
      subtitle={"Create and manage new employees"}
      icon={Users2}
      actions={
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary outline-none"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading.employees ? "animate-spin" : ""}`}
            />
          </Button>
          <Button
            variant="outline"
            size="default"
            onClick={() => setShowForm(!showForm)}
            className="flex cursor-pointer items-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
            {showForm ? "Hide Form" : "Add Employee"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Employee
            </h2>
            <CreateEmployeeForm
              onSuccess={() => {
                setShowForm(false);
                // The `createEmployee` mutation should invalidate the
                // 'Employee' tag, triggering an automatic refetch.
              }}
            />
          </div>
        )}

        <div className="bg-white rounded-lg">
          <div className="">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              All Employees
            </h2>
            <EmployeeTable
              employees={employees}
              isLoading={isLoading.employees}
              onEdit={handleEdit}
              onDelete={removeEmployee}
              onBlock={blockEmployeeAccess}
              onUnblock={unblockEmployeeAccess}
              onView={handleView}
              onRefresh={handleRefresh}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default EmployeeManagement;
