import { Button } from "@/components/ui/Button";
import { revealDelay } from "@/lib/reveal";
import { COMPACT_H1 } from "./headlineScale";
import type { CtaLink } from "@/types/site";

interface HeroLedeProps {
  headline: string[];
  lead?: string;
  actions?: CtaLink[];
  /** Понизить потолок --size-h1 с 64px до 48px — см. parts/headlineScale.ts. */
  compact?: boolean;
  /** Ширина колонки на md+ — своя у каждой раскладки. */
  className?: string;
}

/**
 * Заголовок, лид и кнопки — сердце hero, одинаковое во всех раскладках.
 * Последняя строка headline всегда в акцентном цвете: это одно из
 * шести мест, где акцент вообще появляется.
 */
export function HeroLede({
  headline,
  lead,
  actions = [],
  compact = false,
  className,
}: HeroLedeProps) {
  return (
    <div className={className}>
      {/* Ручные переносы включаются только с md: на узком экране они дают
          висячие строки, там заголовок верстается потоком. */}
      <h1
        className="font-heading text-h1 break-words"
        style={compact ? COMPACT_H1 : undefined}
        data-reveal
      >
        {headline.map((line, index) => (
          <span key={index} className="md:block">
            {index === headline.length - 1 ? (
              <span className="text-accent">{line}</span>
            ) : (
              line
            )}
            {index < headline.length - 1 ? " " : null}
          </span>
        ))}
      </h1>

      {lead ? (
        <p
          className="mt-8 max-w-[52ch] text-lead text-fg-muted"
          data-reveal
          style={revealDelay(1)}
        >
          {lead}
        </p>
      ) : null}

      {actions.length > 0 ? (
        <div
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          data-reveal
          style={revealDelay(2)}
        >
          {actions.map((action, index) => (
            <Button
              key={index}
              href={action.href}
              variant={action.variant ?? "primary"}
            >
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default HeroLede;
