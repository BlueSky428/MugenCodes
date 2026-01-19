export type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  summary: string;
  budget?: string;
  timeline?: string;
  privacyAccepted: boolean;
  website?: string;
};

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

export const validateContactPayload = (payload: ContactPayload) => {
  const errors: ContactErrors = {};

  if (!payload.name?.trim()) {
    errors.name = "Please share your name.";
  }

  if (!payload.email?.trim()) {
    errors.email = "Please share your email.";
  } else if (!isValidEmail(payload.email)) {
    errors.email = "Please use a valid email.";
  }

  if (!payload.summary?.trim()) {
    errors.summary = "Please share a short project summary.";
  }

  if (!payload.privacyAccepted) {
    errors.privacyAccepted = "Please confirm the privacy policy.";
  }

  if (payload.website && payload.website.trim().length > 0) {
    errors.website = "Spam detected.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const isValidEmail = (value: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
};
