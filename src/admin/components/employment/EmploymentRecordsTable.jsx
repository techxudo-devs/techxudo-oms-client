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

const statusVariantMap = {
  draft: "secondary",
  pending_review: "warning",
  approved: "success",
  rejected: "destructive",
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const openFormWindow = (token) => {
  if (!token) return;
  if (typeof window !== "undefined") {
    window.open(`/employment/form/${token}`, "_blank");
  }
};

const EmploymentRecordsTable = ({
  forms = [],
  isLoading,
  onReview,
  reviewingId,
  onViewDetails,
}) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Reviewed</TableHead>
            <TableHead>Revision History</TableHead>
            <TableHead className="text-right">Details</TableHead>
            <TableHead className="text-right">Review</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12">
                Loading employment records...
              </TableCell>
            </TableRow>
          ) : forms.length > 0 ? (
            forms.map((form) => {
              const name =
                form.personalInfo?.legalName || form.employeeName || "N/A";
              const email = form.employeeEmail || "—";
              const phone = form.contactInfo?.phone || "—";
              const city = form.addresses?.primaryAddress?.city || "";
              const policies = form.acceptedPolicies || [];
              const status = form.status || "draft";
              const variant = statusVariantMap[status] || "default";

              return (
                <TableRow key={form._id || form.id} className="hover:bg-gray-50">
                  <TableCell className="space-y-1">
                    <p className="font-medium text-gray-900">{name}</p>
                    <p className="text-xs text-gray-500">{email}</p>
                    {city && (
                      <p className="text-xs text-gray-500">{city}</p>
                    )}
                    <p className="text-[11px] text-gray-500">
                      Policies accepted: {policies.length}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    <div className="text-gray-900 font-medium">{phone}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={variant} className="capitalize">
                      {status.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {formatDate(form.submittedAt || form.createdAt)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {formatDate(form.reviewedAt)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {form.revisionRequests?.length ? (
                      <div className="space-y-1 text-xs text-gray-600">
                        {form.revisionRequests
                          .slice(-2)
                          .reverse()
                          .map((req, idx) => (
                            <div key={idx}>
                              {req.requestedFields?.join(", ")} - {req.notes}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => onViewDetails && onViewDetails(form._id || form.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs"
                          onClick={() =>
                            onReview && onReview(form._id || form.id, "approved")
                          }
                          disabled={
                            !onReview || status !== "pending_review"
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs"
                          onClick={() =>
                            onReview && onReview(form._id || form.id, "rejected")
                          }
                          disabled={
                            !onReview || status !== "pending_review"
                          }
                        >
                          Reject
                        </Button>
                      </div>
                      {onReview && reviewingId === (form._id || form.id) && (
                        <p className="text-[11px] text-gray-500">
                          Updating...
                        </p>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12">
                No employment records found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmploymentRecordsTable;
