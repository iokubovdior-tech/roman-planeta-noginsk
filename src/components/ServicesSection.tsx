import { SITE } from "@/lib/site";

const services = [
  {
    title: "Оценка недвижимости",
    text: "Разберём объект и рынок, подскажем реальную цену и стратегию продажи или покупки.",
  },
  {
    title: "Продажа",
    text: "Квартиры, дома, комнаты, участки и гаражи — от подготовки до сделки и передачи ключей.",
  },
  {
    title: "Покупка и подбор",
    text: "Найдём подходящий вариант под задачу и бюджет, проверим объект и выйдем на сделку.",
  },
  {
    title: "Аренда",
    text: "Сдача и поиск жилья: показы, проверка сторон и оформление без лишней суеты.",
  },
  {
    title: "Ипотека",
    text: "Помощь с одобрением, в том числе в нестандартных случаях, и сопровождение до сделки.",
  },
  {
    title: "Выделение долей",
    text: "Помогаем оформить выделение долей в недвижимости — документы, согласования и регистрация.",
  },
  {
    title: "Приватизация недвижимости",
    text: "Сопровождаем приватизацию от сбора документов до регистрации права собственности.",
  },
  {
    title: "Сопровождение и документы",
    text: "Юридическая проверка, переговоры и полный путь до безопасной сделки и регистрации.",
  },
] as const;

export function ServicesSection() {
  return (
    <section id="services" className="border-y border-[var(--line)] bg-[var(--surface)] px-[6vw] py-20 md:py-24">
      <div className="max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.1rem,4vw,3.2rem)] leading-tight">
          Услуги
        </h2>
        <span className="mt-4 block h-px w-14 bg-[var(--accent)]" aria-hidden />
        <p className="mt-4 text-[var(--ink-soft)]">
          Агентство «{SITE.agency}» · {SITE.city} и Московская область — полный цикл работы с
          недвижимостью.
        </p>
      </div>

      <ul className="mt-12 grid gap-0 border-t border-[var(--line)] sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service, i) => (
          <li
            key={service.title}
            className="border-b border-[var(--line)] py-8 sm:border-r sm:px-6 sm:odd:pl-0 sm:[&:nth-child(2n)]:border-r-0 xl:[&:nth-child(2n)]:border-r xl:[&:nth-child(3n)]:border-r-0 xl:[&:nth-child(3n)]:pr-0"
          >
            <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--accent)]">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl leading-snug">
              {service.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)]">{service.text}</p>
          </li>
        ))}
      </ul>

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
