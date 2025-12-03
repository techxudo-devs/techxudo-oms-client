import { apiSlice } from "@/shared/store/features/apiSlice";

/**
 * Admin Hiring API Slice
 * Manages appointment letters, employment forms, and contracts from admin side
 */
export const hiringApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ============ Appointment Letters (Admin) ============

    // Create and send appointment letter
    createAppointment: builder.mutation({
      query: (data) => ({
        url: "/appointments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Appointments"],
    }),

    // List all appointments
    listAppointments: builder.query({
      query: (params) => ({
        url: "/appointments",
        params, // status, page, limit
      }),
      providesTags: ["Appointments"],
    }),

    // Get single appointment details
    getAppointmentById: builder.query({
      query: (id) => `/appointments/${id}`,
      providesTags: (result, error, id) => [{ type: "Appointment", id }],
    }),

    // ============ Employment Forms (Admin) ============

    // List all employment forms
    listEmploymentForms: builder.query({
      query: (params) => ({
        url: "/employment-forms",
        params, // status, page, limit
      }),
      providesTags: ["EmploymentForms"],
    }),

    // Get employment form details
    getEmploymentFormById: builder.query({
      query: (id) => `/employment-forms/${id}`,
      providesTags: (result, error, id) => [{ type: "EmploymentForm", id }],
    }),

    // Review employment form (approve/reject)
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

    // ============ Contracts (Admin) ============

    // Create contract
    createContract: builder.mutation({
      query: (data) => ({
        url: "/contracts",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Contracts"],
    }),

    // List all contracts
    listContracts: builder.query({
      query: (params) => ({
        url: "/contracts",
        params, // status, page, limit
      }),
      providesTags: ["Contracts"],
    }),

    // Get contract details
    getContractById: builder.query({
      query: (id) => `/contracts/${id}`,
      providesTags: (result, error, id) => [{ type: "Contract", id }],
    }),

    // ============ Statistics ============

    // Get hiring dashboard stats
    getHiringStats: builder.query({
      query: () => "/hiring/stats",
      providesTags: ["HiringStats"],
    }),
  }),
});

export const {
  // Appointments
  useCreateAppointmentMutation,
  useListAppointmentsQuery,
  useGetAppointmentByIdQuery,

  // Employment Forms
  useListEmploymentFormsQuery,
  useGetEmploymentFormByIdQuery,
  useReviewEmploymentFormMutation,

  // Contracts
  useCreateContractMutation,
  useListContractsQuery,
  useGetContractByIdQuery,

  // Stats
  useGetHiringStatsQuery,
} = hiringApiSlice;
