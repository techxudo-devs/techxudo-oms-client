import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Minimalistic pricing section
 * Only Free plan is available for demo
 */
const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "0",
      period: "forever",
      description: "Perfect for trying out the platform",
      features: [
        "Up to 5 team members",
        "2GB storage",
        "Basic attendance tracking",
        "Leave management",
        "Payroll calculations",
        "Email support",
      ],
      cta: "Start free trial",
      href: "/register",
      isAvailable: true,
      highlighted: false,
    },
    {
      name: "Startup",
      price: "29",
      period: "/month",
      description: "For growing teams",
      features: [
        "Up to 20 team members",
        "10GB storage",
        "Custom branding",
        "Advanced reports",
        "API access",
        "Priority support",
      ],
      cta: "Coming soon",
      href: "#",
      isAvailable: false,
      highlighted: true,
    },
    {
      name: "Business",
      price: "79",
      period: "/month",
      description: "For established companies",
      features: [
        "Up to 100 team members",
        "50GB storage",
        "Custom domains",
        "Advanced analytics",
        "Multiple workspaces",
        "Dedicated support",
      ],
      cta: "Coming soon",
      href: "#",
      isAvailable: false,
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-600">
            Start free, scale as you grow. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`
                relative rounded-2xl border bg-white p-8
                ${plan.highlighted
                  ? "border-gray-900 shadow-lg ring-2 ring-gray-900/10"
                  : "border-gray-200 hover:border-gray-300"
                }
                transition-all duration-300
              `}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <span className="inline-flex items-center px-4 py-1 rounded-full bg-gray-900 text-white text-xs font-semibold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-x-1 mb-2">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {plan.period}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-gray-900 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.isAvailable ? (
                <Link to={plan.href} className="block">
                  <Button
                    className={`
                      w-full rounded-lg h-11
                      ${plan.highlighted
                        ? "bg-gray-900 hover:bg-gray-800 text-white"
                        : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
                      }
                    `}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              ) : (
                <Button
                  className="w-full rounded-lg h-11 bg-gray-100 hover:bg-gray-100 text-gray-400 cursor-not-allowed"
                  disabled
                >
                  {plan.cta}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* FAQ hint */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            Need a custom plan?{" "}
            <a href="#" className="text-gray-900 font-medium hover:underline">
              Contact sales
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
