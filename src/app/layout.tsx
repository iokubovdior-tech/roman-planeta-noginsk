import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Роман · Планета · Ногинск",
  description:
    "Роман Ямников — агент недвижимости «Планета» в Ногинске. Портфолио закрытых сделок и помощь с продажей квартиры.",
  openGraph: {
    title: "Роман · Планета · Ногинск",
    description:
      "Портфолио сделок и оценка недвижимости в Ногинске. Роман Ямников, агентство «Планета».",
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
