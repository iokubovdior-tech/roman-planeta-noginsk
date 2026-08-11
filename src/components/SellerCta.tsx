import { SITE } from "@/lib/site";

export function SellerCta() {
  return (
    <section id="sell" className="px-[6vw] py-20 md:py-24">
      <div className="relative overflow-hidden border border-[var(--line)] bg-[var(--surface)] px-8 py-16 sm:px-12 md:py-20">
        <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-[var(--warm-soft)] blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="mb-5 block h-px w-14 bg-[var(--accent)]" aria-hidden />
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.1rem,4vw,3.25rem)] leading-tight text-[var(--ink)]">
            Хотите продать? Начнём с оценки
          </h2>
          <p className="mt-4 max-w-xl text-lg text-[var(--ink-soft)]">
            Напишите в WhatsApp, VK или позвоните — разберём объект, цену и следующий шаг.
          </p>
          <p className="mt-3 max-w-xl text-sm text-[var(--muted)]">
            Офис:{" "}
            <a
              href={SITE.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-deep)] underline-offset-4 transition hover:underline"
            >
              {SITE.address}
            </a>
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[var(--accent)] px-7 py-3.5 font-semibold text-[var(--button-ink)] transition hover:bg-[var(--accent-deep)]"
            >
              Написать в WhatsApp
            </a>
            <a
              href={SITE.vk}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[var(--line)] px-7 py-3.5 font-semibold text-[var(--ink)] transition hover:border-[var(--accent)]"
            >
              ВКонтакте
            </a>
            <a
              href={SITE.phoneHref}
              className="border border-[var(--line)] px-7 py-3.5 font-semibold text-[var(--ink)] transition hover:border-[var(--accent)]"
            >
              {SITE.phoneDisplay}
            </a>
          </div>
          <p className="mt-5 text-sm text-[var(--muted)]">
            Актуальные объекты:{" "}
            <a
              href={SITE.avito}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-deep)] underline-offset-4 transition hover:underline"
            >
              Авито
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
