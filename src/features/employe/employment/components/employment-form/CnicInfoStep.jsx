import { Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CnicInfoStep = ({ formik, handleImageUpload, uploadingImages }) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    formik;

  const ImageUploadBox = ({ field, label, uploadType }) => (
    <div>
      <Label className="text-sm font-medium text-gray-900 mb-3 block">
        {label} <span className="text-red-500">*</span>
      </Label>

      {!values[field] ? (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition">
          <input
            type="file"
            id={field}
            accept="image/*"
            onClick={(e) => (e.target.value = null)}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleImageUpload(e.target.files[0], field);
              }
            }}
            disabled={uploadingImages[uploadType]}
            className="hidden"
          />
          <label
            htmlFor={field}
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            {uploadingImages[uploadType] ? (
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-gray-600" />
            )}
            <p className="text-sm text-gray-600">
              {uploadingImages[uploadType] ? "Uploading..." : "Click to upload"}
            </p>
          </label>
        </div>
      ) : (
        <div className="relative">
          <img
            src={values[field]}
            alt={label}
            className="w-full h-40 object-cover rounded-xl border-2"
          />
          <button
            type="button"
            onClick={() => setFieldValue(field, null)}
            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {errors[field] && touched[field] && (
        <p className="text-sm text-red-600 mt-2">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* CNIC Number */}
      <div>
        <Label htmlFor="cnicNumber">
          CNIC Number <span className="text-red-500">*</span>
        </Label>
        <Input
          id="cnicNumber"
          name="cnicNumber"
          value={values.cnicNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-2 ${
            errors.cnicNumber && touched.cnicNumber ? "border-red-500" : ""
          }`}
          placeholder="12345-1234567-1"
        />
        {errors.cnicNumber && touched.cnicNumber && (
          <p className="text-sm text-red-600 mt-1">{errors.cnicNumber}</p>
        )}
      </div>

      {/* CNIC Images */}
      <div className="grid md:grid-cols-2 gap-4">
        <ImageUploadBox
          field="cnicFrontImage"
          label="CNIC Front"
          uploadType="cnicFront"
        />
        <ImageUploadBox
          field="cnicBackImage"
          label="CNIC Back"
          uploadType="cnicBack"
        />
      </div>

      {/* CNIC Issue Date */}
      <div>
        <Label htmlFor="cnicIssueDate">CNIC Issue Date</Label>
        <Input
          id="cnicIssueDate"
          name="cnicIssueDate"
          type="date"
          value={values.cnicIssueDate}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-2"
        />
      </div>

      {/* CNIC Expiry Date */}
      <div>
        <Label htmlFor="cnicExpiryDate">CNIC Expiry Date</Label>
        <Input
          id="cnicExpiryDate"
          name="cnicExpiryDate"
          type="date"
          value={values.cnicExpiryDate}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-2"
        />
      </div>
    </div>
  );
};

export default CnicInfoStep;
