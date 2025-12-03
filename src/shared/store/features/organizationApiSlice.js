import { apiSlice } from "./apiSlice";

export const organizationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Register new organization
    registerOrganization: builder.mutation({
      query: (data) => ({
        url: "/organization/register",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Organization"],
    }),

    // Get current organization
    getCurrentOrganization: builder.query({
      query: () => "/organization/current",
      providesTags: ["Organization"],
    }),

    // Update organization
    updateOrganization: builder.mutation({
      query: (data) => ({
        url: "/organization/current",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Organization"],
    }),

    // Complete organization setup
    completeSetup: builder.mutation({
      query: (data) => ({
        url: "/organization/setup/complete",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Organization"],
    }),

    // Get organization stats
    getOrganizationStats: builder.query({
      query: () => "/organization/stats",
      providesTags: ["Organization"],
    }),
  }),
});

export const {
  useRegisterOrganizationMutation,
  useGetCurrentOrganizationQuery,
  useUpdateOrganizationMutation,
  useCompleteSetupMutation,
  useGetOrganizationStatsQuery,
} = organizationApiSlice;
