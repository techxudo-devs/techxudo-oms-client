/**
 * Uploads a file to Cloudinary
 * @param {File} file - The file to upload
 * @param {string} uploadPreset - The Cloudinary upload preset
 * @param {string} resourceType - The type of resource ('image', 'raw', 'auto')
 * @returns {Promise<string>} - The secure URL of the uploaded file
 */
export const uploadToCloudinary = async (
  file,
  uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
  resourceType = 'auto' // 'image', 'raw', 'auto' - for PDFs use 'raw' or 'auto'
) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  // Get cloud name from environment variables
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    throw new Error('Cloudinary cloud name is not configured. Please set VITE_CLOUDINARY_CLOUD_NAME in your environment variables.');
  }

  if (!uploadPreset) {
    throw new Error('Cloudinary upload preset is not configured. Please set VITE_CLOUDINARY_UPLOAD_PRESET in your environment variables.');
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    {
      method: 'POST',
      body: formData
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || 'Upload failed');
  }

  return data.secure_url; // Return the URL of the uploaded file
};