export type AvitoCity = "noginsk" | "elektrostal" | "pavlovskiy_posad" | "orekhovo-zuevo";

export type AvitoCategory =
  | "flat_sale"
  | "flat_rent"
  | "room_sale"
  | "house_sale"
  | "land_sale"
  | "garage_sale";

/** Комнаты — отдельный фильтр Авито в пути URL, не строка поиска */
export type AvitoRooms = "" | "studio" | "1" | "2" | "3" | "4";

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

export const AVITO_ROOMS_LABEL: Record<Exclude<AvitoRooms, "">, string> = {
  studio: "Студия",
  "1": "1 комната",
  "2": "2 комнаты",
  "3": "3 комнаты",
  "4": "4+ комнаты",
};

/** Базовый путь без ASg-ID — Авито сам допишет правильный ID и перенесёт pmin/pmax в фильтр */
const CATEGORY_PATH: Record<AvitoCategory, string> = {
  flat_sale: "kvartiry/prodam",
  flat_rent: "kvartiry/sdam",
  room_sale: "komnaty/prodam",
  house_sale: "doma_dachi_kottedzhi/prodam",
  land_sale: "zemelnye_uchastki/prodam",
  garage_sale: "garazhi_i_mashinomesta/prodam",
};

const ROOM_SLUG: Record<Exclude<AvitoRooms, "">, string> = {
  studio: "studii",
  "1": "1-komnatnye",
  "2": "2-komnatnye",
  "3": "3-komnatnye",
  "4": "4-komnatnye",
};

export type AvitoSearchInput = {
  city: AvitoCity;
  category: AvitoCategory;
  rooms?: AvitoRooms;
  priceMin?: number;
  priceMax?: number;
  /** Район / улица — только текстовый поиск Авито */
  query?: string;
};

export function categorySupportsRooms(category: AvitoCategory) {
  return category === "flat_sale" || category === "flat_rent";
}

export function buildAvitoSearchUrl(input: AvitoSearchInput): string {
  let path = CATEGORY_PATH[input.category];
  const rooms = input.rooms;
  if (rooms && categorySupportsRooms(input.category)) {
    path = `${path}/${ROOM_SLUG[rooms]}`;
  }

  const url = new URL(`https://www.avito.ru/${input.city}/${path}`);

  // Авито принимает pmin/pmax и сам переписывает их в параметр f=
  if (input.priceMin && input.priceMin > 0) url.searchParams.set("pmin", String(input.priceMin));
  if (input.priceMax && input.priceMax > 0) url.searchParams.set("pmax", String(input.priceMax));

  const q = input.query?.trim();
  if (q) url.searchParams.set("q", q);

  // Сначала свежие
  url.searchParams.set("s", "104");

  return url.toString();
}

export function defaultCategoryForClientKind(
  kind: "seller" | "buyer" | "rent" | "other",
): AvitoCategory {
  if (kind === "rent") return "flat_rent";
  if (kind === "buyer") return "flat_sale";
  return "flat_sale";
}
