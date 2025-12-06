import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Prestige Motors | Premium Cars for Sale",
  description: "Find your dream car at Prestige Motors. We offer a wide selection of premium new and used vehicles with transparent pricing and financing options.",
};

import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { CarFinderModal } from "@/components/inventory/car-finder-modal";
import { FloatingConcierge } from "@/components/layout/floating-concierge";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${inter.variable} font-body antialiased bg-background text-foreground`}
      >
        {children}
        <Footer />
        <Toaster richColors position="bottom-right" theme="dark" />
        <CarFinderModal />
        <FloatingConcierge />
      </body>
    </html>
  );
}
