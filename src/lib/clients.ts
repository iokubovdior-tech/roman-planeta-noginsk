export type ClientKind = "seller" | "buyer" | "rent" | "other";

export type AvitoPick = {
  id: string;
  url: string;
  title: string;
  addedAt: string;
};

export type Client = {
  id: string;
  name: string;
  phone: string;
  kind: ClientKind;
  address: string;
  note: string;
  picks: AvitoPick[];
  createdAt: string;
  updatedAt: string;
};

export const CLIENT_KIND_LABEL: Record<ClientKind, string> = {
  seller: "Продавец",
  buyer: "Покупатель",
  rent: "Аренда",
  other: "Другое",
};

export const STORAGE_KEY = "planeta-crm-clients-v1";

export function createClientId() {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createPickId() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

export function normalizeClient(raw: Partial<Client> & { id: string }): Client {
  const now = new Date().toISOString();
  return {
    id: raw.id,
    name: raw.name ?? "",
    phone: raw.phone ?? "",
    kind: raw.kind ?? "other",
    address: raw.address ?? "",
    note: raw.note ?? "",
    picks: Array.isArray(raw.picks) ? raw.picks : [],
    createdAt: raw.createdAt ?? now,
    updatedAt: raw.updatedAt ?? now,
  };
}

export function clientMatchesQuery(client: Client, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const pickText = client.picks.map((p) => `${p.title} ${p.url}`).join(" ");
  const hay = [
    client.name,
    client.phone,
    normalizePhone(client.phone),
    CLIENT_KIND_LABEL[client.kind],
    client.address,
    client.note,
    pickText,
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

export function sortClients(clients: Client[]) {
  return [...clients].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}
