import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Upload,
  X,
  Eye,
  Check,
  FileDown,
  Loader2,
  FileIcon,
  Plus,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useLazyPreviewBrandedTemplateQuery,
  useGenerateBrandedTemplateMutation,
} from "@/shared/store/features/documentTemplateApiSlice";

const DocumentsStep = ({ formData, updateField, errors }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Environment variables
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // --- Logic Handling (Kept Original) ---
  const handleUpload = async (file, name) => {
    if (!file) return;
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
    setUploadProgress(0);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", uploadPreset);
      fd.append("folder", "org_documents");

      const data = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        );
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(pct);
          }
        };
        xhr.onload = () => {
          try {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error(`Upload failed (${xhr.status})`));
            }
          } catch (err) {
            reject(err);
          }
        };
        xhr.onerror = () => reject(new Error("Network error during upload"));
        xhr.send(fd);
      });
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
      setUploadProgress(0);
    }
  };

  const removeDoc = (index) => {
    const docs = [...(formData.documents || [])];
    docs.splice(index, 1);
    updateField("documents", docs);
  };

  const [generatingFor, setGeneratingFor] = useState("");
  const [triggerPreview] = useLazyPreviewBrandedTemplateQuery();
  const [generateBranded] = useGenerateBrandedTemplateMutation();

  const addTemplate = async (template) => {
    const docs = Array.isArray(formData.documents) ? formData.documents : [];
    setGeneratingFor(template.id);
    try {
      const data = await generateBranded({
        type: template.id,
        variables: {},
        fileName:
          template.name?.toLowerCase().replace(/\s+/g, "_") || template.id,
        branding: brandingOverrides,
      }).unwrap();
      if (!data?.success || !data?.url) {
        throw new Error(data?.message || "Failed to generate PDF");
      }
      updateField("documents", [
        ...docs,
        { name: template.name, type: "pdf", url: data.url },
      ]);
      toast.success("Template generated and added");
    } catch (e) {
      console.error("Template generate error", e);
      toast.error("PDF generation failed. Added as reference.");
      updateField("documents", [
        ...docs,
        { name: template.name, type: "template", url: template.id },
      ]);
    } finally {
      setGeneratingFor("");
    }
  };

  const templates = [
    { id: "tpl_agreement_modern", name: "Employment Agreement" },
    { id: "tpl_increment_letter", name: "Increment Letter" },
    { id: "tpl_recommendation", name: "Recommendation Letter" },
    { id: "tpl_experience", name: "Experience Letter" },
  ];

  const [previewHtml, setPreviewHtml] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTpl, setPreviewTpl] = useState(null);

  const brandingOverrides = useMemo(() => {
    const theme = formData?.theme || {};
    const logoCandidate =
      typeof formData?.logo === "string"
        ? formData.logo
        : formData?.logoPreview || "";
    return {
      companyName: formData?.companyName || "",
      logo: logoCandidate || "",
      theme: {
        primaryColor: theme.primaryColor,
        secondaryColor: theme.secondaryColor,
        accentColor: theme.accentColor,
      },
      address: formData?.address || {},
    };
  }, [formData]);

  const previewTemplate = async (tplId) => {
    try {
      const data = await triggerPreview({
        type: tplId,
        branding: brandingOverrides,
      }).unwrap();
      if (!data.success) throw new Error(data.message || "Preview failed");
      setPreviewHtml(data.html);
      setPreviewOpen(true);
      const tpl = templates.find((t) => t.id === tplId) || null;
      setPreviewTpl(tpl);
    } catch (e) {
      console.error("Preview error", e);
      toast.error(e.message || "Failed to load preview");
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 ">
      <div className="mb-10 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Documents & Contracts
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage your company documentation or generate new ones from branded
          templates.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Left Column: Upload & List (5 cols) */}
        <div className="xl:col-span-5 space-y-8">
          {/* Upload Area */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Upload Files
            </Label>
            <div
              className={cn(
                "group relative overflow-hidden rounded-xl border border-dashed transition-all duration-200",
                uploading
                  ? "border-primary/30 bg-primary/5"
                  : "border-gray-300 hover:border-gray-400 bg-gray-50/50 hover:bg-gray-50",
              )}
            >
              <input
                id="doc-upload"
                type="file"
                accept=".pdf,.doc,.docx"
                className="absolute inset-0 z-10 cursor-pointer opacity-0"
                onChange={(e) => handleUpload(e.target.files?.[0])}
                disabled={uploading}
              />
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div
                  className={cn(
                    "mb-3 rounded-full bg-white p-3 shadow-sm ring-1 ring-black/5 transition-transform duration-200",
                    !uploading && "group-hover:scale-110",
                  )}
                >
                  {uploading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <Upload className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    {uploading ? "Uploading..." : "Click or drag to upload"}
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF or Word documents up to 10MB
                  </p>
                </div>

                {/* Progress Bar */}
                {uploading && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100">
                    <div
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
            {uploadError && (
              <p className="text-xs font-medium text-red-600 flex items-center gap-1.5 animate-in slide-in-from-top-1">
                <X className="w-3 h-3" /> {uploadError}
              </p>
            )}
          </div>

          {/* Uploaded List */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Your Documents
            </Label>
            <div className="space-y-2">
              {(formData.documents || []).length === 0 ? (
                <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-gray-200 bg-white text-sm text-gray-400">
                  No documents added yet
                </div>
              ) : (
                (formData.documents || []).map((doc, idx) => (
                  <div
                    key={idx}
                    className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-gray-900">
                          {doc.name}
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary transition-colors"
                        >
                          <Eye className="w-3 h-3" /> Preview
                        </a>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDoc(idx)}
                      className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Templates Grid (7 cols) */}
        <div className="xl:col-span-7">
          <div className="mb-4">
            <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Template Library
            </Label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md"
              >
                {/* Visual Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-slate-50 border border-gray-100 group-hover:bg-slate-100/50 transition-colors">
                  {/* Abstract Doc UI */}
                  <div className="absolute inset-x-8 top-4 bottom-0 bg-white rounded-t-lg shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] border border-gray-200 p-3 opacity-90 transition-transform duration-300 group-hover:-translate-y-1">
                    <div className="space-y-2">
                      <div className="h-2 w-1/3 rounded-full bg-slate-200" />
                      <div className="h-1.5 w-full rounded-full bg-slate-100" />
                      <div className="h-1.5 w-5/6 rounded-full bg-slate-100" />
                      <div className="h-1.5 w-4/6 rounded-full bg-slate-100" />
                    </div>
                  </div>

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/40 backdrop-blur-[2px]">
                    <Button
                      onClick={() => previewTemplate(tpl.id)}
                      variant="secondary"
                      size="sm"
                      className="h-8 px-3 bg-white shadow-sm hover:bg-gray-50 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview
                    </Button>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-3">
                  <div className="px-1">
                    <h3
                      className="font-medium text-sm text-gray-900 truncate"
                      title={tpl.name}
                    >
                      {tpl.name}
                    </h3>
                  </div>

                  <div className="grid grid-cols-[1fr,auto] gap-2">
                    <Button
                      onClick={() => {
                        const docs = Array.isArray(formData.documents)
                          ? formData.documents
                          : [];
                        updateField("documents", [
                          ...docs,
                          { name: tpl.name, type: "template", url: tpl.id },
                        ]);
                        toast.success("Template selected");
                      }}
                      size="sm"
                      className="h-9 bg-gray-900 hover:bg-gray-800 text-white shadow-sm text-xs"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1.5" />
                      Add to List
                    </Button>

                    <Button
                      onClick={() => addTemplate(tpl)}
                      disabled={!!generatingFor}
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 border-dashed"
                      title="Generate PDF now"
                    >
                      {generatingFor === tpl.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-600" />
                      ) : (
                        <FileDown className="w-3.5 h-3.5 text-gray-600" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modern Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[90vw] w-[1000px] h-[85vh] p-0 gap-0 overflow-hidden sm:rounded-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] h-full">
            {/* Main Preview Area */}
            <div className="flex flex-col h-full bg-gray-100/50">
              <div className="h-14 shrink-0 flex items-center justify-between px-6 border-b bg-white">
                <div className="flex items-center gap-2">
                  <FileIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">
                    {previewTpl?.name}{" "}
                    <span className="text-gray-400 font-normal">(Preview)</span>
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-hidden relative">
                {!previewHtml && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
                  </div>
                )}
                <div className="h-full w-full overflow-y-auto p-8 flex justify-center">
                  {previewHtml && (
                    <div className="w-[210mm] min-h-[297mm] bg-white shadow-lg ring-1 ring-black/5">
                      <iframe
                        title="preview"
                        className="w-full h-[calc(100vh-200px)]" // approximate height
                        srcDoc={previewHtml}
                        style={{ border: "none", height: "1000px" }} // Force height for iframe content
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar Controls */}
            <div className="border-l bg-white flex flex-col h-full">
              <div className="p-5 border-b">
                <DialogTitle className="text-base font-semibold">
                  Actions
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  This document is auto-branded with your logo and colors.
                </p>
              </div>

              <div className="p-5 space-y-4 flex-1">
                <Button
                  className="w-full h-10 shadow-sm"
                  disabled={!!generatingFor || !previewTpl}
                  onClick={() => previewTpl && addTemplate(previewTpl)}
                >
                  {generatingFor === (previewTpl?.id || "") ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4 mr-2" />
                      Generate & Attach PDF
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-10"
                  disabled={!!generatingFor || !previewTpl}
                  onClick={() => {
                    if (!previewTpl) return;
                    const docs = Array.isArray(formData.documents)
                      ? formData.documents
                      : [];
                    updateField("documents", [
                      ...docs,
                      {
                        name: previewTpl.name,
                        type: "template",
                        url: previewTpl.id,
                      },
                    ]);
                    toast.success("Template selected");
                    setPreviewOpen(false);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Select Template Only
                </Button>
              </div>

              <div className="p-5 bg-gray-50 border-t">
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  <strong>Note:</strong> Generating a PDF creates a static file.
                  Selecting the template allows dynamic generation later.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentsStep;
