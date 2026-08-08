import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { getIcon } from "@/lib/icons";
import type { AboutSection } from "@/types/site";

interface AboutTextBlockProps {
  number?: string;
  eyebrow?: string;
  /** Пилюля вместо обычной подписи с тире — приоритетнее number/eyebrow. */
  badge?: string;
  badgeIcon?: AboutSection["badgeIcon"];
  title?: string;
  text: string[];
  actions?: AboutSection["actions"];
  /** Вторая кнопка — текстовая ссылка (variant="quiet"), а не обводка. Читает quiet-split. */
  quietSecondary?: boolean;
  className?: string;
}

/**
 * Текстовая колонка split-actions/quiet-split/dark: колонтитул (подпись
 * с тире или пилюля), заголовок, абзацы, кнопки. Общее для трёх
 * вариантов — разница только в данных и в паре флагов.
 */
export function AboutTextBlock({
  number,
  eyebrow,
  badge,
  badgeIcon,
  title,
  text,
  actions,
  quietSecondary = false,
  className,
}: AboutTextBlockProps) {
  const Icon = getIcon(badgeIcon);
  const hasKicker = Boolean(badge || number || eyebrow);

  return (
    <div className={className}>
      {hasKicker ? (
        <div data-reveal>
          {badge ? (
            <Badge variant="soft" className="gap-1.5 uppercase">
              {Icon ? (
                <Icon aria-hidden="true" strokeWidth={1.5} className="size-3.5" />
              ) : null}
              {badge}
            </Badge>
          ) : (
            <div className="flex items-baseline gap-4">
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
        </div>
      ) : null}

      {title ? (
        <h2 className="mt-4 max-w-[18ch] font-heading text-h2" data-reveal>
          {title}
        </h2>
      ) : null}

      <div className="mt-5 space-y-4" data-reveal>
        {text.map((paragraph) => (
          <p key={paragraph} className="max-w-[52ch] text-body text-fg-muted">
            {paragraph}
          </p>
        ))}
      </div>

      {actions && actions.length > 0 ? (
        <div
          className={cn(
            "mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-6",
            // quietSecondary: рядом с текстовой ссылкой (h-auto) выравниваем
            // по базовой линии текста, а не по центру бокса — иначе подпись
            // ссылки заметно съезжала выше подписи кнопки (см. CtaBody).
            quietSecondary ? "sm:items-baseline" : "sm:items-center",
          )}
          data-reveal
        >
          {actions.map((action, index) => {
            const variant =
              quietSecondary && index === 1
                ? "quiet"
                : (action.variant ?? (index === 0 ? "primary" : "secondary"));
            return (
              <Button
                key={action.label}
                href={action.href}
                variant={variant}
                // split-actions: обе кнопки настоящие — на мобильном во всю
                // ширину, с sm flex-1 растягивает обе поровну (иначе при
                // разной длине подписи ряд читался неровным). quiet-split:
                // настоящая кнопка тут одна — растягивать её на всю
                // оставшуюся ширину ряда рядом с лёгкой ссылкой не нужно,
                // full="mobile" просто даёт ей удобную ширину тапа.
                full={variant !== "quiet" && quietSecondary ? "mobile" : undefined}
                className={
                  variant !== "quiet" && !quietSecondary ? "w-full sm:flex-1" : undefined
                }
              >
                {action.label}
              </Button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default AboutTextBlock;
