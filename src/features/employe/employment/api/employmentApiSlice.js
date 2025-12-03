import { apiSlice } from "@/shared/store/features/apiSlice";

export const employmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppointmentByToken: builder.query({
      query: (token) => `/appointments/view/${token}`,
      providesTags: (result, error, token) => [
        { type: "Appointment", id: token },
      ],
    }),

    respondToAppointment: builder.mutation({
      query: ({ token, action }) => ({
        url: `/appointments/respond/${token}`,
        method: "POST",
        body: { action },
      }),
      invalidatesTags: (result, error, { token }) => [
        { type: "Appointment", id: token },
      ],
    }),

    createAppointment: builder.mutation({
      query: (data) => ({
        url: "/appointments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Appointments"],
    }),

    // List all appointments (admin)
    listAppointments: builder.query({
      query: () => "/appointments",
      providesTags: ["Appointments"],
    }),

    // ============ Employment Form Endpoints ============

    // Get employment form by token (public)
    getEmploymentFormByToken: builder.query({
      query: (token) => `/employment-forms/view/${token}`,
      providesTags: (result, error, token) => [
        { type: "EmploymentForm", id: token },
      ],
    }),

    // Submit employment form (public)
    submitEmploymentForm: builder.mutation({
      query: ({ token, formData }) => ({
        url: `/employment-forms/submit/${token}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { token }) => [
        { type: "EmploymentForm", id: token },
        "EmploymentForms",
      ],
    }),

    // Create employment form link (admin)
    createEmploymentForm: builder.mutation({
      query: (data) => ({
        url: "/employment-forms",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["EmploymentForms"],
    }),

    // List all employment forms (admin)
    listEmploymentForms: builder.query({
      query: () => "/employment-forms",
      providesTags: ["EmploymentForms"],
    }),

    // Review employment form (admin)
    reviewEmploymentForm: builder.mutation({
      query: ({ id, status, feedback }) => ({
        url: `/employment-forms/${id}/review`,
        method: "PUT",
        body: { status, feedback },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "EmploymentForm", id },
        "EmploymentForms",
      ],
    }),

    // ============ Contract Endpoints ============

    // Get contract by token (public)
    getContractByToken: builder.query({
      query: (token) => `/contracts/view/${token}`,
      providesTags: (result, error, token) => [{ type: "Contract", id: token }],
    }),

    // Sign contract (public)
    signContract: builder.mutation({
      query: ({ token, signatureData }) => ({
        url: `/contracts/sign/${token}`,
        method: "POST",
        body: signatureData,
      }),
      invalidatesTags: (result, error, { token }) => [
        { type: "Contract", id: token },
        "Contracts",
      ],
    }),

    // Create contract (admin)
    createContract: builder.mutation({
      query: (data) => ({
        url: "/contracts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Contracts"],
    }),

    // List all contracts (admin)
    listContracts: builder.query({
      query: () => "/contracts",
      providesTags: ["Contracts"],
    }),

    // ============ Password Setup Endpoint ============

    // Set password after contract signed
    setEmployeePassword: builder.mutation({
      query: ({ token, password }) => ({
        url: `/auth/set-password/${token}`,
        method: "POST",
        body: { password },
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  // Appointment Letter hooks
  useGetAppointmentByTokenQuery,
  useRespondToAppointmentMutation,
  useCreateAppointmentMutation,
  useListAppointmentsQuery,

  // Employment Form hooks
  useGetEmploymentFormByTokenQuery,
  useSubmitEmploymentFormMutation,
  useCreateEmploymentFormMutation,
  useListEmploymentFormsQuery,
  useReviewEmploymentFormMutation,

  // Contract hooks
  useGetContractByTokenQuery,
  useSignContractMutation,
  useCreateContractMutation,
  useListContractsQuery,

  // Password setup hook
  useSetEmployeePasswordMutation,
} = employmentApiSlice;
