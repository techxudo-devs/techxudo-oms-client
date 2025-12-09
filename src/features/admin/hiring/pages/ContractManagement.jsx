import {
  FileText,
  Send,
  CheckCircle,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import useManageContracts from "../hooks/useManageContracts";
import ContractDetailsModal from "../components/ContractDetailModal";
import { format } from "date-fns";

const ContractManagementPage = () => {
  const navigate = useNavigate();
  const {
    contracts,
    pagination,
    statistics,
    selectedContract,
    isLoading,
    isFetching,
    isLoadingDetails,
    isSending,
    filters,
    statusOptions,
    updateFilter,
    viewContract,
    closeDetails,
    handleSendContract,
    refetch,
    nextPage,
    prevPage,
  } = useManageContracts();

  // Status badge component
  const StatusBadge = ({ status }) => {
    const config = {
      draft: {
        icon: FileText,
        bg: "bg-gray-100",
        text: "text-gray-700",
        label: "Draft",
      },
      sent: {
        icon: Send,
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Sent",
      },
      signed: {
        icon: CheckCircle,
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Signed",
      },
      expired: {
        icon: AlertCircle,
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Expired",
      },
    };

    const { icon: Icon, bg, text, label } = config[status] || config.draft;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs 
  font-medium ${bg} ${text}`}
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
          <p className="text-gray-600">Loading contracts...</p>
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
            Contract Management
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage employment contracts
          </p>
        </div>
        <div className="flex gap-2">
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
          <Button onClick={() => navigate("/admin/hiring/contracts/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Create Contract
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
        <div className="bg-gray-50 rounded-lg shadow p-4">
          <p className="text-sm text-gray-700">Draft</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {statistics.draft}
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-4">
          <p className="text-sm text-blue-700">Sent</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {statistics.sent}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <p className="text-sm text-green-700">Signed</p>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {statistics.signed}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4">
          <p className="text-sm text-red-700">Expired</p>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {statistics.expired}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow">
        {contracts.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No contracts found</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract._id}>
                    <TableCell>
                      <div>
                        <p
                          className="text-sm font-medium 
  text-gray-900"
                        >
                          {contract.employeeName}
                        </p>
                        <p
                          className="text-sm 
  text-gray-500"
                        >
                          {contract.employeeEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell
                      className="text-sm 
  text-gray-900"
                    >
                      {contract.contractDetails?.position || "N/A"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {contract.contractDetails?.startDate
                        ? format(
                            new Date(contract.contractDetails.startDate),
                            "MMM dd, yyyy"
                          )
                        : "N/A"}
                    </TableCell>

                    <TableCell className="text-sm text-gray-600">
                      {contract.createdAt
                        ? format(new Date(contract.createdAt), "MMM dd, yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={contract.status} />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewContract(contract._id)}
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
            <div
              className="bg-gray-50 px-6 py-4 flex items-center justify-between 
  border-t"
            >
              <div className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}(
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
      <ContractDetailsModal
        open={!!selectedContract}
        onClose={closeDetails}
        contract={selectedContract}
        isLoading={isLoadingDetails}
        onSend={handleSendContract}
        isSending={isSending}
      />
    </div>
  );
};

export default ContractManagementPage;
