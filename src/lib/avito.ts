export type AvitoCity = "noginsk" | "elektrostal" | "pavlovskiy_posad" | "orekhovo-zuevo";

export type AvitoCategory =
  | "flat_sale"
  | "flat_rent"
  | "room_sale"
  | "house_sale"
  | "land_sale"
  | "garage_sale";

export const AVITO_CITY_LABEL: Record<AvitoCity, string> = {
  noginsk: "Ногинск",
  elektrostal: "Электросталь",
  pavlovskiy_posad: "Павловский Посад",
  "orekhovo-zuevo": "Орехово-Зуево",
};

export const AVITO_CATEGORY_LABEL: Record<AvitoCategory, string> = {
  flat_sale: "Квартиры — купить",
  flat_rent: "Квартиры — снять",
  room_sale: "Комнаты — купить",
  house_sale: "Дома / дачи — купить",
  land_sale: "Участки — купить",
  garage_sale: "Гаражи — купить",
};

const CATEGORY_PATH: Record<AvitoCategory, string> = {
  flat_sale: "kvartiry/prodam",
  flat_rent: "kvartiry/sdam",
  room_sale: "komnaty/prodam",
  house_sale: "doma_dachi_kottedzhi/prodam",
  land_sale: "zemelnye_uchastki/prodam",
  garage_sale: "garazhi_i_mashinomesta/prodam",
};

export type AvitoSearchInput = {
  city: AvitoCity;
  category: AvitoCategory;
  priceMin?: number;
  priceMax?: number;
  /** Свободный текст: «2-к», район, ул. Ильича */
  query?: string;
};

export function buildAvitoSearchUrl(input: AvitoSearchInput): string {
  const path = CATEGORY_PATH[input.category];
  const url = new URL(`https://www.avito.ru/${input.city}/${path}`);
  if (input.priceMin && input.priceMin > 0) url.searchParams.set("pmin", String(input.priceMin));
  if (input.priceMax && input.priceMax > 0) url.searchParams.set("pmax", String(input.priceMax));
  const q = input.query?.trim();
  if (q) url.searchParams.set("q", q);
  return url.toString();
}

export function defaultCategoryForClientKind(
  kind: "seller" | "buyer" | "rent" | "other",
): AvitoCategory {
  if (kind === "rent") return "flat_rent";
  if (kind === "buyer") return "flat_sale";
  return "flat_sale";
}
