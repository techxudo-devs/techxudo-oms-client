import { apiSlice } from "@/shared/store/features/apiSlice";

export const attendanceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Employee Endpoints
    checkIn: builder.mutation({
      query: (data) => ({
        url: "/attendance/check-in",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["MyAttendance", "MyTodayAttendance", "MyStats"]
    }),

    checkOut: builder.mutation({
      query: (data) => ({
        url: "/attendance/check-out",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["MyAttendance", "MyTodayAttendance", "MyStats"]
    }),

    getMyTodayAttendance: builder.query({
      query: () => "/attendance/my-today",
      providesTags: ["MyTodayAttendance"]
    }),

    getMyAttendance: builder.query({
      query: (params) => ({
        url: "/attendance/my-attendance",
        params
      }),
      providesTags: ["MyAttendance"]
    }),

    getMyStats: builder.query({
      query: (params) => ({
        url: "/attendance/my-stats",
        params
      }),
      providesTags: ["MyStats"]
    }),

    requestCorrection: builder.mutation({
      query: (data) => ({
        url: "/attendance/request-correction",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["MyAttendance", "MyCorrectionRequests"]
    }),

    getMyCorrectionRequests: builder.query({
      query: (params) => ({
        url: "/attendance/my-requests",
        params
      }),
      providesTags: ["MyCorrectionRequests"]
    })
  })
});

export const {
  useCheckInMutation,
  useCheckOutMutation,
  useGetMyTodayAttendanceQuery,
  useGetMyAttendanceQuery,
  useGetMyStatsQuery,
  useRequestCorrectionMutation,
  useGetMyCorrectionRequestsQuery
} = attendanceApiSlice;
