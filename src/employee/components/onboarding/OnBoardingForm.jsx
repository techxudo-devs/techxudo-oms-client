import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useOnboarding } from "../../hooks/useOnboarding";
import InputField from "../../../shared/components/UI/Forms/InputField";
import { FileUploadField } from "../../../shared/components/UI/Forms/FileUploadField";
import { User, Calendar, MapPin, Phone, Link, Lock } from "lucide-react";
import { useField } from "formik";

// Wrapper component to use InputField with Formik's useField hook
const FormikInputField = ({
  name,
  label,
  type = "text",
  placeholder,
  icon: Icon,
}) => {
  const [field, meta] = useField(name);
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute top-3 left-0 flex items-center pl-4 pointer-events-none">
            <Icon
              className={`h-5 w-5 transition-colors ${
                meta.touched && meta.error ? "text-red-500" : "text-gray-400"
              }`}
            />
          </div>
        )}
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...field}
          className={`w-full py-3 ${
            Icon ? "pl-11" : "pl-4"
          } pr-4 text-sm bg-gray-100 border rounded-lg outline-none transition-all
            placeholder:text-gray-500
            ${
              meta.touched && meta.error
                ? "border-red-500 text-red-600 focus:border-red-500"
                : "border-gray-200 text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            }`}
        />
      </div>
      {meta.touched && meta.error ? (
        <div className="text-red-600 text-xs mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export const OnboardingForm = () => {
  const { formConfig, actionState } = useOnboarding();
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome! Let's Get You Set Up
        </h2>
        <p className="text-sm text-gray-600">
          Please complete the form below to activate your account
        </p>
      </div>

      <Formik
        {...formConfig}
        children={({ status, isSubmitting }) => (
          <Form className="space-y-8">
            {/* --- Section: Personal Details --- */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Personal Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploadField name="avatar" label="Profile Picture" />
                <FileUploadField
                  name="cnicImage"
                  label="CNIC / Identity Document"
                />
              </div>
              <div className="mt-6">
                <FormikInputField
                  name="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  icon={Calendar}
                />
              </div>
            </div>

            {/* --- Section: Contact & Emergency --- */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormikInputField
                  name="address.street"
                  label="Street Address"
                  type="text"
                  icon={MapPin}
                />
                <FormikInputField
                  name="address.city"
                  label="City"
                  type="text"
                  icon={MapPin}
                />
                <FormikInputField
                  name="address.country"
                  label="Country"
                  type="text"
                  icon={MapPin}
                />
              </div>
              <h3 className="text-lg font-semibold mt-6 mb-4 border-b pb-2">
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormikInputField
                  name="emergencyContact.name"
                  label="Full Name"
                  type="text"
                  icon={User}
                />
                <FormikInputField
                  name="emergencyContact.relationship"
                  label="Relationship"
                  type="text"
                  icon={User}
                />
                <FormikInputField
                  name="emergencyContact.phone"
                  label="Phone Number"
                  type="text"
                  icon={Phone}
                />
              </div>
            </div>

            {/* --- Section: Social & Security --- */}
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Professional & Security
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormikInputField
                  name="github"
                  label="GitHub Profile URL"
                  type="url"
                  placeholder="https://github.com/your-username"
                  icon={Link}
                />
                <FormikInputField
                  name="linkedin"
                  label="LinkedIn Profile URL"
                  type="url"
                  placeholder="https://linkedin.com/in/your-username"
                  icon={Link}
                />
                <FormikInputField
                  name="password"
                  label="Password"
                  type="password"
                  icon={Lock}
                />
                <FormikInputField
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  icon={Lock}
                />
              </div>
            </div>

            {/* --- Submission --- */}
            {status && status.error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                {status.error}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting || actionState.isCompleting}
              className="w-full py-3 mt-6 font-semibold text-white bg-brand-primary rounded-lg
                hover:bg-brand-dark focus:outline-none flex items-center justify-center cursor-pointer
                focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary
                transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl
                disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting || actionState.isCompleting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Finalizing Your Account...
                </>
              ) : (
                "Complete Onboarding"
              )}
            </button>
          </Form>
        )}
      />
    </div>
  );
};
