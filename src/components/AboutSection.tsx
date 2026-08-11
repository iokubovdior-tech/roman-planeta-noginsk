import Image from "next/image";
import { SITE } from "@/lib/site";

export function AboutSection() {
  return (
    <section id="about" className="px-[6vw] py-20 md:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden bg-[var(--paper-deep)] lg:mx-0 lg:max-w-none">
          <Image
            src={SITE.aboutPhoto}
            alt={`${SITE.name}, агент недвижимости «${SITE.agency}»`}
            fill
            quality={92}
            sizes="(max-width: 1024px) 90vw, 40vw"
            className="object-cover object-[center_22%]"
          />
        </div>

        <div>
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.1rem,4vw,3.2rem)] leading-tight">
            Кто ведёт сделки
          </h2>
          <span className="mt-4 block h-px w-14 bg-[var(--accent)]" aria-hidden />

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--ink-soft)]">
            Я — {SITE.name}, агент недвижимости агентства «{SITE.agency}» в {SITE.city}. В профессии с
            2021 года: помогаю купить и продать, подобрать объект и провести сделку — в том числе с
            ипотекой и нестандартными случаями.
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed text-[var(--ink-soft)]">
            За это время закрыто более 200 сделок. Агентство «{SITE.agency}» на рынке более 15 лет:
            рядом сильная команда и понятное сопровождение на каждом этапе.
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed text-[var(--ink-soft)]">
            На рынке много страхов и сомнений — и это нормально. Моя задача — показать результат
            делом. Если нужна оценка или следующий шаг, напишите в личные сообщения. Уже работали
            вместе — буду благодарен за отзыв.
          </p>

          <ul className="mt-8 grid gap-5 sm:grid-cols-2">
            <li className="border-t border-[var(--line)] pt-4 sm:col-span-2">
              <span className="block text-sm tracking-wide text-[var(--muted)] uppercase">Адрес</span>
              <strong className="mt-1.5 block text-lg font-[family-name:var(--font-display)] leading-snug">
                <a
                  href={SITE.mapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--accent)]"
                >
                  {SITE.address}
                </a>
              </strong>
            </li>
            <li className="border-t border-[var(--line)] pt-4">
              <span className="block text-sm tracking-wide text-[var(--muted)] uppercase">Агентство</span>
              <strong className="mt-1.5 block text-lg font-[family-name:var(--font-display)]">
                {SITE.agency}
              </strong>
            </li>
            <li className="border-t border-[var(--line)] pt-4">
              <span className="block text-sm tracking-wide text-[var(--muted)] uppercase">В профессии</span>
              <strong className="mt-1.5 block text-lg font-[family-name:var(--font-display)]">
                с 2021 года
              </strong>
            </li>
            <li className="border-t border-[var(--line)] pt-4">
              <span className="block text-sm tracking-wide text-[var(--muted)] uppercase">Сделки</span>
              <strong className="mt-1.5 block text-lg font-[family-name:var(--font-display)]">
                более 200
              </strong>
            </li>
            <li className="border-t border-[var(--line)] pt-4">
              <span className="block text-sm tracking-wide text-[var(--muted)] uppercase">
                Компания на рынке
              </span>
              <strong className="mt-1.5 block text-lg font-[family-name:var(--font-display)]">
                более 15 лет
              </strong>
            </li>
            <li className="border-t border-[var(--line)] pt-4">
              <span className="block text-sm tracking-wide text-[var(--muted)] uppercase">Телефон</span>
              <strong className="mt-1.5 block text-lg font-[family-name:var(--font-display)]">
                <a href={SITE.phoneHref} className="hover:text-[var(--accent)]">
                  {SITE.phoneDisplay}
                </a>
              </strong>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
