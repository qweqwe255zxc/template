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
 * Жирный вордмарк слева, навигация и кнопка сгруппированы одним блоком
 * справа (а не разнесены по трём зонам, как в Default) — так первый
 * пункт навигации визуально «продолжает» кнопку, а не теряется в
 * пустоте по центру.
 */
export function Bold({
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

          <div className="flex min-w-0 items-center gap-8">
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
                        "text-small font-medium whitespace-nowrap transition-colors hover:text-fg",
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

              <BurgerButton open={menuOpen} onClick={toggleMenu} forceVisible={overflowing} />
            </div>
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

export default Bold;
