import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
