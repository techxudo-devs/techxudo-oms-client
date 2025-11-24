import { apiSlice } from "../../shared/store/features/apiSlice";

export const adminLeaveApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Leave Requests
    getLeaveRequests: builder.query({
      query: ({ page = 1, limit = 10, status = "", employeeId = "", startDate = "", endDate = "", search = "" }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (status) params.append("status", status);
        if (employeeId) params.append("employeeId", employeeId);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        if (search) params.append("search", search);

        return {
          url: `/leaves${params.toString() ? "?" + params.toString() : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Leave"],
      transformErrorResponse: (response) => response.data,
    }),

    updateLeaveStatus: builder.mutation({
      query: ({ id, status, comments }) => ({
        url: `/leaves/${id}/status`,
        method: "PUT",
        body: { status, comments },
      }),
      invalidatesTags: ["Leave"],
      transformErrorResponse: (response) => response.data,
    }),

    getLeaveRequestById: builder.query({
      query: (id) => ({
        url: `/leaves/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Leave", id }],
      transformErrorResponse: (response) => response.data,
    }),
  }),
});

export const {
  // Queries
  useGetLeaveRequestsQuery,
  useGetLeaveRequestByIdQuery,
  useUpdateLeaveStatusMutation,
} = adminLeaveApiSlice;