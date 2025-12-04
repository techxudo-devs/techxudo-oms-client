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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

/**
 * AppointmentListPage - Admin views all appointment letters
 * UI only - Business logic in useManageAppointments hook
 */
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
  } = useManageAppointments();
  console.log(appointments);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const config = {
      pending: {
        icon: Clock,
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Pending",
      },
      accepted: {
        icon: CheckCircle,
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Accepted",
      },
      rejected: {
        icon: XCircle,
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Rejected",
      },
      expired: {
        icon: AlertCircle,
        bg: "bg-gray-100",
        text: "text-gray-700",
        label: "Expired",
      },
    };

    const { icon: Icon, bg, text, label } = config[status] || config.pending;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
      >
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

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
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          disabled={isFetching}
        >
          {isFetching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </Button>
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
                {appointments?.appointmentsLetter.map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.candidateName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appointment.candidateEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900">
                      {appointment.position}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {appointment.department}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {format(
                        new Date(appointment.joiningDate),
                        "MMM dd, yyyy"
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={appointment.status} />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewAppointment(appointment._id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
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

      {/* Details Modal */}
      <Dialog open={!!selectedAppointment} onOpenChange={closeDetails}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Appointment Letter Details</DialogTitle>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-900" />
            </div>
          ) : selectedAppointment ? (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <StatusBadge status={selectedAppointment.status} />
                </div>
                {selectedAppointment.respondedAt && (
                  <div>
                    <p className="text-sm text-gray-600">Responded At</p>
                    <p className="text-sm font-medium text-gray-900">
                      {format(
                        new Date(selectedAppointment.respondedAt),
                        "MMM dd, yyyy HH:mm"
                      )}
                    </p>
                  </div>
                )}
              </div>

              {/* Candidate Info */}
              <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <p className="text-sm text-gray-600">Candidate Name</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.candidateName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.candidateEmail}
                  </p>
                </div>
              </div>

              {/* Position Details */}
              <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <p className="text-sm text-gray-600">Position</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.position}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.department}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Employment Type</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {selectedAppointment.employmentType.replace("-", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Joining Date</p>
                  <p className="font-medium text-gray-900">
                    {format(
                      new Date(selectedAppointment.joiningDate),
                      "MMM dd, yyyy"
                    )}
                  </p>
                </div>
              </div>

              {/* Compensation */}
              <div className="grid md:grid-cols-2 gap-4 border-t pt-4">
                <div>
                  <p className="text-sm text-gray-600">Monthly Salary</p>
                  <p className="font-medium text-gray-900">
                    PKR {selectedAppointment.salary?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Work Location</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.workLocation}
                  </p>
                </div>
              </div>

              {/* Benefits */}
              {selectedAppointment.benefits?.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Benefits</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedAppointment.benefits.map((benefit, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              {selectedAppointment.additionalTerms && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600 mb-2">Additional Terms</p>
                  <p className="text-sm text-gray-900">
                    {selectedAppointment.additionalTerms}
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentListPage;
