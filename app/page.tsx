import { SectionRenderer } from "@/components/SectionRenderer";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { siteConfig } from "@/content/site.config";
import { buildJsonLd, buildNav } from "@/lib/seo";

export default function HomePage() {
  const { brand, contacts, theme, header, footer, sections } = siteConfig;
  const nav = buildNav(siteConfig);
  const jsonLd = buildJsonLd(siteConfig);
  const heroSection = sections.find((section) => section.type === "hero");
  // Centered — единственный вариант hero, чей дефолт surface не "paper"
  // (см. Hero/variants/Centered.tsx) — хедер должен знать про этот же
  // дефолт, а не только про явно заданный surface в конфиге.
  const heroSurface =
    heroSection?.surface ??
    (heroSection?.variant === "centered" ? "ink" : "paper");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header
        brandName={brand.name}
        brandMark={brand.mark}
        nav={nav}
        actions={header.actions}
        showThemeToggle={theme.darkModeToggle}
        variant={header.variant}
        heroSurface={heroSurface}
        transparentBeforeScroll={header.transparentBeforeScroll}
        hideOnScroll={header.hideOnScroll}
      />

      <main id="main">
        <SectionRenderer
          sections={sections}
          context={{
            contacts,
            preset: theme.preset ?? "econom",
            iconShape: theme.iconShape ?? "circle",
            titleStyle: theme.titleStyle ?? "standard",
          }}
        />
      </main>

      <Footer brand={brand} contacts={contacts} footer={footer} nav={nav} />
    </>
  );
}
