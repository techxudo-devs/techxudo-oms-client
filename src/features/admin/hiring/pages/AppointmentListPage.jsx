import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Plus,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useManageAppointments from "../hooks/useManageAppointments";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import AppointmentDetailsModal from "../components/AppointmentDetailsModal";
import StatusBadge from "../components/StatusBadge";


const AppointmentListPage = () => {
  const {
    appointments,
    pagination,
    statistics,
    selectedAppointment,
    isLoading,
    isFetching,
    isLoadingDetails,
    filters,
    statusOptions,
    updateFilter,
    viewAppointment,
    closeDetails,
    refetch,
    goToPage,
    nextPage,
    prevPage,
    sendEmploymentForm,
    isSendingForm,
  } = useManageAppointments();
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Appointment Letters
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage all sent appointment letters
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="flex items-center gap-2">
            <Link to="/admin/hiring/appointments/create">
              <Plus className="w-4 h-4" />
              Create Appointment
            </Link>
          </Button>
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="icon"
            disabled={isFetching}
            title="Refresh List"
          >
            {isFetching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {statistics.total}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <p className="text-sm text-yellow-700">Pending</p>
          <p className="text-2xl font-bold text-yellow-900 mt-1">
            {statistics.pending}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <p className="text-sm text-green-700">Accepted</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {statistics.accepted}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4">
          <p className="text-sm text-red-700">Rejected</p>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {statistics.rejected}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg shadow p-4">
          <p className="text-sm text-gray-700">Expired</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {statistics.expired}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Status
            </label>
            <Select
              value={filters.status}
              onValueChange={(value) => updateFilter("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No appointments found</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Joining Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments?.map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.employeeName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appointment.employeeEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900">
                      {appointment.letterContent?.position}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {appointment.letterContent?.department}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {appointment.letterContent?.joiningDate &&
                        format(
                          new Date(appointment.letterContent.joiningDate),
                          "MMM dd, yyyy"
                        )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={appointment.status} />
                    </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewAppointment(appointment._id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {appointment.status === "accepted" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => sendEmploymentForm(appointment)}
                              disabled={isSendingForm}
                            >
                              {isSendingForm ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <FileText className="w-4 h-4 mr-1" />
                                  Send Form
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
              <div className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages} (
                {pagination.totalItems} total)
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={filters.page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={filters.page >= pagination.totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <AppointmentDetailsModal
        selectedAppointment={selectedAppointment}
        isLoadingDetails={isLoadingDetails}
        closeDetails={closeDetails}
      />
    </div>
  );
};

export default AppointmentListPage;
