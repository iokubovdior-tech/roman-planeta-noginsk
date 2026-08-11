"use client";

import { useState, type FormEvent } from "react";
import { reviews } from "@/data/reviews";
import { SITE, whatsappWithText } from "@/lib/site";

export function ReviewsSection() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [sentHint, setSentHint] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;

    const who = name.trim() || "Клиент";
    const message = `Здравствуйте, Роман! Отзыв с сайта.\n\nИмя: ${who}\n\n${body}`;
    window.open(whatsappWithText(message), "_blank", "noopener,noreferrer");
    setSentHint(true);
  }

  return (
    <section id="reviews" className="border-y border-[var(--line)] bg-[var(--surface)] px-[6vw] py-20 md:py-24">
      <div className="max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.1rem,4vw,3.2rem)] leading-tight">
          Отзывы клиентов
        </h2>
        <span className="mt-4 block h-px w-14 bg-[var(--accent)]" aria-hidden />
        <p className="mt-4 text-[var(--ink-soft)]">
          Реальные истории после сделок. Хотите поделиться — напишите отзыв ниже, он придёт мне в
          WhatsApp.
        </p>
      </div>

      {reviews.length > 0 ? (
        <ul className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => (
            <li key={review.id} className="border-t border-[var(--line)] pt-6">
              <p className="font-[family-name:var(--font-display)] text-xl text-[var(--ink)]">
                {review.name}
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--accent-deep)]">
                {review.meta}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[var(--ink-soft)]">{review.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 max-w-xl border-l-2 border-[var(--accent)] pl-5 text-[var(--ink-soft)]">
          Опубликованных отзывов пока нет — первые появятся здесь после проверки. Уже работали
          вместе? Буду благодарен за пару слов.
        </p>
      )}

      <div className="mt-14 max-w-xl border border-[var(--line)] bg-[var(--paper)] p-6 sm:p-8">
        <h3 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ink)]">
          Оставить отзыв
        </h3>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Форма откроет WhatsApp с вашим текстом. На сайте отзыв появится после того, как я его
          проверю.
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-[0.1em] text-[var(--muted)]">
              Имя
            </span>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Как к вам обращаться"
              autoComplete="name"
              className="mt-2 w-full border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--accent)]"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-[0.1em] text-[var(--muted)]">
              Отзыв
            </span>
            <textarea
              name="review"
              required
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Коротко: что делали и как прошла работа"
              className="mt-2 w-full resize-y border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-[var(--ink)] outline-none transition focus:border-[var(--accent)]"
            />
          </label>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="submit"
              className="bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold tracking-wide text-[var(--button-ink)] transition hover:bg-[var(--accent-deep)]"
            >
              Отправить в WhatsApp
            </button>
            <a
              href={SITE.vk}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[var(--line)] px-6 py-3.5 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--accent)]"
            >
              Написать в VK
            </a>
          </div>
          {sentHint ? (
            <p className="text-sm text-[var(--accent-deep)]">
              Если WhatsApp не открылся — разрешите всплывающие окна или напишите мне напрямую.
            </p>
          ) : null}
        </form>
      </div>
    </section>
  );
}
