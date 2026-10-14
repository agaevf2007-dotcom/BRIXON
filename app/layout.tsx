import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { InitialLoader } from "@/components/InitialLoader";
import { Main } from "@/components/Main";
import { MobileMenu } from "@/components/MobileMenu";
import { Search } from "@/components/Search";
import { SkipLink } from "@/components/SkipLink";
import { Toast } from "@/components/Toast";
import { WishlistDrawer } from "@/components/WishlistDrawer";
import { Providers } from "@/context/Providers";
import { BodyLock } from "@/hooks/useLockBody";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BRIXON — Технологии для комфортной жизни",
    template: "%s · BRIXON",
  },
  description:
    "BRIXON — независимый концепт интернет-магазина бытовой техники. Bosch, Samsung, LG, Miele и другие бренды.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-canvas font-sans text-ink">
        <Providers>
          <SkipLink />
          <InitialLoader />
          <BodyLock />
          <Main>{children}</Main>
          <Footer />
          <CartDrawer />
          <WishlistDrawer />
          <MobileMenu />
          <Search />
          <Toast />
        </Providers>
      </body>
    </html>
  );
}
