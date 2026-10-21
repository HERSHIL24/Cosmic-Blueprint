import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Cosmic Blueprint | Astrology & Numerology",
  description: "Decode Your Cosmic Blueprint with premium Numerology and Kundli analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <SmoothScroll>
          <Navbar />
          <div className="pt-16">
            {children}
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
