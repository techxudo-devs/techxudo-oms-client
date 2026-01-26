import { ArrowRight, Sparkles, PlayCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Modern Hero Section
 * Features: 3D perspective dashboard, spotlight gradients, and optical typography.
 */
const Hero = () => {
  const scrollToPricing = (e) => {
    e.preventDefault();
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) pricingSection.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-white selection:bg-black selection:text-white pt-32 pb-16 md:pt-48 md:pb-32">
      {/* --- Background Effects --- */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        {/* Top Spotlight Blur */}
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-500 opacity-20 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/5 bg-white shadow-sm hover:border-black/10 transition-colors cursor-default mb-8">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-xs font-medium text-gray-600">
                v2.0 is now available
              </span>
              <div className="w-px h-3 bg-gray-200 mx-1" />
              <span className="text-xs font-medium text-gray-900 flex items-center gap-1">
                Read changelog <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 text-balance">
            Manage your team,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900">
              minus the chaos.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed text-balance">
            The all-in-one operating system for modern companies. Automate
            payroll, track attendance, and manage workflows without the
            spreadsheet fatigue.
          </p>

          {/* CTA Buttons */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <a
              href="#pricing"
              onClick={scrollToPricing}
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-8 rounded-full bg-black text-white hover:bg-zinc-800 shadow-xl shadow-black/5 transition-all active:scale-[0.98] text-base font-medium"
              >
                Start free trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-12 px-8 rounded-full border-gray-200 hover:bg-gray-50 hover:text-gray-900 text-gray-600 text-base font-medium"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              Watch demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100 ease-out mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
            {[
              "No credit card required",
              "14-day free trial",
              "SOC2 Compliant",
            ].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- 3D Dashboard Preview --- */}
        <div className="relative mt-20 perspective-[2000px] group">
          {/* Glow Effect behind the dashboard */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-indigo-500/10 blur-[80px] -z-10 rounded-full" />

          {/* The Dashboard Container */}
          <div className="relative mx-auto max-w-6xl rounded-xl border border-gray-200/60 bg-white/40 backdrop-blur-sm shadow-2xl shadow-indigo-500/10 transform transition-transform duration-700 hover:rotate-x-2 md:rotate-x-[12deg]">
            {/* Window Controls */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200/50 bg-white/50 rounded-t-xl">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-green-400/80" />
              </div>
            </div>

            {/* Simulated UI Content (CSS Only - No Images) */}
            <div className="grid grid-cols-[240px_1fr] h-[400px] md:h-[600px] bg-white rounded-b-xl overflow-hidden">
              {/* Fake Sidebar */}
              <div className="border-r border-gray-100 bg-gray-50/50 p-4 space-y-4 hidden md:block">
                <div className="h-8 w-32 bg-gray-200/50 rounded-md mb-6" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gray-200/50" />
                    <div className="h-3 w-24 bg-gray-200/50 rounded" />
                  </div>
                ))}
              </div>

              {/* Fake Main Content */}
              <div className="p-6 md:p-8 bg-white space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                  <div className="h-8 w-48 bg-gray-100 rounded-lg" />
                  <div className="h-8 w-24 bg-gray-100 rounded-lg" />
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-24 rounded-xl border border-gray-100 bg-white shadow-sm p-4 space-y-3"
                    >
                      <div className="h-8 w-8 rounded-full bg-indigo-50" />
                      <div className="h-4 w-20 bg-gray-100 rounded" />
                    </div>
                  ))}
                </div>

                {/* Big Chart Area */}
                <div className="h-64 rounded-xl border border-gray-100 bg-gray-50/30 p-6 flex items-end gap-4">
                  {[40, 70, 45, 90, 65, 80, 50, 95].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-indigo-500/10 rounded-t-sm relative group"
                    >
                      <div
                        className="absolute bottom-0 w-full bg-indigo-500 rounded-t-sm transition-all duration-1000 ease-out"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
