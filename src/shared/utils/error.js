// Normalize API errors from Axios/RTK into a common shape
// Returns: { message: string, fieldErrors: Record<string,string> }
export function extractApiError(error) {
  // Axios error shape
  const data = error?.response?.data || {};
  const status = error?.response?.status;

  const result = {
    message:
      data?.message || data?.error || error?.message || "Something went wrong",
    fieldErrors: {},
  };

  // express-validator array → map to fields
  if (Array.isArray(data?.errors)) {
    for (const err of data.errors) {
      const field = normalizeBackendField(err.field || err.path);
      if (field) result.fieldErrors[field] = err.message || err.msg || "Invalid";
    }
  }

  // Heuristics for common messages → assign to fields
  if (typeof result.message === "string") {
    const msg = result.message.toLowerCase();
    if (msg.includes("organization") && msg.includes("exists")) {
      result.fieldErrors.companyName = result.message;
    }
    if (msg.includes("user") && msg.includes("email") && msg.includes("exists")) {
      result.fieldErrors.email = result.message;
    }
    if (msg.includes("password")) {
      result.fieldErrors.password = result.message;
    }
  }

  // Map 422/400 without details to generic guidance
  if ((status === 400 || status === 422) && !Object.keys(result.fieldErrors).length) {
    // keep top-level message but hint validation
    result.message = result.message || "Validation failed";
  }

  return result;
}

// Map backend field names to local form field keys
function normalizeBackendField(field) {
  if (!field) return field;
  const map = {
    ownerEmail: "email",
    ownerName: "fullName",
    ownerPassword: "password",
    companyName: "companyName",
    planSlug: "plan", // not currently exposed in UI
  };
  return map[field] || field;
}

