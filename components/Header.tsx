"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { useUI } from "@/context/UIContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();
  const { ids } = useWishlist();
  const { openSearch, openCart, openMenu } = useUI();
  const { t } = useLocale();
  const isHome = pathname === "/";

  const nav = [
    { href: "/catalog", label: t("nav.catalog") },
    { href: "/about", label: t("nav.about") },
    { href: "/delivery", label: t("nav.delivery") },
    { href: "/service", label: t("nav.service") },
    { href: "/contacts", label: t("nav.contacts") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const darkHero = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter,height] duration-500",
        scrolled ? "h-[68px]" : "h-[84px]",
        scrolled || !isHome
          ? "border-b border-ink/8 bg-canvas/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          href="/"
          className={cn(
            "text-[15px] font-semibold tracking-[0.28em] transition-colors",
            darkHero ? "text-white" : "text-ink",
          )}
        >
          BRIXON
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm tracking-tight transition-colors",
                  darkHero ? "text-white/80 hover:text-white" : "text-ink/70 hover:text-ink",
                  active && (darkHero ? "text-white" : "text-ink"),
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300",
                    darkHero ? "bg-white" : "bg-ink",
                    "hover:scale-x-100",
                    active && "scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="mr-1 hidden sm:block">
            <LanguageSwitcher light={darkHero} />
          </div>
          <IconButton label={t("header.search")} onClick={openSearch} light={darkHero}>
            <Search className="size-[18px]" />
          </IconButton>
          <Link
            href="/wishlist"
            aria-label={t("header.wishlist")}
            className={cn(
              "relative hidden size-11 place-items-center rounded-full transition-colors lg:grid",
              darkHero ? "text-white hover:bg-white/10" : "text-ink hover:bg-ink/5",
            )}
          >
            <Heart className="size-[18px]" />
            {ids.length ? (
              <span className="absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] leading-4 text-white">
                {ids.length}
              </span>
            ) : null}
          </Link>
          <IconButton label={t("header.cart")} onClick={openCart} light={darkHero} badge={itemCount}>
            <ShoppingBag className="size-[18px]" />
          </IconButton>
          <IconButton label={t("header.menu")} onClick={openMenu} light={darkHero} className="lg:hidden">
            <Menu className="size-[18px]" />
          </IconButton>
        </div>
      </div>
    </header>
  );
}

function IconButton({
  children,
  label,
  onClick,
  light,
  badge,
  className,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  light?: boolean;
  badge?: number;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "relative grid size-11 place-items-center rounded-full transition-colors cursor-pointer",
        light ? "text-white hover:bg-white/10" : "text-ink hover:bg-ink/5",
        className,
      )}
    >
      {children}
      {badge ? (
        <span className="absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] leading-4 text-white">
          {badge}
        </span>
      ) : null}
    </button>
  );
}
