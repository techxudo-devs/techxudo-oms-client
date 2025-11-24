import { apiSlice } from "../../shared/store/features/apiSlice";

export const employeeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Employee Management Endpoints
    createEmployee: builder.mutation({
      query: (details) => ({
        url: `/onboarding/create-employee`,
        method: "POST",
        body: details,
      }),
      invalidatesTags: ["Employee"],
    }),
    getEmployees: builder.query({
      query: ({ page = 1, limit = 10, search = "", role = "" }) => ({
        url: `/users`,
        params: { page, limit, search, role },
      }),
      providesTags: ["Employee"],
    }),
    getEmployeeById: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Employee", id }],
    }),
    updateEmployee: builder.mutation({
      query: ({ id, ...details }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: details,
      }),
      invalidatesTags: ["Employee"],
    }),
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employee"],
    }),
    blockEmployee: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/block`,
        method: "POST",
      }),
      invalidatesTags: ["Employee"],
    }),
    unblockEmployee: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/unblock`,
        method: "POST",
      }),
      invalidatesTags: ["Employee"],
    }),

    // Onboarding Management Endpoints
    getOnboardingStatus: builder.query({
      query: ({ page = 1, limit = 10, status = "" }) => ({
        url: `/onboarding/admin/status`,
        params: { page, limit, status },
      }),
      providesTags: ["Employee"],
    }),
    revokeOnboarding: builder.mutation({
      query: ({ id, reason }) => ({
        url: `/onboarding/${id}/revoke`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["Employee"],
    }),
    resendOffer: builder.mutation({
      query: (id) => ({
        url: `/onboarding/${id}/resend`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCreateEmployeeMutation,
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useBlockEmployeeMutation,
  useUnblockEmployeeMutation,
  useGetOnboardingStatusQuery,
  useRevokeOnboardingMutation,
  useResendOfferMutation,
} = employeeApiSlice;
