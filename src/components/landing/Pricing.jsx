import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch"; // Assuming you have a switch, or we build a simple toggle
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge"; // Optional, can use standard div


const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: "0",
      description: "Essential tools for small teams and hobbyists.",
      features: [
        "Up to 5 team members",
        "Basic attendance tracking",
        "30-day history",
        "Community support",
      ],
      missing: ["Payroll automation", "Custom branding"],
      cta: "Start for free",
      href: "/register",
      popular: false,
      available: true,
    },
    {
      name: "Growth",
      price: isYearly ? "24" : "29", // Dynamic pricing
      period: isYearly ? "/mo (billed yearly)" : "/month",
      description: "The complete OS for scaling companies.",
      features: [
        "Up to 25 team members",
        "Full payroll automation",
        "Advanced leave policies",
        "Custom branding & domain",
        "Priority email support",
        "Unlimited history",
      ],
      missing: [],
      cta: "Start 14-day trial",
      href: "/register",
      popular: true, // This triggers the dark theme
      available: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Dedicated support and security for large orgs.",
      features: [
        "Unlimited members",
        "Dedicated success manager",
        "SAML SSO & Audit logs",
        "Custom contracts",
        "SLA guarantees",
      ],
      missing: [],
      cta: "Contact Sales",
      href: "/contact",
      popular: false,
      available: false, // Waitlist/Contact only
    },
  ];

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-white">
      {/* Background Decor - Subtle Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 via-white to-white -z-10" />

      <div className="container mx-auto px-6">
        {/* Header & Toggle */}
        <div className="flex flex-col items-center text-center mb-16 space-y-8">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Pricing that grows with you
            </h2>
            <p className="text-lg text-gray-500">
              Transparent pricing. No hidden fees. Cancel anytime.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center gap-3 p-1.5 bg-gray-100 rounded-full border border-gray-200">
            <button
              onClick={() => setIsYearly(false)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200",
                !isYearly
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900",
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2",
                isYearly
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900",
              )}
            >
              Yearly
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Cards Layout */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col p-8 rounded-3xl transition-all duration-300",
                // Conditional Styling for "Popular" Card (Dark Theme)
                plan.popular
                  ? "bg-gray-900 text-white shadow-2xl shadow-gray-900/20 scale-105 ring-1 ring-gray-900 z-10"
                  : "bg-white text-gray-900 border border-gray-200 hover:border-gray-300 hover:shadow-lg z-0",
              )}
            >
              {/* Popular Badge */}

              {/* Card Header */}
              <div className="mb-8">
                <h3
                  className={cn(
                    "text-lg font-semibold mb-2",
                    plan.popular ? "text-gray-100" : "text-gray-900",
                  )}
                >
                  {plan.name}
                </h3>
                <p
                  className={cn(
                    "text-sm h-10",
                    plan.popular ? "text-gray-400" : "text-gray-500",
                  )}
                >
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  {plan.price === "Custom" ? (
                    <span className="text-4xl font-bold tracking-tight">
                      Custom
                    </span>
                  ) : (
                    <>
                      <span className="text-5xl font-bold tracking-tight">
                        ${plan.price}
                      </span>
                      {plan.price !== "0" && (
                        <span
                          className={cn(
                            "text-sm font-medium",
                            plan.popular ? "text-gray-400" : "text-gray-500",
                          )}
                        >
                          {isYearly ? "/mo" : "/mo"}
                        </span>
                      )}
                    </>
                  )}
                </div>
                {isYearly && plan.price !== "0" && plan.price !== "Custom" && (
                  <p
                    className={cn(
                      "text-xs mt-2",
                      plan.popular ? "text-emerald-400" : "text-emerald-600",
                    )}
                  >
                    Billed ${parseInt(plan.price) * 12} yearly
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="mb-8">
                <Link to={plan.href} className="w-full block">
                  <Button
                    className={cn(
                      "w-full h-12 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98]",
                      plan.popular
                        ? "bg-white text-gray-900 hover:bg-gray-100"
                        : "bg-gray-900 text-white hover:bg-gray-800",
                      !plan.available &&
                        "opacity-80 cursor-not-allowed bg-gray-100 text-gray-400 hover:bg-gray-100 hover:text-gray-400 border border-gray-200",
                    )}
                    disabled={!plan.available}
                  >
                    {plan.cta}
                  </Button>
                </Link>
                {!plan.available && (
                  <p className="text-xs text-center mt-2 text-gray-400">
                    Currently in private beta
                  </p>
                )}
              </div>

              {/* Features List */}
              <div className="flex-1 space-y-4">
                <p
                  className={cn(
                    "text-xs font-bold uppercase tracking-wider",
                    plan.popular ? "text-gray-500" : "text-gray-400",
                  )}
                >
                  Includes:
                </p>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm"
                    >
                      <div
                        className={cn(
                          "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                          plan.popular
                            ? "bg-gray-800 text-indigo-400"
                            : "bg-indigo-50 text-indigo-600",
                        )}
                      >
                        <Check className="w-3 h-3" />
                      </div>
                      <span
                        className={cn(
                          plan.popular ? "text-gray-300" : "text-gray-600",
                        )}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}

                  {/* Missing Features (Grayed out) - Optional visual cue */}
                  {plan.missing?.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm opacity-50"
                    >
                      <div
                        className={cn(
                          "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                          plan.popular
                            ? "bg-gray-800 text-gray-600"
                            : "bg-gray-100 text-gray-400",
                        )}
                      >
                        <X className="w-3 h-3" />
                      </div>
                      <span
                        className={cn(
                          plan.popular ? "text-gray-500" : "text-gray-400",
                        )}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise / Custom Footer */}
        <div className="mt-20 p-8 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">
              Need something else?
            </h4>
            <p className="text-gray-600 text-sm mt-1">
              We offer custom tailored plans for non-profits and educational
              institutions.
            </p>
          </div>
          <Button
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-white hover:text-gray-900"
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
