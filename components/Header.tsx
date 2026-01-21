"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DropdownNav } from "@/components/DropdownNav";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/team", label: "Team" },
  { href: "/services", label: "Services" },
  {
    type: "dropdown",
    label: "Projects",
    items: [
      { href: "/projects/new", label: "New Project" },
      { href: "/projects/application-in-progress", label: "Application in Progress" },
      { href: "/projects/under-agreement", label: "Discussion in Progress" },
      { href: "/projects/ongoing", label: "Development in Progress" },
      { href: "/projects/successful", label: "Approved" },
      { href: "/projects/failed", label: "Failed" },
    ],
  },
  { href: "/contact", label: "Contact" },
];

export const Header = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "DEVELOPER";

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
          {navLinks.map((link, index) =>
            (link as any).type === "dropdown" ? (
              <DropdownNav
                key={index}
                label={link.label}
                items={(link as any).items}
              />
            ) : (
              <Link
                key={(link as any).href}
                href={(link as any).href}
                className="hover:text-ink dark:hover:text-white"
              >
                {(link as any).label}
              </Link>
            )
          )}
          {isAdmin && (
            <Link
              href="/admin"
              className="hover:text-ink dark:hover:text-white font-medium text-accent"
            >
              Admin
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
