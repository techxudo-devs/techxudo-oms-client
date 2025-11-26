import { useState } from "react";
import { useManageSalary } from "../../hooks/useManageSalary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DollarSign,
  Save,
  User,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CreateSalaryPage = () => {
  const navigate = useNavigate();
  const { handleCreateSalary, isLoading } = useManageSalary();

  const currentDate = new Date();
  const [formData, setFormData] = useState({
    userId: "",
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    baseSalary: "",
    allowances: [],
    bonuses: [],
    deductions: [],
    notes: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Allowance handlers
  const addAllowance = () => {
    setFormData((prev) => ({
      ...prev,
      allowances: [...prev.allowances, { type: "", amount: "", description: "" }],
    }));
  };

  const updateAllowance = (index, field, value) => {
    const updated = [...formData.allowances];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, allowances: updated }));
  };

  const removeAllowance = (index) => {
    setFormData((prev) => ({
      ...prev,
      allowances: prev.allowances.filter((_, i) => i !== index),
    }));
  };

  // Bonus handlers
  const addBonus = () => {
    setFormData((prev) => ({
      ...prev,
      bonuses: [...prev.bonuses, { type: "", amount: "", description: "" }],
    }));
  };

  const updateBonus = (index, field, value) => {
    const updated = [...formData.bonuses];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, bonuses: updated }));
  };

  const removeBonus = (index) => {
    setFormData((prev) => ({
      ...prev,
      bonuses: prev.bonuses.filter((_, i) => i !== index),
    }));
  };

  // Deduction handlers
  const addDeduction = () => {
    setFormData((prev) => ({
      ...prev,
      deductions: [...prev.deductions, { type: "", amount: "", description: "" }],
    }));
  };

  const updateDeduction = (index, field, value) => {
    const updated = [...formData.deductions];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, deductions: updated }));
  };

  const removeDeduction = (index) => {
    setFormData((prev) => ({
      ...prev,
      deductions: prev.deductions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.userId) {
      toast.error("Please enter employee ID or email");
      return;
    }

    if (!formData.baseSalary || formData.baseSalary <= 0) {
      toast.error("Please enter a valid base salary");
      return;
    }

    // Prepare payload
    const payload = {
      userId: formData.userId,
      month: parseInt(formData.month),
      year: parseInt(formData.year),
      baseSalary: parseFloat(formData.baseSalary),
      allowances: formData.allowances
        .filter((a) => a.type && a.amount)
        .map((a) => ({
          type: a.type,
          amount: parseFloat(a.amount),
          description: a.description || "",
        })),
      bonuses: formData.bonuses
        .filter((b) => b.type && b.amount)
        .map((b) => ({
          type: b.type,
          amount: parseFloat(b.amount),
          description: b.description || "",
        })),
      deductions: formData.deductions
        .filter((d) => d.type && d.amount)
        .map((d) => ({
          type: d.type,
          amount: parseFloat(d.amount),
          description: d.description || "",
        })),
      notes: formData.notes,
    };

    const success = await handleCreateSalary(payload);
    if (success) {
      setTimeout(() => {
        navigate("/admin/salary/all");
      }, 1000);
    }
  };

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(2000, i).toLocaleDateString("en-US", { month: "long" }),
  }));

  // Generate year options
  const yearOptions = Array.from({ length: 3 }, (_, i) => ({
    value: currentDate.getFullYear() - i,
    label: (currentDate.getFullYear() - i).toString(),
  }));

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create Salary Entry</h1>
        <p className="text-gray-600 mt-1">
          Add a new salary record for an employee
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Employee ID/Email */}
            <div className="space-y-2">
              <Label htmlFor="userId">Employee ID or Email *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="userId"
                  type="text"
                  placeholder="Enter employee ID or email"
                  value={formData.userId}
                  onChange={(e) => handleChange("userId", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Month and Year */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">Month *</Label>
                <Select
                  value={formData.month.toString()}
                  onValueChange={(value) => handleChange("month", parseInt(value))}
                >
                  <SelectTrigger id="month">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map((m) => (
                      <SelectItem key={m.value} value={m.value.toString()}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Select
                  value={formData.year.toString()}
                  onValueChange={(value) => handleChange("year", parseInt(value))}
                >
                  <SelectTrigger id="year">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {yearOptions.map((y) => (
                      <SelectItem key={y.value} value={y.value.toString()}>
                        {y.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Base Salary */}
            <div className="space-y-2">
              <Label htmlFor="baseSalary">Base Salary (₨) *</Label>
              <Input
                id="baseSalary"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter base salary"
                value={formData.baseSalary}
                onChange={(e) => handleChange("baseSalary", e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Allowances */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Allowances</CardTitle>
              <Button type="button" size="sm" onClick={addAllowance}>
                <Plus className="h-4 w-4 mr-1" />
                Add Allowance
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {formData.allowances.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No allowances added. Click "Add Allowance" to add one.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.allowances.map((allowance, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 p-4 border rounded-lg"
                  >
                    <div className="col-span-4">
                      <Input
                        placeholder="Type (e.g., HRA)"
                        value={allowance.type}
                        onChange={(e) =>
                          updateAllowance(index, "type", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Amount"
                        value={allowance.amount}
                        onChange={(e) =>
                          updateAllowance(index, "amount", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        placeholder="Description (optional)"
                        value={allowance.description}
                        onChange={(e) =>
                          updateAllowance(index, "description", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-1 flex items-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAllowance(index)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bonuses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Bonuses</CardTitle>
              <Button type="button" size="sm" onClick={addBonus}>
                <Plus className="h-4 w-4 mr-1" />
                Add Bonus
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {formData.bonuses.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No bonuses added. Click "Add Bonus" to add one.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.bonuses.map((bonus, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 p-4 border rounded-lg"
                  >
                    <div className="col-span-4">
                      <Input
                        placeholder="Type (e.g., Performance)"
                        value={bonus.type}
                        onChange={(e) =>
                          updateBonus(index, "type", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Amount"
                        value={bonus.amount}
                        onChange={(e) =>
                          updateBonus(index, "amount", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        placeholder="Description (optional)"
                        value={bonus.description}
                        onChange={(e) =>
                          updateBonus(index, "description", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-1 flex items-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBonus(index)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Deductions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Deductions</CardTitle>
              <Button type="button" size="sm" onClick={addDeduction}>
                <Plus className="h-4 w-4 mr-1" />
                Add Deduction
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {formData.deductions.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No deductions added. Click "Add Deduction" to add one.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.deductions.map((deduction, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 p-4 border rounded-lg"
                  >
                    <div className="col-span-4">
                      <Input
                        placeholder="Type (e.g., Tax)"
                        value={deduction.type}
                        onChange={(e) =>
                          updateDeduction(index, "type", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Amount"
                        value={deduction.amount}
                        onChange={(e) =>
                          updateDeduction(index, "amount", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        placeholder="Description (optional)"
                        value={deduction.description}
                        onChange={(e) =>
                          updateDeduction(index, "description", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-span-1 flex items-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDeduction(index)}
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add any additional notes or comments..."
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/salary/all")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading.creating}>
            <Save className="mr-2 h-4 w-4" />
            {isLoading.creating ? "Creating..." : "Create Salary"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateSalaryPage;
