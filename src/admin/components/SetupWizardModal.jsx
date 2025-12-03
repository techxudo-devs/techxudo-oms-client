import { X } from "lucide-react";
import { useState } from "react";
import useSetupWizard from "@/hooks/useSetupWizard.js";
import CompanyInfoStep from "@/pages/setup/steps/CompanyInfoStep.jsx";
import BrandingStep from "@/pages/setup/steps/BrandingStep.jsx";
import DepartmentsStep from "@/pages/setup/steps/DepartmentsStep.jsx";
import WorkingHoursStep from "@/pages/setup/steps/WorkingHoursStep.jsx";
import SignatureStep from "@/pages/setup/steps/SignatureStep.jsx";
import PoliciesStep from "@/pages/setup/steps/PoliciesStep.jsx";
import ReviewStep from "@/pages/setup/steps/ReviewStep.jsx";

/**
 * SetupWizardModal - Blocking modal overlay for organization setup
 * Shows when setupCompleted = false
 * Cannot be closed until setup is complete
 */
const SetupWizardModal = () => {
  const {
    currentStep,
    steps,
    formData,
    errors,
    isLoading,
    isSaving,
    totalSteps,
    progressPercentage,
    isFirstStep,
    isLastStep,
    updateField,
    updateNestedField,
    nextStep,
    prevStep,
    completeSetup,
  } = useSetupWizard();

  const stepComponents = [
    CompanyInfoStep,
    BrandingStep,
    DepartmentsStep,
    WorkingHoursStep,
    SignatureStep,
    PoliciesStep,
    ReviewStep,
  ];

  const CurrentStepComponent = stepComponents[currentStep];

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
            <p className="text-gray-600">Loading setup wizard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 sm:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Complete Your Organization Setup
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Step {currentStep + 1} of {totalSteps} -{" "}
                  {steps[currentStep]?.label}
                </p>
              </div>
              {/* Removed close button - cannot close until complete */}
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-gray-900 to-gray-700 transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Step Indicators */}
            <div className="flex justify-between mt-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center gap-2 flex-1 ${
                    index <= currentStep ? "opacity-100" : "opacity-40"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      index < currentStep
                        ? "bg-green-500 text-white"
                        : index === currentStep
                        ? "bg-gray-900 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {index < currentStep ? "✓" : index + 1}
                  </div>
                  <span className="text-xs text-center hidden sm:block">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 sm:px-8 py-8 max-h-[60vh] overflow-y-auto">
            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            <CurrentStepComponent
              formData={formData}
              updateField={updateField}
              updateNestedField={updateNestedField}
              errors={errors}
            />
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 sm:px-8 py-6">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={prevStep}
                disabled={isFirstStep || isSaving}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  isFirstStep || isSaving
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Previous
              </button>

              {isLastStep ? (
                <button
                  onClick={completeSetup}
                  disabled={isSaving}
                  className="px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Completing Setup...
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={isSaving}
                  className="px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next Step
                </button>
              )}
            </div>

            <p className="text-xs text-center text-gray-500 mt-4">
              You must complete all steps to access your dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupWizardModal;
