import { ContactForm } from "@/components/sections/ContactForm";
import { siteConfig } from "@/content/site.config";
import type { ContactSection } from "@/types/site";
import { QaBlock, QaNav } from "../_lib";

const base = siteConfig.sections.find(
  (s): s is ContactSection => s.type === "contact",
)!;

const variants: NonNullable<ContactSection["variant"]>[] = [
  "split",
  "stacked",
  "boxed",
  "panels",
  "sticky-split",
  "editorial",
  "product",
  "atelier",
  "market",
];

export default function QaContactPage() {
  return (
    <main>
      <QaNav current="contact" />
      {variants.map((variant) => (
        <QaBlock key={variant} label={`ContactForm / variant="${variant}"`}>
          <ContactForm
            {...base}
            id={`contact-${variant}`}
            variant={variant}
            layout="cardContainer"
            contacts={siteConfig.contacts}
            iconShape={base.iconShape ?? siteConfig.theme.iconShape}
          />
        </QaBlock>
      ))}
    </main>
  );
}
