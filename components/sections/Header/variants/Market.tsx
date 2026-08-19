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
 * Хедер семейства `market`: вордмарк капслоком слева, навигация по
 * центру АКЦЕНТНЫМ цветом, кнопка справа.
 *
 * Цветная навигация — единственная в каталоге, и это главный
 * различитель варианта. В остальных десяти хедерах меню набрано
 * приглушённым, а акцент достаётся максимум активному пункту; здесь
 * акцентны ВСЕ пункты, а активный отличается тем, что становится
 * обычным цветом текста, то есть темнеет. Так это сделано и в исходном
 * приёме: оранжевое меню на кремовой полосе — часть того же решения,
 * по которому в этом семействе цветные и заголовки разделов, и цифры,
 * и иконки.
 *
 * Подчёркивания активного пункта нет. Линия под подписью в баре, где
 * все подписи и так цветные, читается вторым уровнем выделения на
 * ровном месте.
 *
 * Вордмарк капслоком, но обычного веса и без разрядки: разрядка тут
 * ушла в бегущую строку и в подписи реквизитов, а знак должен остаться
 * плотным — в исходнике это компактный тяжёлый логотип, а не растянутая
 * строка.
 *
 * Про раскладку: `justify-between`, а не три зоны грида. Причина
 * замерена и подробно расписана в `Header/atelier`: при восьми пунктах
 * меню занимает середину целиком, а боковые `1fr`-треки схлопываются к
 * min-content и перестают быть равными, то есть честного центрирования
 * всё равно не выходит. Разрядка меню 0.06em и `gap-5` — из той же
 * серии замеров: с полной капительной разрядкой восемь подписей не
 * влезают в 1440, `useNavOverflow` прячет меню в бургер, и десктопной
 * навигации не остаётся вовсе.
 *
 * Итоговый замер на 1440 (демо-конфиг, восемь пунктов): вордмарк 140,
 * меню 763, кнопки 385 при доступных 1368 — запас 32px. Правишь
 * разрядку, gap или кегль — перемеряй: запас тут меньше одного пункта
 * меню.
 */
export function Market({
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
            className="inline-flex shrink-0 items-center gap-2.5 font-heading text-h3 uppercase whitespace-nowrap"
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
                      "text-caption font-semibold uppercase tracking-[0.06em] whitespace-nowrap transition-colors",
                      item.href === activeHref
                        ? "text-fg"
                        : "text-accent hover:text-fg [[data-surface=accent]_&]:text-fg [[data-surface=ink]_&]:text-fg",
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

export default Market;
