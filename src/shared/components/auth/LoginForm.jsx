import InputField from "../UI/Forms/InputField";
import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export const LoginForm = ({ formik }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <InputField
        id="email"
        type="email"
        placeholder="Email Address"
        formik={formik}
        icon={Mail}
      />
      <InputField
        id="password"
        type="password"
        placeholder="Password"
        formik={formik}
        icon={Lock}
        showToggle={true}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
      />
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="ml-2 text-gray-600">Remember me</span>
        </label>
        <Link
          to="/forgot-password"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Forgot password?
        </Link>
      </div>
    </>
  );
};
