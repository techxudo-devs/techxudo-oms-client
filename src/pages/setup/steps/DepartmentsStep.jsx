import { useState } from "react";
import { Building, Plus, Edit, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Step 3: Departments
 * Add and manage company departments
 */
const DepartmentsStep = ({ formData, updateField, errors }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentDept, setCurrentDept] = useState({
    name: "",
    description: "",
    headOfDepartment: "",
  });
  const [deptErrors, setDeptErrors] = useState({});

  // Validate department form
  const validateDepartment = () => {
    const newErrors = {};

    if (!currentDept.name.trim()) {
      newErrors.name = "Department name is required";
    }

    // Check for duplicate names (excluding current editing department)
    const isDuplicate = formData.departments.some(
      (dept, index) =>
        dept.name.toLowerCase() === currentDept.name.toLowerCase() &&
        index !== editingIndex
    );

    if (isDuplicate) {
      newErrors.name = "Department name already exists";
    }

    setDeptErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add new department
  const handleAddDepartment = () => {
    if (!validateDepartment()) return;

    updateField("departments", [...formData.departments, { ...currentDept }]);
    resetForm();
  };

  // Update existing department
  const handleUpdateDepartment = () => {
    if (!validateDepartment()) return;

    const updatedDepartments = [...formData.departments];
    updatedDepartments[editingIndex] = { ...currentDept };
    updateField("departments", updatedDepartments);
    resetForm();
  };

  // Delete department
  const handleDeleteDepartment = (index) => {
    const updatedDepartments = formData.departments.filter(
      (_, i) => i !== index
    );
    updateField("departments", updatedDepartments);
  };

  // Start editing department
  const startEditing = (index) => {
    setEditingIndex(index);
    setCurrentDept({ ...formData.departments[index] });
    setIsAdding(true);
  };

  // Reset form
  const resetForm = () => {
    setCurrentDept({ name: "", description: "", headOfDepartment: "" });
    setIsAdding(false);
    setEditingIndex(null);
    setDeptErrors({});
  };

  return (
    <div className=" mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex p-3 rounded-xl bg-gray-100 mb-4">
          <Building className="w-6 h-6 text-gray-900" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Organize your departments
        </h2>
        <p className="text-gray-600">
          Set up departments to better organize your team structure and
          workflows.
        </p>
      </div>

      <div className="space-y-6">
        {/* Existing Departments List */}
        {formData.departments.length > 0 && (
          <div className="space-y-3">
            {formData.departments.map((dept, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors bg-white"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {dept.name}
                    </h3>
                    {dept.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {dept.description}
                      </p>
                    )}
                    {dept.headOfDepartment && (
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">Head:</span>{" "}
                        {dept.headOfDepartment}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => startEditing(index)}
                      className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      title="Edit department"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDepartment(index)}
                      className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete department"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {formData.departments.length === 0 && !isAdding && (
          <div className="text-center py-12 px-6 border-2 border-dashed border-gray-300 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Building className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              No departments yet
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Get started by adding your first department
            </p>
          </div>
        )}

        {/* Add/Edit Department Form */}
        {isAdding && (
          <div className="p-6 rounded-xl border-2 border-gray-900 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                {editingIndex !== null
                  ? "Edit Department"
                  : "Add New Department"}
              </h3>
              <button
                onClick={resetForm}
                className="p-1 rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Department Name */}
              <div>
                <Label
                  htmlFor="dept-name"
                  className="text-sm font-medium text-gray-900 mb-2 block"
                >
                  Department Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dept-name"
                  type="text"
                  value={currentDept.name}
                  onChange={(e) => {
                    setCurrentDept({ ...currentDept, name: e.target.value });
                    if (deptErrors.name)
                      setDeptErrors({ ...deptErrors, name: "" });
                  }}
                  placeholder="e.g., Engineering, Sales, Marketing"
                  className={`h-11 bg-white ${
                    deptErrors.name ? "border-red-500" : ""
                  }`}
                />
                {deptErrors.name && (
                  <p className="text-sm text-red-600 mt-1">{deptErrors.name}</p>
                )}
              </div>

              {/* Department Description */}
              <div>
                <Label
                  htmlFor="dept-desc"
                  className="text-sm font-medium text-gray-900 mb-2 block"
                >
                  Description (Optional)
                </Label>
                <textarea
                  id="dept-desc"
                  value={currentDept.description}
                  onChange={(e) =>
                    setCurrentDept({
                      ...currentDept,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of this department's responsibilities"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none bg-white text-sm"
                />
              </div>

              {/* Head of Department */}
              <div>
                <Label
                  htmlFor="dept-head"
                  className="text-sm font-medium text-gray-900 mb-2 block"
                >
                  Head of Department (Optional)
                </Label>
                <Input
                  id="dept-head"
                  type="text"
                  value={currentDept.headOfDepartment}
                  onChange={(e) =>
                    setCurrentDept({
                      ...currentDept,
                      headOfDepartment: e.target.value,
                    })
                  }
                  placeholder="Name of department head"
                  className="h-11 bg-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  You can update this later when adding employees
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  onClick={
                    editingIndex !== null
                      ? handleUpdateDepartment
                      : handleAddDepartment
                  }
                  className="bg-gray-900 hover:bg-gray-800 text-white h-10 px-6"
                >
                  {editingIndex !== null
                    ? "Update Department"
                    : "Add Department"}
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

        {/* Add Department Button */}
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            variant="outline"
            className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Department
          </Button>
        )}

        {/* Validation Error */}
        {errors.departments && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{errors.departments}</p>
          </div>
        )}

        {/* Helper Text */}
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm text-blue-900">
            <strong>Tip:</strong> You can always add more departments later from
            your settings. Start with your core departments now.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepartmentsStep;
