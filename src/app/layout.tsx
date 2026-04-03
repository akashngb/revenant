import type { Metadata, Viewport } from "next";
import { GeistMono, GeistSans } from "geist/font";
import { GeistPixelGrid } from "geist/font/pixel";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

// Using Geist (local, no network required) as the monospace and sans-serif bases.
// CSS variables --font-jetbrains, --font-space-grotesk, and --font-ibm-plex-mono
// are aliased to Geist equivalents so downstream components continue to work.
const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "Omniate — Your Company's Intelligent Memory",
  description:
    "Omniate is an AI system that lives inside your infrastructure, connects every tool your company uses, and turns scattered knowledge into a single intelligent brain.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${GeistPixelGrid.variable}`}
      style={
        {
          "--font-jetbrains": "var(--font-geist-mono)",
          "--font-space-grotesk": "var(--font-geist-sans)",
          "--font-ibm-plex-mono": "var(--font-geist-mono)",
        } as React.CSSProperties
      }
      suppressHydrationWarning
    >
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

