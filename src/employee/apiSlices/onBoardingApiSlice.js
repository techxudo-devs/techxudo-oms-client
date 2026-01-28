import { apiSlice } from "../../shared/store/features/apiSlice";

export const onBoardingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOnboardingDetails: builder.query({
      query: (token) => `/onboarding/${token}`,
      providesTags: ["Onboarding"],
    }),
    acceptOffer: builder.mutation({
      query: (token) => ({
        url: `/onboarding/${token}/accept`,
        method: "POST",
      }),
      invalidatesTags: ["Onboarding"],
    }),
    rejectOffer: builder.mutation({
      query: ({ token, reason }) => ({
        url: `/onboarding/${token}/reject`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: ["Onboarding"],
    }),
    completeOnboarding: builder.mutation({
      query: ({ token, data }) => ({
        url: `/onboarding/${token}/complete`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Onboarding"],
    }),
    ensureEmploymentForm: builder.mutation({
      query: (token) => ({
        url: `/onboarding/${token}/employment-form`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetOnboardingDetailsQuery,
  useAcceptOfferMutation,
  useRejectOfferMutation,
  useCompleteOnboardingMutation,
  useEnsureEmploymentFormMutation,
} = onBoardingApiSlice;
