import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Realm of Qimen",
  description: "A personal Bazi reading for clearer next steps.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}<footer className="border-t border-[#d7cbbd] px-6 py-8 text-sm text-[#665a50]"><div className="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-3"><span>© {new Date().getFullYear()} Realm of Qimen</span><Link href="/privacy" className="underline underline-offset-4">Privacy Notice</Link><Link href="/terms" className="underline underline-offset-4">Terms &amp; Disclaimer</Link><Link href="/data-request" className="underline underline-offset-4">Personal data request</Link></div></footer></body>
    </html>
  );
}
