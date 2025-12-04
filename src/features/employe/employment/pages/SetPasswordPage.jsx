import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle, Loader2, Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSetPassword } from "../hooks/useSetPassword";

const SetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    formik,
    userData,
    isVerifying,
    isSubmitting,
    submitSucess,
    passwordStrength,
  } = useSetPassword(token);

  const { values, errors, touched, handleChange, handleSubmit } = formik;
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Verifying your account...</p>
        </div>
      </div>
    );
  }

  // Success state
  if (submitSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Password Set Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your account is now active. You can login with your email and
            password.
          </p>
          <Button onClick={() => navigate("/login")} className="w-full">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Invalid token
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div
            className="w-16 h-16 bg-red-100 rounded-full flex items-center 
  justify-center mx-auto mb-4"
          >
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid or Expired Link
          </h2>
          <p className="text-gray-600 mb-6">
            This password setup link is invalid or has expired. Please contact
            your administrator.
          </p>
          <Button variant="outline" onClick={() => navigate("/")}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12">
      <div className="bg-whiter rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Set your password
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome, {userData.name}! Please set a secure password to
          </p>
        </div>

        {/* Form   */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {formik.errors.submit && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm text-center">
              <p className="text-sm text-red-600">{formik.errors.submit}</p>
            </div>
          )}

          {/* Password Field */}
          <div>
            <Label htmlFor="password" className="block mb-2">
              Password
            </Label>

            <div className="relative mt-2">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={values.password}
                onChange={handleChange}
                className={`pr-10 ${
                  error.password && touched.password ? "border-red-600" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && touched.password && (
              <p className="text-sm text-red-600 mt-2">{errors.password}</p>
            )}
            {values.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    Password Strength
                  </span>
                  <span
                    className={`text-xs font-medium ${passwordStrength.color}-600`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>

                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${(passwordStrength.Strength / 5) * 100}`,
                    }}
                    className={`h-2 rounded-full ${passwordStrength.color}-500 tranistion-all duration-500`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <Label htmlFor="confirmPassword" className="block mb-2">
              Confirm Password <span className="text-red-600">*</span>
            </Label>
            <div className="relative mt-2">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={values.confirmPassword}
                onChange={handleChange}
                className={`pr-10 ${
                  errors.confirmPassword && touched.confirmPassword
                    ? "border-red-600"
                    : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="text-sm text-red-600 mt-2">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Password Requirements:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>At least 8 characters long</li>
              <li>Contains uppercase and lowercase letters</li>
              <li>Includes at least one number</li>
              <li>Has at least one special character (@$!%*?&)</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full mt-4"
            disabled={isSubmitting}
            size={"lg"}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Setting Password...
              </>
            ) : (
              "Set Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SetPasswordPage;
