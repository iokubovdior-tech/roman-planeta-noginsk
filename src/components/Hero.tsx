import Image from "next/image";
import { SITE } from "@/lib/site";

type HeroProps = {
  imageSrc: string;
};

export function Hero({ imageSrc }: HeroProps) {
  return (
    <section className="relative min-h-[min(94vh,900px)] overflow-hidden bg-[var(--ink)]">
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="animate-ken object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,18,24,0.64) 0%, rgba(12,18,24,0.42) 40%, rgba(12,18,24,0.9) 100%), linear-gradient(95deg, rgba(12,18,24,0.8) 0%, rgba(12,18,24,0.32) 58%, rgba(138,106,44,0.28) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-44"
          style={{
            background: "linear-gradient(180deg, transparent, rgba(176, 138, 60, 0.22))",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-[min(94vh,900px)] flex-col justify-end px-[6vw] pb-[clamp(2.5rem,6vh,4.5rem)] pt-32 text-white">
        <p className="animate-fade-up font-[family-name:var(--font-display)] text-[clamp(2rem,5vw,3.75rem)] leading-[0.95] tracking-[-0.01em] text-white">
          {SITE.brand}
        </p>
        <span className="animate-fade-up delay-1 mt-4 block h-px w-16 bg-[var(--accent)]" aria-hidden />
        <h1 className="animate-fade-up delay-1 mt-5 max-w-[13ch] font-[family-name:var(--font-display)] text-[clamp(2.4rem,5.8vw,4.6rem)] leading-[1.02] font-semibold">
          Недвижимость с характером сделки
        </h1>
        <p className="animate-fade-up delay-2 mt-5 max-w-lg text-[1.05rem] leading-relaxed text-white/80">
          Закрытые сделки в Ногинске и области — спокойно, по делу, до результата.
        </p>
        <div className="animate-fade-up delay-3 mt-9 flex flex-wrap gap-3">
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[var(--accent)] px-7 py-3.5 text-[0.95rem] font-semibold tracking-wide text-[var(--button-ink)] transition hover:bg-[var(--accent-deep)]"
          >
            Оценить недвижимость
          </a>
          <a
            href={SITE.vk}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-[var(--accent)]/55 px-6 py-3.5 text-[0.95rem] font-semibold tracking-wide text-white transition hover:border-[var(--accent)] hover:bg-[var(--warm-soft)]"
          >
            VK
          </a>
          <a
            href={SITE.phoneHref}
            className="border border-white/35 px-6 py-3.5 text-[0.95rem] font-semibold tracking-wide text-white transition hover:border-white hover:bg-white/10"
          >
            Позвонить
          </a>
        </div>
      </div>
    </section>
  );
}
