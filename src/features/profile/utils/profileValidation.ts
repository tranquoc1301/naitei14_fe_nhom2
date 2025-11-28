import { commonValidations, ValidationErrors } from "@/lib/validation";
import { ProfileFormData } from "../types";

export const validateProfileForm = async (
  formData: ProfileFormData,
  currentEmail?: string
): Promise<ValidationErrors> => {
  const errors: ValidationErrors = {};

  // Full name: required
  const fullNameError = commonValidations.fullNameRequired(formData.fullName);
  if (fullNameError) errors.fullName = fullNameError;

  // Phone: required, basic phone validation
  const phoneError = commonValidations.phoneRequired(formData.phone);
  if (phoneError) errors.phone = phoneError;

  // Email: required, valid email, unique (except current email)
  const emailRequiredError = commonValidations.emailRequired(formData.email);
  if (emailRequiredError) {
    errors.email = emailRequiredError;
  } else {
    const emailUniqueError = await commonValidations.emailUnique(formData.email, currentEmail);
    if (emailUniqueError) errors.email = emailUniqueError;
  }

  // Website: optional, but if provided, valid URL
  const websiteError = commonValidations.websiteOptional(formData.website);
  if (websiteError) errors.website = websiteError;

  return errors;
};
