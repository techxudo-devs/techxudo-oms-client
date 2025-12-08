import { useState, useEffect } from "react";
import { Loader2, FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateContractMutation } from "../../../employe/employment/api/employmentApiSlice";

const CreateContractModal = ({ open, onClose, employmentForm }) => {
  const [formData, setFormData] = useState({
    position: "",
    department: "",
    startDate: "",
    salary: "",
  });

  const [createContract, { isLoading }] = useCreateContractMutation();

  useEffect(() => {
    if (open && employmentForm) {
      // Reset form when opening
      setFormData({
        position: "",
        department: "",
        startDate: "",
        salary: "",
      });
    }
  }, [open, employmentForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employmentForm) return;

    try {
      const contractData = {
        employeeName: employmentForm.personalInfo?.legalName || employmentForm.employeeName,
        employeeEmail: employmentForm.contactInfo?.email || employmentForm.employeeEmail,
        position: formData.position,
        department: formData.department,
        startDate: formData.startDate,
        salary: Number(formData.salary),
        status: "draft",
        organizationId: employmentForm.organizationId,
      };

      await createContract(contractData).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to create contract:", error);
    }
  };

  if (!employmentForm) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Employment Contract</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Employee Name</Label>
            <Input
              value={employmentForm.personalInfo?.legalName || employmentForm.employeeName || ""}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={employmentForm.contactInfo?.email || employmentForm.employeeEmail || ""}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                placeholder="e.g. Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                placeholder="e.g. Engineering"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary (PKR)</Label>
              <Input
                id="salary"
                name="salary"
                type="number"
                value={formData.salary}
                onChange={handleChange}
                required
                placeholder="e.g. 150000"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FileSignature className="w-4 h-4 mr-2" />
                  Create Contract
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContractModal;
