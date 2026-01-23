import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/shared/store/features/authSlice";
import {
  useGetCurrentOrganizationQuery,
  useCompleteSetupMutation,
} from "@/shared/store/features/organizationApiSlice";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
} from "@/utils/setupStorage";

/**
 * Custom hook for managing multi-step company setup wizard
 * Handles state, validation, API calls, and navigation
 */
const useSetupWizard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const draftRestoredRef = useRef(false);

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
    // Step 5: Documents (uploads + gallery selections)
    documents: [], // { name, type, url }

    // Step 6: Email Settings
    emailSettings: {
      fromName: "",
      fromEmail: "",
      headerColor: "#000000",
      footerText: "",
      templateStyle: "modern", // modern | minimal
    },
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
    { id: "documents", label: "Documents", description: "Upload or select templates" },
    { id: "email", label: "Email", description: "Set email theme and template" },
    { id: "review", label: "Review", description: "Review and complete setup" },
  ];

  // On mount: restore draft from localStorage if available; otherwise hydrate from server
  useEffect(() => {
    if (draftRestoredRef.current) return;

    const draft = loadFromLocalStorage();
    if (draft && draft.formData) {
      draftRestoredRef.current = true;
      setFormData((prev) => ({ ...prev, ...draft.formData }));
      if (typeof draft.currentStep === "number") {
        setCurrentStep(draft.currentStep);
      }
      return; // don't override with server data on this mount
    }

    if (organizationData?.data && !draftRestoredRef.current) {
      const org = organizationData.data;
      setFormData((prev) => ({
        ...prev,
        companyName: org.companyName || "",
        slug: org.slug || "",
        address: org.address || prev.address,
        contactInfo: org.contactInfo || prev.contactInfo,
        theme: org.theme || prev.theme,
        departments: org.departments || [],
        workingHours: org.workingHours || prev.workingHours,
        documents: org.documents || [],
        emailSettings: org.emailSettings || prev.emailSettings,
      }));

      if (org.setupCompleted) {
        const dashboardPath =
          org.owner?.userId?.role === "admin"
            ? "/admin/dashboard"
            : "/employee/dashboard";
        navigate(dashboardPath);
      }
    }
  }, [organizationData, navigate]);

  // Persist helper
  const persistDraft = useCallback(
    (dataOverride) => {
      const payload = {
        currentStep,
        formData: dataOverride || formData,
      };
      saveToLocalStorage(payload);
    },
    [currentStep, formData]
  );

  // Update form field
  const updateField = useCallback(
    (field, value) => {
      setFormData((prev) => {
        const next = { ...prev, [field]: value };
        // Persist immediately
        saveToLocalStorage({ currentStep, formData: next });
        return next;
      });
      // Clear error for this field
      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors, currentStep]
  );

  // Update nested field (e.g., address.city)
  const updateNestedField = useCallback(
    (parent, field, value) => {
      setFormData((prev) => {
        const next = {
          ...prev,
          [parent]: {
            ...prev[parent],
            [field]: value,
          },
        };
        saveToLocalStorage({ currentStep, formData: next });
        return next;
      });
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
    [errors, currentStep]
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

      case 4: // Documents
        // Optional; if provided, ensure name and url
        if (Array.isArray(formData.documents)) {
          formData.documents.forEach((doc, i) => {
            if (!doc.name || !doc.name.trim()) {
              newErrors[`documents.${i}.name`] = "Document name is required";
            }
            if (!doc.url || !doc.url.trim()) {
              newErrors[`documents.${i}.url`] = "Please upload or provide a URL";
            }
          });
        }
        break;

        case 5: // Email
          if (!formData.emailSettings.fromName.trim()) {
            newErrors["emailSettings.fromName"] = "From name is required";
          }
          if (!formData.emailSettings.fromEmail.trim()) {
            newErrors["emailSettings.fromEmail"] = "From email is required";
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailSettings.fromEmail)) {
            newErrors["emailSettings.fromEmail"] = "Invalid email format";
          }
          if (!/^#[0-9A-F]{6}$/i.test(formData.emailSettings.headerColor)) {
            newErrors["emailSettings.headerColor"] = "Invalid header color";
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
    const ok = validateStep(currentStep);
    if (!ok) return;

    // Persist current draft before moving
    persistDraft();

    // Move to next
    setErrors({});
    if (currentStep < steps.length - 1) {
      const nextIndex = currentStep + 1;
      setCurrentStep(nextIndex);
      // Persist step change
      saveToLocalStorage({ currentStep: nextIndex, formData });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, steps.length, formData, validateStep, persistDraft]);

  // Navigate to previous step
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      const prevIndex = currentStep - 1;
      setCurrentStep(prevIndex);
      saveToLocalStorage({ currentStep: prevIndex, formData });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep, formData]);

  // Jump to specific step
  const goToStep = useCallback(
    (stepIndex) => {
      if (stepIndex >= 0 && stepIndex < steps.length) {
        setCurrentStep(stepIndex);
        saveToLocalStorage({ currentStep: stepIndex, formData });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [steps.length, formData]
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
        documents: formData.documents,
        emailSettings: formData.emailSettings,
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

      // Clear any saved draft after successful completion
      clearLocalStorage();
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
    saveDraft: () => saveToLocalStorage({ currentStep, formData }),
  };
};

export default useSetupWizard;
