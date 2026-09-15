import { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell">
      <Navigation />
      <main className="site-main">{children}</main>
      <Footer />
    </div>
  );
}
