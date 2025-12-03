import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCreateAppointmentMutation } from "../api/hiringApiSlice";

/**
 * Hook for creating and sending appointment letters
 * Business logic separated from UI
 */
const useCreateAppointment = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createAppointment, { isLoading: isSubmitting }] =
    useCreateAppointmentMutation();

  // Validation schema
  const validationSchema = Yup.object({
    candidateName: Yup.string()
      .required("Candidate name is required")
      .min(2, "Name must be at least 2 characters"),
    candidateEmail: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
    position: Yup.string()
      .required("Position is required")
      .min(2, "Position must be at least 2 characters"),
    department: Yup.string().required("Department is required"),
    joiningDate: Yup.date()
      .required("Joining date is required")
      .min(new Date(), "Joining date must be in the future"),
    salary: Yup.number()
      .required("Salary is required")
      .positive("Salary must be positive")
      .integer("Salary must be a whole number"),
    employmentType: Yup.string()
      .required("Employment type is required")
      .oneOf(
        ["full-time", "part-time", "contract", "internship"],
        "Invalid employment type"
      ),
    probationPeriod: Yup.number()
      .min(0, "Probation period cannot be negative")
      .max(12, "Probation period cannot exceed 12 months"),
    benefits: Yup.array().of(Yup.string()),
    workLocation: Yup.string().required("Work location is required"),
    reportingTo: Yup.string(),
    additionalTerms: Yup.string(),
  });

  // Initial form values
  const initialValues = {
    candidateName: "",
    candidateEmail: "",
    position: "",
    department: "",
    joiningDate: "",
    salary: "",
    employmentType: "full-time",
    probationPeriod: 3,
    benefits: [],
    workLocation: "",
    reportingTo: "",
    additionalTerms: "",
  };

  // Formik setup
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        await createAppointment(values).unwrap();
        setSubmitSuccess(true);
        formik.resetForm();
      } catch (err) {
        formik.setFieldError(
          "submit",
          err.data?.message || "Failed to create appointment letter"
        );
      }
    },
  });

  // Helper to add benefit
  const addBenefit = (benefit) => {
    if (benefit && !formik.values.benefits.includes(benefit)) {
      formik.setFieldValue("benefits", [...formik.values.benefits, benefit]);
    }
  };

  // Helper to remove benefit
  const removeBenefit = (benefit) => {
    formik.setFieldValue(
      "benefits",
      formik.values.benefits.filter((b) => b !== benefit)
    );
  };

  // Reset success state
  const resetSuccess = () => {
    setSubmitSuccess(false);
  };

  return {
    formik,
    isSubmitting,
    submitSuccess,
    addBenefit,
    removeBenefit,
    resetSuccess,
  };
};

export default useCreateAppointment;
