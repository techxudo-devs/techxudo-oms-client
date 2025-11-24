import React, { useState } from "react";
import { Info } from "lucide-react";
const PageHeader = ({ title, subtitle, icon: Icon, actionContent }) => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center">
          {Icon && (
            <div className="hidden sm:flex items-center justify-center bg-blue-100 p-3 rounded-lg mr-4">
              <Icon className="w-7 h-7 text-blue-600" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-medium text-gray-800">{title}</h1>
            <div className="flex items-center gap-2 mt-1">
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          {actionContent}
        </div>
      </div>
    </>
  );
};

const PageLayout = ({
  children,
  title,
  subtitle,
  icon,
  helpContent,
  actions,
}) => {
  return (
    <div className="min-h-screen bg-slate-50/30 text-slate-800">
      <main className="container mx-auto">
        {title && (
          <PageHeader
            title={title}
            subtitle={subtitle}
            icon={icon}
            helpContent={helpContent}
            actionContent={actions}
          />
        )}

        <div className="bg-white p-6 sm:p-8 border rounded-2xl border-gray-300">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageLayout;
