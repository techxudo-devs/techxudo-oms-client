import React, { useState } from "react";
import { FileText } from "lucide-react";
import PageLayout from "@/shared/components/layout/PagesLayout";
import { useManageDocument } from "@/admin/hooks/useManageDocument";
import { useManageEmployee } from "@/admin/hooks/useManageEmployee";
import { useManageDocumentRequests } from "@/admin/hooks/useManageDocumentRequests";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import TemplateSection from "@/admin/components/document/TemplateSection";
import DocumentSection from "@/admin/components/document/DocumentSection";
import DocumentRequestCard from "@/admin/components/document-requests/DocumentRequestCard";
import TemplateDialog from "@/admin/components/document/TemplateDialogue";
import CreateDocumentDialog from "@/admin/components/document/CreateDocumentDialog";
import UploadDocumentDialog from "@/admin/components/document/UploadDocumentDialog";

const UnifiedAdminDocumentManagement = () => {
  const documentHook = useManageDocument();
  const { employees } = useManageEmployee();
  const { documentRequests } = useManageDocumentRequests();

  const [isTemplateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [isCreateDocDialogOpen, setCreateDocDialogOpen] = useState(false);
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);

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
      title="Document Management Center"
      subtitle="Manage document templates, documents, and requests"
      icon={FileText}
    >
      <div className="space-y-8">
        {/* Main Content with Tabs */}
        <Tabs defaultValue="documents" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="requests">Document Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <TemplateSection
              templates={documentHook.templates}
              isLoading={documentHook.isLoading.templates}
              onAddNew={handleAddNewTemplate}
              onEdit={handleEditTemplate}
              onDelete={documentHook.handleDeleteTemplate}
            />
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <div className="space-y-4">
              {documentRequests.map((request) => (
                <DocumentRequestCard
                  key={request._id}
                  request={request}
                  employees={employees}
                  {...documentHook}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <TemplateDialog
        isOpen={isTemplateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        {...documentHook}
      />

      <CreateDocumentDialog
        isOpen={isCreateDocDialogOpen}
        onOpenChange={setCreateDocDialogOpen}
        employees={employees}
        {...documentHook}
      />

      <UploadDocumentDialog
        isOpen={isUploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        employees={employees}
        {...documentHook}
      />
    </PageLayout>
  );
};

export default UnifiedAdminDocumentManagement;