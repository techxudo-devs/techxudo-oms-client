import { CheckCircle2, Building2, Palette, Building, Clock, FileText, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Step 7: Review & Complete
 * Final review of all setup information
 */
const ReviewStep = ({ formData, goToStep, isSaving, errors }) => {
  console.log("This the the form DAta", formData);
  const safe = (v, fallback) => (v === null || v === undefined ? fallback : v);
  const contactInfo = safe(formData?.contactInfo, {});
  const address = safe(formData?.address, {});
  const theme = safe(formData?.theme, {});
  const workingHours = safe(formData?.workingHours, {});
  const emailSettings = safe(formData?.emailSettings, {});
  const departments = Array.isArray(formData?.departments) ? formData.departments : [];
  const documents = Array.isArray(formData?.documents) ? formData.documents : [];
  const workingDays = Array.isArray(workingHours?.workingDays) ? workingHours.workingDays : [];
  const policies = Array.isArray(formData?.policies) ? formData.policies : [];
  const weekDays = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  };

  const sections = [
    {
      id: 0,
      icon: Building2,
      title: "Company Information",
      items: [
        { label: "Company Name", value: formData?.companyName || "" },
        { label: "Company Slug", value: formData?.slug || "" },
        { label: "Email", value: contactInfo.email || "" },
        { label: "Phone", value: contactInfo.phone || "Not provided" },
        {
          label: "Website",
          value: contactInfo.website || "Not provided",
        },
        {
          label: "Address",
          value: [
            address.street,
            address.city,
            address.state,
            address.postalCode,
            address.country,
          ]
            .filter(Boolean)
            .join(", "),
        },
      ],
    },
    {
      id: 1,
      icon: Palette,
      title: "Branding",
      items: [
        {
          label: "Primary Color",
          value: theme.primaryColor || "#000000",
          isColor: true,
        },
        {
          label: "Secondary Color",
          value: theme.secondaryColor || "#000000",
          isColor: true,
        },
        {
          label: "Accent Color",
          value: theme.accentColor || "#000000",
          isColor: true,
        },
        {
          label: "Dark Mode",
          value: theme.darkMode ? "Enabled" : "Disabled",
        },
      ],
    },
    {
      id: 2,
      icon: Building,
      title: "Departments",
      items:
        departments.length > 0
          ? departments.map((dept) => ({
              label: dept.name,
              value: dept.description || "No description",
            }))
          : [{ label: "No departments", value: "Add departments later" }],
    },
    {
      id: 3,
      icon: Clock,
      title: "Working Hours",
      items: [
        { label: "Timezone", value: workingHours.timezone || "" },
        {
          label: "Working Hours",
          value: `${safe(workingHours.startTime, "--:--")} - ${safe(workingHours.endTime, "--:--")}`,
        },
        {
          label: "Working Days",
          value: workingDays
            .map((day) => weekDays[day])
            .join(", "),
        },
      ],
    },
    {
      id: 4,
      icon: FileText,
      title: "Documents",
      items:
        (documents && documents.length > 0)
          ? documents.map((d) => ({ label: d.name, value: d.type?.includes("template") ? "Template" : "Upload" }))
          : [{ label: "No documents", value: "You can add later" }],
    },
    {
      id: 5,
      icon: FileText,
      title: "Email",
      items: [
        { label: "From Name", value: emailSettings?.fromName || "" },
        { label: "From Email", value: emailSettings?.fromEmail || "" },
        { label: "Header Color", value: emailSettings?.headerColor || "#000000" },
        { label: "Template", value: (emailSettings?.templateStyle || "modern").toUpperCase() },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex p-3 rounded-xl bg-green-100 mb-4">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review and complete setup
        </h2>
        <p className="text-gray-600">
          Please review all the information below. You can go back to edit any
          section.
        </p>
      </div>

      {/* Review Sections */}
      <div className="space-y-4 mb-8">
        {sections.map((section) => (
          <div
            key={section.id}
            className="p-6 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100">
                  <section.icon className="w-5 h-5 text-gray-900" />
                </div>
                <h3 className="font-semibold text-gray-900">{section.title}</h3>
              </div>
              <Button
                onClick={() => goToStep(section.id)}
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {section.items.map((item, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 mb-1">
                    {item.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {item.isColor && (
                      <div
                        className="w-6 h-6 rounded border border-gray-200 flex-shrink-0"
                        style={{ backgroundColor: item.value }}
                      />
                    )}
                    <span className="text-sm text-gray-900 font-mono">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submission Error */}
      {errors.submit && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Final Confirmation */}
      <div className="p-6 rounded-xl border-2 border-gray-900 bg-gray-50">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-5 h-5 rounded border-2 border-gray-900 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-gray-900" />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-2">
              Ready to complete setup?
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              By completing the setup, you confirm that all information provided
              is accurate. You can always update these settings later from your
              dashboard.
            </p>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Your workspace will be activated</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>You can start adding employees immediately</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>All features will be available based on your plan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-center">
          <div className="text-2xl font-bold text-blue-900 mb-1">
            {departments.length}
          </div>
          <div className="text-xs text-blue-700">Departments</div>
        </div>

        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-center">
          <div className="text-2xl font-bold text-green-900 mb-1">
            {workingDays.length}
          </div>
          <div className="text-xs text-green-700">Working Days</div>
        </div>

        <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 text-center">
          <div className="text-2xl font-bold text-purple-900 mb-1">
            {policies.length}
          </div>
          <div className="text-xs text-purple-700">Policies</div>
        </div>
      </div>

      {/* Loading State */}
      {isSaving && (
        <div className="mt-6 p-4 rounded-lg bg-gray-100 border border-gray-200">
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-gray-900">
              Completing setup...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewStep;
