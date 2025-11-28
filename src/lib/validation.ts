import { API_BASE_URL } from "@/constants/common";
import {
  VALIDATION_FULL_NAME_REQUIRED,
  VALIDATION_PHONE_REQUIRED,
  VALIDATION_PHONE_INVALID,
  VALIDATION_EMAIL_REQUIRED,
  VALIDATION_EMAIL_INVALID,
  VALIDATION_EMAIL_EXISTS,
  VALIDATION_WEBSITE_INVALID,
  VALIDATION_PASSWORD_REQUIRED,
  VALIDATION_PASSWORD_MIN_LENGTH,
  VALIDATION_PASSWORD_STRENGTH,
  VALIDATION_CONFIRM_PASSWORD_REQUIRED,
  VALIDATION_PASSWORD_MISMATCH,
} from "@/constants/common";

export interface ValidationErrors {
  [key: string]: string;
}

export const commonValidations = {
  fullNameRequired: (value: string): string | null => {
    if (!value.trim()) {
      return VALIDATION_FULL_NAME_REQUIRED;
    }
    return null;
  },

  phoneRequired: (value: string): string | null => {
    if (!value.trim()) {
      return VALIDATION_PHONE_REQUIRED;
    } else if (!/^\d{10,}$/.test(value.replace(/\s/g, ""))) {
      return VALIDATION_PHONE_INVALID;
    }
    return null;
  },

  emailRequired: (value: string): string | null => {
    if (!value.trim()) {
      return VALIDATION_EMAIL_REQUIRED;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return VALIDATION_EMAIL_INVALID;
    }
    return null;
  },

  emailUnique: async (
    email: string,
    excludeEmail?: string
  ): Promise<string | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      const users = await response.json();
      if (Array.isArray(users)) {
        const emailExists = users.some((user: any) => user.email === email);
        const isCurrentUser = email === excludeEmail;

        if (emailExists && !isCurrentUser) {
          return VALIDATION_EMAIL_EXISTS;
        }
      }
    } catch (err) {
      console.warn("Email uniqueness check failed:", err);
    }
    return null;
  },

  websiteOptional: (value: string): string | null => {
    if (value.trim() && !/^https?:\/\/.+\..+/.test(value)) {
      return VALIDATION_WEBSITE_INVALID;
    }
    return null;
  },

  passwordRequired: (value: string): string | null => {
    if (!value) {
      return VALIDATION_PASSWORD_REQUIRED;
    } else if (value.length < 8) {
      return VALIDATION_PASSWORD_MIN_LENGTH;
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
      return VALIDATION_PASSWORD_STRENGTH;
    }
    return null;
  },

  confirmPassword: (
    confirmPassword: string,
    password: string
  ): string | null => {
    if (!confirmPassword) {
      return VALIDATION_CONFIRM_PASSWORD_REQUIRED;
    } else if (password !== confirmPassword) {
      return VALIDATION_PASSWORD_MISMATCH;
    }
    return null;
  },

  emailExistsForForgotPassword: async (
    email: string
  ): Promise<string | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      const users = await response.json();
      if (
        !Array.isArray(users) ||
        !users.some((user: any) => user.email === email)
      ) {
        return "Email không tồn tại trong hệ thống";
      }
    } catch (err) {
      console.warn("Email existence check failed:", err);
    }
    return null;
  },
};

export const validateFields = async (
  validations: (() => Promise<string | null> | string | null)[]
): Promise<{ [key: string]: string }> => {
  const errors: { [key: string]: string } = {};
  const keys = Object.keys(validations);

  for (let i = 0; i < validations.length; i++) {
    const validation = validations[i];
    const result = await Promise.resolve(validation());
    if (result) {
      errors[keys[i]] = result;
    }
  }

  return errors;
};