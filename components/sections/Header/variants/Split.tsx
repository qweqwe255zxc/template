"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { BurgerButton } from "../parts/BurgerButton";
import { headerSurface, resolveScrolled } from "../parts/headerSurface";
import { MobileNav } from "../parts/MobileNav";
import { useHeaderState } from "../parts/useHeaderState";
import { useNavOverflow } from "../parts/useNavOverflow";
import type { HeaderProps } from "../types";

/**
 * Навигация разбита на два кластера, вордмарк — сам по себе пункт по
 * центру между ними (отдельного знака слева нет). Без CTA и переключателя
 * темы в общей строке — как и в `centered`, они бы конкурировали за
 * ширину с nav и заставляли вордмарк обрезаться первым (было именно так
 * в прежней версии с 3-колоночным grid и невидимым зеркалом правого
 * блока: https://.../ — при переполнении левая колонка теряла место под
 * знак, а бургер оставался виден даже при полностью помещающемся nav).
 * Тема доступна в углу всегда, CTA — в выезжающей панели вместе с
 * остальной навигацией.
 */
export function Split({
  brandName,
  nav,
  actions,
  showThemeToggle,
  heroSurface,
  transparentBeforeScroll,
  hideOnScroll,
}: HeaderProps) {
  const { scrolled, hiddenByScroll, menuOpen, toggleMenu, closeMenu, activeHref } = useHeaderState(nav);
  const effectiveScrolled = resolveScrolled(scrolled, transparentBeforeScroll);
  const { ref: navRef, overflowing } = useNavOverflow<HTMLElement>();
  const mid = Math.ceil(nav.length / 2);
  const left = nav.slice(0, mid);
  const right = nav.slice(mid);

  return (
    <header
      data-surface={headerSurface(heroSurface, effectiveScrolled)}
      data-scrolled={effectiveScrolled}
      className={cn(
        "ui-header fixed inset-x-0 top-0 z-[var(--z-header)] text-fg",
        effectiveScrolled ? "border-b border-rule" : "border-b border-transparent",
        hideOnScroll && "transition-transform duration-300",
        hideOnScroll && hiddenByScroll && "-translate-y-full",
      )}
    >
      <Container>
        <div className="relative flex h-header items-center justify-center">
          <div className="absolute inset-y-0 right-0 flex items-center gap-3">
            {showThemeToggle ? (
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
            ) : null}

            <BurgerButton open={menuOpen} onClick={toggleMenu} forceVisible={overflowing} />
          </div>

          {/* Ниже lg сам nav скрыт целиком (lg:flex) — вордмарк
              единственный элемент в потоке и остаётся центрированным
              этим же flex-контейнером. truncate + max-w не даёт ему
              наехать на угловой кластер на самых узких телефонах. */}
          <Link
            href="#hero"
            className={cn(
              "max-w-[calc(100%-5rem)] truncate font-heading text-h3 font-bold uppercase",
              !overflowing && "lg:hidden",
            )}
            onClick={closeMenu}
          >
            {brandName}
          </Link>

          <nav
            ref={navRef}
            className={cn(
              "no-scrollbar hidden min-w-0 items-center gap-4 overflow-x-auto lg:flex xl:gap-6",
              overflowing && "invisible pointer-events-none",
            )}
            aria-label="Основная навигация"
          >
            <ul className="flex items-center gap-4 xl:gap-6">
              {left.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "border-b-2 pb-1 text-small whitespace-nowrap transition-colors hover:text-fg",
                      item.href === activeHref
                        ? "border-accent text-accent"
                        : "border-transparent text-fg-muted",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="#hero"
              className="max-w-[16rem] shrink-0 truncate font-heading text-h3 font-bold uppercase"
            >
              {brandName}
            </Link>

            <ul className="flex items-center gap-4 xl:gap-6">
              {right.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "border-b-2 pb-1 text-small whitespace-nowrap transition-colors hover:text-fg",
                      item.href === activeHref
                        ? "border-accent text-accent"
                        : "border-transparent text-fg-muted",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
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

export default Split;
