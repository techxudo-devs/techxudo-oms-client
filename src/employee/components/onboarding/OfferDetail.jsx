import React from "react";
import { useOnboarding } from "../../hooks/useOnboarding";
import {
  Check,
  X,
  Loader,
  Briefcase,
  Mail,
  Building2,
  Calendar,
  DollarSign,
  User,
  Award,
} from "lucide-react";

export const OfferDetail = ({ details }) => {
  const { actions, actionState } = useOnboarding();

  // A simple function to format the salary
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 py-12 px-4">
      {/* Header Section */}
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
          TECHXUDO
        </h1>
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            You're Invited!
          </h2>
          <p className="text-lg text-gray-600">
            Congratulations,{" "}
            <span className="font-semibold text-blue-600">
              {details.offerDetails.fullName}
            </span>
            ! We are thrilled to offer you the position of{" "}
            <span className="font-semibold text-blue-600">
              {details.offerDetails.designation}
            </span>
            .
          </p>
        </div>
      </div>

      {/* Offer Details Card */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
          <h2 className="text-3xl font-bold text-white text-center">
            Offer Summary
          </h2>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Personal Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-blue-700">
                      Full Name
                    </span>
                    <p className="font-semibold text-gray-900 mt-1">
                      {details.offerDetails.fullName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-blue-700">
                      Email Address
                    </span>
                    <p className="font-semibold text-gray-900 mt-1">
                      {details.offerDetails.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Position Details */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              Position Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                    <Award className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-slate-700">
                      Designation
                    </span>
                    <p className="font-semibold text-gray-900 mt-1">
                      {details.offerDetails.designation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                    <Building2 className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-slate-700">
                      Department
                    </span>
                    <p className="font-semibold text-gray-900 mt-1">
                      {details.offerDetails.department || "Not Specified"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-slate-700">
                      Reports To
                    </span>
                    <p className="font-semibold text-gray-900 mt-1">
                      {details.offerDetails.reportsTo || "Not Specified"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-slate-700">
                      Role
                    </span>
                    <p className="font-semibold text-gray-900 mt-1 capitalize">
                      {details.offerDetails.role || "Employee"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compensation & Start Date */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Compensation & Start Date
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-blue-700">
                      Annual Salary
                    </span>
                    <p className="font-bold text-2xl text-blue-600 mt-1">
                      {formatCurrency(details.offerDetails.salary)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-blue-700">
                      Start Date
                    </span>
                    <p className="font-semibold text-gray-900 mt-1">
                      {formatDate(details.offerDetails.joiningDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Validity Notice */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-amber-100 rounded-lg flex-shrink-0">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-amber-900 mb-1">
                  Offer Validity
                </h4>
                <p className="text-sm text-amber-800">
                  This offer is valid until{" "}
                  <span className="font-semibold">
                    {new Date(details.expiresAt).toLocaleString()}
                  </span>
                  . We are excited about the possibility of you joining our team
                  and look forward to hearing from you soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-4xl mt-8 mb-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h3 className="text-xl font-semibold text-gray-900 text-center mb-6">
            What would you like to do?
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => actions.acceptOffer()}
              disabled={actionState.isAccepting || actionState.isRejecting}
              className="flex-1 group relative overflow-hidden py-4 px-8 font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 rounded-xl hover:from-green-700 hover:to-green-800 flex items-center justify-center transition-all duration-300 transform cursor-pointer hover:shadow-2xl disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
              {actionState.isAccepting ? (
                <div className="flex items-center gap-2">
                  <Loader className="animate-spin h-5 w-5" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Accept Offer</span>
                </div>
              )}
            </button>
            <button
              onClick={() => {
                const reason = prompt(
                  "Optional: Please provide a reason for declining the offer."
                );
                if (reason !== null) {
                  actions.rejectOffer(reason);
                }
              }}
              disabled={actionState.isAccepting || actionState.isRejecting}
              className="flex-1 group relative overflow-hidden py-4 px-8 font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-700 hover:to-red-800 flex items-center justify-center transition-all duration-300 transform cursor-pointer hover:shadow-2xl disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
              {actionState.isRejecting ? (
                <div className="flex items-center gap-2">
                  <Loader className="animate-spin h-5 w-5" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <X className="w-5 h-5" />
                  <span>Decline Offer</span>
                </div>
              )}
            </button>
          </div>
          <p className="text-sm text-gray-500 text-center mt-4">
            Please review all details carefully before making your decision
          </p>
        </div>
      </div>
    </div>
  );
};
