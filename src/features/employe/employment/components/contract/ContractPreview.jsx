import { format } from "date-fns";

const ContractPreview = ({ contract }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p8 max-w-3xl">
      <div className="text-center border-b pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Employment Contract
        </h1>
        <p className="text-gray-600">Contract ID: {contract.contractId}</p>
      </div>

      {/* Company & Employee Info */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Employer</h3>
          <p className="text-sm">{contract.companyName}</p>
          <p className="text-sm">{contract.companyAddress}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Employee</h3>
          <p className="text-sm">{contract.employeeName}</p>
          <p className="text-sm">{contract.employeeEmail}</p>
        </div>
      </div>

      {/* Position Details */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-2">Position Details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Position</p>
            <p className="text-sm text-gray-600">{contract.positioin}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Department</p>
            <p className="font-medium">{contract.department}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Start Date</p>
            <p className="font-medium">
              {format(new Date(contract.startDate), "MMM dd, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Employment Type</p>
            <p className="font-medium capitalize">{contract.employmentType}</p>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Compensation</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Monthly Salary</p>
            <p className="font-medium text-lg">
              PKR {contract.salary?.toLocaleString()}
            </p>
          </div>
          {contract.benefits?.length > 0 && (
            <div>
              <p className="text-sm text-gray-600">Benefits</p>
              <ul className="text-sm list-disc list-inside">
                {contract.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Terms & Conditions</h3>
        <div className="prose prose-sm text-gray-700">
          <p>
            {contract.termsAndConditions || "Standard employment terms apply."}
          </p>
        </div>
      </div>

      {/* Signatures */}
      {contract.employerSignature && (
        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Signatures</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-2">Employer Signature</p>
              <img
                src={contract.employerSignature}
                alt="Employer Signature"
                className="border rounded h-24"
              />
              <p className="text-xs text-gray-500 mt-2">
                Signed on{" "}
                {format(new Date(contract.employerSignedAt), "MMM dd, yyyy")}
              </p>
            </div>
            {contract.employeeSignature && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Employee Signature</p>
                <img
                  src={contract.employeeSignature}
                  alt="Employee Signature"
                  className="border rounded h-24"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Signed on{" "}
                  {format(new Date(contract.employeeSignedAt), "MMM dd, yyyy")}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractPreview;
