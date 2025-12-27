import type { Metadata } from "next";
import { Rajdhani, Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"

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
  title: "Scivvas Entertainment",
  description: "At Scivvas Entertainment Pvt. Ltd., events become environments. We craft immersive atmospheres where every detail, every beam of light, and every shifting wavelength of sound is curated to perfection.",
  icons: {
    icon: '/logo.png',
  }
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
        <CustomCursor/>
        {children}
        <Analytics/>
        <SpeedInsights/>
      </body>
    </html>
  );
}
