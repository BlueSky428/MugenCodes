import type { Metadata } from "next";

import { Section } from "@/components/Section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy"
};

export default function PrivacyPage() {
  return (
    <Section eyebrow="Legal" title="Privacy policy">
      <div className="card card-dark p-8 max-w-3xl">
        <div className="space-y-4">
          <p>
            This site collects information you send through the contact form. This includes your name, email,
            company, project summary, and any other details you choose to share.
          </p>
          <p>
            We use this information to respond to your request, plan your project, and keep a record of our
            conversations. We do not sell your data or share it with third parties for marketing.
          </p>
          <p>
            We keep contact submissions for as long as needed to manage our work together. If you want your
            data removed, email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> and we will
            delete it.
          </p>
        </div>
      </div>
    </Section>
  );
}
