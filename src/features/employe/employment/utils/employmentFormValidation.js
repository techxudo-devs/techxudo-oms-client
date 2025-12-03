import * as Yup from "yup";

// Validation schemas for each step
export const validationSchemas = [
  // Step 0: Personal Info
  Yup.object({
    photo: Yup.string().nullable(),
    legalName: Yup.string().required("Legal name is required").min(2, "Name must be at least 2 characters"),
    dateOfBirth: Yup.date().required("Date of birth is required"),
    gender: Yup.string().required("Gender is required").oneOf(["male", "female", "other"]),
    maritalStatus: Yup.string().oneOf(["single", "married", "divorced", "widowed"]),
  }),

  // Step 1: CNIC Info
  Yup.object({
    cnicNumber: Yup.string().required("CNIC is required").matches(/^\d{5}-\d{7}-\d{1}$/, "Format: 12345-1234567-1"),
    cnicFrontImage: Yup.string().required("CNIC front image required").url(),
    cnicBackImage: Yup.string().required("CNIC back image required").url(),
  }),

  // Step 2: Contact Info
  Yup.object({
    phone: Yup.string().required("Phone is required").matches(/^[+]?[\d\s-()]+$/, "Invalid phone"),
    email: Yup.string().required("Email is required").email("Invalid email"),
    emergencyContactName: Yup.string().required("Emergency contact required"),
    emergencyContactPhone: Yup.string().required("Emergency phone required").matches(/^[+]?[\d\s-()]+$/),
  }),

  // Step 3: Address Info
  Yup.object({
    primaryCity: Yup.string().required("City is required"),
  }),

  // Step 4: Policy Acceptance (dynamic validation)
  Yup.object({
    acceptedPolicies: Yup.array().of(
      Yup.object({
        policyId: Yup.string().required(),
        policyTitle: Yup.string(),
        acceptedAt: Yup.date(),
      })
    ),
  }),
];

// Initial form values
export const initialValues = {
  photo: null,
  legalName: "",
  fatherName: "",
  guardianName: "",
  guardianCNIC: "",
  dateOfBirth: "",
  gender: "",
  maritalStatus: "",
  cnicNumber: "",
  cnicFrontImage: null,
  cnicBackImage: null,
  cnicIssueDate: "",
  cnicExpiryDate: "",
  phone: "",
  alternatePhone: "",
  email: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactPhone: "",
  primaryStreet: "",
  primaryCity: "",
  primaryState: "",
  primaryZipCode: "",
  secondaryStreet: "",
  secondaryCity: "",
  secondaryState: "",
  secondaryZipCode: "",
  acceptedPolicies: [],
};

// Fields for each step
export const stepFields = [
  ["photo", "legalName", "fatherName", "guardianName", "guardianCNIC", "dateOfBirth", "gender", "maritalStatus"],
  ["cnicNumber", "cnicFrontImage", "cnicBackImage", "cnicIssueDate", "cnicExpiryDate"],
  ["phone", "alternatePhone", "email", "emergencyContactName", "emergencyContactRelationship", "emergencyContactPhone"],
  ["primaryStreet", "primaryCity", "primaryState", "primaryZipCode", "secondaryStreet", "secondaryCity", "secondaryState", "secondaryZipCode"],
  ["acceptedPolicies"],
];

// Transform form values to API format
export const transformToApiFormat = (values) => ({
  personalInfo: {
    photo: values.photo,
    legalName: values.legalName,
    fatherName: values.fatherName,
    guardianName: values.guardianName,
    guardianCNIC: values.guardianCNIC,
    dateOfBirth: values.dateOfBirth,
    gender: values.gender,
    maritalStatus: values.maritalStatus,
  },
  cnicInfo: {
    cnicNumber: values.cnicNumber,
    cnicFrontImage: values.cnicFrontImage,
    cnicBackImage: values.cnicBackImage,
    cnicIssueDate: values.cnicIssueDate,
    cnicExpiryDate: values.cnicExpiryDate,
  },
  contactInfo: {
    phone: values.phone,
    alternatePhone: values.alternatePhone,
    email: values.email,
    emergencyContact: {
      name: values.emergencyContactName,
      relationship: values.emergencyContactRelationship,
      phone: values.emergencyContactPhone,
    },
  },
  addresses: {
    primaryAddress: {
      street: values.primaryStreet,
      city: values.primaryCity,
      state: values.primaryState,
      zipCode: values.primaryZipCode,
    },
    secondaryAddress: {
      street: values.secondaryStreet,
      city: values.secondaryCity,
      state: values.secondaryState,
      zipCode: values.secondaryZipCode,
    },
  },
  acceptedPolicies: values.acceptedPolicies,
});
