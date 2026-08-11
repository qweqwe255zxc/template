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
 * `footer.monogramBackground` решает поверхность секции — раньше это
 * были два отдельных файла (gradient/glass), настоящей разницы в
 * раскладке между ними не было.
 *
 * Сама плашка в обоих режимах — плоская заливка акцентом. Раньше режим
 * "gradient" рисовал её через `from-accent to-accent-active`: градиент
 * из цвета в его же затемнённую версию не несёт информации и является
 * штампом («квадратик с инициалом на градиенте»). Имя значения
 * оставлено как есть — это публичный API конфига.
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
                  className="flex size-8 items-center justify-center rounded-control bg-accent text-body font-bold text-accent-fg"
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
