import React, { useState } from "react";
import { X, FileText, Award, Briefcase, Send, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const DocumentTemplateModal = ({ request, onClose, onGenerate, isLoading }) => {
  const [showPreview, setShowPreview] = useState(true);
  const [formFields, setFormFields] = useState({
    companyName: "TECHXUDO",
    companySubtitle: "Office Management System",
    customMessage: "",
  });

  if (!request) return null;

  const employeeName = request.userId?.fullName || "Employee Name";
  const designation = request.userId?.designation || "Designation";
  const department = request.userId?.department || "Department";
  const joiningDate = request.userId?.joiningDate
    ? new Date(request.userId?.joiningDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Joining Date";

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getTemplateContent = () => {
    switch (request.type) {
      case "recommendation":
        return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
    .letterhead { text-align: center; margin-bottom: 30px; }
    .company-name { font-size: 24px; font-weight: bold; color: #1e40af; }
    .content { margin: 30px 0; }
    .signature { margin-top: 50px; }
  </style>
</head>
<body>
  <div class="letterhead">
    <div class="company-name">${formFields.companyName}</div>
    <p>${formFields.companySubtitle}</p>
  </div>

  <p><strong>Date:</strong> ${today}</p>

  <h2>To Whom It May Concern</h2>

  <div class="content">
    <p>This is to certify that <strong>${employeeName}</strong> has been working with ${
          formFields.companyName
        } as <strong>${designation}</strong> in the ${department} department since ${joiningDate}.</p>

    <p>During their tenure with us, ${employeeName} has demonstrated exceptional skills, dedication, and professionalism. They have consistently delivered high-quality work and have been an invaluable asset to our team.</p>

    <p>We highly recommend ${employeeName} for any future endeavors and wish them the best in their career.</p>

    ${formFields.customMessage ? `<p>${formFields.customMessage}</p>` : ""}

    <p><strong>Request Purpose:</strong> ${request.reason}</p>
  </div>

  <div class="signature">
    <p><strong>Sincerely,</strong></p>
    <br>
    <p>________________________</p>
    <p>HR Manager</p>
    <p>${formFields.companyName}</p>
  </div>
</body>
</html>`;

      case "experience":
        return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
    .letterhead { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1e40af; padding-bottom: 20px; }
    .company-name { font-size: 24px; font-weight: bold; color: #1e40af; }
    .content { margin: 30px 0; }
    .signature { margin-top: 50px; }
    .certificate-title { text-align: center; font-size: 10px; font-weight: bold; margin: 20px 0; color: #1e40af; }
  </style>
</head>
<body>
  <div class="letterhead">
    <div class="company-name">${formFields.companyName}</div>
    <p>${formFields.companySubtitle}</p>
  </div>

  <div class="certificate-title">EXPERIENCE CERTIFICATE</div>

  <p><strong>Date:</strong> ${today}</p>

  <div class="content">
    <p>This is to certify that <strong>${employeeName}</strong> has worked with ${
          formFields.companyName
        } from <strong>${joiningDate}</strong> to <strong>${today}</strong>.</p>

    <p>During their employment, ${employeeName} worked as <strong>${designation}</strong> in the ${department} department and performed their duties with dedication and integrity.</p>

    ${formFields.customMessage ? `<p>${formFields.customMessage}</p>` : ""}

    <p>We wish ${employeeName} all the best for their future endeavors.</p>

    <p><strong>Purpose:</strong> ${request.reason}</p>
  </div>

  <div class="signature">
    <p><strong>Authorized Signatory</strong></p>
    <br>
    <p>________________________</p>
    <p>HR Department</p>
    <p>${formFields.companyName}</p>
  </div>
</body>
</html>`;

      case "certificate":
        return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
    .certificate-border { border: 5px solid #1e40af; padding: 30px; }
    .letterhead { text-align: center; margin-bottom: 30px; }
    .company-name { font-size: 24px; font-weight: bold; color: #1e40af; }
    .content { margin: 30px 0; text-align: center; }
    .certificate-title { font-size: 20px; font-weight: bold; margin: 20px 0; color: #1e40af; text-align:center }
    .recipient-name { font-size: 24px; font-weight: bold; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="certificate-border">
    <div class="letterhead">
      <div class="company-name">${formFields.companyName}</div>
      <p>${formFields.companySubtitle}</p>
    </div>

    <div class="certificate-title"> ${
      request.customType ? " " + request.customType.toUpperCase() : ""
    }</div>

    <div class="content">
      <p>This certificate is proudly presented to</p>
      <div class="recipient-name">${employeeName}</div>
      <p><strong>${designation}</strong></p>
      <p>${department} Department</p>

      ${
        formFields.customMessage
          ? `<p style="margin-top: 30px;">${formFields.customMessage}</p>`
          : ""
      }

      

      <p style="margin-top: 40px;"><strong>Date:</strong> ${today}</p>
    </div>

    <div style="margin-top: 60px; text-align: center;">
      <p>________________________</p>
      <p><strong>Authorized Signatory</strong></p>
    </div>
  </div>
</body>
</html>`;

      default:
        return "";
    }
  };

  const handleGenerate = () => {
    const content = getTemplateContent();
    onGenerate(request._id, content);
  };

  const getIcon = () => {
    switch (request.type) {
      case "recommendation":
        return Award;
      case "experience":
        return Briefcase;
      default:
        return FileText;
    }
  };

  const Icon = getIcon();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-b border-gray-100">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">
              Generate Document
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {request.userId?.fullName} - {request.type}{" "}
              {request.customType && `(${request.customType})`}
            </p>
          </div>
          <Button variant="ghost" onClick={onClose} className="rounded-lg">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Edit Form */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">
                  Document Details
                </h4>
              </div>

              {/* Employee Info (Read-only) */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
                <h5 className="text-sm font-semibold text-gray-700 mb-2">
                  Employee Information
                </h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <p className="font-medium text-gray-900">{employeeName}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Designation:</span>
                    <p className="font-medium text-gray-900">{designation}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Department:</span>
                    <p className="font-medium text-gray-900">{department}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Joining Date:</span>
                    <p className="font-medium text-gray-900">{joiningDate}</p>
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formFields.companyName}
                  onChange={handleFieldChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Subtitle
                </label>
                <input
                  type="text"
                  name="companySubtitle"
                  value={formFields.companySubtitle}
                  onChange={handleFieldChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Message (Optional)
                </label>
                <textarea
                  name="customMessage"
                  value={formFields.customMessage}
                  onChange={handleFieldChange}
                  placeholder="Add any custom message or additional details..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  rows="4"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">
                      Document Preview
                    </h4>
                    <p className="text-xs text-blue-700">
                      The document preview shows how the final PDF will look.
                      Edit the fields on the left to customize the content.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">Preview</h4>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Live Preview</span>
                </div>
              </div>

              <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-inner">
                <div
                  className="p-8 max-h-[500px] overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: getTemplateContent() }}
                  style={{
                    fontFamily: "Arial, sans-serif",
                    fontSize: "12px",
                    lineHeight: "1.6",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="flex-1 px-4 py-2.5 font-medium rounded-lg"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>Generate Document</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentTemplateModal;
