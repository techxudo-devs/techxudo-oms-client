import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

/**
 * Custom hook for organization registration
 * Separates business logic from UI
 */
export const useRegistration = () => {
  const navigate = useNavigate();
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
        }
      );

      // Check if response has token
      if (response.data.data?.owner?.token) {
        localStorage.setItem("token", response.data.data.owner.token);
      }

      toast.success("Welcome! Let's set up your workspace");

      // Navigate to setup
      setTimeout(() => {
        navigate("/setup");
      }, 500);

      return true;
    } catch (error) {
      console.error("Registration error:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";

      // Set general error for display
      setErrors({ general: errorMessage });

      toast.error(errorMessage);

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
