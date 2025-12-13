import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chatio - Next.js Backend",
  description: "Next.js backend with Supabase integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

