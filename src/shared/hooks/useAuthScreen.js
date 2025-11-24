import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../store/features/userApiSlice";
import { setCredentials } from "../store/features/authSlice";
import { useAuth } from "./useAuth";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const useAuthScreen = () => {
  const [error, setError] = useState(null);
  const { isAdmin, isEmployee } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // API Mutation
  const [login, { isLoading }] = useLoginMutation();

  // Set default values for development
  const isDevelopment = process.env.NODE_ENV === 'development';
  const defaultEmail = isDevelopment ? "admin@techxudo.com" : "";
  const defaultPassword = isDevelopment ? "Admin@123" : "";

  const formik = useFormik({
    initialValues: {
      email: defaultEmail,
      password: defaultPassword,
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setError(null);
      try {
        const res = await login(values).unwrap();
        if (res) {
          dispatch(setCredentials({ ...res }));

          // Navigate based on role
          if (res.user.role === "admin") {
            navigate("/admin/dashboard");
          } else if (res.user.role === "employee") {
            navigate("/employee/dashboard");
          } else {
            navigate("/");
          }
        }
      } catch (error) {
        setError(error?.data?.error || error.message || "Login Failed");
        console.error("Login Failed", error);
      }
    },
  });

  return {
    formik,
    isLoading,
    error,
    setError,
  };
};
