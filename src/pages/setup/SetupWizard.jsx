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
        <div className="container mx-auto mt-12 px-4">
          <div className="flex items-center justify-between border-t border-black/[0.06] pt-8">
            {!isFirstStep ? (
              <Button
                onClick={prevStep}
                variant="ghost"
                disabled={isSaving}
                className="group h-11 px-4 text-muted-foreground hover:text-foreground transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                <span className="font-medium tracking-tight">Back</span>
              </Button>
            ) : (
              <div />
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              {/* Step Indicator - Refined subtle text */}
              <div className="hidden sm:block text-xs font-medium text-muted-foreground tracking-tight mr-2">
                Step {currentStep + 1}{" "}
                <span className="text-black/20 mx-1">/</span> {steps.length}
              </div>

              {isLastStep ? (
                <Button
                  onClick={completeSetup}
                  disabled={isSaving}
                  className="h-11 px-8 bg-black hover:bg-zinc-800 text-white shadow-sm transition-all active:scale-[0.98]"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Processing
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
                  className="group h-11 px-8 bg-black hover:bg-zinc-800 text-white shadow-sm transition-all active:scale-[0.98]"
                >
                  <span className="font-medium tracking-tight">Continue</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Step Indicator */}
          <div className="mt-6 text-center sm:hidden">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Step {currentStep + 1} of {steps.length}
            </span>
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
