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
 * Корпоративный хедер: жирный вордмарк, навигация с активной ссылкой,
 * подчёркнутой сразу (не только на hover), и двухуровневые actions —
 * тихая текстовая ссылка (`variant: "quiet"` в конфиге) рядом с
 * акцентной кнопкой. Активный пункт — тот же scroll-spy через
 * useActiveNav/activeHref, что и в остальных хедерах шаблона.
 */
export function Classic({
  brandName,
  brandMark,
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
  const quiet = actions.filter((action) => action.variant === "quiet");
  const buttons = actions.filter((action) => action.variant !== "quiet");

  return (
    <header
      data-surface={headerSurface(heroSurface, effectiveScrolled)}
      data-scrolled={effectiveScrolled}
      className={cn(
        "ui-header fixed inset-x-0 top-0 z-[var(--z-header)] text-fg",
        "border-b",
        hideOnScroll && "transition-transform duration-300",
        hideOnScroll && hiddenByScroll && "-translate-y-full",
      )}
    >
      <Container>
        <div className="flex h-header items-center justify-between gap-6">
          <Link
            href="#hero"
            className="inline-flex shrink-0 items-center gap-2 font-heading text-h3 font-bold whitespace-nowrap"
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
            <ul className="flex items-center gap-5 xl:gap-8">
              {nav.map((item) => (
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

          <div className="flex shrink-0 items-center gap-5">
            {showThemeToggle ? (
              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
            ) : null}

            <div className="hidden items-center gap-5 sm:flex">
              {quiet.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="text-small text-fg-muted transition-colors hover:text-fg"
                >
                  {action.label}
                </Link>
              ))}
            </div>

            <HeaderCtaGroup actions={buttons} className="gap-5" />

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

export default Classic;
