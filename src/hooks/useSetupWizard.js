import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/shared/store/features/authSlice";
import {
  useGetCurrentOrganizationQuery,
  useCompleteSetupMutation,
} from "@/shared/store/features/organizationApiSlice";

/**
 * Custom hook for managing multi-step company setup wizard
 * Handles state, validation, API calls, and navigation
 */
const useSetupWizard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});

  // RTK Query hooks
  const { data: organizationData, isLoading } = useGetCurrentOrganizationQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }
  );
  const [completeSetup, { isLoading: isSaving }] = useCompleteSetupMutation();

  // Form data for all steps
  const [formData, setFormData] = useState({
    // Step 1: Company Info
    companyName: "",
    slug: "",
    logo: null,
    logoPreview: null,
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    contactInfo: {
      phone: "",
      email: "",
      website: "",
    },

    // Step 2: Branding
    theme: {
      primaryColor: "#000000",
      secondaryColor: "#6B7280",
      accentColor: "#3B82F6",
      darkMode: false,
    },

    // Step 3: Departments
    departments: [],

    // Step 4: Working Hours
    workingHours: {
      timezone: "UTC",
      startTime: "09:00",
      endTime: "17:00",
      workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    },

    // Step 5: Signature Authority
    signatureAuthority: {
      authorityType: "single",
      requiredSignatures: 1,
    },

    // Step 6: Policies
    policies: [],
  });

  const steps = [
    {
      id: "company-info",
      label: "Company Info",
      description: "Basic information about your company",
    },
    {
      id: "branding",
      label: "Branding",
      description: "Customize your workspace theme",
    },
    {
      id: "departments",
      label: "Departments",
      description: "Organize your teams",
    },
    {
      id: "working-hours",
      label: "Working Hours",
      description: "Set your schedule",
    },
    {
      id: "signature",
      label: "Signature",
      description: "Configure approval process",
    },
    { id: "policies", label: "Policies", description: "Add company policies" },
    { id: "review", label: "Review", description: "Review and complete setup" },
  ];

  // Load organization data when query succeeds
  useEffect(() => {
    if (organizationData?.data) {
      const org = organizationData.data;

      // Populate form with existing data
      setFormData((prev) => ({
        ...prev,
        companyName: org.companyName || "",
        slug: org.slug || "",
        address: org.address || prev.address,
        contactInfo: org.contactInfo || prev.contactInfo,
        theme: org.theme || prev.theme,
        departments: org.departments || [],
        workingHours: org.workingHours || prev.workingHours,
        signatureAuthority: org.signatureAuthority || prev.signatureAuthority,
        policies: org.policies || [],
      }));

      // If setup is already completed, redirect to dashboard
      if (org.setupCompleted) {
        const dashboardPath =
          org.owner?.userId?.role === "admin"
            ? "/admin/dashboard"
            : "/employee/dashboard";
        navigate(dashboardPath);
      }
    }
  }, [organizationData, navigate]);

  // Update form field
  const updateField = useCallback(
    (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      // Clear error for this field
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Update nested field (e.g., address.city)
  const updateNestedField = useCallback(
    (parent, field, value) => {
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [field]: value,
        },
      }));
      // Clear error
      const errorKey = `${parent}.${field}`;
      if (errors[errorKey]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[errorKey];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Validation per step
  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 0: // Company Info
        if (!formData.companyName.trim()) {
          newErrors.companyName = "Company name is required";
        }
        if (!formData.slug.trim()) {
          newErrors.slug = "Company slug is required";
        } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
          newErrors.slug =
            "Slug must contain only lowercase letters, numbers, and hyphens";
        }
        if (!formData.address.city.trim()) {
          newErrors["address.city"] = "City is required";
        }
        if (!formData.address.country.trim()) {
          newErrors["address.country"] = "Country is required";
        }
        if (!formData.contactInfo.email.trim()) {
          newErrors["contactInfo.email"] = "Email is required";
        } else if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactInfo.email)
        ) {
          newErrors["contactInfo.email"] = "Invalid email format";
        }
        break;

      case 1: // Branding
        if (
          !formData.theme.primaryColor ||
          !/^#[0-9A-F]{6}$/i.test(formData.theme.primaryColor)
        ) {
          newErrors.primaryColor = "Invalid primary color";
        }
        if (
          !formData.theme.secondaryColor ||
          !/^#[0-9A-F]{6}$/i.test(formData.theme.secondaryColor)
        ) {
          newErrors.secondaryColor = "Invalid secondary color";
        }
        if (
          !formData.theme.accentColor ||
          !/^#[0-9A-F]{6}$/i.test(formData.theme.accentColor)
        ) {
          newErrors.accentColor = "Invalid accent color";
        }
        break;

      case 2: // Departments
        if (formData.departments.length === 0) {
          newErrors.departments = "Add at least one department";
        }
        break;

      case 3: // Working Hours
        if (!formData.workingHours.timezone) {
          newErrors.timezone = "Timezone is required";
        }
        if (!formData.workingHours.startTime) {
          newErrors.startTime = "Start time is required";
        }
        if (!formData.workingHours.endTime) {
          newErrors.endTime = "End time is required";
        }
        if (formData.workingHours.workingDays.length === 0) {
          newErrors.workingDays = "Select at least one working day";
        }
        break;

      case 4: // Signature
        if (!formData.signatureAuthority.authorityType) {
          newErrors.signatureType = "Signature type is required";
        }
        if (formData.signatureAuthority.requiredSignatures < 1) {
          newErrors.requiredSignatures = "At least one signature is required";
        }
        break;

      case 5: // Policies
        // Validate policies if any exist (no duplicate titles, valid content)
        if (formData.policies && formData.policies.length > 0) {
          const policyTitles = [];
          for (let i = 0; i < formData.policies.length; i++) {
            const policy = formData.policies[i];

            if (!policy.title || !policy.title.trim()) {
              newErrors[`policy.${i}.title`] = `Policy ${
                i + 1
              } title is required`;
            } else if (
              policyTitles.includes(policy.title.toLowerCase().trim())
            ) {
              newErrors[
                `policy.${i}.title`
              ] = `Duplicate policy title: ${policy.title}`;
            } else {
              policyTitles.push(policy.title.toLowerCase().trim());
            }

            if (!policy.content || !policy.content.trim()) {
              newErrors[`policy.${i}.content`] = `Policy ${
                i + 1
              } content is required`;
            }
          }
        }
        break;

      case 6: // Review
        // Final validation before submission
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigate to next step
  const nextStep = useCallback(() => {
    // Validate current step

    // Validation passed - clear errors and move to next step
    setErrors({});
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, steps.length]);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  // Jump to specific step
  const goToStep = useCallback(
    (stepIndex) => {
      if (stepIndex >= 0 && stepIndex < steps.length) {
        setCurrentStep(stepIndex);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [steps.length]
  );

  // Complete setup
  const handleCompleteSetup = async () => {
    try {
      // Prepare complete setup data
      const setupData = {
        companyName: formData.companyName,
        slug: formData.slug,
        logo: formData.logo, // Cloudinary URL
        address: formData.address,
        contactInfo: formData.contactInfo,
        theme: formData.theme,
        departments: formData.departments,
        workingHours: formData.workingHours,
        signatureAuthority: formData.signatureAuthority,
        policies: formData.policies,
      };

      const response = await completeSetup(setupData).unwrap();

      // Update Redux with new token (setupCompleted: true)
      if (response.data?.token) {
        dispatch(setCredentials({ token: response.data.token }));
      }

      // Navigate to admin dashboard after setup completion
      // During initial setup, the user completing setup is always the admin/owner
      navigate("/admin/dashboard", {
        state: { message: "Company setup completed successfully!" },
      });
    } catch (error) {
      console.error("Setup completion failed:", error);
      setErrors({
        submit:
          error?.data?.message || "Failed to complete setup. Please try again.",
      });
    }
  };

  return {
    // State
    currentStep,
    steps,
    formData,
    errors,
    isLoading,
    isSaving,

    // Progress
    totalSteps: steps.length,
    progressPercentage: ((currentStep + 1) / steps.length) * 100,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,

    // Actions
    updateField,
    updateNestedField,
    nextStep,
    prevStep,
    goToStep,
    completeSetup: handleCompleteSetup,
    validateStep,
  };
};

export default useSetupWizard;
