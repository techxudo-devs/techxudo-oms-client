import { useState } from "react";
import {
  useGetContractByTokenQuery,
  useSignContractMutation,
} from "../api/employmentApiSlice";

export const useContractSigning = (token) => {
  const [signature, setSignature] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [signatureError, setSignatureError] = useState("");

  const { data: contractResponse, isLoading } =
    useGetContractByTokenQuery(token);

  const [signContract, { isLoading: isSubmitting }] = useSignContractMutation();

  const contract = contractResponse?.data || null;

  const validateSignature = () => {
    if (!signature) {
      setSignatureError("Please Provide your signature");
      return false;
    }
    if (!agreed) {
      setSignatureError("You must agree to the terms");
      return false;
    }
    setSignatureError("");
    return true;
  };

  const handleSignContract = async () => {
    if (!validateSignature()) return { success: false };

    try {
      await signContract({
        token,
        signatureData: {
          employeeSignature: signature,
          agreedToTerms: agreed,
          signedAt: new Date().toISOString(),
        },
      }).unwrap();
    } catch (error) {
      return {
        success: false,
        error: err.data?.message || "Failed to sign contract",
      };
    }
  };

  return {
    contract,
    isLoading,
    isSubmitting,
    signature,
    setSignature,
    agreed,
    setAgreed,
    signatureError,
    handleSignContract,
    handleSignContract,
    canSign: !contract?.employeeSigned,
  };
};
