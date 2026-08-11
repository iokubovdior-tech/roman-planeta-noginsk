export type Deal = {
  id: string;
  date: string;
  dateLabel: string;
  title: string;
  type: string;
  summary: string;
  description: string;
  /** Ссылка на пост VK, если есть */
  source: string;
  /** Путь из public/, например /photos/deals/....png */
  image: string;
};

const EVALUATE_TEXT = "Здравствуйте, Роман! Хочу оценить недвижимость.";
const REVIEW_TEXT =
  "Здравствуйте, Роман! Хочу оставить отзыв о вашей работе.";

export function whatsappWithText(text: string) {
  return `https://wa.me/79777194753?text=${encodeURIComponent(text)}`;
}

export const SITE = {
  brand: "Роман · Планета · Ногинск",
  name: "Роман Ямников",
  agency: "Планета",
  city: "Ногинск",
  phoneDisplay: "8 (977) 719-47-53",
  phoneHref: "tel:+79777194753",
  vk: "https://vk.ru/iamnikov7042",
  avito: "https://www.avito.ru/brands/i9900530/all/nedvizhimost",
  whatsapp: whatsappWithText(EVALUATE_TEXT),
  whatsappReview: whatsappWithText(REVIEW_TEXT),
  evaluateMessage: EVALUATE_TEXT,
  reviewMessage: REVIEW_TEXT,
  aboutPhoto: "/photos/roman-yamnikov.png",
  region: "Ногинск и Московская область",
  address: "Московская область, г. Ногинск, ул. Рабочая, д. 20",
  mapsHref:
    "https://yandex.ru/maps/?text=" +
    encodeURIComponent("Московская область, г. Ногинск, ул. Рабочая, д. 20"),
  siteUrlPlaceholder: "https://ВАШ-ДОМЕН.ru",
} as const;
