"use client";

import { SITE } from "@/lib/site";

const links = [
  { href: "#deals", label: "Сделки" },
  { href: "#services", label: "Услуги" },
  { href: "#about", label: "Обо мне" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#sell", label: "Оценить" },
];

export function SiteHeader() {
  return (
    <header className="animate-fade-down absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-4 px-[6vw] py-5 text-white">
      <a
        href="#top"
        className="font-[family-name:var(--font-display)] text-[1.15rem] tracking-[0.02em] text-white"
      >
        {SITE.brand}
      </a>
      <nav className="hidden items-center gap-6 text-sm text-white/75 sm:flex">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="transition-colors hover:text-white">
            {link.label}
          </a>
        ))}
        <a
          href={SITE.phoneHref}
          className="bg-[var(--accent)] px-4 py-2 font-medium text-[var(--button-ink)] transition hover:bg-[var(--accent-deep)]"
        >
          Позвонить
        </a>
      </nav>
      <a
        href={SITE.phoneHref}
        className="bg-[var(--accent)] px-3.5 py-2 text-sm font-medium text-[var(--button-ink)] sm:hidden"
      >
        Звонок
      </a>
    </header>
  );
}
