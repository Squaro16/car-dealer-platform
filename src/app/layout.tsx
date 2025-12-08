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
  title: "LS Motor - Premium Automotive Concierge",
  description: "LS Motor offers an exclusive selection of premium vehicles and bespoke automotive services.",
};

import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { FloatingConcierge } from "@/components/layout/floating-concierge";
import { Navbar } from "@/components/layout/navbar"; // Assuming Navbar is a new component to be imported

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
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster richColors position="bottom-right" theme="dark" />
        <FloatingConcierge />
      </body>
    </html>
  );
}
