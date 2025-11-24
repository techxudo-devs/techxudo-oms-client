import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useCreateEmployeeMutation } from "../apiSlices/employeeApiSlice";
/**
 * Custom hook for employee creation form logic
 * Handles form state, validation, and API mutation
 */
const useCreateEmployee = (onSuccess) => {
  const [createEmployee, { isLoading, isError, error, isSuccess }] =
    useCreateEmployeeMutation();

  // Validation schema matching backend requirements
  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must not exceed 100 characters")
      .required("Full name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    designation: Yup.string()
      .min(2, "Designation must be at least 2 characters")
      .max(100, "Designation must not exceed 100 characters")
      .required("Designation is required"),
    salary: Yup.number()
      .positive("Salary must be a positive number")
      .integer("Salary must be a whole number")
      .min(1, "Salary must be at least 1")
      .required("Salary is required"),
    phone: Yup.string()
      .matches(
        /^(\+92|0)?[0-9]{10}$/,
        "Phone number must be valid (e.g., +92-300-1234567 or 03001234567)"
      )
      .required("Phone number is required"),
    department: Yup.string().max(
      100,
      "Department must not exceed 100 characters"
    ),
    joiningDate:
      Yup.date()
      .nullable(),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      designation: "",
      salary: "",
      phone: "",
      department: "",
      joiningDate: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        // Prepare data for API (remove empty optional fields)
        const employeeData = {
          fullName: values.fullName.trim(),
          email: values.email.trim().toLowerCase(),
          designation: values.designation.trim(),
          salary: Number(values.salary),
          phone: values.phone.trim(),
        };

        // Add optional fields only if provided
        if (values.department?.trim()) {
          employeeData.department = values.department.trim();
        }

        if (values.joiningDate) {
          employeeData.joiningDate = values.joiningDate;
        }

        // Call API
        const response = await createEmployee(employeeData).unwrap();

        // Success handling
        toast.success(response.message || "Offer letter sent successfully!", {
          description: `Onboarding email sent to ${employeeData.email}`,
          duration: 5000,
        });

        // Reset form
        resetForm();

        // Call success callback if provided
        if (onSuccess) {
          onSuccess(response.data);
        }
      } catch (err) {
        // Error handling
        const errorMessage =
          err?.data?.error ||
          err?.message ||
          "Failed to create employee. Please try again.";

        toast.error("Error Creating Employee", {
          description: errorMessage,
          duration: 5000,
        });

        console.error("Create employee error:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return {
    formik,
    isLoading: isLoading || formik.isSubmitting,
    isError,
    error,
    isSuccess,
  };
};

export default useCreateEmployee;
