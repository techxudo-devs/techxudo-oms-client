import { useState } from "react";
import {
  Building,
  Plus,
  Edit2,
  Trash2,
  X,
  Users,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have this, or use standard textarea
import { cn } from "@/lib/utils";

/**
 * Step 3: Departments
 * Redesigned for a clean, structural SaaS feel.
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

  // --- Logic (Kept mostly original) ---
  const validateDepartment = () => {
    const newErrors = {};
    if (!currentDept.name.trim()) {
      newErrors.name = "Department name is required";
    }
    const isDuplicate = formData.departments.some(
      (dept, index) =>
        dept.name.toLowerCase() === currentDept.name.toLowerCase() &&
        index !== editingIndex,
    );
    if (isDuplicate) {
      newErrors.name = "Department name already exists";
    }
    setDeptErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddDepartment = () => {
    if (!validateDepartment()) return;
    updateField("departments", [...formData.departments, { ...currentDept }]);
    resetForm();
  };

  const handleUpdateDepartment = () => {
    if (!validateDepartment()) return;
    const updatedDepartments = [...formData.departments];
    updatedDepartments[editingIndex] = { ...currentDept };
    updateField("departments", updatedDepartments);
    resetForm();
  };

  const handleDeleteDepartment = (index) => {
    const updatedDepartments = formData.departments.filter(
      (_, i) => i !== index,
    );
    updateField("departments", updatedDepartments);
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setCurrentDept({ ...formData.departments[index] });
    setIsAdding(true);
    setDeptErrors({});
  };

  const resetForm = () => {
    setCurrentDept({ name: "", description: "", headOfDepartment: "" });
    setIsAdding(false);
    setEditingIndex(null);
    setDeptErrors({});
  };

  return (
    <div className="container mx-auto">
      {/* Header Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
          Organization Structure
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Define your company departments to streamline workflows and
          permissions.
        </p>
      </div>

      <div className="space-y-6">
        {/* Active Departments List */}
        {formData.departments.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            {formData.departments.map((dept, index) => {
              // Hide the item if it's currently being edited to avoid duplication visual
              if (editingIndex === index) return null;

              return (
                <div
                  key={index}
                  className="group relative flex items-start justify-between p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm transition-all duration-200"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600">
                        <Building className="h-4 w-4" />
                      </div>
                      <h3 className="font-medium text-gray-900">{dept.name}</h3>
                    </div>

                    {dept.description && (
                      <p className="text-sm text-gray-500 pl-10 max-w-md line-clamp-1">
                        {dept.description}
                      </p>
                    )}

                    {dept.headOfDepartment && (
                      <div className="flex items-center gap-1.5 pl-10 pt-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          Head:{" "}
                          <span className="font-medium text-gray-700">
                            {dept.headOfDepartment}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Hover Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-4 right-4 sm:relative sm:top-0 sm:right-0">
                    <Button
                      onClick={() => startEditing(index)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-gray-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteDepartment(index)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State (Only show if list is empty and not adding) */}
        {formData.departments.length === 0 && !isAdding && (
          <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
            <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-zinc-100 flex items-center justify-center mb-4">
              <Briefcase className="w-6 h-6 text-zinc-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">
              No departments yet
            </h3>
            <p className="text-xs text-gray-500 mt-1 max-w-xs text-center">
              Create your first department to start organizing your team.
            </p>
          </div>
        )}

        {/* Add / Edit Form Area */}
        {isAdding ? (
          <div className="animate-in slide-in-from-bottom-2 fade-in duration-300">
            <div className="p-6 rounded-xl border border-zinc-200 bg-white shadow-lg shadow-zinc-200/50 ring-1 ring-black/[0.05]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {editingIndex !== null
                      ? "Edit Department"
                      : "New Department"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Fill in the details below.
                  </p>
                </div>
                <Button
                  onClick={resetForm}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-gray-900"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-5">
                {/* Department Name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="dept-name"
                    className="text-xs font-medium text-gray-700"
                  >
                    Department Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="dept-name"
                    value={currentDept.name}
                    onChange={(e) => {
                      setCurrentDept({ ...currentDept, name: e.target.value });
                      if (deptErrors.name)
                        setDeptErrors({ ...deptErrors, name: "" });
                    }}
                    placeholder="e.g. Engineering"
                    className={cn(
                      "h-10",
                      deptErrors.name &&
                        "border-red-500 focus-visible:ring-red-500",
                    )}
                    autoFocus
                  />
                  {deptErrors.name && (
                    <span className="text-xs text-red-600 font-medium">
                      {deptErrors.name}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="dept-desc"
                    className="text-xs font-medium text-gray-700"
                  >
                    Description{" "}
                    <span className="text-gray-400 font-normal">
                      (Optional)
                    </span>
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
                    placeholder="Briefly describe the responsibilities..."
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </div>

                {/* Head of Department */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="dept-head"
                    className="text-xs font-medium text-gray-700"
                  >
                    Head of Department{" "}
                    <span className="text-gray-400 font-normal">
                      (Optional)
                    </span>
                  </Label>
                  <Input
                    id="dept-head"
                    value={currentDept.headOfDepartment}
                    onChange={(e) =>
                      setCurrentDept({
                        ...currentDept,
                        headOfDepartment: e.target.value,
                      })
                    }
                    placeholder="e.g. Sarah Miller"
                    className="h-10"
                  />
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                  <Button
                    onClick={resetForm}
                    variant="ghost"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={
                      editingIndex !== null
                        ? handleUpdateDepartment
                        : handleAddDepartment
                    }
                    className="bg-gray-900 hover:bg-gray-800 text-white min-w-[100px]"
                  >
                    {editingIndex !== null
                      ? "Save Changes"
                      : "Create Department"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Add Button */
          <button
            onClick={() => setIsAdding(true)}
            className="w-full group relative flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-zinc-300 bg-transparent hover:border-zinc-400 hover:bg-zinc-50 transition-all duration-200 outline-none focus:ring-2 focus:ring-black/5"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-600 group-hover:text-zinc-900">
              <div className="p-1 rounded bg-zinc-100 group-hover:bg-white border border-zinc-200 transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              Add another department
            </div>
          </button>
        )}

        {/* Error State */}
        {errors.departments && (
          <div className="p-3 rounded-lg bg-red-50/50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
            {errors.departments}
          </div>
        )}

        {/* Tip */}
        {!isAdding && formData.departments.length > 0 && (
          <div className="text-xs text-center text-gray-400">
            You can manage detailed permissions for each department in Settings
            later.
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentsStep;
