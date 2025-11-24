import { apiSlice } from "@/shared/store/features/apiSlice";
export const employeeDocumentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Employee Document Queries
    getEmployeeDocuments: builder.query({
      query: ({ status } = {}) => {
        const params = new URLSearchParams();
        if (status) params.append("status", status);

        return {
          url: `/documents${params.toString() ? "?" + params.toString() : ""}`,
          method: "GET",
        };
      },
      providesTags: ["EmployeeDocument"],
      transformResponse: (response) => {
        // Response has structure: { success: bool, count: number, data: [] }
        return response?.data || [];
      },
      transformErrorResponse: (response) => response.data,
    }),

    getPendingDocuments: builder.query({
      query: () => ({
        url: "/documents/employee/pending",
        method: "GET",
      }),
      providesTags: ["EmployeeDocument"],
      transformResponse: (response) => {
        // Response has structure: { success: bool, count: number, data: [] }
        return response?.data || [];
      },
      transformErrorResponse: (response) => response.data,
    }),

    getEmployeeDocumentById: builder.query({
      query: (id) => ({
        url: `/documents/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "EmployeeDocument", id }],
      transformResponse: (response) => {
        // For single document response, return the document object directly
        return response?.data || response || null;
      },
      transformErrorResponse: (response) => response.data,
    }),

    signDocument: builder.mutation({
      query: ({ id, signatureData }) => ({
        url: `/documents/${id}/sign`,
        method: "POST",
        body: signatureData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "EmployeeDocument", id },
        "EmployeeDocument",
      ],
      transformErrorResponse: (response) => response.data,
    }),

    declineDocument: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/documents/${id}/decline`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "EmployeeDocument", id },
        "EmployeeDocument",
      ],
      transformErrorResponse: (response) => response.data,
    }),
  }),
});

export const {
  // Queries
  useGetEmployeeDocumentsQuery,
  useGetPendingDocumentsQuery,
  useGetEmployeeDocumentByIdQuery,

  // Mutations
  useSignDocumentMutation,
  useDeclineDocumentMutation,
} = employeeDocumentApiSlice;
