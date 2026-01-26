import {
  User,
  Mail,
  Briefcase,
  DollarSign,
  Phone,
  Building2,
  Calendar,
} from "lucide-react";
import InputField from "../../../shared/components/UI/Forms/InputField";
import useCreateEmployee from "../../hooks/useCreateEmployee";

/**
 * CreateEmployeeForm Component
 * Pure UI component for creating new employees
 * Receives all logic from useCreateEmployee hook
 */
const CreateEmployeeForm = ({ onSuccess }) => {
  const { formik, isLoading } = useCreateEmployee(onSuccess);

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      {/* Grid Layout for Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-2">
        {/* Full Name */}
        <InputField
          id="fullName"
          type="text"
          placeholder="Full Name *"
          formik={formik}
          icon={User}
        />

        {/* Email */}
        <InputField
          id="email"
          type="email"
          placeholder="Email Address *"
          formik={formik}
          icon={Mail}
        />

        {/* Designation */}
        <InputField
          id="designation"
          type="text"
          placeholder="Designation *"
          formik={formik}
          icon={Briefcase}
        />

        {/* Salary */}
        <InputField
          id="salary"
          type="number"
          placeholder="Salary (PKR) *"
          formik={formik}
          icon={DollarSign}
        />

        {/* Phone */}
        <InputField
          id="phone"
          type="tel"
          placeholder="Phone Number *"
          formik={formik}
          icon={Phone}
        />

        {/* Department (Optional) */}
        <InputField
          id="department"
          type="text"
          placeholder="Department (Optional)"
          formik={formik}
          icon={Building2}
        />

        {/* Joining Date (Optional) */}
        <div className="md:col-span-2">
          <InputField
            id="joiningDate"
            type="date"
            placeholder="Joining Date (Optional)"
            formik={formik}
            icon={Calendar}
          />
        </div>
      </div>

      {/* Info Text */}
      <div className="bg-accent/10 border border-accent rounded-lg p-4">
        <p className="text-sm" style={{ color: "var(--accent-foreground)" }}>
          <strong>Note:</strong> An offer letter will be automatically sent to
          the employee's email address. The employee will need to accept the
          offer and complete their profile to activate their account.
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => formik.resetForm()}
          disabled={isLoading}
          className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={isLoading || !formik.isValid}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Sending Offer...</span>
            </>
          ) : (
            <>
              <Mail className="h-5 w-5" />
              <span>Send Offer Letter</span>
            </>
          )}
        </button>
      </div>

      {/* Required Fields Note */}
      <p className="text-xs text-gray-500 text-center">
        Fields marked with * are required
      </p>
    </form>
  );
};

export default CreateEmployeeForm;
