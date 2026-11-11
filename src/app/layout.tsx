import type { Metadata, Viewport } from "next";
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
  authors: [{ name: "Rhodai", url: "https://www.rhodai.ai" }],
  creator: "Rhodai",
  // Share images come from src/app/opengraph-image.jpg & twitter-image.jpg (see scripts/make-brand-images.py)
  openGraph: {
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

const introScript = `try{var r=matchMedia('(prefers-reduced-motion: reduce)').matches;if(location.pathname==='/'&&!r&&!sessionStorage.getItem('hc-intro')){document.documentElement.classList.add('intro')}sessionStorage.setItem('hc-intro','1')}catch(e){}`;

export const viewport: Viewport = {
  themeColor: "#8a1c24",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fell.variable} ${fellSC.variable} ${sourceSans.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* First visit to the home page: play the 3D-cross intro (see HeroCross3D + "Intro" in globals.css) */}
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <div className="intro-veil" aria-hidden="true" />
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
