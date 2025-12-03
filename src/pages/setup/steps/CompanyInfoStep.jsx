import { useState } from "react";
import { Building2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Step 1: Company Information
 * Collects basic company details and logo
 */
const CompanyInfoStep = ({
  formData,
  updateField,
  updateNestedField,
  errors,
}) => {
  const [logoError, setLogoError] = useState("");

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setLogoError("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setLogoError("Image size must be less than 2MB");
      return;
    }

    setLogoError("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      updateField("logoPreview", reader.result);
      updateField("logo", file);
    };
    reader.readAsDataURL(file);
  };

  // Remove logo
  const handleRemoveLogo = () => {
    updateField("logo", null);
    updateField("logoPreview", null);
    setLogoError("");
  };

  // Generate slug from company name
  const handleCompanyNameChange = (value) => {
    updateField("companyName", value);

    // Auto-generate slug
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 50);

    updateField("slug", slug);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex p-3 rounded-xl bg-gray-100 mb-4">
          <Building2 className="w-6 h-6 text-gray-900" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tell us about your company
        </h2>
        <p className="text-gray-600">
          This information will help us set up your workspace and customize your
          experience.
        </p>
      </div>

      <div className="space-y-8">
        {/* Company Logo */}
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-3 block">
            Company Logo (Optional)
          </Label>

          {!formData.logoPreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <label
                htmlFor="logo-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Click to upload logo
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG or SVG (max. 2MB)
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="relative inline-block">
              <img
                src={formData.logoPreview}
                alt="Company logo preview"
                className="w-32 h-32 object-contain rounded-xl border-2 border-gray-200"
              />
              <button
                onClick={handleRemoveLogo}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {logoError && (
            <p className="text-sm text-red-600 mt-2">{logoError}</p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <Label
            htmlFor="companyName"
            className="text-sm font-medium text-gray-900 mb-2 block"
          >
            Company Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyName"
            type="text"
            value={formData.companyName}
            onChange={(e) => handleCompanyNameChange(e.target.value)}
            placeholder="Enter your company name"
            className={`h-11 ${
              errors.companyName
                ? "border-red-500 focus-visible:ring-red-500"
                : ""
            }`}
          />
          {errors.companyName && (
            <p className="text-sm text-red-600 mt-1">{errors.companyName}</p>
          )}
        </div>

        {/* Company Slug */}
        <div>
          <Label
            htmlFor="slug"
            className="text-sm font-medium text-gray-900 mb-2 block"
          >
            Company Slug <span className="text-red-500">*</span>
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">yourcompany.app/</span>
            <Input
              id="slug"
              type="text"
              value={formData.slug}
              onChange={(e) =>
                updateField("slug", e.target.value.toLowerCase())
              }
              placeholder="company-slug"
              className={`h-11 flex-1 ${
                errors.slug ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This will be your unique workspace URL
          </p>
          {errors.slug && (
            <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
          )}
        </div>

        {/* Address Section */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Company Address
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Street */}
            <div className="md:col-span-2">
              <Label
                htmlFor="street"
                className="text-sm font-medium text-gray-900 mb-2 block"
              >
                Street Address
              </Label>
              <Input
                id="street"
                type="text"
                value={formData.address.street}
                onChange={(e) =>
                  updateNestedField("address", "street", e.target.value)
                }
                placeholder="123 Main Street"
                className="h-11"
              />
            </div>

            {/* City */}
            <div>
              <Label
                htmlFor="city"
                className="text-sm font-medium text-gray-900 mb-2 block"
              >
                City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                type="text"
                value={formData.address.city}
                onChange={(e) =>
                  updateNestedField("address", "city", e.target.value)
                }
                placeholder="New York"
                className={`h-11 ${
                  errors["address.city"] ? "border-red-500" : ""
                }`}
              />
              {errors["address.city"] && (
                <p className="text-sm text-red-600 mt-1">
                  {errors["address.city"]}
                </p>
              )}
            </div>

            {/* State */}
            <div>
              <Label
                htmlFor="state"
                className="text-sm font-medium text-gray-900 mb-2 block"
              >
                State/Province
              </Label>
              <Input
                id="state"
                type="text"
                value={formData.address.state}
                onChange={(e) =>
                  updateNestedField("address", "state", e.target.value)
                }
                placeholder="New York"
                className="h-11"
              />
            </div>

            {/* Postal Code */}
            <div>
              <Label
                htmlFor="postalCode"
                className="text-sm font-medium text-gray-900 mb-2 block"
              >
                Postal Code
              </Label>
              <Input
                id="postalCode"
                type="text"
                value={formData.address.postalCode}
                onChange={(e) =>
                  updateNestedField("address", "postalCode", e.target.value)
                }
                placeholder="10001"
                className="h-11"
              />
            </div>

            {/* Country */}
            <div>
              <Label
                htmlFor="country"
                className="text-sm font-medium text-gray-900 mb-2 block"
              >
                Country <span className="text-red-500">*</span>
              </Label>
              <Input
                id="country"
                type="text"
                value={formData.address.country}
                onChange={(e) =>
                  updateNestedField("address", "country", e.target.value)
                }
                placeholder="United States"
                className={`h-11 ${
                  errors["address.country"] ? "border-red-500" : ""
                }`}
              />
              {errors["address.country"] && (
                <p className="text-sm text-red-600 mt-1">
                  {errors["address.country"]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Contact Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-900 mb-2 block"
              >
                Company Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.contactInfo.email}
                onChange={(e) =>
                  updateNestedField("contactInfo", "email", e.target.value)
                }
                placeholder="contact@company.com"
                className={`h-11 ${
                  errors["contactInfo.email"] ? "border-red-500" : ""
                }`}
              />
              {errors["contactInfo.email"] && (
                <p className="text-sm text-red-600 mt-1">
                  {errors["contactInfo.email"]}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-900 mb-2 block"
              >
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.contactInfo.phone}
                onChange={(e) =>
                  updateNestedField("contactInfo", "phone", e.target.value)
                }
                placeholder="+1 (555) 123-4567"
                className="h-11"
              />
            </div>

            {/* Website */}
            <div className="md:col-span-2">
              <Label
                htmlFor="website"
                className="text-sm font-medium text-gray-900 mb-2 block"
              >
                Website (Optional)
              </Label>
              <Input
                id="website"
                type="url"
                value={formData.contactInfo.website}
                onChange={(e) =>
                  updateNestedField("contactInfo", "website", e.target.value)
                }
                placeholder="https://www.company.com"
                className="h-11"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoStep;
