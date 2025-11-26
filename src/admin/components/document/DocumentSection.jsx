import React from "react";
import { FileUp, FilePlus2, Send, Trash2, FileText, User, Calendar, Pin } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const DocumentSection = ({
  documents,
  isLoading,
  filters,
  setFilters,
  onDelete,
  onResend,
  onCreate,
  onUpload,
}) => {
  // This function now handles the special "all" value.
  const handleFilterChange = (value) => {
    // If the user selects the item with value "all", we set the actual filter state to an empty string.
    // Otherwise, we use the selected value directly.
    setFilters({ ...filters, status: value === "all" ? "" : value });
  };

  const getStatusBadgeVariant = (status) => {
    switch (status.toLowerCase()) {
      case "signed":
        return "success";
      case "viewed":
        return "secondary";
      case "rejected":
        return "destructive"
      case "declined":
        return "destructive";
      default:
        return "warning";
    }
  };

  return (
    <div className="bg-white rounded-2xl">
      {/* Header */}
      <div className="py-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-medium text-gray-900 flex items-center gap-2">
              <Pin className="h-5 w-5 text-brand-primary" />
              Sent Documents
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {documents.length} {documents.length === 1 ? 'document' : 'documents'} sent
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={filters.status || "all"}
              onValueChange={handleFilterChange}
            >
              <SelectTrigger className="w-[160px] h-10">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="viewed">Viewed</SelectItem>
                <SelectItem value="signed">Signed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={onCreate} className="h-10">
              <FilePlus2 className="w-4 h-4 mr-2" /> Create
            </Button>
            <Button onClick={onUpload} className="h-10">
              <FileUp className="w-4 h-4 mr-2" /> Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-3 border-brand-primary border-t-transparent"></div>
            <span className="mt-4 text-sm text-gray-600">Loading documents...</span>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-base font-semibold text-gray-900 mb-1">No documents found</h4>
            <p className="text-sm text-gray-500 mb-4">
              Create or upload a document to get started
            </p>
            <div className="flex items-center gap-2 justify-center">
              <Button variant="outline" onClick={onCreate} size="sm">
                <FilePlus2 className="w-4 h-4 mr-2" /> Create Document
              </Button>
              <Button onClick={onUpload} size="sm">
                <FileUp className="w-4 h-4 mr-2" /> Upload Document
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Document</TableHead>
                  <TableHead className="font-semibold">Recipient</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Last Updated</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc._id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-900">{doc.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{doc.sentTo?.fullName || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(doc.status)}>
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(doc.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onResend(doc._id)}
                          className="group cursor-pointer relative p-2 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all"
                          title="Resend document"
                        >
                          <Send size={20} />
                          <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            Resend
                          </span>
                        </button>
                        <button
                          onClick={() => onDelete(doc._id)}
                          className="group cursor-pointer relative p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all"
                          title="Delete document"
                        >
                          <Trash2 size={20} />
                          <span className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            Delete
                          </span>
                        </button>
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

export default DocumentSection;
