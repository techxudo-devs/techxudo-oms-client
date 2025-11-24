import React from 'react';
import { X, Upload, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LeaveRequestForm = ({ 
  formData, 
  daysCount, 
  onInputChange, 
  onAttachmentChange, 
  onSubmit, 
  onCancel,
  isLoading 
}) => {
  const handleFileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    onAttachmentChange(files);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    onAttachmentChange(files);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Apply for Leave</h3>
        <Button
          variant={'outline'}
          onClick={onCancel} 
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Leave Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Leave Type *
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={onInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          >
            <option value="casual">Casual Leave</option>
            <option value="sick">Sick Leave</option>
            <option value="annual">Annual Leave</option>
            <option value="emergency">Emergency Leave</option>
          </select>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <div className="relative">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={onInputChange}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date *
            </label>
            <div className="relative">
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={onInputChange}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Days Count */}
        {daysCount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <span className="text-blue-800 font-medium">
              {daysCount} Day{daysCount !== 1 ? 's' : ''} selected
            </span>
          </div>
        )}

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason *
          </label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={onInputChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Please provide a reason for your leave..."
            required
          />
        </div>

        {/* Attachment for Sick Leave */}
        {formData.type === 'sick' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medical Certificate (Optional)
            </label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                Drag & drop your medical certificate here, or click to select
              </p>
              <input
                type="file"
                onChange={handleFileInput}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
              />
              <button
                type="button"
                onClick={() => document.querySelector('input[type="file"]').click()}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Browse Files
              </button>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <Button
            type="submit"
            variant={''}
            disabled={isLoading}
            clas
           >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            <span>Submit Request</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LeaveRequestForm;