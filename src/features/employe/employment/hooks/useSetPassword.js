import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useSetEmployeePasswordMutation,
  useVerifyTokenMutation,
} from "../api/employmentApiSlice";

export const useSetPassword = (token) => {
  const [SetPassword, { isLoading, isSuccess, isError, error }] =
    useSetEmployeePasswordMutation();

  const [submitSucess, setSubmitSuccess] = useState(false);

  const {
    data: tokenResponse,
    isLoading: isVerifying,
    isError: isTokenError,
  } = useVerifyTokenMutation(token);

  const userData = tokenResponse?.data || null;

  const validationSchema = Yup.object({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(
        /[@$!%*?&]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await SetPassword({ token, password: values.password }).unwrap();
        setSubmitSuccess(true);
      } catch (err) {
        formik.setFieldError(
          "submit",
          err.data?.message || "Failed to set password"
        );
      }
    },
  });

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[@$!%*?&]/.test(password)) strength += 1;

    const config = {
      0: { label: "Very Weak", color: "red" },
      1: { label: "Weak", color: "orange" },
      2: { label: "Fair", color: "yellow" },
      3: { label: "Good", color: "blue" },
      4: { label: "Strong", color: "green" },
      5: { label: "Very Strong", color: "darkgreen" },
    };

    return { strength, ...config[strength] };
  };

  const passwordStrength = getPasswordStrength(formik.values.password);
  return {
    formik,
    userData,
    isVerifying,
    isSubmitting,
    submitSucess,
    isTokenError,
    passwordStrength,
  };
};
