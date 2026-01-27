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
    getApplication: builder.query({
      query: (id) => ({ url: `/hiring/applications/${id}` }),
      providesTags: (res, err, id) => [{ type: "HiringApplications", id }],
    }),
    moveStage: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/hiring/applications/${id}/move`,
        method: "PUT",
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
      query: ({ applicationId, type, subject, message, reason, interview }) => ({
        url: `/hiring/applications/${applicationId}/email`,
        method: "POST",
        body: { type, subject, message, reason, interview },
      }),
    }),
    addNote: builder.mutation({
      query: ({ id, content, isPrivate = false }) => ({
        url: `/hiring/applications/${id}/notes`,
        method: "POST",
        body: { content, isPrivate },
      }),
      invalidatesTags: (r, e, { id }) => [{ type: "HiringApplications", id }],
    }),
    scheduleInterview: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/hiring/applications/${id}/schedule-interview`,
        method: "POST",
        body,
      }),
      invalidatesTags: (r, e, { id }) => [{ type: "HiringApplications", id }],
    }),
    updateInterviewFeedback: builder.mutation({
      query: ({ id, interviewId, ...body }) => ({
        url: `/hiring/applications/${id}/interviews/${interviewId}/feedback`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (r, e, { id }) => [{ type: "HiringApplications", id }],
    }),
    deleteApplication: builder.mutation({
      query: (id) => ({ url: `/hiring/applications/${id}`, method: "DELETE" }),
      invalidatesTags: ["HiringApplications"],
    }),
    getHiringStats: builder.query({
      query: () => ({ url: "/hiring/stats" }),
      providesTags: ["HiringApplications"],
    }),
  }),
});

export const {
  useListApplicationsQuery,
  useGetApplicationQuery,
  useMoveStageMutation,
  useCreateCandidateMutation,
  useSendEmailMutation,
  useAddNoteMutation,
  useScheduleInterviewMutation,
  useUpdateInterviewFeedbackMutation,
  useDeleteApplicationMutation,
  useGetHiringStatsQuery,
} = hiringApiSlice;
