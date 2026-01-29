import { ExternalLink } from "lucide-react";
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

const EmploymentRecordsTable = ({ forms = [], isLoading }) => {
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
            <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => openFormWindow(form.submissionToken)}
                      disabled={!form.submissionToken}
                    >
                      <ExternalLink className="size-4" />
                      Open Form
                    </Button>
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
