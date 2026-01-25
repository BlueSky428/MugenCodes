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

  if (provider === "resend") {
    try {
      const { Resend } = await import("resend");
      const resendApiKey = process.env.RESEND_API_KEY;
      
      if (!resendApiKey) {
        console.error("RESEND_API_KEY is not set in environment variables");
        return { provider, delivered: false };
      }

      const resend = new Resend(resendApiKey);
      const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
      
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "Verify your email address",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px;">Verify Your Email Address</h1>
              </div>
              <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
                <p style="font-size: 16px; margin-bottom: 20px;">Hi ${name},</p>
                <p style="font-size: 16px; margin-bottom: 20px;">Thank you for signing up! Please verify your email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${verificationUrl}" style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Verify Email Address</a>
                </div>
                <p style="font-size: 14px; color: #666; margin-top: 30px;">Or copy and paste this link into your browser:</p>
                <p style="font-size: 12px; color: #999; word-break: break-all; background: #fff; padding: 10px; border-radius: 4px; border: 1px solid #e5e7eb;">${verificationUrl}</p>
                <p style="font-size: 14px; color: #666; margin-top: 30px;">This link will expire in 24 hours.</p>
                <p style="font-size: 14px; color: #666; margin-top: 20px;">If you didn't create an account, you can safely ignore this email.</p>
              </div>
              <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                <p style="font-size: 12px; color: #999;">© ${new Date().getFullYear()} MugenCodes. All rights reserved.</p>
              </div>
            </body>
          </html>
        `,
      });

      if (error) {
        console.error("Resend email error:", error);
        return { provider, delivered: false };
      }

      console.log("Verification email sent successfully via Resend:", data);
      return { provider, delivered: true };
    } catch (error) {
      console.error("Failed to send verification email via Resend:", error);
      return { provider, delivered: false };
    }
  }

  // Fallback for other providers
  console.log("Email provider not configured", provider, { email, verificationUrl });
  return { provider, delivered: false };
};
