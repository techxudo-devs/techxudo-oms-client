import React from "react";
import { Eye, EyeOff } from "lucide-react";

const InputField = ({
  id,
  name,
  type,
  placeholder,
  formik,
  icon: Icon,
  showToggle = false,
  showPassword,
  onTogglePassword,
  label,
  ...props
}) => {
  // Support both traditional formik prop and useField hook
  let field, meta, error, touched, fieldProps, blurHandler, fieldValue;

  // Check if we're using Formik with useField hook (when name prop is provided)
  if (name && typeof window !== "undefined") {
    // Check if in browser to avoid SSR issues
    // For OnBoardingForm which uses useField
    try {
      const { useField } = require("formik");
      [field, meta] = useField(name);
      fieldProps = field;
      error = meta.error;
      touched = meta.touched;
      fieldValue = field.value;
      blurHandler = field.onBlur;
    } catch (e) {
      // Fallback for components that don't use formik hook
      fieldProps = { value: "", onChange: () => {}, onBlur: () => {} };
      error = "";
      touched = false;
      fieldValue = "";
      blurHandler = () => {};
    }
  } else if (formik && id) {
    // Traditional formik prop usage (for LoginForm and CreateEmployeeForm)
    const getNestedValue = (obj, path) =>
      path.split(".").reduce((acc, part) => acc && acc[part], obj);

    fieldProps = formik.getFieldProps(id);
    error = getNestedValue(formik.errors, id);
    touched = getNestedValue(formik.touched, id);
    fieldValue = getNestedValue(formik.values, id);
    blurHandler = formik.handleBlur;
  } else {
    // Fallback in case neither is provided
    fieldProps = { value: "", onChange: () => {}, onBlur: () => {} };
    error = "";
    touched = false;
    fieldValue = "";
    blurHandler = () => {};
  }

  const isDateField = type === "date";
  const hasValue = fieldValue;

  let inputType;
  if (showToggle) {
    inputType = showPassword ? "text" : type;
  } else if (isDateField && !hasValue) {
    inputType = "text";
  } else {
    inputType = type;
  }

  return (
    <div className="w-full space-y-2 mb-4">
      {label && (
        <label className="block text-sm  font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute  top-3 left-0 flex items-center pl-4 pointer-events-none">
            <Icon
              className={`h-5 w-5 transition-colors ${
                touched && error ? "text-red-500" : "text-gray-400"
              }`}
            />
          </div>
        )}
        <input
          id={id || name}
          type={inputType}
          placeholder={placeholder}
          {...fieldProps}
          {...props}
          onFocus={(e) => {
            if (isDateField) {
              e.target.type = "date";
            }
            if (props.onFocus) {
              props.onFocus(e);
            }
          }}
          onBlur={(e) => {
            if (isDateField && !e.target.value) {
              e.target.type = "text";
            }
            blurHandler(e);
          }}
          className={`w-full py-2  ${
            Icon ? "pl-11" : "pl-4"
          } pr-4 text-sm bg-gray-100 border rounded-lg outline-none transition-all
            placeholder:text-gray-500
            ${isDateField && !hasValue ? "text-gray-500" : ""}
            ${
              touched && error
                ? "border-red-500 text-red-600 focus:border-red-500"
                : "border-gray-200 text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            }`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute top-3 cursor-pointer right-0 flex items-center pr-4 text-gray-500 hover:text-indigo-600"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {touched && error ? (
        <div className="text-red-600 text-xs mt-1">{error}</div>
      ) : null}
    </div>
  );
};

export default InputField;
