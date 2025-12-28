import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spread - A Social Media Platform",
  description: "Inspired by X (Formaly Twitter)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.className} bg-white dark:bg-black text-black dark:text-white transition-colors duration-200`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
