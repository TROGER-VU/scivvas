import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins, Rajdhani, Inter } from "next/font/google";
import "./globals.css";

const rajdhani = Rajdhani({ 
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-heading', // Create a CSS variable for the font
});

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-body', // Create a CSS variable for the font
});

export const metadata: Metadata = {
  title: "Scivvas",
  description: "Scivvas Entertainment Pvt. Ltd.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${inter.variable} h-full`}>
      <body
        className={`bg-black text-white h-full antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
