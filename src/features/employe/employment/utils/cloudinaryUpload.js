/**
 * Upload image to Cloudinary (Frontend only)
 * @param {File} file - Image file to upload
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadToCloudinary = async (file, folder = "employee_documents") => {
  try {
    // Validate file
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Please upload an image file" };
    }

    if (file.size > 2 * 1024 * 1024) {
      return { success: false, error: "Image size must be less than 2MB" };
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "unsigned_preset"
    );
    formData.append("folder", folder);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

    if (!cloudName) {
      return { success: false, error: "Cloudinary not configured" };
    }

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      return { success: false, error: "Upload failed" };
    }

    const data = await response.json();
    return { success: true, url: data.secure_url };
  } catch (error) {
    return { success: false, error: error.message || "Upload failed" };
  }
};
