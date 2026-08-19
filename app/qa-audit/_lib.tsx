import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Временный QA-стенд для аудита адаптивности (см. .claude/plans).
 * Не является частью продукта — удаляется после аудита.
 */
export function QaLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        background: "#000",
        color: "#39ff14",
        fontFamily: "monospace",
        fontSize: 13,
        lineHeight: 1.4,
        padding: "6px 16px",
        letterSpacing: "0.02em",
        wordBreak: "break-all",
      }}
    >
      {children}
    </div>
  );
}

export function QaBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <>
      <QaLabel>{label}</QaLabel>
      {children}
    </>
  );
}

/**
 * Два независимых обхода стенда, а не один общий список. "Раздел" —
 * страница, показывающая все варианты ОДНОГО типа секции (Hero, Stats,
 * Header...). "Вариант" — страница, показывающая ВЕСЬ сайт (хедер +
 * 12 секций + футер, где применимо), собранный ОДНИМ сквозным
 * семейством варианта (CLAUDE.md §2.15–2.18). Это разные оси навигации:
 * смешивать их в одну цепочку "вперёд/назад" вводит в заблуждение —
 * editorial/product/atelier выглядят как ещё один "раздел", хотя это
 * готовая сборка сайта, а не тип секции. Источник истины и для QaNav, и
 * для /qa-audit (см. app/qa-audit/page.tsx).
 */
export const SECTION_ORDER = [
  "header",
  "footer",
  "hero",
  "stats",
  "features",
  "about",
  "steps",
  "gallery",
  "testimonials",
  "team",
  "faq",
  "pricing",
  "cta",
  "contact",
] as const;

/**
 * Только семейства, закрытые ЦЕЛИКОМ — вариант с этим именем есть у
 * всех 12 секций конфига (у header/footer — где применимо: у
 * sticky-split варианта хедера/футера нет, см. §2.15). Частично
 * повторяющиеся имена ("cards", "split", "centered" и т.п.) сюда не
 * попадают — для них нет единой сборки сайта, только сравнение внутри
 * своего раздела.
 */
export const FAMILY_ORDER = [
  "sticky-split",
  "editorial",
  "product",
  "atelier",
  "market",
] as const;

export type SectionSlug = (typeof SECTION_ORDER)[number];
export type FamilySlug = (typeof FAMILY_ORDER)[number];
export type QaSlug = SectionSlug | FamilySlug;

function chainFor(slug: QaSlug) {
  if ((FAMILY_ORDER as readonly string[]).includes(slug)) {
    return { order: FAMILY_ORDER as readonly string[], kind: "по вариантам" };
  }
  return { order: SECTION_ORDER as readonly string[], kind: "по разделам" };
}

/**
 * Плавающая панель "назад / список / вперёд" — один и тот же компонент
 * на каждой странице стенда, только с разным `current`. Цепочка
 * выбирается по тому, к какому из двух списков принадлежит `current`:
 * разделы листаются между собой, семейства — между собой, друг в друга
 * кнопки не перетекают. Внутри своей цепочки — по кругу: с последней
 * страницы "вперёд" возвращает на первую.
 */
export function QaNav({ current }: { current: QaSlug }) {
  const { order, kind } = chainFor(current);
  const index = order.indexOf(current);
  const prev = order[(index - 1 + order.length) % order.length];
  const next = order[(index + 1) % order.length];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        gap: 12,
        background: "#000",
        borderRadius: 8,
        padding: "8px 14px",
        fontFamily: "monospace",
        fontSize: 13,
        boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
      }}
    >
      <Link href={`/qa-audit/${prev}`} style={{ color: "#39ff14" }}>
        ← {prev}
      </Link>
      <span style={{ color: "#555" }}>
        {kind} · {index + 1}/{order.length}
      </span>
      <Link href="/qa-audit" style={{ color: "#fff" }}>
        список
      </Link>
      <span style={{ color: "#555" }}>|</span>
      <Link href={`/qa-audit/${next}`} style={{ color: "#39ff14" }}>
        {next} →
      </Link>
    </div>
  );
}
