import { Link } from "react-router-dom";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegistration } from "@/hooks/useRegistration";
import { cn } from "@/lib/utils";

/**
 * Registration Page
 * Modern split-screen layout with high-polish details.
 */
const RegisterPage = () => {
  const { formData, errors, isLoading, updateField, register } =
    useRegistration();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register();
  };

  return (
    <div className="min-h-screen w-full flex bg-white selection:bg-black selection:text-white">
      {/* --- Left Side: Form Area --- */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-12 xl:px-24 relative z-10">
        <div className="w-full max-w-[440px] space-y-10">
          {/* Header */}
          <div className="space-y-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 group transition-opacity hover:opacity-80"
            >
              <span className="text-lg font-bold tracking-tight text-gray-900">
                Techxudo
              </span>
            </Link>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Create your workspace
              </h1>
              <p className="text-base text-gray-500">
                Start your 30-day free trial. No credit card required.
              </p>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Input Group: Organization & Name */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="companyName"
                  className="text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => updateField("companyName", e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className={cn(
                    "h-11 bg-zinc-50 border-transparent focus:bg-white transition-all duration-200",
                    errors.companyName &&
                      "border-red-500 focus-visible:ring-red-500 bg-red-50/50",
                  )}
                  disabled={isLoading}
                />
                {errors.companyName && (
                  <p className="text-xs text-red-600 font-medium animate-in slide-in-from-top-1">
                    {errors.companyName}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="fullName"
                    className="text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    placeholder="John Doe"
                    className={cn(
                      "h-11 bg-zinc-50 border-transparent focus:bg-white transition-all",
                      errors.fullName && "border-red-500 bg-red-50/50",
                    )}
                    disabled={isLoading}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    Work Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="name@work.com"
                    className={cn(
                      "h-11 bg-zinc-50 border-transparent focus:bg-white transition-all",
                      errors.email && "border-red-500 bg-red-50/50",
                    )}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Input Group: Security */}
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    "h-11 bg-zinc-50 border-transparent focus:bg-white transition-all",
                    errors.password && "border-red-500 bg-red-50/50",
                  )}
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-xs text-red-600 font-medium">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="confirmPassword"
                  className="text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    updateField("confirmPassword", e.target.value)
                  }
                  placeholder="••••••••"
                  className={cn(
                    "h-11 bg-zinc-50 border-transparent focus:bg-white transition-all",
                    errors.confirmPassword && "border-red-500 bg-red-50/50",
                  )}
                  disabled={isLoading}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-red-600 font-medium">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Global Error */}
            {errors.general && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2 text-sm text-red-600 animate-in slide-in-from-top-1">
                <ShieldCheck className="w-4 h-4" />
                {errors.general}
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 space-y-4">
              <Button
                type="submit"
                className="w-full h-11 bg-black hover:bg-zinc-800 text-white shadow-lg shadow-black/10 transition-all active:scale-[0.98] text-sm font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-gray-500 px-4 leading-relaxed">
                By clicking "Create Account", you agree to our{" "}
                <Link to="/terms" className="underline hover:text-gray-900">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="underline hover:text-gray-900">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-gray-900 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* --- Right Side: Visual Feature Area --- */}
      <div className="hidden lg:flex lg:flex-1 relative bg-zinc-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-900 to-black opacity-50" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />

        {/* Abstract Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px]" />

        <div className="relative w-full h-full flex flex-col justify-between p-16 xl:p-24 z-10">
          {/* Top Quote/Badge */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium text-white mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Trusted by 500+ modern teams
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold text-white tracking-tight leading-tight">
              Manage your entire organization{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                in one place.
              </span>
            </h2>
          </div>

          {/* Feature List */}
          <div className="grid gap-6">
            {[
              {
                title: "Lightning Fast",
                desc: "Deployed on edge network for <100ms latency",
              },
              {
                title: "Enterprise Security",
                desc: "SOC2 Type II certified and encrypted data",
              },
              {
                title: "Automated Workflows",
                desc: "Save 20+ hours per week with automation",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="group flex items-start gap-4 p-4 rounded-xl transition-colors hover:bg-white/5 border border-transparent hover:border-white/5"
              >
                <div className="mt-1 h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center border border-zinc-700 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-zinc-400 group-hover:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Stats Grid */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
            {[
              { label: "Uptime", value: "99.9%" },
              { label: "Active Users", value: "10k+" },
              { label: "Countries", value: "150+" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-2xl font-bold text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
