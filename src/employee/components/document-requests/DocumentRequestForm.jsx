import React from 'react';
import { X, FileText, Briefcase, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DocumentRequestForm = ({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const documentTypes = [
    {
      value: 'recommendation',
      label: 'Recommendation Letter',
      description: 'Professional recommendation letter',
      icon: Award,
      color: 'blue'
    },
    {
      value: 'experience',
      label: 'Experience Letter',
      description: 'Employment experience certificate',
      icon: Briefcase,
      color: 'blue'
    },
    {
      value: 'certificate',
      label: 'Custom Certificate',
      description: 'Other certificates',
      icon: TrendingUp,
      color: 'blue'
    }
  ];

  const getIconColorClass = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Request Document</h3>
          <p className="text-sm text-gray-500 mt-1">Choose the type of document you need</p>
        </div>
        <Button
          variant="outline"
          onClick={onCancel}
          className="rounded-lg"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Document Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Document Type *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {documentTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = formData.type === type.value;

              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => onInputChange({ target: { name: 'type', value: type.value } })}
                  className={`relative p-4 border-2 rounded-xl transition-all duration-200 text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${getIconColorClass(type.color)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-sm font-semibold mb-1 ${
                        isSelected ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {type.label}
                      </h4>
                      <p className="text-xs text-gray-500">{type.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Type (only for certificate) */}
        {formData.type === 'certificate' && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Certificate Type *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="customType"
                value={formData.customType}
                onChange={onInputChange}
                placeholder="e.g., Training Certificate, Achievement Certificate"
                className="w-full p-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1.5">Please specify the type of certificate you need</p>
          </div>
        )}

        {/* Reason */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Reason for Request *
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={onInputChange}
            placeholder="Please provide a detailed reason for requesting this document..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            rows="4"
            required
          />
          <p className="text-xs text-gray-500 mt-1.5">Minimum 10 characters required</p>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Processing Time</h4>
              <p className="text-xs text-blue-700">
                Your request will be reviewed by admin. Once approved, the document will be generated
                and available for download in your dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 rounded-lg font-medium"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Submit Request</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DocumentRequestForm;
