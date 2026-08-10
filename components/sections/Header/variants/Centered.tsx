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
 * Минималистичный хедер в две строки: знак и навигация центрированы.
 * Пока список ссылок помещается в одну строку — без кнопки и без
 * бургера, просто центрированный ряд. Если пунктов слишком много для
 * одной строки (см. useNavOverflow — как и у остальных хедеров, а не
 * flex-wrap: с fixed-хедером перенос на 2-3 строки увеличивает высоту
 * хедера без изменения scroll-margin-top секций и накрывает контент
 * hero), ряд прячется и вместо него — бургер с той же выезжающей
 * панелью, что и у остальных дизайнов. Активный пункт (жирный) —
 * тот же scroll-spy через useActiveNav/activeHref, что и в остальных
 * хедерах шаблона.
 */
export function Centered({
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
        <div className="relative flex flex-col items-center gap-4 py-6">
          <div className="absolute top-6 right-0 flex items-center gap-3">
            {showThemeToggle ? <ThemeToggle /> : null}
            {overflowing ? (
              <BurgerButton open={menuOpen} onClick={toggleMenu} forceVisible />
            ) : null}
          </div>

          <Link href="#hero" className="font-heading text-h3 tracking-wide">
            {brandName}
          </Link>

          <nav
            ref={navRef}
            aria-label="Основная навигация"
            className={cn(
              "no-scrollbar overflow-x-auto",
              // При переполнении нав прячем через invisible (не hidden —
              // иначе clientWidth обнулится и useNavOverflow больше не
              // сможет засечь, что место наконец появилось, см. коммент
              // в useNavOverflow.ts), но ещё и вынимаем его из потока
              // (absolute), иначе invisible-нав всё равно занимает свою
              // строку в flex-col и под шапкой остаётся пустая полоса
              // высотой в строку навигации.
              overflowing
                ? "invisible pointer-events-none absolute inset-x-0 top-full"
                : "static w-full",
            )}
          >
            <ul className="mx-auto flex w-fit items-center gap-x-8">
              {nav.map((item) => (
                <li key={item.href} className="shrink-0">
                  <Link
                    href={item.href}
                    className={cn(
                      "text-caption font-medium tracking-wide uppercase transition-colors hover:text-fg",
                      item.href === activeHref ? "text-fg" : "text-fg-muted",
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

export default Centered;
