import { SITE } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] px-[6vw] py-10">
      <p className="font-[family-name:var(--font-display)] text-xl">{SITE.brand}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">Портфолио сделок · {SITE.region}</p>
      <p className="mt-2 max-w-xl text-sm text-[var(--ink-soft)]">
        <a
          href={SITE.mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--accent)]"
        >
          {SITE.address}
        </a>
      </p>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <a href={SITE.phoneHref} className="hover:text-[var(--accent)]">
          {SITE.phoneDisplay}
        </a>
        <a
          href={SITE.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--accent)]"
        >
          WhatsApp
        </a>
        <a href={SITE.vk} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)]">
          ВКонтакте
        </a>
        <a
          href={SITE.avito}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-[var(--accent)]"
        >
          Объекты на Авито
        </a>
      </div>
    </footer>
  );
}
