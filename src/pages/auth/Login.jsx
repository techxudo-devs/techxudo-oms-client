import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  AlertCircle,
  Loader2,
  Command,
  ShieldCheck,
} from "lucide-react";
import { useAuthScreen } from "../../shared/hooks/useAuthScreen";
import { LoginForm } from "../../shared/components/auth/LoginForm";
import { cn } from "@/lib/utils"; // Assuming you have a class merger, or just use standard strings

const Login = () => {
  const { formik, isLoading, error } = useAuthScreen();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden selection:bg-black selection:text-white">
      <div className="absolute inset-0 z-0 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="relative z-10 w-full max-w-[450px] px-4">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white shadow-xl shadow-black/10 ring-4 ring-black/5">
            <Command className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-500 max-w-[280px]">
            Enter your credentials to access your organization workspace.
          </p>
        </div>

        {/* Main Card */}
        <div className="group  rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-xl  transition-all hover:shadow-md">
          <div className="p-6 sm:p-8">
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-100 bg-red-50/50 p-3 text-sm text-red-600 animate-in slide-in-from-top-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <LoginForm formik={formik} />
              </div>

              {/* Primary Action */}
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "group relative flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-black px-4 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black/10 focus:ring-offset-2 active:scale-[0.98]",
                  isLoading && "cursor-not-allowed opacity-70",
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-100"></div>
              <span className="text-[11px] font-medium uppercase text-gray-400 tracking-wider">
                Or
              </span>
              <div className="h-px flex-1 bg-gray-100"></div>
            </div>

            {/* Secondary Action */}
            <Link
              to="/register"
              className="flex h-10 w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 active:scale-[0.98]"
            >
              Create new organization
            </Link>
          </div>
        </div>

        {/* Footer / Links */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Forgot your password?
          </Link>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Encrypted & Secure</span>
          </div>
        </div>
      </div>

      {/* Optional: Bottom branding/copyright */}
      <div className="absolute bottom-6 text-[10px] text-gray-400 font-medium">
        © 2024 OMS Platform. All rights reserved.
      </div>
    </div>
  );
};

export default Login;
