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

export const sendVerificationEmail = async (
  email: string,
  name: string,
  verificationToken: string
): Promise<EmailResult> => {
  const provider = process.env.EMAIL_PROVIDER || "mock";
  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verificationUrl = `${baseUrl}/auth/verify-email?token=${verificationToken}`;

  if (provider === "mock") {
    console.log("=== VERIFICATION EMAIL (MOCK) ===");
    console.log("To:", email);
    console.log("Subject: Verify your email address");
    console.log("Verification URL:", verificationUrl);
    console.log("================================");
    return { provider, delivered: true };
  }

  // TODO connect to a real email provider using env vars
  // Example with nodemailer, SendGrid, Resend, etc.
  console.log("Email provider not configured", provider, { email, verificationUrl });
  return { provider, delivered: false };
};
