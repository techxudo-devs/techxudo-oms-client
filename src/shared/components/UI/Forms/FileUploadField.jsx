import React, { useState, useEffect } from "react";
import { useField } from "formik";
import { UploadCloud, X } from "lucide-react";

export const FileUploadField = ({ label, ...props }) => {
  const [field, meta, helpers] = useField(props.name);
  const { setValue } = helpers;
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // Clean up the preview URL to prevent memory leaks
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setValue(file); // Set the file object in Formik state
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemove = () => {
    setValue(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          {preview ? (
            <div className="relative group w-32 h-32 mx-auto">
              <img
                src={preview}
                alt="Preview"
                className="h-32 w-32 rounded-full object-cover shadow-lg"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          )}
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor={props.id || props.name}
              className="relative cursor-pointer bg-white rounded-md font-medium text-brand-primary hover:text-brand-dark focus-within:outline-none"
            >
              <span>Upload a file</span>
              <input
                id={props.id || props.name}
                name={props.name}
                type="file"
                className="sr-only"
                onChange={handleChange}
                accept="image/*"
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
        </div>
      </div>
      {meta.touched && meta.error ? (
        <div className="text-red-600 text-xs mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};
