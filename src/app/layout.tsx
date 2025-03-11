import type { Metadata } from "next";
import { AuthProvider } from '../context/AuthContext';
import "./globals.css";

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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}