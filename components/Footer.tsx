import Link from "next/link";
import Image from "next/image";

import { siteConfig } from "@/lib/site";

export const Footer = () => {
  return (
    <footer className="border-t border-ink/10 bg-white dark:border-white/10 dark:bg-night">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2 text-sm text-ink/70 dark:text-white/70">
          <div className="flex items-center gap-4">
            <span className="relative h-14 w-14">
              <Image
                src="/logo.png"
                alt={`${siteConfig.name} logo`}
                fill
                className="object-contain"
              />
            </span>
          </div>
          <p>We build software with calm delivery and clear care.</p>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm text-ink/70 dark:text-white/70">
          <Link href="/privacy" className="hover:text-ink dark:hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/contact" className="hover:text-ink dark:hover:text-white">
            Contact
          </Link>
          <a href={`mailto:${siteConfig.email}`} className="hover:text-ink dark:hover:text-white">
            {siteConfig.email}
          </a>
        </div>
        <p className="text-xs text-ink/50 dark:text-white/50">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
