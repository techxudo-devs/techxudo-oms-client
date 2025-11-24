import { apiSlice } from "@/shared/store/features/apiSlice";

export const employeeLeaveApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Employee Leave Queries
    getMyLeaveRequests: builder.query({
      query: ({ page = 1, limit = 10, status = "" }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (status) params.append("status", status);

        return {
          url: `/leaves${params.toString() ? "?" + params.toString() : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Leave"],
      transformResponse: (response) => {
        // Response could be an array directly from our API
        return response || [];
      },
      transformErrorResponse: (response) => response.data,
    }),

    getMyLeaveBalance: builder.query({
      query: () => ({
        url: "/leaves/balance",
        method: "GET",
      }),
      providesTags: ["Leave"],
      transformErrorResponse: (response) => response.data,
    }),

    getMyLeaveRequestById: builder.query({
      query: (id) => ({
        url: `/leaves/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Leave", id }],
      transformResponse: (response) => {
        // Return the single leave request object
        return response || null;
      },
      transformErrorResponse: (response) => response.data,
    }),

    // Employee Leave Mutations
    submitLeaveRequest: builder.mutation({
      query: (leaveData) => ({
        url: "/leaves",
        method: "POST",
        body: leaveData,
      }),
      invalidatesTags: ["Leave"],
      transformErrorResponse: (response) => response.data,
    }),

    cancelMyLeaveRequest: builder.mutation({
      query: (id) => ({
        url: `/leaves/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Leave"],
      transformErrorResponse: (response) => response.data,
    }),
  }),
});

export const {
  // Queries
  useGetMyLeaveRequestsQuery,
  useGetMyLeaveBalanceQuery,
  useGetMyLeaveRequestByIdQuery,

  // Mutations
  useSubmitLeaveRequestMutation,
  useCancelMyLeaveRequestMutation,
} = employeeLeaveApiSlice;