import { FileSignature } from "lucide-react";
import { Label } from "@/components/ui/label";

/**
 * Step 5: Signature Authority
 * Configure document approval process
 */
const SignatureStep = ({ formData, updateNestedField, errors }) => {
  const signatureTypes = [
    {
      value: "single",
      label: "Single Signature",
      description: "One designated person can approve all documents",
      icon: "👤",
    },
    {
      value: "multiple",
      label: "Multiple Signatures",
      description: "Require multiple approvals for important documents",
      icon: "👥",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex p-3 rounded-xl bg-gray-100 mb-4">
          <FileSignature className="w-6 h-6 text-gray-900" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Configure signature authority
        </h2>
        <p className="text-gray-600">
          Set up how documents like appointment letters, contracts, and other
          official documents should be approved.
        </p>
      </div>

      <div className="space-y-8">
        {/* Signature Type Selection */}
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-3 block">
            Signature Type <span className="text-red-500">*</span>
          </Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {signatureTypes.map((type) => {
              const isSelected =
                formData.signatureAuthority.authorityType === type.value;

              return (
                <button
                  key={type.value}
                  onClick={() => {
                    updateNestedField(
                      "signatureAuthority",
                      "authorityType",
                      type.value
                    );
                    // Reset required signatures to 1 when switching to single
                    if (type.value === "single") {
                      updateNestedField(
                        "signatureAuthority",
                        "requiredSignatures",
                        1
                      );
                    }
                  }}
                  className={`
                    p-6 rounded-xl border-2 text-left transition-all
                    ${
                      isSelected
                        ? "border-gray-900 bg-gray-50 ring-2 ring-gray-900/10"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }
                  `}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{type.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {type.label}
                        </h3>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {errors.signatureType && (
            <p className="text-sm text-red-600 mt-2">{errors.signatureType}</p>
          )}
        </div>

        {/* Required Signatures (only for multiple) */}
        {formData.signatureAuthority.authorityType === "multiple" && (
          <div className="p-6 rounded-xl border border-gray-200 bg-gray-50">
            <Label
              htmlFor="requiredSignatures"
              className="text-sm font-medium text-gray-900 mb-3 block"
            >
              Number of Required Signatures{" "}
              <span className="text-red-500">*</span>
            </Label>

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const current =
                    formData.signatureAuthority.requiredSignatures;
                  if (current > 1) {
                    updateNestedField(
                      "signatureAuthority",
                      "requiredSignatures",
                      current - 1
                    );
                  }
                }}
                className="w-10 h-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={formData.signatureAuthority.requiredSignatures <= 1}
              >
                <span className="text-lg font-bold">−</span>
              </button>

              <div className="flex-1 text-center">
                <div className="text-4xl font-bold text-gray-900">
                  {formData.signatureAuthority.requiredSignatures}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {formData.signatureAuthority.requiredSignatures === 1
                    ? "signature required"
                    : "signatures required"}
                </p>
              </div>

              <button
                onClick={() => {
                  const current =
                    formData.signatureAuthority.requiredSignatures;
                  if (current < 5) {
                    updateNestedField(
                      "signatureAuthority",
                      "requiredSignatures",
                      current + 1
                    );
                  }
                }}
                className="w-10 h-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={formData.signatureAuthority.requiredSignatures >= 5}
              >
                <span className="text-lg font-bold">+</span>
              </button>
            </div>

            {errors.requiredSignatures && (
              <p className="text-sm text-red-600 mt-2">
                {errors.requiredSignatures}
              </p>
            )}

            <div className="mt-4 p-3 rounded-lg bg-white border border-gray-200">
              <p className="text-xs text-gray-600">
                <strong>Note:</strong> You can set a maximum of 5 required
                signatures. Signatories can be assigned when creating documents.
              </p>
            </div>
          </div>
        )}

        {/* Information Cards */}
        <div className="space-y-4">
          {formData.signatureAuthority.authorityType === "single" ? (
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-green-900 mb-1">
                    Single Signature Authority
                  </h4>
                  <p className="text-sm text-green-800">
                    Fast and simple approval process. Best for small teams and
                    startups where one person (usually the owner or HR head)
                    approves all documents.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">
                    Multiple Signature Authority
                  </h4>
                  <p className="text-sm text-blue-800">
                    Enhanced security and accountability with multiple
                    approvals. Ideal for larger organizations where important
                    documents need validation from multiple stakeholders.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Use Cases */}
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Documents requiring signatures:
            </h4>
            <ul className="space-y-1">
              <li className="text-sm text-gray-600 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                Appointment letters
              </li>
              <li className="text-sm text-gray-600 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                Employment contracts
              </li>
              <li className="text-sm text-gray-600 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                Leave approvals
              </li>
              <li className="text-sm text-gray-600 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                Salary revisions
              </li>
              <li className="text-sm text-gray-600 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                Policy acknowledgments
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureStep;
