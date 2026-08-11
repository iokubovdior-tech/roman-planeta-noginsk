"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Deal } from "@/lib/site";

type DealsSectionProps = {
  deals: Deal[];
};

const AUTOPLAY_MS = 6500;

export function DealsSection({ deals }: DealsSectionProps) {
  const [index, setIndex] = useState(0);
  const [detail, setDetail] = useState<Deal | null>(null);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const titleId = useId();
  const regionId = useId();
  const total = deals.length;
  const deal = deals[index] ?? null;

  const go = useCallback(
    (next: number) => {
      if (!total) return;
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  const prev = useCallback(() => go(index - 1), [go, index]);
  const next = useCallback(() => go(index + 1), [go, index]);

  useEffect(() => {
    if (!total || paused || detail) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [total, paused, detail]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (detail) {
        if (e.key === "Escape") setDetail(null);
        return;
      }
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detail, prev, next]);

  if (!deal) {
    return (
      <section id="deals" className="px-[6vw] py-24">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">Мои сделки</h2>
        <p className="mt-3 text-[var(--ink-soft)]">Скоро здесь появятся закрытые сделки.</p>
      </section>
    );
  }

  return (
    <section id="deals" className="border-y border-[var(--line)] bg-[var(--surface)] px-[6vw] py-20 md:py-24">
      <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.1rem,4vw,3.2rem)] leading-tight">
            Мои сделки
          </h2>
          <span className="mt-4 block h-px w-14 bg-[var(--accent)]" aria-hidden />
          <p className="mt-3 text-[var(--ink-soft)]">
            Реальные закрытые сделки — листайте как слайдшоу.
          </p>
        </div>
        <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--accent-deep)] tabular-nums" aria-live="polite">
          {index + 1}
          <span className="mx-1 text-lg text-[var(--muted)]">/</span>
          {total}
        </p>
      </div>

      <div
        className="outline-none"
        role="region"
        aria-roledescription="carousel"
        aria-labelledby={regionId}
        tabIndex={0}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
        }}
        onTouchStart={(e) => {
          touchX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) < 48) return;
          if (dx > 0) prev();
          else next();
        }}
      >
        <p id={regionId} className="sr-only">
          Слайдшоу закрытых сделок
        </p>

        <div className="grid items-stretch gap-0 overflow-hidden border border-[var(--line)] bg-[var(--white)] lg:grid-cols-[1.15fr_0.85fr]">
          <button
            type="button"
            className="group relative min-h-[380px] w-full overflow-hidden bg-[var(--paper-deep)] text-left sm:min-h-[460px] lg:min-h-[520px]"
            onClick={() => setDetail(deal)}
            aria-label={`Подробнее: ${deal.title}`}
          >
            {deal.image ? (
              <Image
                key={deal.id}
                src={deal.image}
                alt=""
                fill
                quality={92}
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="animate-slide-fade object-contain object-center p-2 transition duration-700 sm:p-3"
              />
            ) : null}
            <span className="absolute left-4 top-4 bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold tracking-wide text-[var(--button-ink)] uppercase">
              {deal.type}
            </span>
          </button>

          <div className="flex flex-col justify-between gap-8 p-6 sm:p-8 lg:p-10">
            <div>
              <p className="text-xs tracking-[0.14em] text-[var(--muted)] uppercase">
                {deal.dateLabel}
              </p>
              <h3
                key={`${deal.id}-title`}
                className="animate-slide-fade mt-3 font-[family-name:var(--font-display)] text-[clamp(1.7rem,3vw,2.45rem)] leading-snug"
              >
                {deal.title}
              </h3>
              <p
                key={`${deal.id}-summary`}
                className="animate-slide-fade mt-4 text-[1.02rem] leading-relaxed text-[var(--ink-soft)]"
              >
                {deal.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setDetail(deal)}
                className="bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--button-ink)] transition hover:bg-[var(--accent-deep)]"
              >
                Подробнее
              </button>
              {deal.source ? (
                <a
                  href={deal.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-[var(--line)] px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  Пост в VK
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              className="flex h-12 w-12 items-center justify-center border border-[var(--line)] bg-[var(--surface)] text-xl text-[var(--ink)] transition hover:border-[var(--accent)]"
              aria-label="Предыдущая сделка"
            >
              ←
            </button>
            <button
              type="button"
              onClick={next}
              className="flex h-12 w-12 items-center justify-center border border-[var(--line)] bg-[var(--surface)] text-xl text-[var(--ink)] transition hover:border-[var(--accent)]"
              aria-label="Следующая сделка"
            >
              →
            </button>
          </div>

          <div className="hidden max-w-[min(100%,28rem)] flex-1 items-center gap-1.5 px-2 sm:flex" aria-hidden>
            {deals.map((d, i) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-1.5 flex-1 transition ${
                  i === index ? "bg-[var(--accent)]" : "bg-[var(--line)] hover:bg-[var(--muted)]"
                }`}
                aria-label={`Сделка ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {detail ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(10,18,24,0.62)] p-0 sm:items-center sm:p-6"
          role="presentation"
          onClick={() => setDetail(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto bg-[var(--white)] shadow-[var(--shadow)] sm:rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative min-h-[320px] bg-[var(--paper-deep)] sm:min-h-[420px]">
              {detail.image ? (
                <Image
                  src={detail.image}
                  alt=""
                  fill
                  quality={92}
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-contain object-center p-3"
                />
              ) : null}
              <button
                type="button"
                aria-label="Закрыть"
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center bg-[rgba(10,18,24,0.75)] text-xl text-white"
                onClick={() => setDetail(null)}
              >
                ×
              </button>
            </div>
            <div className="space-y-3 p-6 sm:p-8">
              <p className="text-xs tracking-[0.14em] text-[var(--muted)] uppercase">
                {detail.type} · {detail.dateLabel}
              </p>
              <h3 id={titleId} className="font-[family-name:var(--font-display)] text-2xl leading-snug">
                {detail.title}
              </h3>
              <p className="text-[var(--ink-soft)] whitespace-pre-wrap">{detail.description}</p>
              {detail.source ? (
                <a
                  href={detail.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex font-semibold text-[var(--accent)] hover:text-[var(--accent-deep)]"
                >
                  Пост во ВКонтакте
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
