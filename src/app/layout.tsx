import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vishaka - Vedic Astrology Wisdom",
  description: "Generate authentic Vedic Kundli reports using traditional sidereal calculations with Lahiri Ayanamsa. Explore the ancient wisdom of Jyotish astrology.",
  keywords: ["Vedic Astrology", "Kundli", "Jyotish", "Sidereal", "Lahiri Ayanamsa", "Vishaka", "Birth Chart", "Astrology"],
  authors: [{ name: "Vishaka Team" }],
  openGraph: {
    title: "Vishaka - Vedic Astrology Wisdom",
    description: "Authentic Vedic astrology calculations and educational resources",
    url: "https://vishaka.example.com",
    siteName: "Vishaka",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vishaka - Vedic Astrology Wisdom",
    description: "Authentic Vedic astrology calculations and educational resources",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
