import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useContractSigning } from "../hooks/useContractSigning";
import ContractPreview from "../components/contract/ContractPreview";
import SignaturePad from "../components/contract/SignaturePad";

const ContractSigningPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const {
    contract,
    isLoading,
    isSubmitting,
    signature,
    setSignature,
    agreed,
    setAgreed,
    signatureError,
    handleSignContract,
    canSign,
  } = useContractSigning(token);

  const [submitSucess, setSubmitSuccess] = useState(false);

  const onSubmit = async () => {
    const result = await handleSignContract();
    if (result.success) setSubmitSuccess(true);
  };

  //Loading State
  if (isLoading)
    return (
      <div className="flex items-center jsutify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading contract details...</p>
        </div>
      </div>
    );

  if (submitSucess)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Contract Signed Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            You will receive an email to set your password and access your
            account.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Employeement Contract
          </h1>
          <p className="text-gray-600 mt-2">
            Please review and sign your employment contract below.
          </p>
        </div>

        {/* Contract Preview */}
        <ContractPreview contract={contract} />

        {/* Signature Pad */}
        {canSign && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Sign the Contract
            </h2>

            <div>
              <Label className="block mb-2">Your Signature</Label>
              <SignaturePad onSave={setSignature} disabled={isSubmitting} />
              {signatureError && (
                <p className="text-sm text-red-600 mt-2">{signatureError}</p>
              )}
            </div>

            {/* Agreement Checkbox */}
            <div className="flex items-start gap-3 mb-6">
              <Checkbox
                id="agree"
                Checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked)}
                disabled={isSubmitting}
              />
              <Label htmlFor="agree" className="text-sm text-gray-700">
                I have read and agree to all the terms and conditions stated in
                this employment contract. I understand that this is a legally
                binding agreement.
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              onClick={onSubmit}
              disabled={!signature || isSubmitting || !agreed}
              className="w-full md:w-auto"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Signing...
                </>
              ) : (
                "Sign Contract"
              )}
            </Button>
          </div>
        )}

        {!canSign && (
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contract Already Signed
            </h2>
            <p className="text-gray-600">
              You have already signed this contract. Thank you!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractSigningPage;
