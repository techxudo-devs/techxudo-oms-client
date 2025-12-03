import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ContactInfoStep = ({ formik }) => {
  const { values, errors, touched, handleChange, handleBlur } = formik;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Your Contact Information</h3>

      <div>
        <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
        <Input
          id="phone"
          name="phone"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-2 ${errors.phone && touched.phone ? "border-red-500" : ""}`}
          placeholder="+92 300 1234567"
        />
        {errors.phone && touched.phone && (
          <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-2 ${errors.email && touched.email ? "border-red-500" : ""}`}
          placeholder="your.email@example.com"
        />
        {errors.email && touched.email && (
          <p className="text-sm text-red-600 mt-1">{errors.email}</p>
        )}
      </div>

      <div className="pt-6 border-t">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="emergencyContactName">Name <span className="text-red-500">*</span></Label>
            <Input
              id="emergencyContactName"
              name="emergencyContactName"
              value={values.emergencyContactName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mt-2 ${errors.emergencyContactName && touched.emergencyContactName ? "border-red-500" : ""}`}
            />
            {errors.emergencyContactName && touched.emergencyContactName && (
              <p className="text-sm text-red-600 mt-1">{errors.emergencyContactName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="emergencyContactPhone">Phone <span className="text-red-500">*</span></Label>
            <Input
              id="emergencyContactPhone"
              name="emergencyContactPhone"
              value={values.emergencyContactPhone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`mt-2 ${errors.emergencyContactPhone && touched.emergencyContactPhone ? "border-red-500" : ""}`}
            />
            {errors.emergencyContactPhone && touched.emergencyContactPhone && (
              <p className="text-sm text-red-600 mt-1">{errors.emergencyContactPhone}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoStep;
