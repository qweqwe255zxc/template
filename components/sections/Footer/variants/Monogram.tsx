import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { BottomBar } from "../parts/BottomBar";
import { FooterColumns } from "../parts/FooterColumns";
import { NewsletterForm } from "../parts/NewsletterForm";
import { SocialLinks } from "../parts/SocialLinks";
import type { FooterProps } from "../types";

/**
 * Знак-плашка с инициалом, колонки ссылок и форма подписки
 * (footer.newsletter) в отдельной зоне справа. Без newsletter в конфиге
 * эта зона просто не рендерится — колонки при этом занимают освободившееся
 * место.
 *
 * `footer.monogramBackground` решает и фон плашки, и поверхность секции
 * разом — раньше это были два отдельных файла (gradient/glass),
 * отличавшихся только этими двумя классами: настоящей разницы в
 * раскладке между ними не было.
 */
export function Monogram({ brand, footer }: FooterProps) {
  const initial = brand.name.charAt(0).toUpperCase();
  const background = footer.monogramBackground ?? "gradient";

  return (
    <footer
      data-surface={background === "surface" ? "surface" : "paper"}
      className="bg-bg text-fg"
    >
      <div className="border-t border-rule pt-12 md:pt-16">
        <Container>
          <div className="grid gap-x-gutter gap-y-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="inline-flex items-center gap-2.5 font-heading text-h3 font-bold">
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex size-8 items-center justify-center rounded-control text-body font-bold text-accent-fg",
                    background === "surface"
                      ? "bg-accent"
                      : "bg-gradient-to-br from-accent to-accent-active",
                  )}
                >
                  {initial}
                </span>
                {brand.name}
              </p>
              <p className="mt-3 max-w-[34ch] text-small text-fg-muted">
                {brand.description}
              </p>

              {footer.social ? <SocialLinks items={footer.social} className="mt-6" /> : null}
            </div>

            {footer.columns ? (
              <div className={footer.newsletter ? "md:col-span-5" : "md:col-span-8"}>
                <FooterColumns columns={footer.columns} />
              </div>
            ) : null}

            {footer.newsletter ? (
              <div className="md:col-span-3">
                <NewsletterForm newsletter={footer.newsletter} />
              </div>
            ) : null}
          </div>

          <BottomBar
            legalName={brand.legalName}
            links={footer.links}
            note={footer.note}
            legal={footer.legal}
            className="mt-4"
          />
        </Container>
      </div>
    </footer>
  );
}

export default Monogram;
