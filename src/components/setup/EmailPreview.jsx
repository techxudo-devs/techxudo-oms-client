import React from "react";

const EmailPreview = ({ logoUrl, companyName = "Your Company", headerColor = "#000000", footerText = "" }) => {
  return (
    <div className="w-full">
      <div className="text-sm text-gray-600 mb-3">Email Preview</div>
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="h-14 flex items-center justify-between px-4" style={{ backgroundColor: headerColor }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img src={logoUrl} alt="logo" className="w-full h-full object-contain" />
              ) : (
                <div className="w-4 h-4 rounded bg-white/60" />
              )}
            </div>
            <span className="text-white text-sm font-medium">{companyName}</span>
          </div>
          <div className="h-6 w-20 rounded bg-white/20" />
        </div>
        <div className="p-4 bg-gray-50">
          <div className="max-w-[460px] mx-auto bg-white rounded-lg border p-4 space-y-3">
            <div className="h-3 w-40 bg-gray-200 rounded" />
            <div className="h-2 w-72 bg-gray-100 rounded" />
            <div className="h-2 w-64 bg-gray-100 rounded" />
            <div className="h-2 w-56 bg-gray-100 rounded" />
            <div className="mt-3 h-8 w-28 bg-primary text-primary-foreground text-xs rounded flex items-center justify-center">Call to Action</div>
          </div>
        </div>
        <div className="px-4 py-3 text-xs text-gray-600 border-t">
          {footerText || "You are receiving this email because you are a user of our platform."}
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;

