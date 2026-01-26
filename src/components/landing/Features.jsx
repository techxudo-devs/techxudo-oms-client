import {
  Clock,
  DollarSign,
  FileText,
  Shield,
  TrendingUp,
  Users,
  Zap,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Features Section
 * Clean grid layout with high-contrast hover states
 */
const Features = () => {
  const features = [
    {
      icon: Users,
      title: "Employee Lifecycle",
      description:
        "Manage the entire journey from smooth onboarding to performance reviews and offboarding.",
    },
    {
      icon: Clock,
      title: "Smart Attendance",
      description:
        "GPS-fenced check-ins, QR codes, and biometric integration for precise time tracking.",
    },
    {
      icon: DollarSign,
      title: "Payroll Automation",
      description:
        "Run payroll in seconds. Automatically calculates taxes, benefits, and deductions.",
    },
    {
      icon: FileText,
      title: "Leave Management",
      description:
        "Customizable leave policies with multi-level approval workflows and calendar sync.",
    },
    {
      icon: BarChart3,
      title: "People Analytics",
      description:
        "Real-time insights into attrition, attendance trends, and workforce costs.",
    },
    {
      icon: Shield,
      title: "Enterprise Grade",
      description:
        "SOC2 Type II ready with role-based access control (RBAC) and audit logs.",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 relative bg-gray-50/50 overflow-hidden"
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      ></div>

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20 space-y-4">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
            Everything you need to run a
            <span className="text-gray-400"> modern team.</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Replace your fragmented tools with a single operating system
            designed for performance and scale.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 bg-white rounded-2xl border border-gray-200/60 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon Container - Inverts on hover */}
              <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center mb-6 text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
                <feature.icon className="h-6 w-6 stroke-[1.5px]" />
              </div>

              {/* Text Content */}
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                  {feature.description}
                </p>
              </div>

              {/* Subtle Decorator */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="h-2 w-2 rounded-full bg-gray-900" />
              </div>
            </div>
          ))}
        </div>

        {/* Optional Bottom CTA or Badge */}
      </div>
    </section>
  );
};

export default Features;
