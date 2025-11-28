import "./globals.css";
import type { Metadata } from "next";
import PwaRegister from "@/components/PwaRegister";

export const metadata: Metadata = {
  title: "Little Printer Web",
  description: "Cozy daily strips for your thermal printer."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body>
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}