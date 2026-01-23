import { ArrowLeft, ArrowRight, Check, Info, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useSetupWizard from "@/hooks/useSetupWizard";
import ProgressBar from "@/components/setup/ProgressBar";
import CompanyInfoStep from "./steps/CompanyInfoStep";
import BrandingStep from "./steps/BrandingStep";
import DepartmentsStep from "./steps/DepartmentsStep";
import WorkingHoursStep from "./steps/WorkingHoursStep";
import DocumentsStep from "./steps/DocumentsStep";
import EmailStep from "./steps/EmailStep";
import ReviewStep from "./steps/ReviewStep";

/**
 * Main Setup Wizard Container
 * Multi-step company setup process with smooth transitions
 */
const SetupWizard = () => {
  const {
    currentStep,
    steps,
    formData,
    errors,
    isLoading,
    isSaving,
    isFirstStep,
    isLastStep,
    updateField,
    updateNestedField,
    nextStep,
    prevStep,
    goToStep,
    completeSetup,
    saveDraft,
  } = useSetupWizard();

  // Render current step component
  const renderStep = () => {
    const commonProps = {
      formData,
      updateField,
      updateNestedField,
      errors,
    };

    switch (currentStep) {
      case 0:
        return <CompanyInfoStep {...commonProps} />;
      case 1:
        return <BrandingStep {...commonProps} />;
      case 2:
        return <DepartmentsStep {...commonProps} />;
      case 3:
        return <WorkingHoursStep {...commonProps} />;
      case 4:
        return <DocumentsStep {...commonProps} />;
      case 5:
        return <EmailStep {...commonProps} />;
      case 6:
        return (
          <ReviewStep
            formData={formData}
            goToStep={goToStep}
            isSaving={isSaving}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Bar with Save Draft */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Info className="w-4 h-4 text-primary" />
            </div>
            <div className="text-sm text-gray-600">
              Your progress is saved automatically. You can resume anytime.
            </div>
          </div>
          <Button
            variant="secondary"
            className="h-9"
            onClick={() => {
              saveDraft();
              toast.success("Draft saved");
            }}
            title="Manually save a draft of your current progress"
          >
            <Save className="w-4 h-4 mr-2" /> Save Draft
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        steps={steps}
        currentStep={currentStep}
        onStepClick={goToStep}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Step Content with Fade Animation and helper copy */}
        <div className="animate-in fade-in duration-500" key={currentStep}>
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="flex items-center justify-between gap-4">
            {/* Back Button */}
            {!isFirstStep && (
              <Button
                onClick={prevStep}
                variant="outline"
                className="h-12 px-6 border-gray-300 hover:bg-gray-100"
                disabled={isSaving}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}

            {/* Spacer for first step */}
            {isFirstStep && <div />}

            {/* Next/Complete Button */}
            <div className="ml-auto">
              {isLastStep ? (
                <Button
                  onClick={completeSetup}
                  className="h-12 px-8 bg-gray-900 hover:bg-gray-800 text-white"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Completing...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Complete Setup
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="h-12 px-8 bg-gray-900 hover:bg-gray-800 text-white"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Step Indicator for Mobile */}
          <div className="mt-6 text-center text-sm text-gray-500 md:hidden">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Help Text */}
        <div className="max-w-6xl mx-auto mt-8 p-4 rounded-lg bg-white border border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Need help?{" "}
            <a href="#" className="text-gray-900 font-medium hover:underline">
              Contact support
            </a>{" "}
            or{" "}
            <a href="#" className="text-gray-900 font-medium hover:underline">
              view setup guide
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;
