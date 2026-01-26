import { apiSlice } from "@/shared/store/features/apiSlice";

export const hiringApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listApplications: builder.query({
      query: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return { url: `/hiring/applications${qs ? `?${qs}` : ""}` };
      },
      providesTags: ["HiringApplications"],
    }),
    moveStage: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/hiring/applications/${id}/move`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["HiringApplications"],
    }),
    createCandidate: builder.mutation({
      query: (body) => ({
        url: "/hiring/candidates",
        method: "POST",
        body,
      }),
      invalidatesTags: ["HiringApplications"],
    }),
    sendEmail: builder.mutation({
      query: ({ applicationId, subject, message, to }) => ({
        url: `/hiring/applications/${applicationId}/email`,
        method: "POST",
        body: { subject, message, to },
      }),
    }),
  }),
});

export const {
  useListApplicationsQuery,
  useMoveStageMutation,
  useCreateCandidateMutation,
  useSendEmailMutation,
} = hiringApiSlice;
