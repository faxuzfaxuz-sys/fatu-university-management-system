import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "FATU - Faxriddin Axborot Texnologiyalari Universiteti",
  description: "Faxriddin Axborot Texnologiyalari Universiteti - Zamonaviy ta'lim markazi",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
