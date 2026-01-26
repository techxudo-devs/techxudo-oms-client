import { apiSlice } from "./apiSlice";

export const documentTemplateApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Preview branded HTML for a template type
    previewBrandedTemplate: builder.query({
      // Accept optional branding overrides for setup: { type, branding: { companyName, logo, theme: { primaryColor, secondaryColor, accentColor } } }
      query: ({ type, branding }) => {
        const params = new URLSearchParams({ type });
        if (branding) {
          if (branding.companyName) params.set("companyName", branding.companyName);
          if (branding.logo) params.set("logo", branding.logo);
          if (branding.theme?.primaryColor) params.set("primary", branding.theme.primaryColor);
          if (branding.theme?.secondaryColor) params.set("secondary", branding.theme.secondaryColor);
          if (branding.theme?.accentColor) params.set("accent", branding.theme.accentColor);
        }
        return {
          url: `/documents/templates/preview?${params.toString()}`,
          method: "GET",
        };
      },
    }),

    // Generate branded PDF and upload (returns URL)
    generateBrandedTemplate: builder.mutation({
      // Accept optional branding overrides via body.branding
      query: ({ type, variables = {}, fileName, branding }) => ({
        url: "/documents/templates/generate",
        method: "POST",
        body: { type, variables, fileName, branding },
      }),
      invalidatesTags: ["Organization", "Document"],
    }),

    // Create editable template from branded type
    createEditableFromBranded: builder.mutation({
      query: ({ type, name }) => ({
        url: "/documents/templates/create-from-branded",
        method: "POST",
        body: { type, name },
      }),
      invalidatesTags: ["DocumentTemplate"],
    }),

    // Update a template content/name
    updateTemplate: builder.mutation({
      query: ({ id, body }) => ({
        url: `/documents/templates/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["DocumentTemplate"],
    }),
  }),
});

export const {
  usePreviewBrandedTemplateQuery,
  useLazyPreviewBrandedTemplateQuery,
  useGenerateBrandedTemplateMutation,
  useCreateEditableFromBrandedMutation,
  useUpdateTemplateMutation,
} = documentTemplateApiSlice;
