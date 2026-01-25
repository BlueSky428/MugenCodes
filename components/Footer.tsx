import Link from "next/link";
import Image from "next/image";

import { siteConfig } from "@/lib/site";

export const Footer = () => {
  return (
    <footer className="border-t border-gray-200/80 bg-white/90 backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-800/90 animate-fade-in-up">
      <div className="container-page py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 group">
              <span className="relative h-10 w-10 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src="/logo.png"
                  alt={`${siteConfig.name} logo`}
                  fill
                  className="object-contain"
                />
              </span>
              <div className="text-base font-bold text-black dark:text-white">
                {siteConfig.name}
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              We deliver software solutions with reliability and attention to detail.
            </p>
          </div>

          <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              Links
            </div>
            <div className="flex flex-col gap-3 text-sm">
              {[
                { href: "/services", label: "Services" },
                { href: "/team", label: "Team" },
                { href: "/contact", label: "Contact" },
                { href: "/privacy", label: "Privacy Policy" }
              ].map((link) => (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className="text-gray-600 transition-all duration-300 hover:text-primary-600 hover:translate-x-1 dark:text-gray-400 dark:hover:text-primary-400 inline-block w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              Contact
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-gray-600 transition-all duration-300 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 inline-block w-fit group"
              >
                <span className="flex items-center gap-2">
                  {siteConfig.email}
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200/80 pt-6 text-xs text-gray-500 dark:border-gray-800/80 dark:text-gray-400 flex items-center justify-between">
          <span>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
