import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/shared/utils/cloudinary";

const UploadDocumentDialog = ({
  isOpen,
  onOpenChange,
  employees,
  handleUploadDocument,
  isLoading,
}) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else if (selectedFile) {
      toast.error("Invalid File", { description: "Please select a PDF file." });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a PDF file to upload.");
      return;
    }

    try {
      // First upload the file to Cloudinary
      toast.info("Uploading document to cloud storage...");

      // Upload PDF to Cloudinary with 'raw' resource type for PDF files
      const pdfUrl = await uploadToCloudinary(file, undefined, "raw");

      if (!pdfUrl) {
        throw new Error("Failed to upload document to cloud storage");
      }

      // Now send document metadata with the cloudinary URL to backend
      await handleUploadDocument({
        title,
        employeeId,
        type: "custom",
        pdfUrl,
      });

      toast.success("Document uploaded and sent successfully");

      // Reset form
      onOpenChange(false);
      setFile(null);
      setTitle("");
      setEmployeeId("");
      setUploadProgress(0);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload Failed", {
        description:
          error.message || "An error occurred while uploading the document.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Upload Custom Document</DialogTitle>
            <DialogDescription>
              Select a PDF file, assign a title, and choose an employee to send
              it to.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Employment Contract"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employee" className="text-right">
                Employee
              </Label>
              <Select value={employeeId} onValueChange={setEmployeeId} required>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp._id} value={emp._id}>
                      {emp.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                PDF File
              </Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                // Reset form when dialog is closed
                setFile(null);
                setTitle("");
                setEmployeeId("");
                setUploadProgress(0);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading.uploading || !file || !title || !employeeId}
            >
              {isLoading.uploading ? "Uploading..." : "Upload & Send"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
