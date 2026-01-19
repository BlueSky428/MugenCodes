import type { ContactSubmission } from "./storage";

type EmailResult = {
  provider: string;
  delivered: boolean;
};

export const sendContactEmail = async (
  submission: ContactSubmission
): Promise<EmailResult> => {
  const provider = process.env.EMAIL_PROVIDER || "mock";

  if (provider === "mock") {
    console.log("Mock email sender", submission);
    return { provider, delivered: true };
  }

  // TODO connect to a real email provider using env vars
  console.log("Email provider not configured", provider, submission);
  return { provider, delivered: false };
};
