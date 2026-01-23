import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import EmailPreview from "@/components/setup/EmailPreview.jsx";

const EmailStep = ({ formData, updateNestedField, errors }) => {
  const s = formData.emailSettings;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex p-3 rounded-xl bg-gray-100 mb-4">
          <div className="w-6 h-6 rounded bg-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Branding</h2>
        <p className="text-gray-600">Set your default email sender and style. Templates adopt your logo and brand colors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-900 mb-2 block">From Name</Label>
            <Input
              value={s.fromName}
              onChange={(e) => updateNestedField("emailSettings", "fromName", e.target.value)}
              placeholder="Acme Inc"
              className={errors["emailSettings.fromName"] ? "border-red-500" : ""}
            />
            {errors["emailSettings.fromName"] && (
              <p className="text-sm text-red-600 mt-1">{errors["emailSettings.fromName"]}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-900 mb-2 block">From Email</Label>
            <Input
              value={s.fromEmail}
              onChange={(e) => updateNestedField("emailSettings", "fromEmail", e.target.value)}
              placeholder="noreply@acme.com"
              className={errors["emailSettings.fromEmail"] ? "border-red-500" : ""}
            />
            {errors["emailSettings.fromEmail"] && (
              <p className="text-sm text-red-600 mt-1">{errors["emailSettings.fromEmail"]}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-900 mb-2 block">Header Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={s.headerColor}
                onChange={(e) => updateNestedField("emailSettings", "headerColor", e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
              />
              <Input
                value={s.headerColor}
                onChange={(e) => updateNestedField("emailSettings", "headerColor", e.target.value)}
                placeholder="#000000"
                className={"flex-1 " + (errors["emailSettings.headerColor"] ? "border-red-500" : "")}
              />
            </div>
            {errors["emailSettings.headerColor"] && (
              <p className="text-sm text-red-600 mt-1">{errors["emailSettings.headerColor"]}</p>
            )}
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-900 mb-2 block">Footer Text</Label>
            <Input
              value={s.footerText}
              onChange={(e) => updateNestedField("emailSettings", "footerText", e.target.value)}
              placeholder="© Acme Inc. All rights reserved."
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-900 mb-2 block">Template Style</Label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateNestedField("emailSettings", "templateStyle", "modern")}
                className={`px-3 py-2 text-sm rounded border ${s.templateStyle === "modern" ? "bg-primary text-primary-foreground border-primary" : "bg-white"}`}
              >
                Modern
              </button>
              <button
                type="button"
                onClick={() => updateNestedField("emailSettings", "templateStyle", "minimal")}
                className={`px-3 py-2 text-sm rounded border ${s.templateStyle === "minimal" ? "bg-primary text-primary-foreground border-primary" : "bg-white"}`}
              >
                Minimal
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:sticky lg:top-6 h-fit">
          <EmailPreview
            logoUrl={formData.logoPreview || formData.logo}
            companyName={formData.companyName || "Your Company"}
            headerColor={s.headerColor}
            footerText={s.footerText}
          />
        </div>
      </div>
    </div>
  );
};

export default EmailStep;

