import { useState } from "react";
import { useFormik } from "formik";
import {
  useGetEmploymentFormByTokenQuery,
  useSubmitEmploymentFormMutation,
} from "../api/employmentApiSlice";
import {
  validationSchemas,
  initialValues,
  stepFields,
  transformToApiFormat,
} from "../utils/employmentFormValidation";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

/**
 * useEmploymentForm Hook
 * Manages employment form with Formik + Yup + Cloudinary
 * @param {string} token - Form token
 */
const useEmploymentForm = (token) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadingImages, setUploadingImages] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const steps = [
    { id: "personal", label: "Personal Info" },
    { id: "cnic", label: "CNIC Info" },
    { id: "contact", label: "Contact Info" },
    { id: "address", label: "Address" },
    { id: "policies", label: "Policies" },
  ];

  const {
    data: formResponse,
    isLoading,
    error,
    isError,
  } = useGetEmploymentFormByTokenQuery(token, { skip: !token });
  const [submitForm, { isLoading: isSubmitting }] =
    useSubmitEmploymentFormMutation();

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchemas[currentStep],
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values) => {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        await handleFinalSubmit(values);
      }
    },
  });

  const handleImageUpload = async (file, fieldName) => {
    if (!file) return;

    const uploadType = fieldName.replace("Image", "");

    setUploadingImages((prev) => ({ ...prev, [uploadType]: true }));

    try {
      const result = await uploadToCloudinary(file);

      if (result.success) {
        formik.setFieldValue(fieldName, result.url);
        formik.setFieldError(fieldName, undefined);
      } else {
        formik.setFieldError(fieldName, result.error);
      }
    } catch (error) {
      console.log(error);
      formik.setFieldError(fieldName, "Image Uplaod Again Please Try Again");
    } finally {
      setUploadingImages((prev) => ({ ...prev, [uploadType]: false }));
    }
  };

  const nextStep = async () => {
    const errors = await formik.validateForm();
    const currentFields = stepFields[currentStep];
    const hasErrors = currentFields.some((field) => errors[field]);

    if (hasErrors) {
      const touched = {};
      currentFields.forEach((field) => (touched[field] = true));
      formik.setTouched(touched);
      return;
    }

    setCurrentStep((prev) => prev + 1);
    formik.setValidationSchema(validationSchemas[currentStep + 1]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      formik.setValidationSchema(validationSchemas[currentStep - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Final submission
  const handleFinalSubmit = async (values) => {
    try {
      const submitData = transformToApiFormat(values);
      await submitForm({ token, formData: submitData }).unwrap();
      setSubmitSuccess(true);
      return { success: true };
    } catch (err) {
      console.error("Form submission error:", err);

      // Extract error message from different possible error structures
      let errorMessage = "Failed to submit form. Please try again.";

      if (err?.data?.error) {
        // Backend returned a specific error message
        errorMessage = err.data.error;
      } else if (err?.error) {
        // RTK Query error
        errorMessage = err.error;
      } else if (err?.message) {
        // Standard error object
        errorMessage = err.message;
      }

      // Handle specific error cases with user-friendly messages
      if (err?.status === 404) {
        errorMessage =
          "Employment form not found. The link may be invalid or expired.";
      } else if (err?.status === 409) {
        errorMessage = "This form has already been submitted.";
      } else if (err?.status === 410) {
        errorMessage =
          "This employment form link has expired. Please contact HR for a new link.";
      }

      formik.setFieldError("submit", errorMessage);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return { success: false, error: errorMessage };
    }
  };

  // Policy toggle
  const togglePolicy = (policyId, policyTitle) => {
    const policies = formik.values.acceptedPolicies || [];
    const isAccepted = policies.some((p) => p.policyId === policyId);

    formik.setFieldValue(
      "acceptedPolicies",
      isAccepted
        ? policies.filter((p) => p.policyId !== policyId)
        : [...policies, { policyId, policyTitle, acceptedAt: new Date() }]
    );
  };

  return {
    formik,
    policies: formResponse?.data?.policies || [],
    isLoading,
    isError,
    error,
    isSubmitting,
    uploadingImages,
    submitSuccess,
    currentStep,
    steps,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === steps.length - 1,
    progressPercentage: ((currentStep + 1) / steps.length) * 100,
    handleImageUpload,
    nextStep,
    prevStep,
    togglePolicy,
  };
};

export default useEmploymentForm;
