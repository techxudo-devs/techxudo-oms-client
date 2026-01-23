import { Palette, Moon, Sun, Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useTheme } from "@/shared/context/ThemeContext.jsx";
import BrandingPreview from "@/components/setup/BrandingPreview.jsx";

const BrandingStep = ({ formData, updateNestedField, updateField, errors }) => {
  const { updateTheme, updateLogo } = useTheme();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Live theme preview - update theme context whenever colors change
  useEffect(() => {
    updateTheme(formData.theme);
  }, [formData.theme, updateTheme]);

  // Handle logo upload to Cloudinary
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setUploadError("Please upload an image file (PNG, JPG, SVG)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError("Image size must be less than 2MB");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "unsigned_preset",
      );
      formData.append("folder", "company_logos");

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

      if (!cloudName) {
        throw new Error(
          "Cloudinary configuration missing. Please set VITE_CLOUDINARY_CLOUD_NAME in .env",
        );
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const logoUrl = data.secure_url;

      // Update form data and theme context
      updateField("logo", logoUrl);
      updateField("logoPreview", logoUrl);
      updateLogo(logoUrl);
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      setUploadError(
        error.message || "Failed to upload logo. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Remove logo
  const handleRemoveLogo = () => {
    updateField("logo", null);
    updateField("logoPreview", null);
    updateLogo(null);
  };
  const presetColors = {
    primary: [
      { name: "Black", value: "#000000" },
      { name: "Gray", value: "#6B7280" },
      { name: "Blue", value: "#3B82F6" },
      { name: "Indigo", value: "#6366F1" },
      { name: "Purple", value: "#9333EA" },
      { name: "Pink", value: "#EC4899" },
    ],
    secondary: [
      { name: "Light Gray", value: "#9CA3AF" },
      { name: "Slate", value: "#64748B" },
      { name: "Zinc", value: "#71717A" },
      { name: "Stone", value: "#78716C" },
    ],
    accent: [
      { name: "Blue", value: "#3B82F6" },
      { name: "Green", value: "#10B981" },
      { name: "Yellow", value: "#F59E0B" },
      { name: "Red", value: "#EF4444" },
      { name: "Teal", value: "#14B8A6" },
      { name: "Orange", value: "#F97316" },
    ],
  };

  return (
    <div className="container mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Customize your workspace
        </h2>
        <p className="text-gray-600">
          Choose colors that match your brand identity. You can change these
          anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Logo Upload Section */}
          <div>
            <Label className="text-sm font-medium text-gray-900 mb-3 block">
              Company Logo (Optional)
            </Label>
            <p className="text-xs text-gray-500 mb-3">
              Upload your company logo. It will appear throughout your
              dashboard.
            </p>

            {!formData.logoPreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={isUploading}
                  className="hidden"
                />
                <label
                  htmlFor="logo-upload"
                  className={`cursor-pointer flex flex-col items-center gap-3 ${
                    isUploading ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {isUploading ? "Uploading..." : "Click to upload logo"}
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

            {uploadError && (
              <p className="text-sm text-red-600 mt-2">{uploadError}</p>
            )}
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Theme Colors
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Colors will update live across your dashboard as you select them
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-900 mb-3 block">
              Primary Color <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-gray-500 mb-3">
              Main color used for buttons, links, and key UI elements
            </p>

            {/* Preset colors */}
            <div className="grid grid-cols-6 gap-3 mb-3">
              {presetColors.primary.map((color) => (
                <button
                  key={color.value}
                  onClick={() =>
                    updateNestedField("theme", "primaryColor", color.value)
                  }
                  className={`
                  group relative w-full aspect-square rounded-lg transition-all
                  ${
                    formData.theme.primaryColor === color.value
                      ? "ring-2 ring-offset-2 ring-gray-900"
                      : "hover:scale-105"
                  }
                `}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {formData.theme.primaryColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-900 rounded-full" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom color picker */}
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.theme.primaryColor}
                onChange={(e) =>
                  updateNestedField("theme", "primaryColor", e.target.value)
                }
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
              />
              <input
                type="text"
                value={formData.theme.primaryColor}
                onChange={(e) =>
                  updateNestedField("theme", "primaryColor", e.target.value)
                }
                placeholder="#000000"
                className="flex-1 h-12 px-4 rounded-lg border border-gray-300 font-mono text-sm"
              />
            </div>

            {errors.primaryColor && (
              <p className="text-sm text-red-600 mt-2">{errors.primaryColor}</p>
            )}
          </div>

          {/* Secondary Color */}
          <div>
            <Label className="text-sm font-medium text-gray-900 mb-3 block">
              Secondary Color <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-gray-500 mb-3">
              Secondary color for supporting UI elements
            </p>

            {/* Preset colors */}
            <div className="grid grid-cols-6 gap-3 mb-3">
              {presetColors.secondary.map((color) => (
                <button
                  key={color.value}
                  onClick={() =>
                    updateNestedField("theme", "secondaryColor", color.value)
                  }
                  className={`
                  group relative w-full aspect-square rounded-lg transition-all
                  ${
                    formData.theme.secondaryColor === color.value
                      ? "ring-2 ring-offset-2 ring-gray-900"
                      : "hover:scale-105"
                  }
                `}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {formData.theme.secondaryColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-900 rounded-full" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom color picker */}
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.theme.secondaryColor}
                onChange={(e) =>
                  updateNestedField("theme", "secondaryColor", e.target.value)
                }
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
              />
              <input
                type="text"
                value={formData.theme.secondaryColor}
                onChange={(e) =>
                  updateNestedField("theme", "secondaryColor", e.target.value)
                }
                placeholder="#6B7280"
                className="flex-1 h-12 px-4 rounded-lg border border-gray-300 font-mono text-sm"
              />
            </div>

            {errors.secondaryColor && (
              <p className="text-sm text-red-600 mt-2">
                {errors.secondaryColor}
              </p>
            )}
          </div>

          {/* Accent Color */}
          <div>
            <Label className="text-sm font-medium text-gray-900 mb-3 block">
              Accent Color <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-gray-500 mb-3">
              Accent color for highlights, badges, and notifications
            </p>

            {/* Preset colors */}
            <div className="grid grid-cols-6 gap-3 mb-3">
              {presetColors.accent.map((color) => (
                <button
                  key={color.value}
                  onClick={() =>
                    updateNestedField("theme", "accentColor", color.value)
                  }
                  className={`
                  group relative w-full aspect-square rounded-lg transition-all
                  ${
                    formData.theme.accentColor === color.value
                      ? "ring-2 ring-offset-2 ring-gray-900"
                      : "hover:scale-105"
                  }
                `}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {formData.theme.accentColor === color.value && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-900 rounded-full" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom color picker */}
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.theme.accentColor}
                onChange={(e) =>
                  updateNestedField("theme", "accentColor", e.target.value)
                }
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
              />
              <input
                type="text"
                value={formData.theme.accentColor}
                onChange={(e) =>
                  updateNestedField("theme", "accentColor", e.target.value)
                }
                placeholder="#3B82F6"
                className="flex-1 h-12 px-4 rounded-lg border border-gray-300 font-mono text-sm"
              />
            </div>

            {errors.accentColor && (
              <p className="text-sm text-red-600 mt-2">{errors.accentColor}</p>
            )}
          </div>
          {/* Dark Mode Toggle */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-gray-900 block mb-1">
                  Dark Mode
                </Label>
                <p className="text-xs text-gray-500">
                  Enable dark mode for your workspace
                </p>
              </div>

              <button
                onClick={() =>
                  updateNestedField(
                    "theme",
                    "darkMode",
                    !formData.theme.darkMode,
                  )
                }
                className={`
                relative inline-flex h-11 w-20 items-center rounded-full transition-colors
                ${formData.theme.darkMode ? "bg-gray-900" : "bg-gray-200"}
              `}
              >
                <span
                  className={`
                  inline-flex h-8 w-8 transform items-center justify-center rounded-full bg-white transition-transform
                  ${
                    formData.theme.darkMode ? "translate-x-10" : "translate-x-1"
                  }
                `}
                >
                  {formData.theme.darkMode ? (
                    <Moon className="h-4 w-4 text-gray-900" />
                  ) : (
                    <Sun className="h-4 w-4 text-gray-600" />
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
        {/* Right column: sticky live preview */}
        <div className="lg:sticky lg:top-50 h-fit">
          <BrandingPreview
            logoUrl={formData.logoPreview || formData.logo}
            companyName={formData.companyName || "Your Company"}
          />
        </div>
      </div>
    </div>
  );
};

export default BrandingStep;
