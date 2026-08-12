import type { AvitoPick } from "@/lib/clients";
import { SITE } from "@/lib/site";

/** Цифры для wa.me: 8XXXXXXXXXX → 7XXXXXXXXXX */
export function waPhoneDigits(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;
  if (digits.length === 11 && digits.startsWith("8")) return `7${digits.slice(1)}`;
  if (digits.length === 10) return `7${digits}`;
  return digits;
}

export function buildPicksMessage(picks: AvitoPick[], clientName?: string) {
  const name = clientName?.trim();
  const greeting = name ? `Здравствуйте, ${name}!` : "Здравствуйте!";
  const lines = picks.map((p, i) => `${i + 1}. ${p.title}\n${p.url}`);

  return [
    greeting,
    "Подобрал варианты для вас:",
    "",
    ...lines,
    "",
    `${SITE.name}, агентство «${SITE.agency}»`,
    SITE.phoneDisplay,
  ].join("\n");
}

export function shareWhatsAppUrl(text: string, phone?: string) {
  const digits = phone ? waPhoneDigits(phone) : null;
  const base = digits ? `https://wa.me/${digits}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function shareTelegramUrl(text: string, primaryUrl?: string) {
  const params = new URLSearchParams();
  if (primaryUrl) params.set("url", primaryUrl);
  params.set("text", text);
  return `https://t.me/share/url?${params.toString()}`;
}

export function shareMaxUrl(text: string) {
  return `https://max.ru/:share?text=${encodeURIComponent(text)}`;
}
