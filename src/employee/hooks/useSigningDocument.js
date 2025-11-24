import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetEmployeeDocumentByIdQuery,
  useSignDocumentMutation,
  useDeclineDocumentMutation,
} from "../apiSlices/documentApiSlice";
import { toast } from "sonner";

export const useDocumentSigning = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for the form and submission status
  const [signature, setSignature] = useState(null); // Will hold the base64 data URL
  const [declineReason, setDeclineReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // RTK Query Hooks for data fetching and mutations
  const {
    data: document,
    isLoading,
    error,
  } = useGetEmployeeDocumentByIdQuery(id);
  const [signDocument] = useSignDocumentMutation();
  const [declineDocument] = useDeclineDocumentMutation();

  // Handler for signing the document
  const handleSign = async () => {
    if (!signature) {
      toast.error("Please provide your signature before submitting.");
      return;
    }
    setIsSubmitting(true);
    try {
      const signaturePayload = {
        signatureImage: signature,
        signedAt: new Date().toISOString(),
      };
      await signDocument({ id, signatureData: signaturePayload }).unwrap();
      toast.success("Document Signed Successfully!");
      navigate("/employee/documents");
    } catch (err) {
      toast.error("Signing Failed", {
        description: err.data?.message || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for declining the document
  const handleDecline = async () => {
    if (!declineReason.trim()) {
      toast.error("Please provide a reason for declining.");
      return;
    }
    setIsSubmitting(true);
    try {
      await declineDocument({ id, reason: declineReason }).unwrap();
      toast.success("Document has been declined.");
      navigate("/employee/documents");
    } catch (err) {
      toast.error("Action Failed", {
        description: err.data?.message || "Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    document,
    isLoading,
    error,
    isSubmitting,
    signature,
    setSignature,
    declineReason,
    setDeclineReason,
    handleSign,
    handleDecline,
    navigate,
  };
};
