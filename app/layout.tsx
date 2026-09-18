import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { SiteLayout } from "@/components/layout/SiteLayout";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gratissimo | Frivilligt arbejde",
  description: "Find dit næste frivillige job med Gratissimo.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="da" className={montserrat.variable}>
      {/* suppressHydrationWarning: browser extensions inject attributes here before React hydrates */}
      <body suppressHydrationWarning>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
