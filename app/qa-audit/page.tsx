import type { Metadata } from "next";
import Link from "next/link";
import { FAMILY_ORDER, SECTION_ORDER } from "./_lib";

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

export default function QaIndexPage() {
  return (
    <main style={{ padding: 32, fontFamily: "monospace", maxWidth: 720 }}>
      <h1>QA harness — стенд адаптивности</h1>
      <p>
        Два разных способа смотреть каталог — не путать друг с другом (см.
        _lib.tsx).
      </p>

      <h2>По разделам</h2>
      <p>
        Каждая страница рендерит все варианты ОДНОГО типа секции подряд —
        сравнение раскладок между собой.
      </p>
      <ul>
        {SECTION_ORDER.map((p) => (
          <li key={p}>
            <Link href={`/qa-audit/${p}`}>{p}</Link>
          </li>
        ))}
      </ul>

      <h2>По вариантам</h2>
      <p>
        Каждая страница — весь сайт (хедер + 12 секций + футер, где
        применимо) собранный ОДНИМ сквозным семейством варианта
        (CLAUDE.md §2.15–2.18): не сравнение раскладок, а уже готовая
        сборка сайта этим приёмом целиком.
      </p>
      <ul>
        {FAMILY_ORDER.map((p) => (
          <li key={p}>
            <Link href={`/qa-audit/${p}`}>{p}</Link>
          </li>
        ))}
      </ul>

      <p>
        На каждой странице внизу — панель «назад / вперёд», листающая внутри
        своей группы (разделы отдельно от вариантов). Удалить перед сдачей
        клиенту.
      </p>
    </main>
  );
}
