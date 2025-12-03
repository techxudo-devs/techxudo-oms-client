import { CheckCircle, Circle } from "lucide-react";

const PoliciesStep = ({ formik, policies, togglePolicy }) => {
  const { values, errors, touched } = formik;

  const isPolicyAccepted = (policyId) => {
    return values.acceptedPolicies?.some((p) => p.policyId === policyId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Company Policies</h3>
        <p className="text-sm text-gray-600 mb-6">
          Please review and accept the following policies to continue
        </p>
      </div>

      {policies && policies.length > 0 ? (
        <div className="space-y-4">
          {policies.map((policy) => {
            const isAccepted = isPolicyAccepted(policy._id);

            return (
              <div
                key={policy._id}
                className={`border-2 rounded-xl p-6 transition-all ${
                  isAccepted
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    type="button"
                    onClick={() => togglePolicy(policy._id, policy.title)}
                    className="flex-shrink-0 mt-1"
                  >
                    {isAccepted ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {policy.title}
                      </h4>
                      {policy.isRequired && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                          Required
                        </span>
                      )}
                    </div>

                    <div
                      className="text-sm text-gray-700 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: policy.content }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">No policies to accept at this time</p>
        </div>
      )}

      {errors.acceptedPolicies && touched.acceptedPolicies && (
        <p className="text-sm text-red-600 mt-4">{errors.acceptedPolicies}</p>
      )}
    </div>
  );
};

export default PoliciesStep;
