import Image from "next/image";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { PricingPlan } from "@/types/site";

/**
 * Содержимое одного тарифа: фото, название, цена, описание, список
 * возможностей, кнопка. Общее для всех раскладок.
 *
 * Фото — фиксированный бокс aspect-[4/3] с .ui-media, тот же, что в
 * Features: см. docs/section-system.md, раздел 2.
 *
 * Кнопка тарифа идёт с `mt-auto pt-8`, а не `mt-8`. В карточной раскладке
 * содержимое сидит во flex-колонке, и `mt-auto` съедает разницу высот:
 * списки возможностей у тарифов всегда разной длины, а кнопки обязаны
 * стоять на одной линии — иначе ряд читается неровным. В табличной
 * раскладке flex-колонки нет, `margin-top: auto` там по спецификации
 * равен нулю, и отступ целиком держит `pt-8` — то есть прежние 32px.
 */
interface PlanContentProps {
  plan: PricingPlan;
  /**
   * Ступень кегля цены — её обязан передать вариант, базовой тут нет
   * намеренно (та же причина, что у цитаты в TestimonialBody: две
   * утилиты font-size в одном className конфликтуют по порядку в
   * собранном CSS, а не в строке).
   *
   * Кегль выбирает тот, кто знает ширину колонки. В табличной раскладке
   * колонка широкая, и цена идёт крупной цифрой `text-stat` (до 60px).
   * В карточке содержимое ужимается до ~300px, и та же ступень ломала
   * цену на две строки: «от 90 000 ₽» переносило рубль на вторую строку,
   * а «по запросу» занимало полкарточки и перебивало собственное
   * название тарифа.
   */
  priceClassName: string;
  /**
   * Галка/крестик вместо тире перед пунктом (ribbon/playful/glass).
   * Дефолт — тире, как в исходных table/cards: не хотим менять их вид.
   */
  checkIcon?: boolean;
  /** Показать plan.tag (короткий лейбл над названием) — ribbon/panel/glass. */
  showTag?: boolean;
  /**
   * Переопределяет aspect-ratio фото для растянутой в 2 колонки карточки
   * (`fillLastRow`, см. lib/gridFill.ts) — без этого фото удваивало бы
   * не только ширину, но и высоту.
   */
  mediaAspectClassName?: string;
}

export function PlanContent({
  plan,
  priceClassName,
  checkIcon = false,
  showTag = false,
  mediaAspectClassName,
}: PlanContentProps) {
  return (
    <>
      {plan.photo ? (
        <div className={cn("ui-media-inset relative mb-5 aspect-[4/3] w-full shrink-0 overflow-hidden", mediaAspectClassName)}>
          <Image
            src={plan.photo}
            alt={plan.name}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : null}

      {showTag && plan.tag ? (
        <p className="text-caption font-medium uppercase text-fg-muted">{plan.tag}</p>
      ) : null}

      <h3 className={cn("font-display text-h3", showTag && plan.tag && "mt-1")}>
        {plan.name}
      </h3>
      {/* whitespace-nowrap на самой цене: строка «от 90 000 ₽ / инстанция»
          длиннее колонки, и браузер переносил её по последнему пробелу,
          который влезал, — то есть ВНУТРИ числа, оставляя «₽» на второй
          строке. Цена — одна лексема, рвать её нельзя; переносится
          единица измерения, и это правильное место разрыва. */}
      <p className={cn("tabular mt-6 font-display", priceClassName)}>
        <span className="whitespace-nowrap">{plan.price}</span>
        {plan.unit ? (
          <span className="ml-2 text-body tracking-normal text-fg-muted">{plan.unit}</span>
        ) : null}
      </p>
      {plan.text ? (
        <p className="mt-4 text-body text-fg-muted">{plan.text}</p>
      ) : null}

      {plan.features.length > 0 ? (
      <ul className="mt-7 space-y-2.5 border-t border-rule pt-7">
        {plan.features.map((feature) => {
          const isObject = typeof feature !== "string";
          const label = isObject ? feature.text : feature;
          const excluded = isObject && feature.excluded;

          return (
            <li
              key={label}
              className={cn(
                "flex gap-3 text-small",
                excluded ? "text-fg-muted/60 line-through" : "text-fg-muted",
              )}
            >
              {checkIcon ? (
                excluded ? (
                  <X aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0" />
                ) : (
                  <Check aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0 text-accent" />
                )
              ) : (
                <span aria-hidden="true" className="select-none">
                  —
                </span>
              )}
              <span>{label}</span>
            </li>
          );
        })}
      </ul>
      ) : null}

      {plan.action ? (
        <div className="mt-auto pt-8">
          <Button
            href={plan.action.href}
            variant={plan.action.variant ?? "secondary"}
            size="sm"
            full
          >
            {plan.action.label}
          </Button>
        </div>
      ) : null}
    </>
  );
}

export default PlanContent;
