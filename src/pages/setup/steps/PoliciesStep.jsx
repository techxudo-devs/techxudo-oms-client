import { useState } from "react";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Step 6: Company Policies
 * Add and manage company policies (optional)
 */
const PoliciesStep = ({ formData, updateField, errors }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentPolicy, setCurrentPolicy] = useState({
    title: "",
    content: "",
    isRequired: false,
    order: 0,
  });
  const [policyErrors, setPolicyErrors] = useState({});

  // Common policy templates
  const policyTemplates = [
    {
      title: "Code of Conduct",
      content:
        "All employees are expected to maintain professional behavior, respect colleagues, and adhere to company values at all times.",
    },
    {
      title: "Leave Policy",
      content:
        "Employees are entitled to annual leave, sick leave, and other types of leave as per company policy. Leave requests must be submitted in advance through the system.",
    },
    {
      title: "Remote Work Policy",
      content:
        "Employees may work remotely subject to manager approval. Remote workers must be available during core hours and maintain regular communication with their team.",
    },
    {
      title: "Confidentiality Agreement",
      content:
        "Employees must not disclose any confidential information, trade secrets, or proprietary data obtained during employment without proper authorization.",
    },
  ];

  // Validate policy form
  const validatePolicy = () => {
    const newErrors = {};

    if (!currentPolicy.title.trim()) {
      newErrors.title = "Policy title is required";
    }

    if (!currentPolicy.content.trim()) {
      newErrors.content = "Policy content is required";
    }

    // Check for duplicate policy title (case-insensitive)
    const isDuplicate = formData.policies.some(
      (policy, index) =>
        policy.title.toLowerCase().trim() ===
          currentPolicy.title.toLowerCase().trim() && index !== editingIndex // Exclude currently editing policy
    );

    if (isDuplicate) {
      newErrors.title = "A policy with this title already exists";
    }

    setPolicyErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add new policy
  const handleAddPolicy = () => {
    if (!validatePolicy()) return;

    const newPolicy = {
      ...currentPolicy,
      order: formData.policies.length,
    };

    updateField("policies", [...formData.policies, newPolicy]);
    resetForm();
  };

  // Update existing policy
  const handleUpdatePolicy = () => {
    if (!validatePolicy()) return;

    const updatedPolicies = [...formData.policies];
    updatedPolicies[editingIndex] = { ...currentPolicy };
    updateField("policies", updatedPolicies);
    resetForm();
  };

  // Delete policy
  const handleDeletePolicy = (index) => {
    const updatedPolicies = formData.policies.filter((_, i) => i !== index);
    // Reorder remaining policies
    const reorderedPolicies = updatedPolicies.map((policy, i) => ({
      ...policy,
      order: i,
    }));
    updateField("policies", reorderedPolicies);
  };

  // Move policy up/down
  const movePolicy = (index, direction) => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.policies.length) return;

    const updatedPolicies = [...formData.policies];
    [updatedPolicies[index], updatedPolicies[newIndex]] = [
      updatedPolicies[newIndex],
      updatedPolicies[index],
    ];

    // Update order values
    const reorderedPolicies = updatedPolicies.map((policy, i) => ({
      ...policy,
      order: i,
    }));

    updateField("policies", reorderedPolicies);
  };

  // Use template
  const useTemplate = (template) => {
    setCurrentPolicy({
      ...currentPolicy,
      title: template.title,
      content: template.content,
    });
    setIsAdding(true);
  };

  // Start editing policy
  const startEditing = (index) => {
    setEditingIndex(index);
    setCurrentPolicy({ ...formData.policies[index] });
    setIsAdding(true);
  };

  // Reset form
  const resetForm = () => {
    setCurrentPolicy({ title: "", content: "", isRequired: false, order: 0 });
    setIsAdding(false);
    setEditingIndex(null);
    setPolicyErrors({});
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex p-3 rounded-xl bg-gray-100 mb-4">
          <FileText className="w-6 h-6 text-gray-900" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Add company policies
        </h2>
        <p className="text-gray-600">
          Define policies that employees need to acknowledge. This step is
          optional and you can add policies later.
        </p>
      </div>

      <div className="space-y-6">
        {/* Policy Templates */}
        {!isAdding && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Quick Start Templates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {policyTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => useTemplate(template)}
                  className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-left"
                >
                  <h4 className="font-medium text-gray-900 text-sm mb-1">
                    {template.title}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {template.content}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Existing Policies List */}
        {formData.policies.length > 0 && (
          <div className="space-y-3">
            {formData.policies
              .sort((a, b) => a.order - b.order)
              .map((policy, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-gray-200 bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {policy.title}
                        </h3>
                        {policy.isRequired && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {policy.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Move up/down */}
                      <button
                        onClick={() => movePolicy(index, "up")}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => movePolicy(index, "down")}
                        disabled={index === formData.policies.length - 1}
                        className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Move down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {/* Edit/Delete */}
                      <button
                        onClick={() => startEditing(index)}
                        className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        title="Edit policy"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePolicy(index)}
                        className="p-1.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete policy"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Add/Edit Policy Form */}
        {isAdding && (
          <div className="p-6 rounded-xl border-2 border-gray-900 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                {editingIndex !== null ? "Edit Policy" : "Add New Policy"}
              </h3>
              <button
                onClick={resetForm}
                className="p-1 rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Policy Title */}
              <div>
                <Label
                  htmlFor="policy-title"
                  className="text-sm font-medium text-gray-900 mb-2 block"
                >
                  Policy Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="policy-title"
                  type="text"
                  value={currentPolicy.title}
                  onChange={(e) => {
                    setCurrentPolicy({
                      ...currentPolicy,
                      title: e.target.value,
                    });
                    if (policyErrors.title)
                      setPolicyErrors({ ...policyErrors, title: "" });
                  }}
                  placeholder="e.g., Code of Conduct, Leave Policy"
                  className={`h-11 bg-white ${
                    policyErrors.title ? "border-red-500" : ""
                  }`}
                />
                {policyErrors.title && (
                  <p className="text-sm text-red-600 mt-1">
                    {policyErrors.title}
                  </p>
                )}
              </div>

              {/* Policy Content */}
              <div>
                <Label
                  htmlFor="policy-content"
                  className="text-sm font-medium text-gray-900 mb-2 block"
                >
                  Policy Content <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="policy-content"
                  value={currentPolicy.content}
                  onChange={(e) => {
                    setCurrentPolicy({
                      ...currentPolicy,
                      content: e.target.value,
                    });
                    if (policyErrors.content)
                      setPolicyErrors({ ...policyErrors, content: "" });
                  }}
                  placeholder="Describe your policy in detail..."
                  rows={6}
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none bg-white text-sm ${
                    policyErrors.content ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {policyErrors.content && (
                  <p className="text-sm text-red-600 mt-1">
                    {policyErrors.content}
                  </p>
                )}
              </div>

              {/* Is Required */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="policy-required"
                  checked={currentPolicy.isRequired}
                  onChange={(e) =>
                    setCurrentPolicy({
                      ...currentPolicy,
                      isRequired: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <Label
                  htmlFor="policy-required"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Require employees to acknowledge this policy
                </Label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={
                    editingIndex !== null ? handleUpdatePolicy : handleAddPolicy
                  }
                  className="bg-gray-900 hover:bg-gray-800 text-white h-10 px-6"
                >
                  {editingIndex !== null ? "Update Policy" : "Add Policy"}
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-100 h-10 px-6"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add Policy Button */}
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            variant="outline"
            className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Policy
          </Button>
        )}

        {/* Validation Error for Policies Step */}
        {errors &&
          Object.keys(errors).some((key) => key.startsWith("policy.")) && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 mt-4">
              {Object.entries(errors).map(([key, value]) => {
                if (key.startsWith("policy.")) {
                  return (
                    <p key={key} className="text-sm text-red-600">
                      {value}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          )}

        {/* Helper Info */}
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Optional:</strong> You can skip this step and add policies
            later from your settings. Policies marked as "Required" will need
            employee acknowledgment during onboarding.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PoliciesStep;
