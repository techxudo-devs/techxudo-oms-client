import React from "react";
import { useOnboarding } from "../hooks/useOnboarding";
import { Loader, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { OfferDetail } from "../components/onboarding/OfferDetail";
import { OnboardingForm } from "../components/onboarding/OnBoardingForm";
import { StatusDisplay } from "../components/onboarding/StatusDisplay";
import { Link } from "react-router-dom";

export const OnboardingPage = () => {
  const { onboardingDetails, isLoading, isError, error } = useOnboarding();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader className="w-12 h-12 animate-spin text-brand-primary" />
        <p className="ml-4 text-lg text-gray-700">Loading Offer Details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex justify-center">
        <div className="max-w-8xl bg-slate-50 shadow-xl sm:rounded-3xl flex justify-center flex-1">
          <div className="w-full flex items-center justify-center p-6 sm:p-12">
            <div className="flex flex-col items-center w-full max-w-2xl">
              <div className="text-center mb-8">
                <div className="mb-6">
                  <img src="/av.svg" alt="Logo" className="w-48 mx-auto" />
                </div>
              </div>
              <StatusDisplay
                icon={<AlertTriangle className="w-16 h-16 text-red-500" />}
                title="Error Fetching Details"
                message={
                  error?.data?.error ||
                  "The link may be invalid or an unknown error occurred."
                }
              />
              <Link
                to="/login"
                className="px-4 py-2 bg-brand-primary text-white text-md round  ed-2xl"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderContentByStatus = () => {
    switch (onboardingDetails?.status) {
      case "pending":
        return <OfferDetail details={onboardingDetails} />;
      case "accepted":
        return <OnboardingForm />;
      case "completed":
        return (
          <StatusDisplay
            icon={<CheckCircle className="w-16 h-16 text-green-500" />}
            title="Onboarding Completed!"
            message="Welcome aboard! You can now log in with your new credentials."
            showLoginButton={true}
          />
        );
      case "rejected":
        return (
          <StatusDisplay
            icon={<XCircle className="w-16 h-16 text-gray-600" />}
            title="Offer Declined"
            message="You have successfully declined the offer. We wish you the best in your future endeavors."
          />
        );
      case "expired":
        return (
          <StatusDisplay
            icon={<AlertTriangle className="w-16 h-16 text-yellow-500" />}
            title="Link Expired"
            message="This onboarding link has expired. Please contact the administrator for assistance."
          />
        );
      case "revoked":
        return (
          <StatusDisplay
            icon={<XCircle className="w-16 h-16 text-red-500" />}
            title="Offer Revoked"
            message={`This offer has been revoked by the administrator. Reason: ${onboardingDetails.revocationReason}`}
          />
        );
      default:
        return (
          <StatusDisplay
            icon={<AlertTriangle className="w-16 h-16 text-red-500" />}
            title="Invalid Status"
            message="The onboarding status is unrecognized. Please contact support."
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex justify-center">
      <div className="max-w-8xl bg-slate-50 shadow-xl sm:rounded-3xl flex justify-center flex-1">
        <div className="w-full flex items-center justify-center max-w-6xl py-10">
          <div className="flex flex-col items-center w-full ">
            <div className="w-full">{renderContentByStatus()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
