import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  FileSignature,
  XCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";

const DocumentList = ({
  documents,
  isLoading,
  statusFilter,
  setStatusFilter,
}) => {
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "pending":
        return "outline";
      case "signed":
        return "default";
      case "declined":
        return "destructive";
      case "completed":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "signed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "declined":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDocumentActions = (document) => {
    const actions = [];

    if (document.status === "pending") {
      actions.push(
        <Link key="sign-link" to={`/employee/documents/${document._id}/sign`}>
          <Button
            key="sign"
            variant="default"
            size="sm"
            className="flex items-center gap-1"
          >
            <FileSignature className="h-4 w-4" />
            Sign
          </Button>
        </Link>,
        <Link
          key="decline-link"
          to={`/employee/documents/${document._id}/sign`}
        >
          <Button
            key="decline"
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <XCircle className="h-4 w-4" />
            Decline
          </Button>
        </Link>
      );
    }

    actions.push(
      <Link key="view-link" to={`/employee/documents/${document._id}/sign`}>
        <Button
          key="view"
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
      </Link>
    );

    return actions;
  };

  const filteredDocuments = statusFilter
    ? documents.filter((doc) => doc.status === statusFilter)
    : documents;

  return (
    <div className="bg-white rounded-xl border border-gray-200/60 shadow-sm">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Document List</h3>
            <p className="text-sm text-gray-500 mt-1">
              {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'} found
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                statusFilter === null
                  ? "bg-brand-primary text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                statusFilter === "pending"
                  ? "bg-brand-primary text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("signed")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                statusFilter === "signed"
                  ? "bg-brand-primary text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Signed
            </button>
            <button
              onClick={() => setStatusFilter("declined")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                statusFilter === "declined"
                  ? "bg-brand-primary text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Declined
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-brand-primary border-t-transparent"></div>
            <span className="mt-4 text-sm text-gray-600">Loading documents...</span>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileSignature className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-base font-semibold text-gray-900 mb-1">No documents found</h4>
            <p className="text-sm text-gray-500">
              {statusFilter ? `No ${statusFilter} documents available.` : "You don't have any documents yet."}
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Document Name</TableHead>
                  <TableHead className="font-semibold">Created Date</TableHead>
                  <TableHead className="font-semibold">Due Date</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((document) => (
                  <TableRow key={document._id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {document.title || document.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {document.createdAt
                        ? new Date(document.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {document.dueDate
                        ? new Date(document.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(document.status)}
                        <Badge variant={getStatusBadgeVariant(document.status)}>
                          {document.status.charAt(0).toUpperCase() +
                            document.status.slice(1)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {getDocumentActions(document)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentList;
