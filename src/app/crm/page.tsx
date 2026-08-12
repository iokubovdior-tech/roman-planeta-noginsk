import type { Metadata, Viewport } from "next";
import { CrmApp } from "@/components/CrmApp";

export const metadata: Metadata = {
  title: "Клиенты · Роман Планета",
  description: "Быстрый учёт входящих клиентов: добавление и поиск.",
  manifest: "/manifest-crm.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Клиенты",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/icons/crm-apple-180.png",
    icon: [
      { url: "/icons/crm-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/crm-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f6f3",
};

export default function CrmPage() {
  return <CrmApp />;
}
