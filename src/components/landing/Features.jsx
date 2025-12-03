import { Clock, DollarSign, FileText, Shield, TrendingUp, Users } from "lucide-react";

/**
 * Features section with minimalistic design
 */
const Features = () => {
  const features = [
    {
      icon: Users,
      title: "Employee Management",
      description: "Complete employee lifecycle from onboarding to performance reviews",
    },
    {
      icon: Clock,
      title: "Smart Attendance",
      description: "Real-time tracking with QR code, geolocation, and automatic reports",
    },
    {
      icon: DollarSign,
      title: "Payroll Automation",
      description: "Automated salary calculation with tax deductions and allowances",
    },
    {
      icon: FileText,
      title: "Leave Management",
      description: "Streamlined leave requests, approvals, and balance tracking",
    },
    {
      icon: TrendingUp,
      title: "Advanced Analytics",
      description: "Insights into team productivity, attendance patterns, and costs",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption, role-based access, and audit logs",
    },
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to manage your team
          </h2>
          <p className="text-lg text-gray-600">
            Powerful features designed for modern workplaces
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="mb-4 inline-flex p-3 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
                <feature.icon className="h-6 w-6 text-gray-900" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
