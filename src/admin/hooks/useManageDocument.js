import { useState, useCallback } from "react";
import {
  useGetDocumentTemplatesQuery,
  useCreateDocumentTemplateMutation,
  useUpdateDocumentTemplateMutation,
  useDeleteDocumentTemplateMutation,
  useGetDocumentsQuery,
  useCreateDocumentFromTemplateMutation,
  useUploadDocumentMutation,
  useResendDocumentMutation,
  useDeleteDocumentMutation,
} from "../apiSlices/documentApiSlice";
import { toast } from "sonner";

const initialTemplateForm = {
  name: "",
  type: "contract",
  content: "",
  placeholders: [],
};

const initialDocumentForm = {
  templateId: "",
  employeeId: "",
  placeholderValues: {},
};

/**
 * Manages all state and API interactions for document and template management.
 */
export const useManageDocument = () => {
  // --- LOCAL UI STATE ---
  const [templateForm, setTemplateForm] = useState(initialTemplateForm);
  const [documentForm, setDocumentForm] = useState(initialDocumentForm);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  const [filters, setFilters] = useState({ status: "" });

  // --- RTK QUERY HOOKS ---
  // Mutations
  const [createTemplate, { isLoading: isCreatingTemplate }] =
    useCreateDocumentTemplateMutation();
  const [updateTemplate, { isLoading: isUpdatingTemplate }] =
    useUpdateDocumentTemplateMutation();
  const [deleteTemplate, { isLoading: isDeletingTemplate }] =
    useDeleteDocumentTemplateMutation();
  const [createDocument, { isLoading: isCreatingDocument }] =
    useCreateDocumentFromTemplateMutation();
  const [uploadDocument, { isLoading: isUploadingDocument }] =
    useUploadDocumentMutation();
  const [resendDocument, { isLoading: isResendingDocument }] =
    useResendDocumentMutation();
  const [deleteDocument, { isLoading: isDeletingDocument }] =
    useDeleteDocumentMutation();

  // Queries
  const {
    data: templatesData,
    isLoading: templatesLoading,
    isError: templatesError,
  } = useGetDocumentTemplatesQuery();

  const {
    data: documentsData,
    isLoading: documentsLoading,
    isError: documentsError,
  } = useGetDocumentsQuery(filters, {
    // Skip fetching if filters are not ready, etc.
    skip: !filters,
  });

  // --- TEMPLATE ACTIONS ---
  const handleCreateTemplate = useCallback(
    async (templateData) => {
      try {
        const result = await createTemplate(templateData).unwrap();
        toast.success("Template created successfully");
        setTemplateForm(initialTemplateForm);
        return result;
      } catch (err) {
        toast.error("Failed to create template", {
          description: err.data?.message || "An error occurred.",
        });
        throw err;
      }
    },
    [createTemplate]
  );

  const handleUpdateTemplate = useCallback(
    async (id, templateData) => {
      try {
        const result = await updateTemplate({ id, ...templateData }).unwrap();
        toast.success("Template updated successfully");
        setCurrentTemplate(null);
        setTemplateForm(initialTemplateForm);
        return result;
      } catch (err) {
        toast.error("Failed to update template", {
          description: err.data?.message || "An error occurred.",
        });
        throw err;
      }
    },
    [updateTemplate]
  );

  const handleDeleteTemplate = useCallback(
    async (id) => {
      // Note: No manual refetch needed. This relies on the mutation invalidating a 'Templates' tag.
      try {
        await deleteTemplate(id).unwrap();
        toast.success("Template deleted successfully");
      } catch (err) {
        toast.error("Failed to delete template", {
          description: err.data?.message || "An error occurred.",
        });
      }
    },
    [deleteTemplate]
  );

  // --- DOCUMENT ACTIONS ---
  const handleCreateDocument = useCallback(
    async (documentData) => {
      try {
        const result = await createDocument(documentData).unwrap();
        toast.success("Document created and sent successfully");
        setDocumentForm(initialDocumentForm);
        return result;
      } catch (err) {
        toast.error("Failed to create document", {
          description: err.data?.message || "An error occurred.",
        });
        throw err;
      }
    },
    [createDocument]
  );

  const handleUploadDocument = useCallback(
    async (formData) => {
      try {
        const result = await uploadDocument(formData).unwrap();
        toast.success("Document uploaded and sent successfully");
        return result;
      } catch (err) {
        toast.error("Failed to upload document", {
          description: err.data?.message || "An error occurred.",
        });
        throw err;
      }
    },
    [uploadDocument]
  );

  const handleResendDocument = useCallback(
    async (id) => {
      try {
        await resendDocument(id).unwrap();
        toast.success("Document resent successfully");
      } catch (err) {
        toast.error("Failed to resend document", {
          description: err.data?.message || "An error occurred.",
        });
      }
    },
    [resendDocument]
  );

  const handleDeleteDocument = useCallback(
    async (id) => {
      // Note: No manual refetch needed. This relies on the mutation invalidating a 'Documents' tag.
      try {
        await deleteDocument(id).unwrap();
        toast.success("Document deleted successfully");
      } catch (err) {
        toast.error("Failed to delete document", {
          description: err.data?.message || "An error occurred.",
        });
      }
    },
    [deleteDocument]
  );

  // --- FORM HELPERS ---
  const updateTemplateFormValue = useCallback((field, value) => {
    setTemplateForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateDocumentFormValue = useCallback((field, value) => {
    setDocumentForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetTemplateForm = useCallback(() => {
    setTemplateForm(initialTemplateForm);
    setCurrentTemplate(null);
  }, []);

  const loadTemplateForEdit = useCallback((template) => {
    setCurrentTemplate(template);
    setTemplateForm({
      name: template.name,
      type: template.type,
      content: template.content,
      placeholders: template.placeholders || [],
    });
  }, []);

  return {
    // State
    templates: templatesData?.data || [],
    documents: documentsData?.data || [],
    currentTemplate,
    templateForm,
    documentForm,
    filters,
    setFilters,

    // Derived State (Loading and Errors)
    isLoading: {
      templates: templatesLoading,
      documents: documentsLoading,
      creatingTemplate: isCreatingTemplate,
      updatingTemplate: isUpdatingTemplate,
      deletingTemplate: isDeletingTemplate,
      creatingDocument: isCreatingDocument,
      uploading: isUploadingDocument,
      resending: isResendingDocument,
      deletingDocument: isDeletingDocument,
    },
    isError: templatesError || documentsError,

    // Actions
    handleCreateTemplate,
    handleUpdateTemplate,
    handleDeleteTemplate,
    handleCreateDocument,
    handleUploadDocument,
    handleResendDocument,
    handleDeleteDocument,

    // Form Helpers
    updateTemplateFormValue,
    updateDocumentFormValue,
    resetTemplateForm,
    loadTemplateForEdit,
  };
};
