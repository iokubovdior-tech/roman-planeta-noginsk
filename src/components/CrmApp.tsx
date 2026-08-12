"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CLIENT_KIND_LABEL,
  STORAGE_KEY,
  clientMatchesQuery,
  createClientId,
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

const emptyDraft = (): Draft => ({
  name: "",
  phone: "",
  kind: "seller",
  address: "",
  note: "",
});

function loadClients(): Client[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Client[];
    return Array.isArray(parsed) ? sortClients(parsed) : [];
  } catch {
    return [];
  }
}

function saveClients(clients: Client[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export function CrmApp() {
  const [clients, setClients] = useState<Client[]>([]);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Client | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
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

  function openCreate() {
    setEditing(null);
    setDraft(emptyDraft());
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
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
    setDraft(emptyDraft());
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
      persist(
        clients.map((c) =>
          c.id === editing.id
            ? {
                ...c,
                name,
                phone,
                kind: draft.kind,
                address: draft.address.trim(),
                note: draft.note.trim(),
                updatedAt: now,
              }
            : c,
        ),
      );
    } else {
      const next: Client = {
        id: createClientId(),
        name,
        phone,
        kind: draft.kind,
        address: draft.address.trim(),
        note: draft.note.trim(),
        createdAt: now,
        updatedAt: now,
      };
      persist([next, ...clients]);
    }
    closeForm();
    setFlash(editing ? "Клиент обновлён" : "Клиент добавлен");
  }

  function removeClient(id: string) {
    if (!confirm("Удалить клиента?")) return;
    persist(clients.filter((c) => c.id !== id));
    closeForm();
    setFlash("Удалено");
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
        const parsed = JSON.parse(String(reader.result)) as Client[];
        if (!Array.isArray(parsed)) throw new Error("bad");
        const byId = new Map<string, Client>();
        for (const c of [...clients, ...parsed]) {
          if (c && typeof c.id === "string") byId.set(c.id, c);
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
              {clients.length} в базе · поиск по имени, телефону, адресу
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
                      <p className="truncate font-semibold">
                        {client.name || "Без имени"}
                      </p>
                      <p className="mt-0.5 text-sm text-[var(--ink-soft)]">
                        {client.phone || "Нет телефона"}
                      </p>
                      {client.address ? (
                        <p className="mt-1 truncate text-sm text-[var(--muted)]">
                          {client.address}
                        </p>
                      ) : null}
                    </div>
                    <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--accent-deep)]">
                      {CLIENT_KIND_LABEL[client.kind]}
                    </span>
                  </div>
                  {client.note ? (
                    <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">{client.note}</p>
                  ) : null}
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
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, kind: e.target.value as ClientKind }))
                  }
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
                  onClick={() => removeClient(editing.id)}
                  className="rounded-xl border border-red-200 px-4 py-3.5 font-semibold text-red-700"
                >
                  Удалить
                </button>
              ) : null}
            </div>
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
