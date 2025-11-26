import { apiSlice } from "@/shared/store/features/apiSlice";

export const employeeSalaryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Employee: Get my salary history
    getMySalaryHistory: builder.query({
      query: (params) => ({
        url: "/salary/my-history",
        params
      }),
      providesTags: ["MySalaryHistory"]
    }),

    // Employee: Get current month salary
    getMyCurrentSalary: builder.query({
      query: () => "/salary/my-current",
      providesTags: ["MyCurrentSalary"]
    }),

    // Employee: Get salary summary
    getMySalarySummary: builder.query({
      query: (params) => ({
        url: "/salary/my-summary",
        params
      }),
      providesTags: ["MySalarySummary"]
    }),

    // Employee: Acknowledge salary
    acknowledgeSalary: builder.mutation({
      query: (id) => ({
        url: `/salary/acknowledge/${id}`,
        method: "POST"
      }),
      invalidatesTags: ["MySalaryHistory", "MyCurrentSalary"]
    }),

    // Employee: Export my salary (returns download URL)
    exportMySalary: builder.query({
      query: (params) => ({
        url: "/salary/my-export",
        params,
        responseHandler: "content-type"
      })
    })
  })
});

export const {
  useGetMySalaryHistoryQuery,
  useGetMyCurrentSalaryQuery,
  useGetMySalarySummaryQuery,
  useAcknowledgeSalaryMutation,
  useLazyExportMySalaryQuery
} = employeeSalaryApiSlice;
