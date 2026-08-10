import { Container } from "@/components/ui/Container";
import { BottomBar } from "../parts/BottomBar";
import { FooterColumns } from "../parts/FooterColumns";
import { NewsletterForm } from "../parts/NewsletterForm";
import { SocialLinks } from "../parts/SocialLinks";
import type { FooterProps } from "../types";

/**
 * Жирный вордмарк и тег-лайн слева, соцссылки под ним; сгруппированные
 * колонки ссылок и форма подписки справа. Колонки, соцссылки и
 * newsletter — опциональные данные (footer.columns / footer.social /
 * footer.newsletter): без них секция просто не рендерит соответствующий
 * блок, а не подставляет заглушку. Логика доли колонок под newsletter —
 * та же, что в Monogram.
 */
export function Bold({ brand, footer }: FooterProps) {
  return (
    <footer data-surface="paper" className="bg-bg text-fg">
      <div className="border-t border-rule pt-12 md:pt-16">
        <Container>
          <div className="grid gap-x-gutter gap-y-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="font-heading text-h2 font-black uppercase">
                {brand.name}
              </p>
              <p className="mt-3 max-w-[36ch] text-small text-fg-muted">
                {brand.description}
              </p>

              {footer.social ? <SocialLinks items={footer.social} className="mt-6" /> : null}
            </div>

            {footer.columns ? (
              <div className={footer.newsletter ? "md:col-span-4" : "md:col-span-7"}>
                <FooterColumns columns={footer.columns} />
              </div>
            ) : null}

            {footer.newsletter ? (
              <div className={footer.columns ? "md:col-span-3" : "md:col-span-7"}>
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

export default Bold;
