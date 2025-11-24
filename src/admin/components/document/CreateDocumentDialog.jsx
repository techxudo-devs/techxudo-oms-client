import React, { useState, useEffect, useMemo } from "react";
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
import { Search, FileText, User, Sparkles } from "lucide-react";

const CreateDocumentDialog = ({
  isOpen,
  onOpenChange,
  templates,
  employees,
  handleCreateDocument,
  isLoading,
}) => {
  const [templateId, setTemplateId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [placeholderValues, setPlaceholderValues] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [templateSearch, setTemplateSearch] = useState("");

  // Filter employees based on search
  const filteredEmployees = useMemo(() => {
    if (!employeeSearch) return employees;
    return employees.filter((emp) =>
      emp.fullName.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      emp.email?.toLowerCase().includes(employeeSearch.toLowerCase())
    );
  }, [employees, employeeSearch]);

  // Filter templates based on search
  const filteredTemplates = useMemo(() => {
    if (!templateSearch) return templates;
    return templates.filter((t) =>
      t.name.toLowerCase().includes(templateSearch.toLowerCase())
    );
  }, [templates, templateSearch]);

  // When a template is chosen, update the form to show its placeholders
  useEffect(() => {
    if (templateId) {
      const template = templates.find((t) => t._id === templateId);
      setSelectedTemplate(template);

      const initialValues = {};
      template?.placeholders?.forEach((key) => {
        const cleanKey = key.replace(/{{|}}/g, "");
        initialValues[cleanKey] = "";
      });
      setPlaceholderValues(initialValues);
    } else {
      setSelectedTemplate(null);
      setPlaceholderValues({});
    }
  }, [templateId, templates]);

  const handlePlaceholderChange = (key, value) => {
    setPlaceholderValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleCreateDocument({ templateId, employeeId, placeholderValues });
    onOpenChange(false);
    setTemplateId("");
    setEmployeeId("");
    setEmployeeSearch("");
    setTemplateSearch("");
  };

  const selectedEmployee = employees.find(emp => emp._id === employeeId);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-3 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-brand-primary/10 p-2.5 rounded-lg">
                <Sparkles className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">Create New Document</DialogTitle>
                <DialogDescription className="text-sm mt-1">
                  Select a template and employee to generate a new document
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Template Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="h-4 w-4 text-brand-primary" />
                Document Template
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  className="pl-9 mb-2"
                />
              </div>
              <Select onValueChange={setTemplateId} value={templateId} required>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {filteredTemplates.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No templates found
                    </div>
                  ) : (
                    filteredTemplates.map((t) => (
                      <SelectItem key={t._id} value={t._id}>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-brand-primary" />
                          <span>{t.name}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Employee Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <User className="h-4 w-4 text-brand-primary" />
                Assign to Employee
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  className="pl-9 mb-2"
                />
              </div>
              <Select onValueChange={setEmployeeId} value={employeeId} required>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Choose an employee" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {filteredEmployees.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No employees found
                    </div>
                  ) : (
                    filteredEmployees.map((emp) => (
                      <SelectItem key={emp._id} value={emp._id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{emp.fullName}</span>
                          {emp.email && (
                            <span className="text-xs text-gray-500">{emp.email}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedEmployee && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{selectedEmployee.fullName}</p>
                      {selectedEmployee.email && (
                        <p className="text-xs text-gray-600">{selectedEmployee.email}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Placeholder Fields */}
            {selectedTemplate && selectedTemplate.placeholders.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="bg-amber-50 p-1.5 rounded">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Template Fields</h4>
                </div>
                <div className="space-y-4 bg-gray-50 rounded-lg p-4">
                  {selectedTemplate.placeholders.map((p) => {
                    const key = p.replace(/{{|}}/g, "");
                    return (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={key} className="text-sm font-medium text-gray-700 capitalize">
                          {key.replace(/_/g, " ")}
                        </Label>
                        <Input
                          id={key}
                          value={placeholderValues[key] || ""}
                          onChange={(e) =>
                            handlePlaceholderChange(key, e.target.value)
                          }
                          className="bg-white"
                          placeholder={`Enter ${key.replace(/_/g, " ")}`}
                          required
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading.creatingDocument || !templateId || !employeeId}
              className="min-w-[140px]"
            >
              {isLoading.creatingDocument ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                "Create & Send"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDocumentDialog;
