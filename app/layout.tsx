import type { Metadata, Viewport } from "next";
import {
  Golos_Text,
  Wix_Madefor_Display,
  Wix_Madefor_Text,
} from "next/font/google";
import { RevealRoot } from "@/components/ui/RevealRoot";
import { ThemeScript } from "@/components/ThemeScript";
import { YandexMetrika } from "@/components/YandexMetrika";
import { siteConfig } from "@/content/site.config";
import { buildMetadata } from "@/lib/seo";
import { palette, paletteDark } from "@/theme/palette";
import "./globals.css";

// Шрифты ДЕМО-сборки. Под проект пара выбирается заново по референсам
// клиента (CLAUDE.md §5 шаг 0), а таблица §1.2 — набор кандидатов, а не
// дефолт по нише. Обязательное техническое условие для русского сайта:
// у семейства должно быть кириллическое подмножество — subsets:
// ["cyrillic"] на шрифте без него не соберётся (так отпадают, например,
// Syne, Space Grotesk, Sora, Outfit, DM Sans).
//
// Display-шрифт — h3/h4, цитаты, крупные цифры.
const madeforText = Wix_Madefor_Text({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-madefor-text",
});

// Body — кириллица-first гротеск.
const golos = Golos_Text({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-golos",
});

// Вторая гарнитура — только для h1 и h2, для акцентной декоративной
// типографики (см. font-heading в theme/tokens.css).
const madeforDisplay = Wix_Madefor_Display({
  subsets: ["cyrillic", "latin"],
  weight: ["600", "700", "800"],
  display: "swap",
  variable: "--font-madefor-display",
});

export const metadata: Metadata = buildMetadata(siteConfig);

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: palette.paper },
    { media: "(prefers-color-scheme: dark)", color: paletteDark.paper },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-preset — единственное место, откуда тариф оформления попадает
    // в CSS: блоки [data-preset=...] в theme/tokens.css переопределяют
    // ручки глубины, и вся страница разом становится «дорогой». Значение
    // серверное и статическое, поэтому вспышки смены темы тут нет.
    <html
      lang="ru"
      data-preset={siteConfig.theme.preset ?? "econom"}
      data-title-style={siteConfig.theme.titleStyle ?? "standard"}
      className={`${madeforText.variable} ${golos.variable} ${madeforDisplay.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript theme={siteConfig.theme} />
      </head>
      <body>
        {children}
        <RevealRoot />
        <YandexMetrika id={siteConfig.analytics.yandexMetrikaId} />
      </body>
    </html>
  );
}
