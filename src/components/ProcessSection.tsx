import { SITE } from "@/lib/site";

const steps = [
  {
    n: "01",
    title: "Оценка недвижимости",
    text: "Смотрим объект, рынок и реальную цену — без завышенных обещаний.",
  },
  {
    n: "02",
    title: "Договор и подготовка",
    text: "Фиксируем условия, собираем документы и готовим объект к показу.",
  },
  {
    n: "03",
    title: "Показы и переговоры",
    text: "Приводим покупателей, ведём торг и держим процесс под контролем.",
  },
  {
    n: "04",
    title: "Сделка и расчёты",
    text: "Сопровождаем до подписания, безопасных расчётов и передачи ключей.",
  },
] as const;

export function ProcessSection() {
  return (
    <section id="process" className="border-y border-[var(--line)] bg-[var(--paper)] px-[6vw] py-20 md:py-24">
      <div className="max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.1rem,4vw,3.2rem)] leading-tight">
          Как проходит продажа
        </h2>
        <span className="mt-4 block h-px w-14 bg-[var(--accent)]" aria-hidden />
        <p className="mt-4 text-[var(--ink-soft)]">
          Понятный путь от первого звонка до закрытой сделки.
        </p>
      </div>

      <ol className="mt-12 grid gap-0 border-t border-[var(--line)] md:grid-cols-2 xl:grid-cols-4">
        {steps.map((step) => (
          <li
            key={step.n}
            className="border-b border-[var(--line)] py-8 md:border-r md:px-6 md:first:pl-0 md:[&:nth-child(2n)]:border-r-0 xl:[&:nth-child(2n)]:border-r xl:[&:nth-child(4n)]:border-r-0 xl:last:border-r-0"
          >
            <p className="font-[family-name:var(--font-display)] text-3xl text-[var(--accent)]">
              {step.n}
            </p>
            <h3 className="mt-4 font-[family-name:var(--font-display)] text-xl leading-snug">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">{step.text}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12">
        <a
          href={SITE.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold tracking-wide text-[var(--button-ink)] transition hover:bg-[var(--accent-deep)]"
        >
          Оценить недвижимость
        </a>
      </div>
    </section>
  );
}
