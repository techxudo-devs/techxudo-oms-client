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
import { useState } from "react";
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
import useReviewEmploymentForm from "../hooks/useReviewEmploymentForm";
import EmploymentFormDetailsModal from "../components/EmploymentFormDetailsModal";
import ReviewConfirmationModal from "../components/ReviewConfirmationModal";
import { format } from "date-fns";

/**
 * EmploymentFormReviewPage - Admin reviews submitted employment forms
 * UI only - Business logic in useReviewEmploymentForm hook
 * (~150 lines total)
 */
const EmploymentFormReviewPage = () => {
  const {
    forms,
    pagination,
    selectedForm,
    isLoading,
    isFetching,
    isLoadingDetails,
    isSubmitting,
    filters,
    statusOptions,
    updateFilter,
    viewForm,
    closeDetails,
    refetch,
    reviewModalOpen,
    reviewAction,
    openReviewModal,
    closeReviewModal,
    submitReview,
    nextPage,
    prevPage,
  } = useReviewEmploymentForm();

  const [feedback, setFeedback] = useState("");
  const [submitError, setSubmitError] = useState("");

  // Status badge component
  const StatusBadge = ({ status }) => {
    const config = {
      pending_review: {
        icon: Clock,
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Pending Review",
      },
      approved: {
        icon: CheckCircle,
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Approved",
      },
      rejected: {
        icon: XCircle,
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Rejected",
      },
    };

    const { icon: Icon, bg, text, label } = config[status] || config.pending_review;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  // Handle review submission
  const handleSubmitReview = async () => {
    setSubmitError("");
    const result = await submitReview(feedback);

    if (result.success) {
      setFeedback("");
    } else {
      setSubmitError(result.error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Loading employment forms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employment Forms</h1>
          <p className="text-sm text-gray-600 mt-1">Review submitted employment forms</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isFetching}>
          {isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
            <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
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
        {forms.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No employment forms found</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>CNIC</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => (
                  <TableRow key={form._id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {form.personalInfo?.legalName}
                        </p>
                        <p className="text-sm text-gray-500">{form.contactInfo?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900">
                      {form.cnicInfo?.cnicNumber}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {format(new Date(form.submittedAt), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={form.status} />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => viewForm(form._id)}>
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
                Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} total)
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={prevPage} disabled={filters.page === 1}>
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

      {/* Modals */}
      <EmploymentFormDetailsModal
        open={!!selectedForm && !reviewModalOpen}
        onClose={closeDetails}
        selectedForm={selectedForm}
        isLoading={isLoadingDetails}
        onApprove={() => openReviewModal("approve")}
        onReject={() => openReviewModal("reject")}
      />

      <ReviewConfirmationModal
        open={reviewModalOpen}
        onClose={closeReviewModal}
        reviewAction={reviewAction}
        feedback={feedback}
        onFeedbackChange={setFeedback}
        onSubmit={handleSubmitReview}
        isSubmitting={isSubmitting}
        error={submitError}
      />
    </div>
  );
};

export default EmploymentFormReviewPage;
