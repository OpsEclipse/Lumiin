import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumiin - Your Biometric Accountability Partner",
  description:
    "AI-powered privacy-first computer vision to monitor your posture and focus in real-time. Build healthier habits while you work, without wearing a device.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${plusJakarta.variable} ${geistMono.variable} font-sans antialiased bg-[#0a0a0a] text-gray-100 min-h-screen`}
      >
        <ClerkProvider appearance={{ baseTheme: dark }}>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
