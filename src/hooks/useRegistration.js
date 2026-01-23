import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { extractApiError } from "@/shared/utils/error";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/shared/store/features/authSlice";

export const useRegistration = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  // Update form field
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    } else if (formData.companyName.length < 2) {
      newErrors.companyName = "Company name must be at least 2 characters";
    } else if (!/^[a-zA-Z0-9\s&.-]+$/.test(formData.companyName)) {
      newErrors.companyName = "Only letters, numbers, spaces, & . - allowed";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit registration
  const register = async () => {
    if (!validate()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/organization/register`,
        {
          companyName: formData.companyName,
          ownerName: formData.fullName,
          ownerEmail: formData.email,
          ownerPassword: formData.password,
          planSlug: "free",
        },
      );

      // Persist auth in Redux (and localStorage via slice)
      const owner = response?.data?.data?.owner;
      if (owner?.token) {
        dispatch(
          setCredentials({
            token: owner.token,
            id: owner.id,
            email: owner.email,
            fullName: owner.fullName,
          })
        );
      }

      toast.success("Welcome! Let's set up your workspace");

      // Redirect to dashboard; Setup wizard modal will guide completion
      navigate("/admin/dashboard", { replace: true });

      return true;
    } catch (error) {
      console.error("Registration error:", error);

      const { message, fieldErrors } = extractApiError(error);

      // Merge field errors into current errors
      setErrors((prev) => ({
        ...prev,
        ...fieldErrors,
        general: message,
      }));

      // Prefer showing first field error if available
      const firstFieldMsg = Object.values(fieldErrors)[0];
      toast.error(firstFieldMsg || message);

      // Focus first errored field if present
      if (fieldErrors.companyName) {
        document.getElementById("companyName")?.focus();
      } else if (fieldErrors.fullName) {
        document.getElementById("fullName")?.focus();
      } else if (fieldErrors.email) {
        document.getElementById("email")?.focus();
      } else if (fieldErrors.password) {
        document.getElementById("password")?.focus();
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const reset = () => {
    setFormData({
      companyName: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    isLoading,
    updateField,
    register,
    reset,
  };
};
