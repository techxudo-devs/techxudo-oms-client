import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useListEmploymentFormsQuery } from "@/features/employe/employment/api/employmentApiSlice";

const EMPLOYMENT_STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "pending_review", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export const useEmploymentRecords = () => {
  const [statusFilter, setStatusFilter] = useState("approved");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [debouncedSearch] = useDebounce(searchTerm, 400);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, debouncedSearch]);

  const { data, isFetching, refetch } = useListEmploymentFormsQuery({
    page,
    limit,
    status: statusFilter === "all" ? undefined : statusFilter,
    search: debouncedSearch,
  });

  const payload = data?.data || {};

  return {
    forms: payload.forms || [],
    total: payload.totalCount || 0,
    currentPage: payload.currentPage || page,
    totalPages: payload.totalPages || 1,
    isFetching,
    refetch,
    statusFilter,
    setStatusFilter,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    limit,
    statusOptions: EMPLOYMENT_STATUS_OPTIONS,
  };
};
