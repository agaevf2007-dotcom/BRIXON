"use client";

import { Header } from "@/components/Header";
import { usePathname } from "next/navigation";

export function Main({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <Header />
      <main id="main" className={isHome ? undefined : "pt-[84px]"}>
        {children}
      </main>
    </>
  );
}
