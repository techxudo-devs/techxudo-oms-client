import { useParams } from "react-router-dom";
import { Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmploymentForm from "../hooks/useEmploymentForm";
import {
  PersonalInfoStep,
  CnicInfoStep,
  ContactInfoStep,
  AddressInfoStep,
  PoliciesStep,
  AccountSetupStep,
} from "../components/employment-form";

/**
 * EmploymentFormPage - Multi-step employment form
 * Route: /employment/form/:token
 * Business logic in useEmploymentForm hook
 */
const EmploymentFormPage = () => {
  const { token } = useParams();

  const {
    formik,
    formResponse,
    policies,
    isLoading,
    isError,
    error,
    isSubmitting,
    uploadingImages,
    submitSuccess,
    currentStep,
    steps,
    isFirstStep,
    isLastStep,
    progressPercentage,
    handleImageUpload,
    nextStep,
    prevStep,
    togglePolicy,
    org,
  } = useEmploymentForm(token);

  const latestRevision = formResponse?.data?.revisionRequests?.slice(-1)[0];
  const isRevisionRequested = formResponse?.data?.status === "needs_revision";

  const stepComponents = [
    PersonalInfoStep,
    CnicInfoStep,
    ContactInfoStep,
    AddressInfoStep,
    PoliciesStep,
    AccountSetupStep,
  ];

  const CurrentStep = stepComponents[currentStep];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  // Error state - form not found or failed to load
  if (isError) {
    const errorMessage =
      error?.data?.error ||
      error?.error ||
      "The employment form could not be loaded.";
    const isExpired = error?.status === 410;
    const isNotFound = error?.status === 404;
    const isAlreadySubmitted = error?.status === 409;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">{isExpired ? "⏰" : "⚠️"}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isExpired
              ? "Link Expired"
              : isNotFound
              ? "Form Not Found"
              : isAlreadySubmitted
              ? "Already Submitted"
              : "Error Loading Form"}
          </h2>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          {(isExpired || isNotFound) && (
            <p className="text-sm text-gray-500">
              Please contact HR for assistance.
            </p>
          )}
          {isAlreadySubmitted && (
            <div className="text-left text-sm text-gray-500 space-y-1">
              <p>
                Your submission is in review. HR will reach out with the next
                steps, including an appointment link, contract signing, and
                credential setup.
              </p>
              <p>Please wait for the confirmation email before retrying.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Success state
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Form Submitted Successfully!
        </h2>
        <p className="text-gray-600">
          Your employment form has been submitted for review. HR will contact
          you once your profile is approved and share the appointment, contract,
          and onboarding steps.
        </p>
        <ul className="mt-4 space-y-1 text-left text-sm text-gray-600">
          <li>1. HR reviews your information and confirms it internally.</li>
          <li>2. You receive an appointment letter link to confirm the role.</li>
          <li>3. A contract is issued for review and e-signature.</li>
          <li>4. Once signed, you’ll get credentials and onboarding instructions.</li>
        </ul>
      </div>
    </div>
  );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-xl px-8 py-6 border-b">
          <div className="flex items-center gap-3 mb-2">
            {org?.logo ? (
              <img src={org.logo} alt={org?.companyName || "Logo"} className="w-10 h-10 rounded" />
            ) : null}
            <h1 className="text-2xl font-bold text-gray-900">
              {org?.companyName ? `${org.companyName} Employment Form` : "Employment Form"}
            </h1>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Step {currentStep + 1} of {steps.length} -{" "}
            {steps[currentStep]?.label}
          </p>

          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-gray-900 to-gray-700 transition-all duration-300"
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
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
          {isRevisionRequested && (
            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50/80 p-4 text-sm text-amber-900">
              <p className="font-semibold">HR requested updates</p>
              <p>
                Please revisit: {latestRevision?.requestedFields?.join(", ") || "the sections requested"}.
              </p>
              {latestRevision?.notes && (
                <p className="text-xs text-amber-800">Note: {latestRevision.notes}</p>
              )}
              <p className="text-xs text-amber-700">
                Update and resubmit so we can continue with the next steps (appointment, contract, credentials).
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white shadow-xl px-8 py-10">
          {formik.errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{formik.errors.submit}</p>
            </div>
          )}

          <form onSubmit={formik.handleSubmit}>
            <CurrentStep
              formik={formik}
              handleImageUpload={handleImageUpload}
              uploadingImages={uploadingImages}
              policies={policies}
              togglePolicy={togglePolicy}
            />
          </form>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-b-2xl shadow-xl px-8 py-6 border-t">
          <div className="flex items-center justify-between gap-4">
            <Button
              type="button"
              onClick={prevStep}
              disabled={isFirstStep || isSubmitting}
              variant="outline"
              className="px-6 py-3"
            >
            Previous
            </Button>

            {isLastStep ? (
              <Button
                type="button"
                onClick={formik.handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Form"
                )}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={nextStep}
                disabled={isSubmitting}
                className="px-8 py-3 bg-gradient-to-r from-gray-900 to-gray-700"
              >
                Next Step
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmploymentFormPage;
