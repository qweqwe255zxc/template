"use client";

import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/cn";
import { BurgerButton } from "../parts/BurgerButton";
import { headerSurface, resolveScrolled } from "../parts/headerSurface";
import { HeaderCtaGroup } from "../parts/HeaderCtaGroup";
import { MobileNav } from "../parts/MobileNav";
import { useHeaderState } from "../parts/useHeaderState";
import { useNavOverflow } from "../parts/useNavOverflow";
import type { HeaderProps } from "../types";

/**
 * Хедер семейства `atelier`: крупный вордмарк обычного веса слева,
 * навигация капителью с разрядкой, кнопка справа. Активный пункт —
 * акцентным цветом.
 *
 * Чем отличается от соседей по каталогу:
 *
 *   • `bold` тоже даёт крупный вордмарк (`font-heading text-h3`), но
 *     жирный и с навигацией, сгруппированной справа вплотную к кнопке.
 *     Тут вордмарк обычного веса и навигация отбита в середину: в этом
 *     семействе заголовки держатся на кегле и воздухе, а не на
 *     насыщенности.
 *   • `classic` набирает меню обычным `text-small` и подчёркивает
 *     активный пункт акцентной линией во всю ширину подписи. Здесь
 *     подчёркивания нет вовсе — линия под подписью читалась бы вторым
 *     штрихом рядом со штрихом семейства и обесценила бы его.
 *   • `editorial` набирает капителью и вордмарк тоже, и делает бар
 *     непрозрачным с первого кадра. Здесь капитель только у меню, а
 *     `transparentBeforeScroll` читается как обычно: линейку под баром
 *     тут ничто не несёт, и прозрачный бар поверх первого экрана приёму
 *     не мешает. Активный пункт там показан цветом текста, здесь —
 *     акцентом, и это единственное акцентное пятно во всём баре.
 *
 * Про раскладку: `justify-between`, а не три зоны грида. Пробовал
 * `grid-cols-[1fr_auto_1fr]` ради честного центрирования меню — на
 * демо-данных не работает и работать не может. При восьми пунктах
 * навигация занимает середину целиком (замерено на 1440: вордмарк 138,
 * меню 817, кнопки 365 при доступных 1368 — ровно в обрез, запас 0), и
 * боковые `1fr`-треки схлопываются к min-content, то есть перестают
 * быть равными. Центрирование получается только на макете с тремя
 * пунктами меню; на настоящем конфиге это лишняя сложность, дающая тот
 * же результат, что обычный `justify-between`.
 *
 * Разрядка меню 0.08em, а не 0.16em, как у остальных капительных строк
 * семейства, и `gap-5` вместо `gap-6`. Это замер, а не вкус: с полной
 * разрядкой восемь подписей не влезают, `useNavOverflow` честно прячет
 * меню в бургер, и на 1440 десктопной навигации не остаётся вовсе. Та
 * же грабля уже была поймана в `Header/editorial` — там значения те же
 * и по той же причине. Итоговый замер на 1440: вордмарк 123, меню 773,
 * кнопки 385 при доступных 1368 — запас 39px. Правишь разрядку или
 * gap — перемеряй, запас тут в один пункт меню.
 */
export function Atelier({
  brandName,
  brandMark,
  nav,
  actions,
  showThemeToggle,
  heroSurface,
  transparentBeforeScroll,
  hideOnScroll,
}: HeaderProps) {
  const { scrolled, hiddenByScroll, menuOpen, toggleMenu, closeMenu, activeHref } =
    useHeaderState(nav);
  const effectiveScrolled = resolveScrolled(scrolled, transparentBeforeScroll);
  const { ref: navRef, overflowing } = useNavOverflow<HTMLElement>();

  return (
    <header
      data-surface={headerSurface(heroSurface, effectiveScrolled)}
      data-scrolled={effectiveScrolled}
      className={cn(
        "ui-header fixed inset-x-0 top-0 z-[var(--z-header)] border-b text-fg",
        hideOnScroll && "transition-transform duration-300",
        hideOnScroll && hiddenByScroll && "-translate-y-full",
      )}
    >
      <Container>
        <div className="flex h-header items-center justify-between gap-6">
          <Link
            href="#hero"
            className="inline-flex shrink-0 items-center gap-2.5 font-heading text-h3 whitespace-nowrap"
            onClick={closeMenu}
          >
            <BrandMark mark={brandMark} alt={brandName} />
            <span className="hidden sm:inline">{brandName}</span>
          </Link>

          <nav
            ref={navRef}
            className={cn(
              "no-scrollbar hidden min-w-0 overflow-x-auto lg:block",
              overflowing && "invisible pointer-events-none",
            )}
            aria-label="Основная навигация"
          >
            <ul className="flex items-center gap-5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-caption font-medium uppercase tracking-[0.08em] whitespace-nowrap transition-colors hover:text-fg",
                      item.href === activeHref ? "text-accent" : "text-fg-muted",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-3">
            {showThemeToggle ? (
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
            ) : null}

            <HeaderCtaGroup actions={actions} />

            <BurgerButton
              open={menuOpen}
              onClick={toggleMenu}
              forceVisible={overflowing}
            />
          </div>
        </div>
      </Container>

      <MobileNav
        nav={nav}
        actions={actions}
        menuOpen={menuOpen}
        closeMenu={closeMenu}
        activeHref={activeHref}
      />
    </header>
  );
}

export default Atelier;
