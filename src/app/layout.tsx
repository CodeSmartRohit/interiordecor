import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/components/cart/CartProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Élégance — Premium Interior Design & Home Decor",
  description:
    "Transform your space with Élégance. Browse curated home decor collections and request personalized interior design services from expert designers.",
  keywords: "interior design, home decor, furniture, lighting, wall art, design services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
