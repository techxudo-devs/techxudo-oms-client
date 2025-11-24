import { apiSlice } from "../../shared/store/features/apiSlice";

export const adminDocumentRequestApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Admin Document Request Management
    getAdminDocumentRequests: builder.query({
      query: ({ page = 1, limit = 10, status = "", employeeId = "", type = "" }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (status) params.append("status", status);
        if (employeeId) params.append("employeeId", employeeId);
        if (type) params.append("type", type);

        return {
          url: `/requests${params.toString() ? "?" + params.toString() : ""}`,
          method: "GET",
        };
      },
      providesTags: ["DocumentRequest"],
      transformErrorResponse: (response) => response.data,
    }),

    getAdminDocumentRequestById: builder.query({
      query: (id) => ({
        url: `/requests/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "DocumentRequest", id }],
      transformErrorResponse: (response) => response.data,
    }),

    // Generate document from request
    generateDocumentFromAdminRequest: builder.mutation({
      query: ({ id, htmlContent }) => ({
        url: `/requests/${id}/generate`,
        method: "POST",
        body: { htmlContent },
      }),
      invalidatesTags: ["DocumentRequest"],
      transformErrorResponse: (response) => response.data,
    }),

    // Download document from request
    downloadDocumentFromAdminRequest: builder.query({
      query: (id) => ({
        url: `/requests/${id}/download`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "DocumentRequest", id }],
      transformErrorResponse: (response) => response.data,
    }),
  }),
});

export const {
  // Queries
  useGetAdminDocumentRequestsQuery,
  useGetAdminDocumentRequestByIdQuery,
  useDownloadDocumentFromAdminRequestQuery,
  useGenerateDocumentFromAdminRequestMutation,
} = adminDocumentRequestApiSlice;