import type { Metadata } from "next";
import Link from "next/link";

/**
 * Стенд живёт в шаблоне постоянно: на нём смотрят и сравнивают варианты
 * секций. В клиентский проект он уезжать не должен — удаляется каталог
 * app/qa-audit/ целиком перед сдачей (см. README и CLAUDE.md §5).
 * noindex здесь и disallow в app/robots.ts — страховка на случай, если
 * демо всё-таки выложили с ним.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const pages = [
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
  "header",
  "footer",
  // Стенды семейств целиком, а не одной секции: вся страница одним
  // приёмом. См. комментарии в app/qa-audit/editorial/page.tsx,
  // app/qa-audit/product/page.tsx и app/qa-audit/atelier/page.tsx.
  "editorial",
  "product",
  "atelier",
];

export default function QaIndexPage() {
  return (
    <main style={{ padding: 32, fontFamily: "monospace" }}>
      <h1>QA harness — стенд адаптивности</h1>
      <p>Каждая страница рендерит все варианты секции подряд. Удалить перед сдачей клиенту.</p>
      <ul>
        {pages.map((p) => (
          <li key={p}>
            <Link href={`/qa-audit/${p}`}>{p}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
