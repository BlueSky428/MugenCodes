"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/team", label: "Team" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/projects", label: "My Projects" },
  { href: "/contact", label: "Contact" },
];

export const Header = () => {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "ADMIN" || session?.user?.role === "DEVELOPER";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/90 backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-800/90 animate-fade-in-down shadow-sm">
      <div className="container-page flex items-center justify-between gap-6 py-4">
        <Link 
          href="/" 
          aria-label={siteConfig.name} 
          className="flex items-center group transition-transform duration-300 hover:scale-105"
        >
          <span className="relative flex h-10 w-10 items-center justify-center md:h-12 md:w-12">
            <Image
              src="/logo.png"
              alt={`${siteConfig.name} logo`}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-110"
              priority
            />
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks
            .filter((link) => {
              // Hide "My Projects" for admins (they use Admin dashboard instead)
              if (link.href === "/projects" && isAdmin) {
                return false;
              }
              return true;
            })
            .map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute inset-0 rounded-xl bg-primary-500/10 scale-0 group-hover:scale-100 transition-transform duration-300 origin-center"></span>
              </Link>
            ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="relative rounded-xl px-4 py-2 text-sm font-semibold text-white bg-gradient-primary shadow-lg transition-all duration-300 hover:shadow-glow hover:scale-105"
            >
              Admin
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 md:flex">
            {status === "loading" ? (
              <span className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">Checking…</span>
            ) : session?.user ? (
              <>
                <div className="text-right leading-tight animate-fade-in">
                  <div className="text-sm font-semibold text-black dark:text-white">
                    {session.user.name || session.user.email}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 uppercase">{session.user.role}</div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="btn btn-secondary text-sm"
                >
                  Log out
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="btn btn-primary text-sm"
              >
                Sign in
              </Link>
            )}
          </div>
          <ThemeToggle />
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200/80 dark:border-gray-700/50 bg-white/95 backdrop-blur-xl dark:bg-gray-800/95 animate-fade-in-down">
          <nav className="container-page py-4 space-y-2">
            {navLinks
              .filter((link) => {
                if (link.href === "/projects" && isAdmin) {
                  return false;
                }
                return true;
              })
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-3 text-base font-semibold text-white bg-gradient-primary shadow-lg transition-all duration-300 hover:shadow-glow"
              >
                Admin
              </Link>
            )}
            <div className="pt-4 border-t border-gray-200/80 dark:border-gray-700/50 mt-4">
              {status === "loading" ? (
                <span className="block px-4 py-2 text-xs text-gray-500 dark:text-gray-400 animate-pulse">Checking…</span>
              ) : session?.user ? (
                <>
                  <div className="px-4 py-2 mb-2">
                    <div className="text-sm font-semibold text-black dark:text-white">
                      {session.user.name || session.user.email}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 uppercase">{session.user.role}</div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full text-left rounded-xl px-4 py-3 text-base font-medium text-gray-700 transition-all duration-300 hover:bg-gray-100 hover:text-black dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-base font-semibold text-white bg-gradient-primary shadow-lg transition-all duration-300 hover:shadow-glow text-center"
                >
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
