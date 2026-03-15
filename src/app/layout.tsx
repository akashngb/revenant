import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Revenent - Self-Improving Corporate Intelligence System",
  description:
    "Revenent captures engineering judgment, promotes living company memory, and preserves founder knowledge as an interactive mentor.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
