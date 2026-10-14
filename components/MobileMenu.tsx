"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLocale } from "@/context/LocaleContext";
import { useUI } from "@/context/UIContext";
import { categories } from "@/data/categories";
import { useEscape } from "@/hooks/useLockBody";
import { loc } from "@/lib/i18n";
import { EASE_PREMIUM } from "@/lib/utils";
import { X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";

export function MobileMenu() {
  const { menuOpen, closeMenu, openSearch } = useUI();
  const reduce = useReducedMotion();
  const { locale, t, dict } = useLocale();
  useEscape(closeMenu, menuOpen);

  const links = [
    { href: "/catalog", label: dict.nav.catalog },
    { href: "/about", label: dict.nav.about },
    { href: "/delivery", label: dict.nav.delivery },
    { href: "/service", label: dict.nav.service },
    { href: "/contacts", label: dict.nav.contacts },
  ];

  return (
    <AnimatePresence>
      {menuOpen ? (
        <motion.div
          className="fixed inset-0 z-[80] overflow-y-auto bg-canvas"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE_PREMIUM }}
        >
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <p className="text-[15px] font-semibold tracking-[0.28em]">BRIXON</p>
            <button
              type="button"
              onClick={closeMenu}
              className="grid size-11 place-items-center rounded-full hover:bg-white cursor-pointer"
              aria-label={t("header.closeMenu")}
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="px-5 pt-8 sm:px-8" aria-label="Mobile">
            <ul>
              {links.map((link, index) => (
                <li key={link.href} className="overflow-hidden border-b border-ink/8">
                  <motion.div
                    initial={reduce ? false : { y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.08 + index * 0.06, duration: 0.5, ease: EASE_PREMIUM }}
                  >
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      className="block py-4 text-3xl tracking-tight"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <LanguageSwitcher />
            </div>

            <div className="mt-10 flex gap-6 text-sm">
              <button
                type="button"
                className="cursor-pointer"
                onClick={() => {
                  closeMenu();
                  openSearch();
                }}
              >
                {t("header.search")}
              </button>
              <Link href="/wishlist" onClick={closeMenu} className="cursor-pointer">
                {t("header.wishlist")}
              </Link>
            </div>

            <p className="mt-16 text-xs uppercase tracking-[0.2em] text-muted">
              {t("footer.products")}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 pb-12 text-sm">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/catalog/${category.slug}`}
                  onClick={closeMenu}
                  className="text-muted hover:text-ink"
                >
                  {loc(category.name, locale)}
                </Link>
              ))}
            </div>
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
