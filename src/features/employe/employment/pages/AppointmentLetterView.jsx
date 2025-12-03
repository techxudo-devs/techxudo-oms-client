import { useParams, useNavigate } from "react-router-dom";
import {
  Building2,
  Calendar,
  DollarSign,
  Briefcase,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useAppointmentLetter from "../hooks/useAppointmentLetter";

/**
 * AppointmentLetterView - UI Component
 * Public page for viewing and responding to appointment letter
 * Route: /employment/appointment/:token
 * Business logic handled by useAppointmentLetter hook
 */
const AppointmentLetterView = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const {
    appointment,
    isLoading,
    isSubmitting,
    responseStatus,
    error,
    canRespond,
    hasResponded,
    handleAccept,
    handleReject,
  } = useAppointmentLetter(token);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Loading appointment letter...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Unable to Load Appointment Letter
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-sm text-gray-500">
            The link may have expired or is invalid. Please contact HR for
            assistance.
          </p>
        </div>
      </div>
    );
  }

  // Success response state
  if (hasResponded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {responseStatus === "accepted"
              ? "Offer Accepted!"
              : "Response Submitted"}
          </h2>
          <p className="text-gray-600 mb-6">
            {responseStatus === "accepted"
              ? "Congratulations! We're excited to have you on board. You'll receive an email with next steps shortly."
              : "Your response has been recorded. Thank you for your consideration."}
          </p>
        </div>
      </div>
    );
  }

  // Already responded (status check)
  if (!canRespond) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Already Responded
          </h2>
          <p className="text-gray-600">
            You have already responded to this appointment letter.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Status:{" "}
            <span className="font-semibold capitalize">{appointment.status}</span>
          </p>
        </div>
      </div>
    );
  }

  // Main view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-xl px-8 py-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Appointment Letter
              </h1>
              <p className="text-gray-600">Welcome, {appointment.employeeName}!</p>
            </div>
          </div>
        </div>

        {/* Letter Content */}
        <div className="bg-white shadow-xl px-8 py-10">
          <div className="prose prose-gray max-w-none mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {appointment.subject}
            </h2>
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: appointment.body }}
            />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t">
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Position</p>
                <p className="font-semibold text-gray-900">
                  {appointment.position}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="font-semibold text-gray-900">
                  {appointment.department}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Joining Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(appointment.joiningDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-gray-600 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Salary</p>
                <p className="font-semibold text-gray-900">
                  ${appointment.salary.toLocaleString()} / year
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          {appointment.benefits && appointment.benefits.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-3">
                Benefits & Perks
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {appointment.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-b-2xl shadow-xl px-8 py-6 border-t">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleAccept}
              disabled={isSubmitting}
              className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Accept Offer
                </>
              )}
            </Button>

            <Button
              onClick={handleReject}
              disabled={isSubmitting}
              variant="outline"
              className="flex-1 h-12 border-2 border-gray-300 hover:bg-gray-50"
            >
              <XCircle className="w-5 h-5 mr-2" />
              Decline Offer
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500 mt-4">
            By accepting this offer, you agree to proceed with the next steps of
            onboarding
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentLetterView;
