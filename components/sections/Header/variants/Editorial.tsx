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
 * Хедер семейства `editorial`: вордмарк и навигация набраны капителью с
 * разрядкой — тем же начертанием, что колонтитул раздела в
 * components/ui/EditorialHeader. Никакого подчёркивания активного
 * пункта: активность показывает цвет, как в `compact`, потому что
 * подчёркивание тут спорило бы с волосяной линейкой под самим баром.
 *
 * Единственный вариант хедера, который сознательно НЕ прозрачен до
 * скролла: линейка под баром — часть приёма (она продолжает линейку
 * колонтитула первого экрана), а прозрачный хедер её показать не может.
 * Поэтому `transparentBeforeScroll` тут игнорируется, а не читается:
 * молча уважить его значило бы отдать половину раскладки полю конфига,
 * которое к этому семейству не относится.
 *
 * Кнопка — общий `HeaderCtaGroup`: форму кнопки (радиус, регистр, тень)
 * задаёт тариф через `.ui-button`, и вариант не имеет права её
 * переопределять — иначе кнопка перестаёт отличаться между «Экономом» и
 * «Стандартом».
 */
export function Editorial({
  brandName,
  brandMark,
  nav,
  actions,
  showThemeToggle,
  heroSurface,
  hideOnScroll,
}: HeaderProps) {
  const { scrolled, hiddenByScroll, menuOpen, toggleMenu, closeMenu, activeHref } =
    useHeaderState(nav);
  // false вторым аргументом — «считать прокрученным всегда»: см. шапку
  // файла, бар в этом семействе непрозрачен с первого кадра.
  const effectiveScrolled = resolveScrolled(scrolled, false);
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
            className="inline-flex shrink-0 items-center gap-2 text-caption font-bold uppercase tracking-[0.14em] whitespace-nowrap"
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
            {/* Разрядка навигации 0.08em, а не 0.14em как у вордмарка, и
                gap без xl-прибавки — это не вкусовая правка, а замер.
                Вордмарк один, ширина ему не жмёт; навигация — это восемь
                подписей в ряд, и на демо-данных полная разрядка с
                xl:gap-8 давала 905px при доступных 806. Хедер честно
                прятал меню в бургер (useNavOverflow), то есть на 1440
                десктопной навигации не было вовсе — при том, что все
                восемь остальных вариантов хедера туда влезают (741–818px).
                Текущая пара даёт 773px, запас 33px. Разрядка при этом
                читается: 0.08em на 13px — это всё ещё капитель, а не
                обычный набор. */}
            <ul className="flex items-center gap-5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "text-caption font-medium uppercase tracking-[0.08em] whitespace-nowrap transition-colors hover:text-fg",
                      item.href === activeHref ? "text-fg" : "text-fg-muted",
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

export default Editorial;
