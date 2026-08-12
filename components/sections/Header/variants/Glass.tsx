"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/cn";
import { BurgerButton } from "../parts/BurgerButton";
import { HeaderCtaGroup } from "../parts/HeaderCtaGroup";
import { MobileNav } from "../parts/MobileNav";
import { useHeaderState } from "../parts/useHeaderState";
import { useNavOverflow } from "../parts/useNavOverflow";
import type { HeaderProps } from "../types";

/**
 * Единственный вариант со стеклянной подложкой. `.ui-header--glass`
 * (globals.css) локально подменяет `--header-bg` + `--header-blur` —
 * раньше эту пару включал сразу всем хедерам пресет «Стандарт», из-за
 * чего блюр был не выбором, а фоном по умолчанию.
 *
 * `data-scrolled` держим включённым безусловно: шапка обязана
 * выглядеть приподнятой с первого кадра, а не после скролла. Реальный
 * скролл всё равно нужен — от него зависит нижняя линейка.
 */
export function Glass({
  brandName,
  nav,
  actions,
  showThemeToggle,
  hideOnScroll,
}: HeaderProps) {
  const { hiddenByScroll, menuOpen, toggleMenu, closeMenu, activeHref } = useHeaderState(nav);
  const { ref: navRef, overflowing } = useNavOverflow<HTMLElement>();
  const initial = brandName.charAt(0).toUpperCase();

  return (
    <header
      data-surface="paper"
      data-scrolled="true"
      className={cn(
        "ui-header ui-header--glass fixed inset-x-0 top-0 z-[var(--z-header)] text-fg",
        "border-b",
        hideOnScroll && "transition-transform duration-300",
        hideOnScroll && hiddenByScroll && "-translate-y-full",
      )}
    >
      <Container>
        <div className="flex h-header items-center justify-between gap-6">
          <Link
            href="#hero"
            className="inline-flex shrink-0 items-center gap-2.5 font-heading text-h3 font-bold whitespace-nowrap"
            onClick={closeMenu}
          >
            <span
              aria-hidden="true"
              className="flex size-8 items-center justify-center rounded-control bg-accent text-body font-bold text-accent-fg"
            >
              {initial}
            </span>
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
            <ul className="flex items-center gap-5 xl:gap-8">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "border-b-2 pb-1 text-small whitespace-nowrap transition-colors hover:text-fg",
                      item.href === activeHref
                        ? "border-accent text-fg"
                        : "border-transparent text-fg-muted",
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

            <BurgerButton open={menuOpen} onClick={toggleMenu} forceVisible={overflowing} />
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

export default Glass;
