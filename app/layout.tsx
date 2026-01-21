import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { AnalyticsPlaceholder } from "@/components/AnalyticsPlaceholder";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers } from "@/app/providers";
import { siteConfig } from "@/lib/site";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Calm delivery for important software",
    template: `%s | ${siteConfig.name}`
  },
  description:
    "A senior software team focused on clear ownership, calm delivery, and trusted outcomes.",
  openGraph: {
    title: siteConfig.name,
    description:
      "Senior engineers and clear communication for dependable software delivery.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: siteConfig.name
      }
    ],
    type: "website"
  },
  alternates: {
    canonical: siteConfig.url
  },
  icons: {
    icon: "/icon.ico",
    apple: "/icon.ico"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `
    (function() {
      try {
        var stored = localStorage.getItem('theme');
        var prefers = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var theme = stored || (prefers ? 'dark' : 'light');
        if (theme === 'dark') document.documentElement.classList.add('dark');
      } catch (e) {}
    })();
  `;

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
        <AnalyticsPlaceholder />
      </body>
    </html>
  );
}
