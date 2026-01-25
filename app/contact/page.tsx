import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Section } from "@/components/Section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact"
};

interface ContactItemProps {
  label: string;
  value: string;
  href: string;
  icon: ReactNode;
}

const ContactItem = ({ label, value, href, icon }: ContactItemProps) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="card card-dark card-hover group flex items-center gap-4 p-6 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300 animate-fade-in-up"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-ink/55 dark:text-white/50">
          {label}
        </div>
        <div className="mt-1 text-lg font-semibold text-ink dark:text-white">{value}</div>
      </div>
    </a>
  );
};

// Phone Icon
const PhoneIcon = () => (
  <svg
    className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

// Gmail Icon (Official brand logo)
const EmailIcon = () => (
  <svg
    className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
    viewBox="0 0 24 24"
    fill="none"
  >
    {/* Official Gmail envelope M logo */}
    <path
      fill="#EA4335"
      d="M24 5.5v5.67l-8.5 4.87v-5.67L24 5.5z"
    />
    <path
      fill="#4285F4"
      d="M24 11.17v5.67l-8.5 4.87v-5.67L24 11.17z"
    />
    <path
      fill="#34A853"
      d="M15.5 16.71v5.67L7 27.25v-5.67l8.5-4.87z"
    />
    <path
      fill="#FBBC04"
      d="M7 21.58v-5.67L0 12.04v5.67l7 3.87z"
    />
    <path
      fill="#C5221F"
      d="M0 12.04v-5.67l7 3.87v5.67L0 12.04z"
    />
    <path
      fill="#EA4335"
      d="M7 5.5v5.67l8.5 4.87V5.5L7 0.63v4.87z"
    />
  </svg>
);

// Telegram Icon (Brand colors)
const TelegramIcon = () => (
  <svg
    className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      fill="#0088cc"
      d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.12l-6.87 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"
    />
  </svg>
);

// WhatsApp Icon (Brand colors)
const WhatsAppIcon = () => (
  <svg
    className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      fill="#25D366"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
    />
  </svg>
);

// LinkedIn Icon (Brand colors)
const LinkedInIcon = () => (
  <svg
    className="w-6 h-6 transition-transform duration-300 group-hover:scale-110"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path
      fill="#0077B5"
      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
    />
  </svg>
);

export default function ContactPage() {
  return (
    <>
      <Section eyebrow="Contact" title="Get in touch">
        <div className="max-w-3xl">
          <p className="muted text-lg">
            Choose your preferred channel. We typically respond within two business days.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ContactItem
            label="Phone"
            value={siteConfig.phone}
            href={`tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`}
            icon={<PhoneIcon />}
          />
          <ContactItem
            label="Email"
            value={siteConfig.email}
            href={`mailto:${siteConfig.email}`}
            icon={<EmailIcon />}
          />
          <ContactItem
            label="Telegram"
            value="Jayabrata Bhaduri"
            href={siteConfig.telegram}
            icon={<TelegramIcon />}
          />
          <ContactItem
            label="WhatsApp"
            value="Jayabrata Bhaduri"
            href={siteConfig.whatsapp}
            icon={<WhatsAppIcon />}
          />
          <ContactItem
            label="LinkedIn"
            value="Jayabrata Bhaduri"
            href={siteConfig.linkedin}
            icon={<LinkedInIcon />}
          />
        </div>
      </Section>
    </>
  );
}
