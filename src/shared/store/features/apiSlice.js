import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./authSlice";
import { toast } from "sonner";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.userInfo?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Custom base query with 401 error handling
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized errors (but not for login endpoint)
  if (result.error && result.error.status === 401) {
    // Get the endpoint URL
    const url = typeof args === 'string' ? args : args.url;

    console.error("401 Error detected at:", url, result.error);

    // Skip redirect for login endpoint - let the login page handle the error
    if (url !== '/auth/login') {
      // Show session expired toast
      toast.error("Session Expired", {
        description: "Your session has expired. Please login again.",
        duration: 3000,
      });

      // Dispatch logout action
      api.dispatch(logout());

      // Redirect to login page
      window.location.href = "/login";
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Employee",
    "Document",
    "DocumentTemplate",
    "EmployeeDocument",
    "Leave",
    "DocumentRequest",
    "Organization",
    "HiringApplications",
  ],
  endpoints: (builder) => ({}),
});
