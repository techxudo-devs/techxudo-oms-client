import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

/**
 * ReviewConfirmationModal - Modal for confirming approval/rejection
 * Separated component for better maintainability (~50 lines)
 */
const ReviewConfirmationModal = ({
  open,
  onClose,
  reviewAction,
  feedback,
  onFeedbackChange,
  onSubmit,
  isSubmitting,
  error,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {reviewAction === "approve"
              ? "Approve Employment Form"
              : "Reject Employment Form"}
          </DialogTitle>
          <DialogDescription>
            {reviewAction === "approve"
              ? "This will approve the form and proceed to contract generation."
              : "Please provide feedback on why this form is being rejected."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="feedback">
              Feedback {reviewAction === "reject" && "(Required)"}
            </Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => onFeedbackChange(e.target.value)}
              placeholder="Enter your feedback here..."
              rows={4}
              className="mt-2"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={isSubmitting || (reviewAction === "reject" && !feedback.trim())}
              className={
                reviewAction === "approve" ? "bg-green-600 hover:bg-green-700" : ""
              }
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                `Confirm ${reviewAction === "approve" ? "Approval" : "Rejection"}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewConfirmationModal;
