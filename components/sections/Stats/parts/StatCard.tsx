import { getIcon } from "@/lib/icons";
import type { StatItem } from "@/types/site";

interface StatCardProps {
  item: StatItem;
  /** round — плашка .icon-tile под иконкой (badge), форма из ThemeConfig.iconShape; none — голая иконка (plain, всегда без плашки). */
  tile?: "round" | "none";
}

/**
 * Содержимое одной карточки-метрики: иконка, число (+ суффикс) и подпись,
 * плюс опциональное описание (text). Общий кусок для badge/plain — эти
 * варианты отличаются только оправой карточки и тем, есть ли у иконки
 * плашка, а не версткой самого числа.
 *
 * Без собственной обёртки (Fragment, не div): `<dl>` по HTML-спеке
 * допускает только ОДИН уровень `<div>` между собой и `<dt>/<dd>` — его
 * даёт сам `Card` в варианте. Раньше `Card` и этот компонент оба
 * рендерили свой `<div>`, и получалось два уровня вложенности —
 * `data-reveal`/`revealDelay` поэтому переехали на сам `Card` (см.
 * variants/Badge.tsx и соседей).
 */
export function StatCard({ item, tile = "none" }: StatCardProps) {
  const Icon = getIcon(item.icon);

  return (
    <>
      {Icon ? (
        tile === "round" ? (
          // Форма — через .icon-tile (см. ThemeConfig.iconShape), не
          // хардкод rounded-full: раньше плашка была круглой всегда,
          // независимо от настройки сайта.
          <span className="icon-tile mb-4">
            <Icon aria-hidden="true" strokeWidth={1.5} className="size-5" />
          </span>
        ) : (
          // text-fg-muted, а не text-accent: по правилу акцента (CLAUDE.md
          // §1.1) ВСЕ иконки — приглушённый текст. Акцентная иконка в
          // каждой карточке-метрике размывала правило и красила сетку
          // цифр в цвет бренда целиком.
          <div className="mb-4 flex size-8 items-center justify-center text-fg-muted">
            <Icon aria-hidden="true" strokeWidth={1.5} className="size-5" />
          </div>
        )
      ) : null}

      <dt className="tabular font-display text-stat">
        {item.value}
        {item.suffix ? <span className="text-accent">{item.suffix}</span> : null}
      </dt>

      <dd className="mt-3 text-caption font-medium uppercase text-fg-muted">
        {item.label}
      </dd>

      {item.text ? (
        <p className="mt-3 text-small text-fg-muted">{item.text}</p>
      ) : null}
    </>
  );
}

export default StatCard;
