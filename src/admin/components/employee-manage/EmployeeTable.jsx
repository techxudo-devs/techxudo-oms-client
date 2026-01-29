import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  UserX,
  UserCheck,
  Github,
  Linkedin,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EmployeeTable = ({
  employees = [],
  onEdit,
  onDelete,
  onBlock,
  onUnblock,
  onView,
  isLoading = false,
  onRefresh,
}) => {
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    employee: null,
  });

  const openDeleteModal = (employee) => {
    setDeleteModal({ isOpen: true, employee });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, employee: null });
  };

  const handleConfirmDelete = () => {
    if (deleteModal.employee && onDelete) {
      onDelete(deleteModal.employee._id);
      closeDeleteModal();
    }
  };

  // Function to get initials from full name
  const getInitials = (name) => {
    if (!name) return "N/A";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to format salary
  const formatSalary = (salary) => {
    if (!salary) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(salary);
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Function to get status badge variant
  const getStatusVariant = (isActive) => {
    if (isActive === undefined || isActive === null) return "secondary";
    return isActive ? "success" : "destructive";
  };

  // Function to get status text
  const getStatusText = (isActive) => {
    if (isActive === undefined || isActive === null) return "Pending";
    return isActive ? "Active" : "Blocked";
  };

  return (
    <>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Employee</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Social Links</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Loading employees...
                </TableCell>
              </TableRow>
            ) : employees && employees.length > 0 ? (
              employees
                .filter((emp) => emp.role !== "admin")
                .map((employee) => (
                  <TableRow
                    key={employee._id || employee.id}
                    className="hover:bg-gray-50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={employee.avatar || employee.profile?.avatar}
                            alt={employee.fullName}
                          />
                          <AvatarFallback className="bg-brand-primary text-white font-semibold">
                            {getInitials(employee.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {employee.fullName || employee.name || "N/A"}
                          </span>
                          <span className="text-sm text-gray-500">
                            {employee.email || "N/A"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.designation || "N/A"}</TableCell>
                    <TableCell>{employee.department || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {employee?.socialLinks?.github && (
                          <a
                            href={employee.socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 hover:text-black"
                          >
                            <Github size={24} />
                          </a>
                        )}

                        {employee?.socialLinks?.linkedin && (
                          <a
                            href={employee.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Linkedin size={24} />
                          </a>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={getStatusVariant(employee.isActive)}
                        className="capitalize"
                      >
                        {getStatusText(employee.isActive)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatSalary(employee.salary)}</TableCell>
                    <TableCell>{formatDate(employee.joiningDate)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button
                            variant="ghost"
                            className="h-8 cursor-pointer w-8 p-0"
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="size-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onView && onView(employee)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onEdit && onEdit(employee)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {employee?.isActive ? (
                            <DropdownMenuItem
                              onClick={() => onBlock && onBlock(employee?._id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Block
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() =>
                                onUnblock && onUnblock(employee?._id)
                              }
                              className="text-green-600 focus:text-green-600"
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Unblock
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => openDeleteModal(employee)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No employees found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start gap-4 p-6 border-b border-gray-100">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  Delete Employee
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  This action cannot be undone
                </p>
              </div>
              <Button
                variant="ghost"
                onClick={closeDeleteModal}
                className="rounded-lg"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> You are about to permanently delete
                  this employee's account.
                </p>
              </div>

              {deleteModal.employee && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={deleteModal.employee.avatar}
                      alt={deleteModal.employee.fullName}
                    />
                    <AvatarFallback className="bg-brand-primary text-white font-semibold">
                      {getInitials(deleteModal.employee.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {deleteModal.employee.fullName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {deleteModal.employee.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {deleteModal.employee.designation} •{" "}
                      {deleteModal.employee.department}
                    </p>
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-600 mt-4">
                Are you sure you want to delete this employee? All their data
                will be permanently removed from the system.
              </p>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
              <Button
                type="button"
                onClick={closeDeleteModal}
                variant="outline"
                className="flex-1 px-4 py-2.5 font-medium rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Employee</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeTable;
