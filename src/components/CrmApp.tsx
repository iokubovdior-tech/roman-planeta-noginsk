"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AVITO_CATEGORY_LABEL,
  AVITO_CITY_LABEL,
  buildAvitoSearchUrl,
  defaultCategoryForClientKind,
  type AvitoCategory,
  type AvitoCity,
} from "@/lib/avito";
import {
  CLIENT_KIND_LABEL,
  STORAGE_KEY,
  clientMatchesQuery,
  createClientId,
  createPickId,
  normalizeClient,
  sortClients,
  type Client,
  type ClientKind,
} from "@/lib/clients";

type Draft = {
  name: string;
  phone: string;
  kind: ClientKind;
  address: string;
  note: string;
};

type AvitoDraft = {
  city: AvitoCity;
  category: AvitoCategory;
  priceMin: string;
  priceMax: string;
  query: string;
  saveTitle: string;
  saveUrl: string;
};

const emptyDraft = (): Draft => ({
  name: "",
  phone: "",
  kind: "seller",
  address: "",
  note: "",
});

const emptyAvito = (kind: ClientKind = "buyer"): AvitoDraft => ({
  city: "noginsk",
  category: defaultCategoryForClientKind(kind),
  priceMin: "",
  priceMax: "",
  query: "",
  saveTitle: "",
  saveUrl: "",
});

function loadClients(): Client[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<Client>[];
    if (!Array.isArray(parsed)) return [];
    return sortClients(parsed.filter((c) => c && c.id).map((c) => normalizeClient(c as Client)));
  } catch {
    return [];
  }
}

function saveClients(clients: Client[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

function parseMoney(value: string) {
  const n = Number(value.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : undefined;
}

export function CrmApp() {
  const [clients, setClients] = useState<Client[]>([]);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Client | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [avitoOpen, setAvitoOpen] = useState(false);
  const [avito, setAvito] = useState<AvitoDraft>(emptyAvito());
  const [flash, setFlash] = useState("");

  useEffect(() => {
    setClients(loadClients());
    setReady(true);
  }, []);

  const persist = useCallback((next: Client[]) => {
    const sorted = sortClients(next);
    setClients(sorted);
    saveClients(sorted);
  }, []);

  const filtered = useMemo(
    () => clients.filter((c) => clientMatchesQuery(c, query)),
    [clients, query],
  );

  const liveSearchUrl = useMemo(
    () =>
      buildAvitoSearchUrl({
        city: avito.city,
        category: avito.category,
        priceMin: parseMoney(avito.priceMin),
        priceMax: parseMoney(avito.priceMax),
        query: avito.query || undefined,
      }),
    [avito],
  );

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft());
    setAvitoOpen(false);
    setCreating(true);
  }

  function openEdit(client: Client) {
    setCreating(false);
    setEditing(client);
    setDraft({
      name: client.name,
      phone: client.phone,
      kind: client.kind,
      address: client.address,
      note: client.note,
    });
    setAvito(emptyAvito(client.kind));
    setAvitoOpen(false);
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
    setDraft(emptyDraft());
    setAvitoOpen(false);
  }

  function saveForm() {
    const name = draft.name.trim();
    const phone = draft.phone.trim();
    if (!name && !phone) {
      setFlash("Укажите имя или телефон");
      return;
    }
    const now = new Date().toISOString();
    if (editing) {
      const updated = clients.map((c) =>
        c.id === editing.id
          ? normalizeClient({
              ...c,
              name,
              phone,
              kind: draft.kind,
              address: draft.address.trim(),
              note: draft.note.trim(),
              updatedAt: now,
            })
          : c,
      );
      persist(updated);
      const fresh = updated.find((c) => c.id === editing.id) ?? null;
      setEditing(fresh);
    } else {
      const next = normalizeClient({
        id: createClientId(),
        name,
        phone,
        kind: draft.kind,
        address: draft.address.trim(),
        note: draft.note.trim(),
        picks: [],
        createdAt: now,
        updatedAt: now,
      });
      persist([next, ...clients]);
      setCreating(false);
      setEditing(next);
    }
    setFlash(editing ? "Клиент обновлён" : "Клиент добавлен");
  }

  function removeClient(id: string) {
    if (!confirm("Удалить клиента?")) return;
    persist(clients.filter((c) => c.id !== id));
    closeForm();
    setFlash("Удалено");
  }

  function updateEditingPicks(nextPicks: Client["picks"]) {
    if (!editing) return;
    const now = new Date().toISOString();
    const updated = clients.map((c) =>
      c.id === editing.id ? { ...c, picks: nextPicks, updatedAt: now } : c,
    );
    persist(updated);
    const fresh = updated.find((c) => c.id === editing.id) ?? null;
    setEditing(fresh);
  }

  function addPickFromFields() {
    if (!editing) return;
    const url = avito.saveUrl.trim() || liveSearchUrl;
    if (!url.startsWith("http")) {
      setFlash("Вставьте корректную ссылку Авито");
      return;
    }
    const title =
      avito.saveTitle.trim() ||
      `${AVITO_CATEGORY_LABEL[avito.category]} · ${AVITO_CITY_LABEL[avito.city]}`;
    const pick = {
      id: createPickId(),
      url,
      title,
      addedAt: new Date().toISOString(),
    };
    updateEditingPicks([pick, ...(editing.picks ?? [])]);
    setAvito((a) => ({ ...a, saveTitle: "", saveUrl: "" }));
    setFlash("Вариант сохранён к клиенту");
  }

  function removePick(pickId: string) {
    if (!editing) return;
    updateEditingPicks((editing.picks ?? []).filter((p) => p.id !== pickId));
    setFlash("Вариант удалён");
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(clients, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `klienty-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setFlash("Файл сохранён — его можно импортировать на другом устройстве");
  }

  function importJson(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Partial<Client>[];
        if (!Array.isArray(parsed)) throw new Error("bad");
        const byId = new Map<string, Client>();
        for (const c of [...clients, ...parsed.map((x) => normalizeClient(x as Client))]) {
          if (c?.id) byId.set(c.id, c);
        }
        persist([...byId.values()]);
        setFlash(`Импорт: теперь клиентов ${byId.size}`);
      } catch {
        setFlash("Не удалось прочитать файл");
      }
    };
    reader.readAsText(file);
  }

  const formOpen = creating || editing;

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--paper)] text-[var(--muted)]">
        Загрузка…
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-dvh max-w-lg bg-[var(--paper)] text-[var(--ink)]">
      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--surface)]/95 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl leading-none">Клиенты</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {clients.length} в базе · поиск и подбор Авито
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--button-ink)]"
          >
            + Новый
          </button>
        </div>
        <label className="mt-3 block">
          <span className="sr-only">Поиск</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск: Иванов, 977, Текстилей…"
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-base outline-none focus:border-[var(--accent)]"
            inputMode="search"
            enterKeyHint="search"
          />
        </label>
        <div className="mt-2 flex gap-2 text-xs">
          <button
            type="button"
            onClick={exportJson}
            className="rounded-lg border border-[var(--line)] px-3 py-1.5 text-[var(--ink-soft)]"
          >
            Экспорт
          </button>
          <label className="cursor-pointer rounded-lg border border-[var(--line)] px-3 py-1.5 text-[var(--ink-soft)]">
            Импорт
            <input
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                importJson(e.target.files?.[0] ?? null);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        {flash ? (
          <p className="mt-2 text-xs text-[var(--accent-deep)]" role="status">
            {flash}
          </p>
        ) : null}
      </header>

      <main className="px-4 pb-[max(6rem,env(safe-area-inset-bottom))] pt-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--line)] bg-[var(--surface)] px-5 py-10 text-center">
            <p className="font-[family-name:var(--font-display)] text-2xl">Пока пусто</p>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">
              Нажмите «+ Новый» — добавьте входящего за 10 секунд.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {filtered.map((client) => (
              <li key={client.id}>
                <button
                  type="button"
                  onClick={() => openEdit(client)}
                  className="w-full rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3.5 text-left transition active:bg-[var(--accent-soft)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{client.name || "Без имени"}</p>
                      <p className="mt-0.5 text-sm text-[var(--ink-soft)]">
                        {client.phone || "Нет телефона"}
                      </p>
                      {client.address ? (
                        <p className="mt-1 truncate text-sm text-[var(--muted)]">{client.address}</p>
                      ) : null}
                      {(client.picks?.length ?? 0) > 0 ? (
                        <p className="mt-1 text-xs text-[var(--accent-deep)]">
                          Вариантов Авито: {client.picks.length}
                        </p>
                      ) : null}
                    </div>
                    <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--accent-deep)]">
                      {CLIENT_KIND_LABEL[client.kind]}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      {formOpen ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center sm:p-4">
          <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-[var(--surface)] p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:rounded-3xl sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-display)] text-2xl">
                {editing ? "Клиент" : "Новый клиент"}
              </h2>
              <button type="button" onClick={closeForm} className="px-2 text-2xl text-[var(--muted)]">
                ×
              </button>
            </div>

            <div className="space-y-3">
              <Field label="Имя">
                <input
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-base outline-none focus:border-[var(--accent)]"
                  placeholder="Имя / как обращаться"
                  autoComplete="name"
                />
              </Field>
              <Field label="Телефон">
                <input
                  value={draft.phone}
                  onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-base outline-none focus:border-[var(--accent)]"
                  placeholder="8 977 …"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </Field>
              <Field label="Тип">
                <select
                  value={draft.kind}
                  onChange={(e) => {
                    const kind = e.target.value as ClientKind;
                    setDraft((d) => ({ ...d, kind }));
                    setAvito((a) => ({ ...a, category: defaultCategoryForClientKind(kind) }));
                  }}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-base outline-none focus:border-[var(--accent)]"
                >
                  {(Object.keys(CLIENT_KIND_LABEL) as ClientKind[]).map((k) => (
                    <option key={k} value={k}>
                      {CLIENT_KIND_LABEL[k]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Адрес / объект">
                <input
                  value={draft.address}
                  onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-base outline-none focus:border-[var(--accent)]"
                  placeholder="ул. Текстилей, 2к"
                />
              </Field>
              <Field label="Заметка">
                <textarea
                  value={draft.note}
                  onChange={(e) => setDraft((d) => ({ ...d, note: e.target.value }))}
                  className="min-h-24 w-full resize-y rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-base outline-none focus:border-[var(--accent)]"
                  placeholder="Откуда пришёл, что хочет, срок…"
                />
              </Field>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={saveForm}
                className="flex-1 rounded-xl bg-[var(--accent)] px-4 py-3.5 font-semibold text-[var(--button-ink)]"
              >
                Сохранить
              </button>
              {editing?.phone ? (
                <a
                  href={`tel:${editing.phone.replace(/[^\d+]/g, "")}`}
                  className="rounded-xl border border-[var(--line)] px-4 py-3.5 font-semibold"
                >
                  Позвонить
                </a>
              ) : null}
              {editing ? (
                <button
                  type="button"
                  onClick={() => setAvitoOpen((v) => !v)}
                  className="rounded-xl border border-[var(--accent)] px-4 py-3.5 font-semibold text-[var(--accent-deep)]"
                >
                  {avitoOpen ? "Скрыть Авито" : "Подбор Авито"}
                </button>
              ) : null}
              {editing ? (
                <button
                  type="button"
                  onClick={() => removeClient(editing.id)}
                  className="rounded-xl border border-red-200 px-4 py-3.5 font-semibold text-red-700"
                >
                  Удалить
                </button>
              ) : null}
            </div>

            {editing && avitoOpen ? (
              <div className="mt-5 space-y-3 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4">
                <p className="font-[family-name:var(--font-display)] text-xl">Подбор на Авито</p>
                <p className="text-xs text-[var(--muted)]">
                  Собираем ссылку поиска → открываете Авито → сохраняете понравившиеся варианты к
                  клиенту.
                </p>

                <Field label="Город">
                  <select
                    value={avito.city}
                    onChange={(e) =>
                      setAvito((a) => ({ ...a, city: e.target.value as AvitoCity }))
                    }
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-base outline-none focus:border-[var(--accent)]"
                  >
                    {(Object.keys(AVITO_CITY_LABEL) as AvitoCity[]).map((c) => (
                      <option key={c} value={c}>
                        {AVITO_CITY_LABEL[c]}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Категория">
                  <select
                    value={avito.category}
                    onChange={(e) =>
                      setAvito((a) => ({ ...a, category: e.target.value as AvitoCategory }))
                    }
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-base outline-none focus:border-[var(--accent)]"
                  >
                    {(Object.keys(AVITO_CATEGORY_LABEL) as AvitoCategory[]).map((c) => (
                      <option key={c} value={c}>
                        {AVITO_CATEGORY_LABEL[c]}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="grid grid-cols-2 gap-2">
                  <Field label="Цена от">
                    <input
                      value={avito.priceMin}
                      onChange={(e) => setAvito((a) => ({ ...a, priceMin: e.target.value }))}
                      className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-base outline-none focus:border-[var(--accent)]"
                      inputMode="numeric"
                      placeholder="3000000"
                    />
                  </Field>
                  <Field label="Цена до">
                    <input
                      value={avito.priceMax}
                      onChange={(e) => setAvito((a) => ({ ...a, priceMax: e.target.value }))}
                      className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-base outline-none focus:border-[var(--accent)]"
                      inputMode="numeric"
                      placeholder="5500000"
                    />
                  </Field>
                </div>

                <Field label="Запрос (комнаты / район)">
                  <input
                    value={avito.query}
                    onChange={(e) => setAvito((a) => ({ ...a, query: e.target.value }))}
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-base outline-none focus:border-[var(--accent)]"
                    placeholder="2-к Ильича"
                  />
                </Field>

                <a
                  href={liveSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center rounded-xl bg-[var(--accent)] px-4 py-3.5 text-center font-semibold text-[var(--button-ink)]"
                >
                  Открыть поиск на Авито
                </a>

                <p className="break-all text-[11px] text-[var(--muted)]">{liveSearchUrl}</p>

                <div className="border-t border-[var(--line)] pt-3">
                  <p className="mb-2 text-sm font-semibold">Сохранить вариант к клиенту</p>
                  <Field label="Название">
                    <input
                      value={avito.saveTitle}
                      onChange={(e) => setAvito((a) => ({ ...a, saveTitle: e.target.value }))}
                      className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-base outline-none focus:border-[var(--accent)]"
                      placeholder="2к Текстилей, 4.8 млн"
                    />
                  </Field>
                  <Field label="Ссылка объявления (из Авито)">
                    <input
                      value={avito.saveUrl}
                      onChange={(e) => setAvito((a) => ({ ...a, saveUrl: e.target.value }))}
                      className="w-full rounded-xl border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-base outline-none focus:border-[var(--accent)]"
                      placeholder="https://www.avito.ru/..."
                    />
                  </Field>
                  <button
                    type="button"
                    onClick={addPickFromFields}
                    className="mt-2 w-full rounded-xl border border-[var(--line)] px-4 py-3 font-semibold"
                  >
                    Сохранить ссылку
                  </button>
                </div>

                {(editing.picks?.length ?? 0) > 0 ? (
                  <ul className="space-y-2 border-t border-[var(--line)] pt-3">
                    {editing.picks.map((pick) => (
                      <li
                        key={pick.id}
                        className="flex items-start justify-between gap-2 rounded-xl bg-[var(--surface)] px-3 py-2"
                      >
                        <a
                          href={pick.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="min-w-0 flex-1 text-sm font-medium text-[var(--accent-deep)] underline-offset-2 hover:underline"
                        >
                          {pick.title}
                        </a>
                        <button
                          type="button"
                          onClick={() => removePick(pick.id)}
                          className="shrink-0 text-xs text-red-700"
                        >
                          Удалить
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium tracking-wide text-[var(--muted)] uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
