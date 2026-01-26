import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Assuming you have a class merger utility

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      // Trigger the pill shape after scrolling 20px
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToPricing = (e) => {
    e.preventDefault();
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Pricing", href: "#pricing", action: scrollToPricing },
    { name: "Changelog", href: "#" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 pointer-events-none pt-4">
      <nav
        className={cn(
          "pointer-events-auto flex items-center justify-between transition-all duration-500 ease-in-out",
          // SCROLLED STATE: Pill shape, smaller width, shadow
          isScrolled
            ? "w-[90%] max-w-4xl rounded-full border border-black/5 bg-white/80 px-4 py-2 shadow-lg shadow-black/5 backdrop-blur-xl ring-1 ring-black/5"
            : // TOP STATE: Full width, transparent (or subtle border)
              "w-full max-w-7xl rounded-none border-b border-transparent bg-transparent px-6 py-4",
        )}
      >
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="h-8 w-8 rounded-lg bg-black text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <span
            className={cn(
              "font-bold tracking-tight text-gray-900 transition-opacity duration-300",
              isScrolled ? "text-base hidden sm:block" : "text-lg",
            )}
          >
            TechXudo
          </span>
        </Link>

        {/* Center: Links (Desktop) */}
        <div
          className={cn(
            "hidden md:flex items-center gap-1 transition-all duration-300",
            // If scrolled, tighten the gap
            isScrolled ? "gap-2" : "gap-6",
          )}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={link.action}
              className={cn(
                "px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100/50",
                isScrolled ? "text-xs lg:text-sm" : "text-sm",
              )}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Sign In - Hide text on very small pill screens if needed */}
          <Link to="/login">
            <Button
              variant="ghost"
              className={cn(
                "text-gray-600 hover:text-gray-900",
                isScrolled ? "h-8 px-3 text-xs" : "h-9 px-4 text-sm",
              )}
            >
              Log in
            </Button>
          </Link>

          <Link to="/register">
            <Button
              className={cn(
                "bg-black hover:bg-zinc-800 text-white shadow-lg shadow-black/10 transition-all active:scale-95 rounded-full",
                isScrolled ? "h-8 px-4 text-xs" : "h-10 px-5 text-sm",
              )}
            >
              <span>Start Free</span>
              {!isScrolled && (
                <ArrowRight className="w-4 h-4 ml-1.5 hidden lg:block" />
              )}
            </Button>
          </Link>

          {/* Mobile Menu Toggle (Simplified) */}
          <div className="md:hidden ml-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
