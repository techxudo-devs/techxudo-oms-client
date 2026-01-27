import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddCandidateModal({ open, onClose, onSubmit, departments = [] }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    positionTitle: "",
    department: "",
    employmentType: "full-time",
    source: "manual",
    resumeUrl: "",
  });

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }));
  const canSubmit = form.name && form.email && form.positionTitle;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    await onSubmit(form);
    setForm({ name: "", email: "", phone: "", positionTitle: "", department: "", employmentType: "full-time", source: "manual", resumeUrl: "" });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Candidate</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Name *</Label>
            <Input value={form.name} onChange={(e) => update("name", e.target.value)} />
          </div>
          <div>
            <Label>Email *</Label>
            <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
          </div>
          <div>
            <Label>Position *</Label>
            <Input value={form.positionTitle} onChange={(e) => update("positionTitle", e.target.value)} />
          </div>
          <div>
            <Label>Department</Label>
            <select className="h-9 border rounded-md px-2 text-sm w-full" value={form.department} onChange={(e) => update("department", e.target.value)}>
              <option value="">Select department</option>
              {departments.map((d) => (
                <option key={d._id || d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Employment Type</Label>
            <select className="h-9 border rounded-md px-2 text-sm w-full" value={form.employmentType} onChange={(e) => update("employmentType", e.target.value)}>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div className="col-span-2">
            <Label>Resume URL</Label>
            <Input value={form.resumeUrl} onChange={(e) => update("resumeUrl", e.target.value)} placeholder="https://..." />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={!canSubmit} onClick={handleSubmit}>Add</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

