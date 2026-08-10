import Link from "next/link";
import { cn } from "@/lib/cn";
import type { CtaLink } from "@/types/site";

interface BottomBarProps {
  legalName: string;
  links: CtaLink[];
  note?: string;
  /** Текст реквизитов (ИНН/ОГРН и т.п.) — построчно под копирайтом. */
  legal?: string[];
  className?: string;
}

/**
 * Нижняя строка футера: копирайт (+ опциональная дисклеймер-строка и
 * реквизиты) слева, юридические ссылки справа. Общий кусок для
 * колончатых вариантов (Bold/Classic/Monogram) — в Default та же идея
 * устроена немного иначе (свой собственный блок с footer.legal),
 * поэтому Default его не использует.
 */
export function BottomBar({ legalName, links, note, legal = [], className }: BottomBarProps) {
  const year = new Date().getFullYear();

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-t border-rule py-8 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div>
        {note ? <p className="measure text-small text-fg-muted">{note}</p> : null}
        <p className={cn("tabular text-small text-fg-muted", note && "mt-1.5")}>
          © {year} {legalName}
        </p>
        {legal.map((line) => (
          <p key={line} className="tabular mt-1.5 text-small text-fg-muted">
            {line}
          </p>
        ))}
      </div>

      {links.length > 0 ? (
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-small text-fg-muted transition-colors hover:text-fg"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default BottomBar;
