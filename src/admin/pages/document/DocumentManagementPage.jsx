import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import PageLayout from "@/shared/components/layout/PagesLayout";
import { useManageDocument } from "@/admin/hooks/useManageDocument";
import { useManageEmployee } from "@/admin/hooks/useManageEmployee";
import TemplateSection from "@/admin/components/document/TemplateSection";
import DocumentSection from "@/admin/components/document/DocumentSection";
import TemplateDialog from "@/admin/components/document/TemplateDialogue";
import CreateDocumentDialog from "@/admin/components/document/CreateDocumentDialog";
import UploadDocumentDialog from "@/admin/components/document/UploadDocumentDialog";
const DocumentManagement = () => {
  const documentHook = useManageDocument();
  const { employees } = useManageEmployee(); // Get employee data

  const [isTemplateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [isCreateDocDialogOpen, setCreateDocDialogOpen] = useState(false);
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Fetch employees when the component mounts

  const handleEditTemplate = (template) => {
    documentHook.loadTemplateForEdit(template);
    setTemplateDialogOpen(true);
  };

  const handleAddNewTemplate = () => {
    documentHook.resetTemplateForm();
    setTemplateDialogOpen(true);
  };

  return (
    <PageLayout
      title="Document Center"
      subtitle="Manage document templates and employee documents"
      icon={FileText}
    >
      <div className="space-y-8">
        <TemplateSection
          templates={documentHook.templates}
          isLoading={documentHook.isLoading.templates}
          onAddNew={handleAddNewTemplate}
          onEdit={handleEditTemplate}
          onDelete={documentHook.handleDeleteTemplate}
        />

        <DocumentSection
          documents={documentHook.documents}
          isLoading={documentHook.isLoading.documents}
          filters={documentHook.filters}
          setFilters={documentHook.setFilters}
          onDelete={documentHook.handleDeleteDocument}
          onResend={documentHook.handleResendDocument}
          onCreate={() => setCreateDocDialogOpen(true)}
          onUpload={() => setUploadDialogOpen(true)}
        />
      </div>

      <TemplateDialog
        isOpen={isTemplateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        {...documentHook}
      />

      <CreateDocumentDialog
        isOpen={isCreateDocDialogOpen}
        onOpenChange={setCreateDocDialogOpen}
        employees={employees} // Pass employee list
        {...documentHook}
      />

      <UploadDocumentDialog
        isOpen={isUploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        employees={employees} // Pass employee list
        {...documentHook}
      />
    </PageLayout>
  );
};

export default DocumentManagement;
