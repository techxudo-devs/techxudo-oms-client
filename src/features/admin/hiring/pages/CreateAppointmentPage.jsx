import { CheckCircle, Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useCreateAppointment from "../hooks/useCreateAppointment";

/**
 * CreateAppointmentPage - Admin creates and sends appointment letters
 * UI only - Business logic in useCreateAppointment hook
 */
const CreateAppointmentPage = () => {
  const {
    formik,
    isSubmitting,
    submitSuccess,
    addBenefit,
    removeBenefit,
    resetSuccess,
  } = useCreateAppointment();

  const [newBenefit, setNewBenefit] = useState("");

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    formik;

  // Success state
  if (submitSuccess) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Appointment Letter Sent!
          </h2>
          <p className="text-gray-600 mb-6">
            The appointment letter has been sent to the candidate's email.
            They'll be notified to review and respond.
          </p>
          <Button onClick={resetSuccess} className="w-full">
            Create Another Appointment
          </Button>
        </div>
      </div>
    );
  }

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      addBenefit(newBenefit.trim());
      setNewBenefit("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Create Appointment Letter
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Send an official appointment letter to a candidate
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6">
        {formik.errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{formik.errors.submit}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Candidate Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Candidate Information
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="candidateName">
                  Candidate Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="candidateName"
                  name="candidateName"
                  value={values.candidateName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-2 ${
                    errors.candidateName && touched.candidateName
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="John Doe"
                />
                {errors.candidateName && touched.candidateName && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.candidateName}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="candidateEmail">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="candidateEmail"
                  name="candidateEmail"
                  type="email"
                  value={values.candidateEmail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-2 ${
                    errors.candidateEmail && touched.candidateEmail
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="john@example.com"
                />
                {errors.candidateEmail && touched.candidateEmail && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.candidateEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Position Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Position Details
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">
                  Position <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="position"
                  name="position"
                  value={values.position}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-2 ${
                    errors.position && touched.position ? "border-red-500" : ""
                  }`}
                  placeholder="Software Engineer"
                />
                {errors.position && touched.position && (
                  <p className="text-sm text-red-600 mt-1">{errors.position}</p>
                )}
              </div>

              <div>
                <Label htmlFor="department">
                  Department <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="department"
                  name="department"
                  value={values.department}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-2 ${
                    errors.department && touched.department
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="Engineering"
                />
                {errors.department && touched.department && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.department}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="employmentType">
                  Employment Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={values.employmentType}
                  onValueChange={(value) =>
                    formik.setFieldValue("employmentType", value)
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="joiningDate">
                  Joining Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="joiningDate"
                  name="joiningDate"
                  type="date"
                  value={values.joiningDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-2 ${
                    errors.joiningDate && touched.joiningDate
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {errors.joiningDate && touched.joiningDate && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.joiningDate}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="probationPeriod">
                  Probation Period (months)
                </Label>
                <Input
                  id="probationPeriod"
                  name="probationPeriod"
                  type="number"
                  value={values.probationPeriod}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="mt-2"
                  placeholder="3"
                />
              </div>
            </div>
          </div>

          {/* Compensation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Compensation & Benefits
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary">
                  Monthly Salary <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  value={values.salary}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-2 ${
                    errors.salary && touched.salary ? "border-red-500" : ""
                  }`}
                  placeholder="50000"
                />
                {errors.salary && touched.salary && (
                  <p className="text-sm text-red-600 mt-1">{errors.salary}</p>
                )}
              </div>

              <div>
                <Label htmlFor="workLocation">
                  Work Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="workLocation"
                  name="workLocation"
                  value={values.workLocation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-2 ${
                    errors.workLocation && touched.workLocation
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="Karachi Office"
                />
                {errors.workLocation && touched.workLocation && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.workLocation}
                  </p>
                )}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <Label>Benefits</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="e.g., Health Insurance"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddBenefit();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddBenefit}
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {values.benefits.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {values.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                    >
                      <span className="text-sm">{benefit}</span>
                      <button
                        type="button"
                        onClick={() => removeBenefit(benefit)}
                        className="text-gray-600 hover:text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Additional Information
            </h3>

            <div>
              <Label htmlFor="reportingTo">Reporting To</Label>
              <Input
                id="reportingTo"
                name="reportingTo"
                value={values.reportingTo}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-2"
                placeholder="Manager Name"
              />
            </div>

            <div>
              <Label htmlFor="additionalTerms">Additional Terms</Label>
              <Textarea
                id="additionalTerms"
                name="additionalTerms"
                value={values.additionalTerms}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-2"
                rows={4}
                placeholder="Any additional terms or conditions..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <Button type="submit" disabled={isSubmitting} className="px-8">
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Sending...
              </>
            ) : (
              "Send Appointment Letter"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAppointmentPage;
