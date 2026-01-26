import { useEffect, useState, useRef } from "react";
import PageLayout from "@/shared/components/layout/PagesLayout";
import {
  useGetCurrentOrganizationQuery,
  useUpdateOrganizationMutation,
} from "@/shared/store/features/organizationApiSlice";
import { extractApiError } from "@/shared/utils/error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Building2,
  Upload,
  X,
  Loader2,
  MapPin,
  Palette,
  Clock,
  Globe,
  Hash,
} from "lucide-react";
import { useTheme } from "@/shared/context/ThemeContext.jsx";
import { cn } from "@/lib/utils";

// --- Sub-components for Cleaner UI ---

const SettingsSection = ({
  title,
  description,
  icon: Icon,
  children,
  className,
}) => (
  <div className={cn("bg-white rounded-xl   overflow-hidden", className)}>
    <div className="px-6 py-5 border-b border-zinc-100 flex items-start gap-4">
      <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-500">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-zinc-900 leading-none mb-1.5">
          {title}
        </h3>
        <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const HexColorPicker = ({ id, label, value, onChange }) => (
  <div className="group space-y-2">
    <Label
      htmlFor={id}
      className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
    >
      {label}
    </Label>
    <div className="flex items-center gap-3">
      <div className="relative overflow-hidden w-10 h-10 rounded-lg shadow-sm ring-1 ring-black/10 transition-transform group-hover:scale-105">
        <input
          type="color"
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 p-0 border-0 cursor-pointer"
        />
      </div>
      <div className="relative flex-1">
        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <Input
          value={value.replace("#", "")}
          onChange={(e) => onChange(`#${e.target.value}`)}
          className="pl-9 font-mono uppercase text-sm"
          maxLength={6}
        />
      </div>
    </div>
  </div>
);

// --- Main Page Component ---

export default function CompanyProfilePage() {
  const { data, isLoading } = useGetCurrentOrganizationQuery();
  const [updateOrganization, { isLoading: isSaving }] =
    useUpdateOrganizationMutation();
  const { updateTheme, updateLogo } = useTheme();

  const fileInputRef = useRef(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState("");
  const [model, setModel] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const org = data?.data;

  // Sync state with API data
  useEffect(() => {
    if (org) {
      setModel({
        companyName: org.companyName || "",
        slug: org.slug || "",
        industry: org.industry || "",
        logo: org.logo || "",
        address: {
          street: org.address?.street || "",
          city: org.address?.city || "",
          country: org.address?.country || "",
          zipCode: org.address?.zipCode || "",
        },
        theme: {
          primaryColor: org.theme?.primaryColor || "#000000",
          secondaryColor: org.theme?.secondaryColor || "#6B7280",
          accentColor: org.theme?.accentColor || "#3B82F6",
          darkMode: org.theme?.darkMode || false,
        },
        workingHours: {
          startTime: org.workingHours?.startTime || "09:00",
          endTime: org.workingHours?.endTime || "17:00",
          timezone: org.workingHours?.timezone || "Asia/Karachi",
        },
      });
    }
  }, [org]);

  // Deep update handler
  const handleChange = (path, value) => {
    setModel((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let ref = next;
      for (let i = 0; i < keys.length - 1; i++) ref = ref[keys[i]];
      ref[keys[keys.length - 1]] = value;

      // Live Preview updates
      if (path.startsWith("theme.")) updateTheme(next.theme);
      if (path === "logo") updateLogo(value);

      return next;
    });
    // Clear error for the field being edited
    setFieldErrors((prev) => {
      if (!prev || !prev[path]) return prev;
      const copy = { ...prev };
      delete copy[path];
      return copy;
    });
  };

  const onSave = async () => {
    try {
      setFieldErrors({});
      await updateOrganization(model).unwrap();
      toast.success("Settings saved successfully");
    } catch (e) {
      const parsed = extractApiError(e);
      setFieldErrors(parsed.fieldErrors || {});
      const first = Object.values(parsed.fieldErrors || {})[0];
      toast.error(first || parsed.message || "Failed to save settings");
    }
  };

  const handleLogoUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setLogoError("Please upload an image file (PNG, JPG)");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setLogoError("Image size must be less than 2MB");
      return;
    }

    setLogoError("");
    setLogoUploading(true);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      );
      form.append("folder", "company_logos");

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: form },
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      const url = data.secure_url;

      setModel((prev) => ({ ...prev, logo: url }));
      updateLogo(url);
      toast.success("Logo updated");
    } catch (err) {
      console.error(err);
      setLogoError("Failed to upload logo");
      toast.error("Logo upload failed");
    } finally {
      setLogoUploading(false);
    }
  };

  // Loading State
  if (isLoading || !model) {
    return (
      <PageLayout
        title="Company Settings"
        subtitle="Loading configuration..."
        icon={Building2}
      >
        <div className="h-[60vh] w-full flex flex-col items-center justify-center text-zinc-400">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-zinc-300" />
          <p>Loading your profile...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Company Profile"
      subtitle="Manage your organization's identity, branding, and location."
      icon={Building2}
      actions={
        <Button
          disabled={isSaving}
          onClick={onSave}
          className="bg-zinc-900 hover:bg-zinc-800 text-white min-w-[140px] shadow-sm transition-all active:scale-[0.98]"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      }
    >
      <div className="container mx-auto space-y-6 pb-10">
        {/* --- Identity Section --- */}
        <SettingsSection
          title="Organization Identity"
          description="This information will be displayed on your public profile and invoices."
          icon={Building2}
        >
          <div className="flex flex-col md:flex-row gap-8">
            {/* Logo Uploader */}
            <div className="w-full md:w-auto flex flex-col items-center md:items-start space-y-3">
              <Label className="text-sm font-medium text-zinc-700">
                Company Logo
              </Label>
              <div
                className={cn(
                  "relative group w-32 h-32 rounded-2xl border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden bg-zinc-50 transition-all",
                  !model.logo &&
                    "hover:border-zinc-300 hover:bg-zinc-100 cursor-pointer",
                )}
                onClick={() => !model.logo && fileInputRef.current?.click()}
              >
                {model.logo ? (
                  <div className="relative w-full h-full p-2">
                    <img
                      src={model.logo}
                      alt="Logo"
                      className="w-full h-full object-contain"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-zinc-400">
                    {logoUploading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Upload className="w-6 h-6 mb-1" />
                    )}
                    <span className="text-[10px] font-medium uppercase">
                      Upload
                    </span>
                  </div>
                )}
              </div>

              {/* Logo Actions */}
              {model.logo && (
                <button
                  onClick={() => {
                    handleChange("logo", "");
                    updateLogo(null);
                  }}
                  className="text-xs text-red-600 font-medium hover:text-red-700 flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Remove logo
                </button>
              )}

              {logoError && (
                <p className="text-xs text-red-500 font-medium max-w-[130px]">
                  {logoError}
                </p>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/svg+xml"
                className="hidden"
                onChange={(e) => handleLogoUpload(e.target.files?.[0])}
              />
            </div>

            {/* Inputs */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 w-full">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700">
                  Display Name
                </Label>
                <Input
                  value={model.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder="e.g. Acme Inc."
                />
                {fieldErrors["companyName"] && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors["companyName"]}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700">
                  Workspace Slug
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium">
                    app.com/
                  </span>
                  <Input
                    value={model.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    className="pl-20"
                    placeholder="acme"
                  />
                  {fieldErrors["slug"] && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors["slug"]}</p>
                  )}
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-sm font-medium text-zinc-700">
                  Industry
                </Label>
                <Input
                  value={model.industry}
                  onChange={(e) => handleChange("industry", e.target.value)}
                  placeholder="e.g. Software Development"
                />
                {fieldErrors["industry"] && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors["industry"]}</p>
                )}
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* --- Location Section --- */}
        <SettingsSection
          title="Location & Address"
          description="Manage your primary headquarters address."
          icon={MapPin}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div className="md:col-span-2 space-y-2">
              <Label className="text-sm font-medium text-zinc-700">
                Street Address
              </Label>
              <Input
                value={model.address.street}
                onChange={(e) => handleChange("address.street", e.target.value)}
                placeholder="123 Innovation Drive"
              />
              {fieldErrors["address.street"] && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors["address.street"]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-700">City</Label>
              <Input
                value={model.address.city}
                onChange={(e) => handleChange("address.city", e.target.value)}
              />
              {fieldErrors["address.city"] && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors["address.city"]}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700">
                  Zip Code
                </Label>
              <Input
                value={model.address.zipCode}
                onChange={(e) =>
                  handleChange("address.zipCode", e.target.value)
                }
              />
              {fieldErrors["address.zipCode"] && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors["address.zipCode"]}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-700">
                Country
              </Label>
              <Input
                value={model.address.country}
                onChange={(e) =>
                  handleChange("address.country", e.target.value)
                }
              />
              {fieldErrors["address.country"] && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors["address.country"]}</p>
              )}
            </div>
            </div>
          </div>
        </SettingsSection>

        {/* --- Layout Grid for 2 Smaller Sections --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Branding */}
          <SettingsSection
            title="Brand Appearance"
            description="Customize the look and feel of your workspace."
            icon={Palette}
            className="h-full"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <HexColorPicker
                id="primary"
                label="Primary"
                value={model.theme.primaryColor}
                onChange={(v) => handleChange("theme.primaryColor", v)}
              />
              {fieldErrors["theme.primaryColor"] && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors["theme.primaryColor"]}</p>
              )}
              <HexColorPicker
                id="secondary"
                label="Secondary"
                value={model.theme.secondaryColor}
                onChange={(v) => handleChange("theme.secondaryColor", v)}
              />
              {fieldErrors["theme.secondaryColor"] && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors["theme.secondaryColor"]}</p>
              )}
              <HexColorPicker
                id="accent"
                label="Accent"
                value={model.theme.accentColor}
                onChange={(v) => handleChange("theme.accentColor", v)}
              />
              {fieldErrors["theme.accentColor"] && (
                <p className="text-xs text-red-500 mt-1">{fieldErrors["theme.accentColor"]}</p>
              )}
            </div>
            <div className="mt-8 pt-6 border-t border-zinc-100">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="darkMode"
                    className="text-sm font-medium text-zinc-900"
                  >
                    Dark Mode Default
                  </Label>
                  <p className="text-xs text-zinc-500">
                    Force dark mode for new users.
                  </p>
                </div>
                <input
                  id="darkMode"
                  type="checkbox"
                  className="h-5 w-5 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 transition-all"
                  checked={!!model.theme.darkMode}
                  onChange={(e) =>
                    handleChange("theme.darkMode", e.target.checked)
                  }
                />
              </div>
            </div>
          </SettingsSection>

          {/* Working Hours */}
          <SettingsSection
            title="Regional Settings"
            description="Set operating hours and timezone."
            icon={Clock}
            className="h-full"
          >
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-zinc-700">
                    Start Time
                  </Label>
                  <Input
                    type="time"
                    value={model.workingHours.startTime}
                    onChange={(e) =>
                      handleChange("workingHours.startTime", e.target.value)
                    }
                    className="block w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-zinc-700">
                    End Time
                  </Label>
                  <Input
                    type="time"
                    value={model.workingHours.endTime}
                    onChange={(e) =>
                      handleChange("workingHours.endTime", e.target.value)
                    }
                    className="block w-full"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-zinc-700">
                  Timezone
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <Input
                    value={model.workingHours.timezone}
                    onChange={(e) =>
                      handleChange("workingHours.timezone", e.target.value)
                    }
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>
    </PageLayout>
  );
}
