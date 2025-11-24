import { apiSlice } from "@/shared/store/features/apiSlice";

export const employeeDocumentRequestApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Employee Document Request Queries
    getMyDocumentRequests: builder.query({
      query: ({ page = 1, limit = 10, status = "" }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", page);
        if (limit) params.append("limit", limit);
        if (status) params.append("status", status);

        return {
          url: `/requests${params.toString() ? "?" + params.toString() : ""}`,
          method: "GET",
        };
      },
      providesTags: ["DocumentRequest"],
      transformResponse: (response) => {
        // Response could be an array directly from our API
        return response || [];
      },
      transformErrorResponse: (response) => response.data,
    }),

    getMyDocumentRequestById: builder.query({
      query: (id) => ({
        url: `/requests/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "DocumentRequest", id }],
      transformResponse: (response) => {
        // Return the single document request object
        return response || null;
      },
      transformErrorResponse: (response) => response.data,
    }),

    // Download document from request
    downloadMyDocument: builder.query({
      query: (id) => ({
        url: `/requests/${id}/download`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "DocumentRequest", id }],
      transformErrorResponse: (response) => response.data,
    }),

    // Employee Document Request Mutations
    submitDocumentRequest: builder.mutation({
      query: (documentData) => ({
        url: "/requests",
        method: "POST",
        body: documentData,
      }),
      invalidatesTags: ["DocumentRequest"],
      transformErrorResponse: (response) => response.data,
    }),

    cancelMyDocumentRequest: builder.mutation({
      query: (id) => ({
        url: `/requests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DocumentRequest"],
      transformErrorResponse: (response) => response.data,
    }),
  }),
});

export const {
  // Queries
  useGetMyDocumentRequestsQuery,
  useGetMyDocumentRequestByIdQuery,
  useDownloadMyDocumentQuery,

  // Mutations
  useSubmitDocumentRequestMutation,
  useCancelMyDocumentRequestMutation,
} = employeeDocumentRequestApiSlice;
