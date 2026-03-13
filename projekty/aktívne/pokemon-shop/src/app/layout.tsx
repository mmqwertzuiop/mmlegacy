import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
  title: "MM Legacy — Prémiový Pokemon TCG Shop",
  description: "MM Legacy je prémiový Pokemon TCG shop pre skutočných zberateľov. Boostery, graded karty a mystery boxy — všetko na jednom mieste.",
  keywords: "Pokemon TCG, booster box, PSA graded, singles, mystery box, Charizard, Umbreon, Slovakia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <CustomCursor />
        <Navbar />
        <main style={{ paddingTop: '64px' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
