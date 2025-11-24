import { apiSlice } from "@/shared/store/features/apiSlice";

export const manageAttendanceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // QR Code
    generateQRCode: builder.query({
      query: () => "/attendance/admin/generate-qr"
    }),

    // Attendance Management
    getAllAttendance: builder.query({
      query: (params) => ({
        url: "/attendance/admin/all",
        params
      }),
      providesTags: ["AllAttendance"]
    }),

    getEmployeeAttendance: builder.query({
      query: ({ userId, ...params }) => ({
        url: `/attendance/admin/employee/${userId}`,
        params
      }),
      providesTags: ["EmployeeAttendance"]
    }),

    manualAttendanceEntry: builder.mutation({
      query: (data) => ({
        url: "/attendance/admin/manual-entry",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["AllAttendance", "DashboardStats", "DailyReport"]
    }),

    updateAttendance: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/attendance/admin/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["AllAttendance", "EmployeeAttendance", "DashboardStats"]
    }),

    deleteAttendance: builder.mutation({
      query: (id) => ({
        url: `/attendance/admin/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["AllAttendance", "DashboardStats", "DailyReport"]
    }),

    // Reports
    getDailyReport: builder.query({
      query: (params) => ({
        url: "/attendance/admin/reports/daily",
        params
      }),
      providesTags: ["DailyReport"]
    }),

    getWeeklyReport: builder.query({
      query: (params) => ({
        url: "/attendance/admin/reports/weekly",
        params
      }),
      providesTags: ["WeeklyReport"]
    }),

    getMonthlyReport: builder.query({
      query: (params) => ({
        url: "/attendance/admin/reports/monthly",
        params
      }),
      providesTags: ["MonthlyReport"]
    }),

    // Statistics
    getDashboardStats: builder.query({
      query: () => "/attendance/admin/statistics/dashboard",
      providesTags: ["DashboardStats"]
    }),

    // Correction Requests
    getCorrectionRequests: builder.query({
      query: (params) => ({
        url: "/attendance/admin/corrections",
        params
      }),
      providesTags: ["CorrectionRequests"]
    }),

    reviewCorrectionRequest: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/attendance/admin/corrections/${id}`,
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["CorrectionRequests", "AllAttendance", "DashboardStats"]
    }),

    // Settings
    getSettings: builder.query({
      query: () => "/attendance/admin/settings",
      providesTags: ["AttendanceSettings"]
    }),

    updateSettings: builder.mutation({
      query: (data) => ({
        url: "/attendance/admin/settings",
        method: "PUT",
        body: data
      }),
      invalidatesTags: ["AttendanceSettings"]
    })
  })
});

export const {
  useGenerateQRCodeQuery,
  useGetAllAttendanceQuery,
  useGetEmployeeAttendanceQuery,
  useManualAttendanceEntryMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
  useGetDailyReportQuery,
  useGetWeeklyReportQuery,
  useGetMonthlyReportQuery,
  useGetDashboardStatsQuery,
  useGetCorrectionRequestsQuery,
  useReviewCorrectionRequestMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation
} = manageAttendanceApiSlice;
