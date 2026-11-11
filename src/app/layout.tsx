import type { Metadata } from "next";
import { IM_Fell_English, IM_Fell_English_SC, Source_Sans_3 } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/content/site";
import "./globals.css";

// Headings & quotes: revival of the 17th-century Fell types (the look of early printed Bibles & prayer books)
const fell = IM_Fell_English({
  variable: "--font-fell",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

// Small-caps labels, set in red like prayer-book rubrics
const fellSC = IM_Fell_English_SC({
  variable: "--font-fell-sc",
  subsets: ["latin"],
  weight: "400",
});


const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Sanger, CA`,
    template: `%s · ${site.name}`,
  },
  description: `${site.name} is an Anglo-Catholic parish in the ${site.diocese.name} of the ${site.province.name}. Sunday worship at 9:30 a.m., 828 O Street, Sanger, CA.`,
  openGraph: {
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fell.variable} ${fellSC.variable} ${sourceSans.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-parchment focus:p-3">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
