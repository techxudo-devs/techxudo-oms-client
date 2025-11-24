import { useParams, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  useGetOnboardingDetailsQuery,
  useAcceptOfferMutation,
  useRejectOfferMutation,
  useCompleteOnboardingMutation,
} from "../apiSlices/onBoardingApiSlice";
import { uploadToCloudinary } from "../../shared/utils/cloudinary";
import { toast } from "sonner";

const initialValues = {
  password: "",
  confirmPassword: "",
  avatar: null,
  cnicImage: null,
  github: "",
  linkedin: "",
  dateOfBirth: "",
  address: { street: "", city: "", country: "" },
  emergencyContact: { name: "", relationship: "", phone: "" },
};

const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
  avatar: Yup.mixed().required("A profile picture is required").nullable(),
  cnicImage: Yup.mixed().required("A CNIC image is required").nullable(),
  github: Yup.string().url("Must be a valid URL"),
  linkedin: Yup.string().url("Must be a valid URL"),
  dateOfBirth: Yup.date().required("Required"),
}).test(
  "at-least-one-social",
  "At least one social link (GitHub or LinkedIn) is required",
  (value) => !!value.github || !!value.linkedin
);

export const useOnboarding = () => {
  const { token } = useParams(); // Get token from URL: e.g., /onboarding/:token

  // Fetch onboarding details
  const {
    data: onboardingDetails,
    isLoading: isLoadingDetails,
    isError,
    error,
  } = useGetOnboardingDetailsQuery(token, {
    skip: !token, // Don't run the query if there's no token
  });

  // Mutations
  const [acceptOffer, { isLoading: isAccepting }] = useAcceptOfferMutation();
  const [rejectOffer, { isLoading: isRejecting }] = useRejectOfferMutation();
  const [completeOnboarding, { isLoading: isCompleting }] =
    useCompleteOnboardingMutation();

  const onSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      setStatus({ error: null });

      // 1. Upload files to Cloudinary
      toast.info("Uploading images...");
      const [avatarUrl, cnicImageUrl] = await Promise.all([
        uploadToCloudinary(values.avatar),
        uploadToCloudinary(values.cnicImage),
      ]);

      // 2. Prepare final data payload
      const finalData = {
        password: values.password,
        github: values.github,
        linkedin: values.linkedin,
        dateOfBirth: values.dateOfBirth,
        address: values.address,
        emergencyContact: values.emergencyContact,
        avatar: avatarUrl,
        cnicImage: cnicImageUrl,
      };

      // 3. Submit to backend
      toast.info("Finalizing your account...");
      const result = await completeOnboarding({ token, data: finalData }).unwrap();

      toast.success("Onboarding completed successfully!");

      // Don't redirect immediately - let the query refetch and show the completed status
      // The completed status screen will have a login button
    } catch (err) {
      const errorMessage =
        err?.data?.error ||
        err.message ||
        "An unexpected error occurred. Please try again.";
      setStatus({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      // Formik handles the isSubmitting state, but it's good practice to ensure it's set to false.
      setSubmitting(false);
    }
  };

  const handleAccept = async () => {
    try {
      await acceptOffer(token).unwrap();
      toast.success("Offer accepted successfully!");
    } catch (err) {
      const errorMessage = err?.data?.error || "Failed to accept offer";
      toast.error(errorMessage);
      console.error("Failed to accept offer:", err);
    }
  };

  // Handler for rejecting the offer
  const handleReject = async (reason) => {
    try {
      await rejectOffer({ token, reason }).unwrap();
      toast.success("Offer declined successfully");
    } catch (err) {
      const errorMessage = err?.data?.error || "Failed to reject offer";
      toast.error(errorMessage);
      console.error("Failed to reject offer:", err);
    }
  };

  return {
    onboardingDetails: onboardingDetails?.data,
    token,
    isLoading: isLoadingDetails,
    isError,
    error,

    formConfig: {
      initialValues,
      validationSchema,
      onSubmit,
    },

    actions: {
      acceptOffer: handleAccept,
      rejectOffer: handleReject,
    },

    actionState: {
      isAccepting,
      isRejecting,
      isCompleting,
    },
  };
};
