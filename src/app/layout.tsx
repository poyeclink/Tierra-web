import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/config/site";
import { getEstablishment } from "@/presentation/data/establishment";
import "./globals.css";

// Satoshi (Fontshare, ITF Free Font License: see fonts/Satoshi-LICENSE.txt).
// Variable font covering the brand weights 400 / 500 / 900.
const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  weight: "300 900",
  style: "normal",
  display: "swap",
  variable: "--font-satoshi",
});

export async function generateMetadata(): Promise<Metadata> {
  const { name, description } = await getEstablishment();
  return {
    // TODO: set metadataBase once the final domain is confirmed.
    title: { default: name, template: `%s · ${name}` },
    description,
    icons: { icon: "/brand/logos/isotipo-aqua.svg" },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={siteConfig.lang} className={`${satoshi.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
