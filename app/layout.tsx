import type { Metadata } from "next";
import { Rajdhani, Inter } from "next/font/google";
import "./globals.css";
import WandCursor from "@/components/WandCursor";
import CustomCursor from "@/components/CustomCursor";

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
  description: "Scivvas Entertainment Pvt. Ltd.",
  icons: [
    { rel: 'icon', url: '/logo.png', type: 'image/x-icon' }
  ]
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
      </body>
    </html>
  );
}
