import React from "react";
import PageLayout from "../../../shared/components/layout/PagesLayout";
import { useDocumentSigning } from "../../hooks/useSigningDocument";
import DOMPurify from "dompurify";
import SignatureCanvas from "../../utils/SignatureCanvas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  FileSignature,
  ThumbsDown,
  CornerUpLeft,
  PaperclipIcon,
} from "lucide-react";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    sent: {
      label: "Pending",
      variant: "yellow",
      icon: <Clock className="h-3 w-3" />,
    },
    signed: {
      label: "Signed",
      variant: "green",
      icon: <CheckCircle className="h-3 w-3" />,
    },
    declined: {
      label: "Declined",
      variant: "destructive",
      icon: <XCircle className="h-3 w-3" />,
    },
    viewed: {
      label: "Viewed",
      variant: "blue",
      icon: <Clock className="h-3 w-3" />,
    },
  };
  const config = statusConfig[status] || {
    label: "Unknown",
    variant: "secondary",
  };
  return (
    <Badge variant={config.variant} className="gap-1.5 pl-2">
      {config.icon}
      {config.label}
    </Badge>
  );
};

const DocumentSigningPage = () => {
  const {
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
  } = useDocumentSigning();

  if (isLoading) {
    return (
      <PageLayout title="Loading Document...">
        <div className="flex justify-center pt-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout title="Error">
        <div className="text-destructive text-center pt-20">
          {error?.data?.message || "Could not load the document."}
        </div>
      </PageLayout>
    );
  }

  const sanitizedContent = DOMPurify.sanitize(document.content);

  return (
    <PageLayout
      title="Document Review"
      icon={PaperclipIcon}
      subtitle={`Review and sign the document: ${document.title}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Document Viewer */}
        <div className="lg:col-span-2">
          <div className="h-[80vh] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-primary" />
                Document Content
              </CardTitle>
              <StatusBadge status={document.status} />
            </CardHeader>
            <CardContent className="flex-1 mt-6 overflow-y-auto min-h-0">
              <div
                className="prose max-w-none prose-sm sm:prose-base"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            </CardContent>
          </div>
        </div>

        {/* Right Column: Action Panel */}
        <div className="lg:col-span-1 sticky top-24">
          <Card>
            <CardHeader>
              <CardTitle>Action Panel</CardTitle>
              <CardDescription>
                Provide your signature or decline the document.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {document.status === "sent" || document.status === "viewed" ? (
                <>
                  {/* Signing Section */}
                  <div className="space-y-4 p-4  rounded-lg bg-slate-50">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FileSignature className="h-5 w-5 text-primary" />
                      Provide Your Signature
                    </h3>
                    <SignatureCanvas
                      signature={signature}
                      setSignature={setSignature}
                    />
                    <Button
                      onClick={handleSign}
                      disabled={isSubmitting || !signature}
                      className="w-full gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {isSubmitting ? "Submitting..." : "Sign & Approve"}
                    </Button>
                  </div>

                  {/* Decline Section */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm text-center text-muted-foreground">
                      Or, if you wish to decline:
                    </h3>
                    <Input
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      placeholder="Provide a reason for declining..."
                    />
                    <Button
                      onClick={handleDecline}
                      disabled={isSubmitting || !declineReason.trim()}
                      variant="destructive"
                      className="w-full gap-2"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      Decline Document
                    </Button>
                  </div>
                </>
              ) : (
                // Final State (Signed or Declined)
                <div className="text-center py-8 space-y-4">
                  {document.status === "signed" ? (
                    <>
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                      <h3 className="text-xl font-semibold">Document Signed</h3>
                      <p className="text-muted-foreground">
                        Thank you. This action has been recorded.
                      </p>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-16 w-16 text-destructive mx-auto" />
                      <h3 className="text-xl font-semibold">
                        Document Declined
                      </h3>
                      <p className="text-muted-foreground">
                        This action has been recorded.
                      </p>
                    </>
                  )}
                  <Button
                    onClick={() => navigate("/employee/documents")}
                    variant="outline"
                    className="gap-2"
                  >
                    <CornerUpLeft className="h-4 w-4" />
                    Back to Documents
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default DocumentSigningPage;
