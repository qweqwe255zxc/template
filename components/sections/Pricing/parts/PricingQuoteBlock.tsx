import Image from "next/image";
import { cn } from "@/lib/cn";

interface PricingQuoteBlockProps {
  quote: { text: string; author: string; photo: string };
  className?: string;
}

/**
 * Цитата поверх фото под тарифами (как Hero/parts/HeroOverlay.tsx, но
 * центрированная и во всю ширину блока). Раньше жила только в variants/
 * Quote.tsx — вынесена сюда, чтобы `quote` можно было задать при любом
 * variant, а не только там, где для неё случайно нашлось место в вёрстке.
 *
 * Оверлей абсолютом — только на md+, как у HeroOverlay: 21/9 на узком
 * экране — полоса высотой ~150px, в которую многострочная цитата с
 * паддингом физически не помещается (card заведомо выше бокса, а
 * overflow-hidden обрезает её сверху и снизу). На мобильном карточка
 * встаёт обычным блоком под фото, а не наложением поверх слишком
 * тонкой полосы.
 */
export function PricingQuoteBlock({ quote, className }: PricingQuoteBlockProps) {
  return (
    <div className={cn("relative", className)} data-reveal>
      <div className="ui-media-raised relative aspect-[21/9] w-full overflow-hidden">
        <Image src={quote.photo} alt="" fill sizes="100vw" className="object-cover grayscale" />
      </div>
      <div className="mt-6 md:absolute md:inset-6 md:mt-0 md:flex md:items-center md:justify-center">
        <div className="ui-popover mx-auto max-w-[36rem] bg-card p-8 text-center md:mx-0 md:p-10">
          <p className="italic text-lead">{quote.text}</p>
          <p className="mt-4 text-caption font-medium uppercase text-fg-muted">
            — {quote.author}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PricingQuoteBlock;
