import { apiSlice } from "../../shared/store/features/apiSlice";

export const documentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Document Templates
    getDocumentTemplates: builder.query({
      query: () => ({
        url: "/documents/templates",
        method: "GET",
      }),
      providesTags: ["DocumentTemplate"],
      transformErrorResponse: (response) => response.data,
    }),

    getDocumentTemplateById: builder.query({
      query: (id) => ({
        url: `/documents/templates/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "DocumentTemplate", id }],
      transformErrorResponse: (response) => response.data,
    }),

    createDocumentTemplate: builder.mutation({
      query: (newTemplate) => ({
        url: "/documents/templates",
        method: "POST",
        body: newTemplate,
      }),
      invalidatesTags: ["DocumentTemplate"],
      transformErrorResponse: (response) => response.data,
    }),

    updateDocumentTemplate: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/documents/templates/${id}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "DocumentTemplate", id },
        "DocumentTemplate",
      ],
      transformErrorResponse: (response) => response.data,
    }),

    deleteDocumentTemplate: builder.mutation({
      query: (id) => ({
        url: `/documents/templates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DocumentTemplate"],
      transformErrorResponse: (response) => response.data,
    }),

    // Documents
    getDocuments: builder.query({
      query: ({ status } = {}) => {
        const params = new URLSearchParams();
        if (status) params.append("status", status);

        return {
          url: `/documents${params.toString() ? "?" + params.toString() : ""}`,
          method: "GET",
        };
      },
      providesTags: ["Document"],
      transformErrorResponse: (response) => response.data,
    }),

    getDocumentById: builder.query({
      query: (id) => ({
        url: `/documents/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Document", id }],
      transformErrorResponse: (response) => response.data,
    }),

    createDocumentFromTemplate: builder.mutation({
      query: (documentData) => ({
        url: "/documents/generate",
        method: "POST",
        body: documentData,
      }),
      invalidatesTags: ["Document"],
      transformErrorResponse: (response) => response.data,
    }),

    uploadDocument: builder.mutation({
      query: (documentData) => ({
        url: "/documents/upload",
        method: "POST",
        body: documentData,
      }),
      invalidatesTags: ["Document"],
      transformErrorResponse: (response) => response.data,
    }),

    resendDocument: builder.mutation({
      query: (id) => ({
        url: `/documents/${id}/resend`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Document", id },
        "Document",
      ],
      transformErrorResponse: (response) => response.data,
    }),

    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `/documents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Document"],
      transformErrorResponse: (response) => response.data,
    }),
  }),
});

export const {
  // Template queries/mutations
  useGetDocumentTemplatesQuery,
  useGetDocumentTemplateByIdQuery,
  useCreateDocumentTemplateMutation,
  useUpdateDocumentTemplateMutation,
  useDeleteDocumentTemplateMutation,

  // Document queries/mutations
  useGetDocumentsQuery,
  useGetDocumentByIdQuery,
  useCreateDocumentFromTemplateMutation,
  useUploadDocumentMutation,
  useResendDocumentMutation,
  useDeleteDocumentMutation,
} = documentApiSlice;
