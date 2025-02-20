'use client'
import { useEffect, useState } from 'react';
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from '@/lib/utils'
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = Plus_Jakarta_Sans(
  {
      subsets: ["latin"],
      weight: ['300','400','500','600','700'],
      variable: '--font-sans'
  }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="en">
      <body className={cn('min-h-screen bg-dark-300 font-sans antialiased', fontSans.variable)}>
        {mounted ? (
          <ThemeProvider attribute="class" defaultTheme="dark">
            {children}
          </ThemeProvider>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
