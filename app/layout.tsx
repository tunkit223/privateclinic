'use client'
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans'
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" >
      <body className={cn('min-h-screen bg-dark-300 font-sans antialiased', fontSans.variable)} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}