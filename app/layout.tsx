import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/app/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Realm of Qimen",
  description: "Thoughtful Bazi, Qimen, and Feng Shui services for modern life.",
  icons: { icon: "/ROQ%20logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SiteHeader />
        {children}
        <footer className="border-t border-[var(--border)] bg-[var(--card)] px-6 py-8 text-sm text-[var(--muted)]">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-3">
            <span>© {new Date().getFullYear()} Realm of Qimen</span>
            <Link href="/privacy" className="underline underline-offset-4">Privacy Notice</Link>
            <Link href="/terms" className="underline underline-offset-4">Terms &amp; Disclaimer</Link>
            <Link href="/data-request" className="underline underline-offset-4">Personal data request</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
