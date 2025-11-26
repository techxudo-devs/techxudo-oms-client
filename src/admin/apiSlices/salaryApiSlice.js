import { apiSlice } from "@/shared/store/features/apiSlice";

export const salaryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Admin: Get all salary history with filters
    getAllSalaries: builder.query({
      query: (params) => ({
        url: "/salary/admin/all",
        params
      }),
      providesTags: ["AllSalaries"]
    }),

    // Admin: Get salary statistics
    getSalaryStatistics: builder.query({
      query: (params) => ({
        url: "/salary/admin/statistics",
        params
      }),
      providesTags: ["SalaryStatistics"]
    }),

    // Admin: Get salary by ID
    getSalaryById: builder.query({
      query: (id) => `/salary/admin/${id}`,
      providesTags: (result, error, id) => [{ type: "Salary", id }]
    }),

    // Admin: Create salary entry
    createSalary: builder.mutation({
      query: (data) => ({
        url: "/salary/admin/create",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["AllSalaries", "SalaryStatistics"]
    }),

    // Admin: Update salary entry
    updateSalary: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/salary/admin/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: (result, error, { id }) => [
        "AllSalaries",
        { type: "Salary", id },
        "SalaryStatistics"
      ]
    }),

    // Admin: Delete salary entry
    deleteSalary: builder.mutation({
      query: (id) => ({
        url: `/salary/admin/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["AllSalaries", "SalaryStatistics"]
    }),

    // Admin: Lock salary entry
    lockSalary: builder.mutation({
      query: (id) => ({
        url: `/salary/admin/${id}/lock`,
        method: "POST"
      }),
      invalidatesTags: (result, error, id) => [
        "AllSalaries",
        { type: "Salary", id }
      ]
    }),

    // Admin: Bulk generate salaries
    bulkGenerateSalaries: builder.mutation({
      query: (data) => ({
        url: "/salary/admin/bulk-generate",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["AllSalaries", "SalaryStatistics"]
    }),

    // Admin: Export all salaries (returns download URL)
    exportAllSalaries: builder.query({
      query: (params) => ({
        url: "/salary/admin/export",
        params,
        responseHandler: "content-type"
      })
    })
  })
});

export const {
  useGetAllSalariesQuery,
  useGetSalaryStatisticsQuery,
  useGetSalaryByIdQuery,
  useCreateSalaryMutation,
  useUpdateSalaryMutation,
  useDeleteSalaryMutation,
  useLockSalaryMutation,
  useBulkGenerateSalariesMutation,
  useLazyExportAllSalariesQuery
} = salaryApiSlice;
