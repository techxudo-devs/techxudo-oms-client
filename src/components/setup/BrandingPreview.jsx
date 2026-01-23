import React from "react";

// Live dashboard mockup mirroring the real sidebar + navbar layout
// Uses Tailwind tokens so it reflects theme instantly.
const BrandingPreview = ({ logoUrl, companyName = "Your Company" }) => {
  return (
    <div className="w-full">
      <div className="text-sm text-gray-600 mb-3">Live Preview</div>
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        {/* Navbar */}
        <div className="h-14 px-4 flex items-center justify-between bg-primary text-primary-foreground">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary-foreground/20 flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="logo" className="w-full h-full object-contain" />
              ) : (
                <div className="w-3.5 h-3.5 rounded bg-primary-foreground/60" />
              )}
            </div>
            <span className="font-medium text-sm truncate max-w-[160px]">{companyName}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-20 rounded bg-primary-foreground/20" />
            <div className="h-6 w-6 rounded-full bg-primary-foreground/30" />
          </div>
        </div>

        <div className="flex">
          {/* Sidebar (expanded) */}
          <div className="w-60 bg-gradient-to-b from-slate-50 to-white border-r border-gray-200/80">
            {/* Logo row */}
            <div className="h-12 flex items-center gap-2 px-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center overflow-hidden">
                {logoUrl ? (
                  <img src={logoUrl} alt="logo" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-4 h-4 rounded bg-primary-foreground" />
                )}
              </div>
              <div className="h-3 w-24 rounded bg-primary/30" />
            </div>

            {/* Nav items */}
            <div className="py-3 px-2 space-y-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 rounded-md flex items-center gap-2 px-2 text-xs text-foreground/70 hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <div className="w-3.5 h-3.5 rounded bg-secondary/60" />
                  <div className="h-2.5 w-24 rounded bg-secondary/40" />
                </div>
              ))}
            </div>

            {/* Bottom separator and items */}
            <div className="px-3 py-2">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>
            <div className="px-2 space-y-1 pb-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-8 rounded-md flex items-center gap-2 px-2 text-xs text-foreground/70 hover:bg-accent hover:text-accent-foreground">
                  <div className="w-3.5 h-3.5 rounded bg-secondary/60" />
                  <div className="h-2.5 w-20 rounded bg-secondary/40" />
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 space-y-4 bg-background">
            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["Employees", "Requests", "Leaves", "Reports"].map((t, i) => (
                <div key={i} className="rounded-lg border bg-card p-3">
                  <div className="text-xs text-muted-foreground">{t}</div>
                  <div className="mt-1 text-lg font-semibold">{Math.floor(10 + i * 7)}</div>
                  <div className="mt-2 h-2 rounded bg-accent/30">
                    <div className="h-2 bg-accent rounded" style={{ width: `${45 + i * 12}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Table mock */}
            <div className="rounded-lg border overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-accent text-accent-foreground">
                <div className="text-xs font-medium">Recent Activity</div>
                <div className="h-7 px-3 rounded bg-background text-foreground text-xs flex items-center">Filter</div>
              </div>
              <div className="divide-y">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 bg-card">
                    <div className="text-sm text-foreground/80">Item {i + 1}</div>
                    <div className="h-6 px-3 rounded bg-primary text-primary-foreground text-xs flex items-center">View</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingPreview;
