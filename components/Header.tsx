import Link from "next/link";
import Image from "next/image";

import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/team", label: "Team" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" }
];

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-surface/90 backdrop-blur dark:border-white/10 dark:bg-night/90">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-2">
        <Link href="/" aria-label={siteConfig.name} className="flex items-center">
          <span className="relative flex h-12 w-12 items-center justify-center md:h-16 md:w-16">
            <Image
              src="/logo.png"
              alt={`${siteConfig.name} logo`}
              fill
              className="object-contain flex flex-wrap mt-[10px]"
              priority
            />
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-xs text-ink/70 md:gap-6 md:text-sm dark:text-white/70">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink dark:hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
