import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Mail, Shield, Sparkles, Save, X, Info } from "lucide-react";

const TemplateDialog = ({
  isOpen,
  onOpenChange,
  templateForm,
  currentTemplate,
  updateTemplateFormValue,
  handleCreateTemplate,
  handleUpdateTemplate,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (currentTemplate) {
        await handleUpdateTemplate(currentTemplate._id, templateForm);
      } else {
        await handleCreateTemplate(templateForm);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving template:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const templateTypes = [
    {
      value: "nda",
      label: "NDA",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      value: "contract",
      label: "Contract",
      icon: Mail,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      value: "undertaking",
      label: "Undertaking",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const selectedType = templateTypes.find((t) => t.value === templateForm.type);

  // Enhanced Quill modules for professional editing
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
  ];

  const placeholderExamples = [
    "{{employee_name}}",
    "{{company_name}}",
    "{{date}}",
    "{{position}}",
    "{{salary}}",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] h-[90vh]  flex flex-col p-0">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-slate-50 to-gray-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {currentTemplate ? "Edit Template" : "Create New Template"}
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {currentTemplate
                    ? "Update your template details and content"
                    : "Design a reusable document template"}
                </p>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto min-h-0  px-6 py-5 space-y-5">
            {/* Template Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Template Name
              </label>
              <Input
                placeholder="e.g., Standard Employment Contract"
                value={templateForm.name}
                onChange={(e) =>
                  updateTemplateFormValue("name", e.target.value)
                }
                required
                className="h-11 text-base border-gray-200 focus:border-primary focus:ring-primary/20"
              />
            </div>

            {/* Template Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Template Type
              </label>
              <Select
                value={templateForm.type}
                onValueChange={(value) =>
                  updateTemplateFormValue("type", value)
                }
              >
                <SelectTrigger className="h-11 border-gray-200 focus:border-primary focus:ring-primary/20">
                  <SelectValue placeholder="Select template type">
                    {selectedType && (
                      <div className="flex items-center gap-2">
                        <selectedType.icon
                          className={`h-4 w-4 ${selectedType.color}`}
                        />
                        <span>{selectedType.label}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {templateTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className={`h-4 w-4 ${type.color}`} />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Placeholder Info */}
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm text-blue-800">
                  Use placeholders to create dynamic content that can be filled
                  in later.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {placeholderExamples.map((placeholder) => (
                    <Badge
                      key={placeholder}
                      variant="secondary"
                      className="text-xs bg-white text-blue-700 border border-blue-200 font-mono"
                    >
                      {placeholder}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Rich Text Editor */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Template Content
              </label>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <ReactQuill
                  theme="snow"
                  value={templateForm.content}
                  onChange={(value) =>
                    updateTemplateFormValue("content", value)
                  }
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Start writing your template content..."
                  className="template-editor"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 -mt-4  gap-2 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {currentTemplate ? "Update Template" : "Save Template"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Custom styles for Quill editor */}
      <style jsx global>{`
        .template-editor .ql-toolbar {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          padding: 12px;
        }

        .template-editor .ql-container {
          border: none;
          font-family: inherit;
          font-size: 14px;
          min-height: 250px;
        }

        .template-editor .ql-editor {
          padding: 16px;
          min-height: 250px;
          line-height: 1.6;
        }

        .template-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
          left: 16px;
        }

        .template-editor .ql-toolbar button:hover,
        .template-editor .ql-toolbar button:focus,
        .template-editor .ql-toolbar .ql-picker-label:hover,
        .template-editor .ql-toolbar .ql-picker-item:hover {
          color: hsl(var(--primary));
        }

        .template-editor .ql-toolbar button.ql-active,
        .template-editor .ql-toolbar .ql-picker-label.ql-active {
          color: hsl(var(--primary));
        }

        .template-editor .ql-snow.ql-toolbar button:hover .ql-stroke,
        .template-editor .ql-snow .ql-toolbar button:hover .ql-stroke,
        .template-editor .ql-snow.ql-toolbar button:focus .ql-stroke,
        .template-editor .ql-snow .ql-toolbar button:focus .ql-stroke,
        .template-editor .ql-snow.ql-toolbar button.ql-active .ql-stroke,
        .template-editor .ql-snow .ql-toolbar button.ql-active .ql-stroke {
          stroke: hsl(var(--primary));
        }

        .template-editor .ql-snow.ql-toolbar button:hover .ql-fill,
        .template-editor .ql-snow .ql-toolbar button:hover .ql-fill,
        .template-editor .ql-snow.ql-toolbar button:focus .ql-fill,
        .template-editor .ql-snow .ql-toolbar button:focus .ql-fill,
        .template-editor .ql-snow.ql-toolbar button.ql-active .ql-fill,
        .template-editor .ql-snow .ql-toolbar button.ql-active .ql-fill {
          fill: hsl(var(--primary));
        }
      `}</style>
    </Dialog>
  );
};

export default TemplateDialog;
