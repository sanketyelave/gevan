import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import { AuthProvider } from '../context/AuthContext';
import "./globals.css";
import { LanguageProvider } from "../context/languageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Gevan.com",
  description: "Gevan.com – Empowering farmers with a smart agriculture platform! Buy, sell, and manage crops with real-time mandi prices, expert guidance, AI-powered crop solutions, and farm input shopping. Boost productivity with precision farming today!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${roboto.className} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>

      </body>
    </html>
  );
}
