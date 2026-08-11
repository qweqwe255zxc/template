import { cn } from "@/lib/cn";

interface SectionHeaderProps {
  number?: string;
  eyebrow?: string;
  title?: string;
  lead?: string;
  /** Линейка во всю ширину над шапкой — базовый разделитель разделов. */
  rule?: boolean;
  /**
   * Как стоят номер с колонтитулом относительно заголовка.
   *
   * gutter (по умолчанию) — на левом поле, в 3 колонки из 12: обычная
   * шапка раздела на широком контейнере (1600px).
   *
   * stacked — строкой над заголовком, во всю ширину. Нужен узкому
   * контейнеру (`Container width="narrow"`, 760px): там 3/12 — это около
   * 170px, и колонтитул вроде «Вопросы и ответы» рвался на три строки,
   * а рядом с ним пустовало поле. Это не другой дизайн шапки, а та же
   * шапка в колонке, где боковое поле физически не помещается.
   */
  layout?: "gutter" | "stacked";
  className?: string;
}

/**
 * Шапка раздела: номер и колонтитул — на левое поле, заголовок и лид —
 * в основную колонку. Номер и колонтитул всегда fg-muted, без акцента.
 */
export function SectionHeader({
  number,
  eyebrow,
  title,
  lead,
  rule = true,
  layout = "gutter",
  className,
}: SectionHeaderProps) {
  if (!number && !eyebrow && !title && !lead) return null;

  const stacked = layout === "stacked";
  const hasKicker = Boolean(number || eyebrow);

  return (
    <header
      className={cn(
        "grid gap-x-gutter gap-y-6",
        !stacked && "md:grid-cols-12",
        rule && "border-t border-rule pt-7 md:pt-9",
        className,
      )}
      data-reveal
    >
      {hasKicker && (
        <div
          className={cn(
            "flex items-baseline gap-4",
            !stacked && "md:col-span-3 md:flex-col md:gap-3",
          )}
        >
          {number ? (
            <span className="tabular text-caption font-medium uppercase text-fg-muted">
              {number}
            </span>
          ) : null}
          {eyebrow ? (
            <span className="text-caption font-medium uppercase text-fg-muted">
              {eyebrow}
            </span>
          ) : null}
        </div>
      )}

      <div
        className={cn(
          !stacked && (hasKicker ? "md:col-span-9" : "md:col-span-12"),
        )}
      >
        {title ? <h2 className="font-heading section-title">{title}</h2> : null}
        {lead ? (
          <p className="mt-5 max-w-[58ch] text-lead text-fg-muted">{lead}</p>
        ) : null}
      </div>
    </header>
  );
}

export default SectionHeader;
