import React from "react";
import { Briefcase } from "lucide-react";
import { useAuthScreen } from "../../shared/hooks/useAuthScreen";
import { LoginForm } from "../../shared/components/auth/LoginForm";

const Login = () => {
  const { formik, isLoading, error } = useAuthScreen();

  return (
    <div className="min-h-screen bg-white text-gray-900 flex justify-center">
      <div className="max-w-8xl bg-slate-50 shadow-xl sm:rounded-3xl flex justify-center flex-1">
        {/* Left Side - Branding */}
        <div className="flex-1 text-center h-screen  hidden lg:flex relative overflow-hidden sm:rounded-l-3xl">
          <img
            src="/auth-screen.png"
            alt="Techxudo Login"
            className="object-contain"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 xl:w-5/12 w-1/1 flex items-center justify-center p-6 sm:p-12">
          <div className="flex flex-col items-center w-full max-w-sm">
            {/* Header */}
            <div className="text-center">
              <div className="-translate-y-10">
                <img src="/av.svg" alt="Logo.webp" className="w-60" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-sm text-gray-600">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Form */}
            <div className="w-full flex-1 mt-8">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <form onSubmit={formik.handleSubmit}>
                <LoginForm formik={formik} />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 mt-6 font-semibold text-white bg-brand-primary rounded-lg
                    hover:bg-brand-dark focus:outline-none flex items-center justify-center cursor-pointer
                    focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary
                    transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl
                    disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <p className="mt-8 text-sm text-gray-600 text-center">
                Need help accessing your account?
                <a
                  href="/forgot-password"
                  className="font-semibold text-brand-primary hover:underline ml-1 cursor-pointer focus:outline-none"
                >
                  Contact Admin
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
