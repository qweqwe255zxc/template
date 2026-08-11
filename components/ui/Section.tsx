import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { IconShape, Surface } from "@/types/site";

interface SectionProps {
  id: string;
  children: ReactNode;
  /** Контекст поверхности — переопределяет цветовые переменные для потомков. */
  surface?: Surface;
  /**
   * hero — первый экран: верх выкупает высоту фиксированного хедера
   * (--space-hero-top), низ тише обычного (--space-hero). lg — CTA:
   * просторнее секции, но без налога на хедер. sm — полоса статистики.
   * none — секция сама решает.
   */
  spacing?: "default" | "hero" | "lg" | "sm" | "none";
  /** Линейка во всю ширину сверху, базовый разделитель между секциями. */
  ruleTop?: boolean;
  /**
   * Какую фоновую подсветку берёт секция: обычную (--section-tint) или
   * усиленную геройскую (--hero-tint). В тарифе «Эконом» оба токена —
   * none, то есть заливка остаётся плоской; значение имеет смысл только
   * в «Стандарте». Ставит его один Hero, остальным секциям не нужно.
   */
  tint?: "section" | "hero";
  /** Форма .icon-tile для потомков — уже резолвлена SectionRenderer'ом (section.iconShape ?? theme.iconShape). */
  iconShape?: IconShape;
  className?: string;
}

const spacingMap = {
  default: "py-section",
  hero: "pt-hero-top pb-hero",
  lg: "py-section-lg",
  sm: "py-section-sm",
  none: "",
} as const;

/**
 * Обёртка секции: задаёт поверхность, вертикальные отступы и
 * scroll-margin-top под sticky-хедер (data-section — селектор
 * для scroll-margin-top в globals.css). Больше ничего не делает.
 */
export function Section({
  id,
  children,
  surface = "paper",
  spacing = "default",
  ruleTop = false,
  tint = "section",
  iconShape,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      data-section
      data-surface={surface}
      data-tint={tint}
      data-icon-shape={iconShape}
      className={cn(
        "bg-bg text-fg",
        spacingMap[spacing],
        ruleTop && "border-t border-rule",
        className,
      )}
    >
      {children}
    </section>
  );
}

export default Section;
