import { Upload, X, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PersonalInfoStep = ({ formik, handleImageUpload, uploadingImages }) => {
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;

  return (
    <div className="space-y-6">
      {/* Photo Upload */}
      <div>
        <Label className="text-sm font-medium text-gray-900 mb-3 block">
          Photo (Optional)
        </Label>

        {!values.photo ? (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition">
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0], "photo")}
              disabled={uploadingImages.photo}
              className="hidden"
            />
            <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                {uploadingImages.photo ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
                ) : (
                  <Upload className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {uploadingImages.photo ? "Uploading..." : "Click to upload photo"}
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG or JPG (max 2MB)</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="relative inline-block">
            <img src={values.photo} alt="Preview" className="w-32 h-32 object-cover rounded-xl border-2" />
            <button
              type="button"
              onClick={() => setFieldValue("photo", null)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        {errors.photo && touched.photo && (
          <p className="text-sm text-red-600 mt-2">{errors.photo}</p>
        )}
      </div>

      {/* Legal Name */}
      <div>
        <Label htmlFor="legalName">Legal Name <span className="text-red-500">*</span></Label>
        <Input
          id="legalName"
          name="legalName"
          value={values.legalName}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-2 ${errors.legalName && touched.legalName ? "border-red-500" : ""}`}
          placeholder="Enter your full legal name"
        />
        {errors.legalName && touched.legalName && (
          <p className="text-sm text-red-600 mt-1">{errors.legalName}</p>
        )}
      </div>

      {/* Father Name */}
      <div>
        <Label htmlFor="fatherName">Father Name</Label>
        <Input
          id="fatherName"
          name="fatherName"
          value={values.fatherName}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-2"
          placeholder="Father's name"
        />
      </div>

      {/* Date of Birth */}
      <div>
        <Label htmlFor="dateOfBirth">Date of Birth <span className="text-red-500">*</span></Label>
        <Input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          value={values.dateOfBirth}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-2 ${errors.dateOfBirth && touched.dateOfBirth ? "border-red-500" : ""}`}
        />
        {errors.dateOfBirth && touched.dateOfBirth && (
          <p className="text-sm text-red-600 mt-1">{errors.dateOfBirth}</p>
        )}
      </div>

      {/* Gender */}
      <div>
        <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
        <select
          id="gender"
          name="gender"
          value={values.gender}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`mt-2 w-full h-11 px-3 rounded-lg border ${
            errors.gender && touched.gender ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && touched.gender && (
          <p className="text-sm text-red-600 mt-1">{errors.gender}</p>
        )}
      </div>

      {/* Marital Status */}
      <div>
        <Label htmlFor="maritalStatus">Marital Status</Label>
        <select
          id="maritalStatus"
          name="maritalStatus"
          value={values.maritalStatus}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-2 w-full h-11 px-3 rounded-lg border border-gray-300"
        >
          <option value="">Select status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
          <option value="widowed">Widowed</option>
        </select>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
