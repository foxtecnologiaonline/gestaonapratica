import type { Metadata } from "next";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Gestão na Prática",
    template: "%s | Gestão na Prática",
  },
  description:
    "Conteúdo prático sobre gestão para pequenos negócios, com ferramentas e produtos digitais para aplicar direto no seu dia a dia.",
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
