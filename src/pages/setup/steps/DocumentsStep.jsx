import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Upload, X, PlusCircle, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog.jsx";
import { Button as UIButton } from "@/components/ui/button.jsx";
import { toast } from "sonner";

// Step: Documents — upload custom documents and pick from templates
const DocumentsStep = ({ formData, updateField, errors }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const handleUpload = async (file, name) => {
    if (!file) return;
    // Accept pdf/doc/docx only
    const okTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!okTypes.includes(file.type)) {
      setUploadError("Please upload PDF or Word documents");
      return;
    }
    if (!cloudName || !uploadPreset) {
      setUploadError("Cloudinary is not configured");
      return;
    }
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", uploadPreset);
      fd.append("folder", "org_documents");
      // Resource type auto allows pdf/docx
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        { method: "POST", body: fd },
      );
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const newDoc = {
        name: name || file.name,
        type: file.type,
        url: data.secure_url,
      };
      const docs = Array.isArray(formData.documents) ? formData.documents : [];
      updateField("documents", [...docs, newDoc]);
    } catch (e) {
      console.error("Document upload error", e);
      setUploadError(e.message || "Failed to upload");
    } finally {
      setUploading(false);
    }
  };

  const removeDoc = (index) => {
    const docs = [...(formData.documents || [])];
    docs.splice(index, 1);
    updateField("documents", docs);
  };

  const addTemplate = (template) => {
    const docs = Array.isArray(formData.documents) ? formData.documents : [];
    updateField("documents", [
      ...docs,
      { name: template.name, type: "template", url: template.id },
    ]);
  };

  const templates = [
    { id: "tpl_agreement_modern", name: "Employment Agreement (Modern)" },
    { id: "tpl_increment_letter", name: "Increment Letter" },
    { id: "tpl_recommendation", name: "Recommendation Letter" },
    { id: "tpl_experience", name: "Experience Letter" },
  ];

  const [previewHtml, setPreviewHtml] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  const previewTemplate = async (tplId) => {
    try {
      const res = await fetch(`/api/documents/templates/preview?type=${encodeURIComponent(tplId)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Preview failed");
      setPreviewHtml(data.html);
      setPreviewOpen(true);
    } catch (e) {
      console.error("Preview error", e);
      toast.error(e.message || "Failed to load preview");
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <div className="inline-flex p-3 rounded-xl bg-gray-100 mb-4">
          <FileText className="w-6 h-6 text-gray-900" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Documents</h2>
        <p className="text-gray-600">
          Upload your company documents or select from pre‑made templates that
          adapt to your branding.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-900 mb-2 block">
              Upload Documents
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
              <input
                id="doc-upload"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={(e) => handleUpload(e.target.files?.[0])}
                disabled={uploading}
              />
              <label
                htmlFor="doc-upload"
                className={`cursor-pointer inline-flex items-center gap-2 text-sm font-medium ${uploading ? "opacity-50 pointer-events-none" : ""}`}
              >
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : "Click to upload PDF or Word"}
              </label>
              {uploadError && (
                <p className="text-sm text-red-600 mt-2">{uploadError}</p>
              )}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-900 mb-2 block">
              Your Documents
            </Label>
            <div className="space-y-2">
              {(formData.documents || []).length === 0 && (
                <p className="text-sm text-gray-500">No documents added yet</p>
              )}
              {(formData.documents || []).map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border bg-white"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {doc.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {doc.url}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeDoc(idx)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Templates */}
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-2 block">
            Pre‑made Templates
          </Label>
          <p className="text-xs text-gray-500 mb-4">
            Modern templates with abstract shapes that adapt your logo and theme
            colors.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="rounded-lg border bg-white p-3 flex flex-col gap-3"
              >
                <div className="h-24 rounded bg-accent/20 flex items-center justify-center text-xs text-accent-foreground">
                  {tpl.name}
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => addTemplate(tpl)} size="sm" className="h-9">
                    <PlusCircle className="w-4 h-4 mr-2" /> Add
                  </Button>
                  <UIButton onClick={() => previewTemplate(tpl.id)} variant="secondary" className="h-9">
                    <Eye className="w-4 h-4 mr-2" /> Preview
                  </UIButton>
                </div>
              </div>
            ))}
          </div>
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogContent className="max-w-4xl h-[80vh]">
              <DialogHeader>
                <DialogTitle>Template Preview</DialogTitle>
              </DialogHeader>
              <div className="w-full h-full overflow-auto bg-gray-50 border rounded">
                {previewHtml ? (
                  <iframe title="preview" className="w-full h-full" srcDoc={previewHtml} />
                ) : (
                  <div className="p-6 text-sm text-gray-500">Loading...</div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default DocumentsStep;
