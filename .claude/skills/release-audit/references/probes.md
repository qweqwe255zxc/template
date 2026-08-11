# Пробы для браузера

Выполнять через `mcp__claude-in-chrome__javascript_tool` на открытой странице (`/` или `/qa-audit/<секция>`).
Ширину задавать `mcp__claude-in-chrome__resize_window` перед каждым прогоном: **390 / 768 / 1024 / 1440 / 1920**.

Пробы дают числа. Числа не заменяют скриншот: композицию («смотрится несуразно», «дыра в сетке», «фото на разной высоте») ловит только глаз. Снимай `computer` screenshot на каждой ширине.

---

## 1. Горизонтальное переполнение

Любой ненулевой результат — блокер. Возвращает виновников, а не только факт.

```js
(() => {
  const vw = document.documentElement.clientWidth;
  const out = [];
  for (const el of document.body.querySelectorAll("*")) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right > vw + 1 || r.left < -1) {
      // виноват самый верхний элемент цепочки, вложенные — следствие
      if (out.some((o) => o.el.contains(el))) continue;
      out.push({ el, sel: el.tagName.toLowerCase() + "." + (el.className || "").toString().slice(0, 80),
                 left: Math.round(r.left), right: Math.round(r.right) });
    }
  }
  return {
    vw,
    scrollWidth: document.documentElement.scrollWidth,
    overflows: out.length,
    top: out.slice(0, 12).map(({ sel, left, right }) => ({ sel, left, right })),
  };
})();
```

## 2. Выравнивание карточек внутри ряда

Группирует прямых детей контейнера по `offsetTop` (= один ряд) и сравнивает высоты. Селектор контейнера подставить свой (`[data-section="features"] .grid` и т. п.).

```js
((sel) => {
  const rows = new Map();
  for (const el of document.querySelectorAll(sel + " > *")) {
    const r = el.getBoundingClientRect();
    const key = Math.round(r.top / 4) * 4;
    (rows.get(key) ?? rows.set(key, []).get(key)).push(Math.round(r.height));
  }
  return [...rows.entries()].map(([top, hs]) => ({
    top, count: hs.length, heights: hs, ragged: Math.max(...hs) - Math.min(...hs) > 1,
  }));
})("СЕЛЕКТОР_СЕТКИ");
```

`ragged: true` — карточки одного ряда разной высоты.

## 3. Линии внутри карточек

Проверяет, что одноимённые внутренние блоки соседних карточек стоят на одной вертикали (иконки, заголовки, фото, кнопки).

```js
((cardSel, partSel) => {
  const tops = [...document.querySelectorAll(cardSel)].map((c) => {
    const p = c.querySelector(partSel);
    return p ? Math.round(p.getBoundingClientRect().top - c.getBoundingClientRect().top) : null;
  });
  return { tops, aligned: new Set(tops).size <= 1 };
})("СЕЛЕКТОР_КАРТОЧКИ", "СЕЛЕКТОР_ЭЛЕМЕНТА_ВНУТРИ");
```

## 4. Обрезанный текст

Находит элементы, где содержимое реально не помещается: `line-clamp`, `truncate`, `overflow: hidden` со срезом.

```js
(() => {
  const out = [];
  for (const el of document.body.querySelectorAll("p, span, h1, h2, h3, h4, li, div")) {
    if (el.children.length > 0) continue;
    const cs = getComputedStyle(el);
    const clamped = cs.webkitLineClamp !== "none" && cs.webkitLineClamp !== "";
    const cut = el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
    if ((clamped || cs.textOverflow === "ellipsis" || cs.overflow === "hidden") && cut) {
      out.push({ text: el.textContent.trim().slice(0, 60), clamp: cs.webkitLineClamp,
                 overflow: cs.overflow, cls: (el.className || "").toString().slice(0, 60) });
    }
  }
  return { count: out.length, items: out.slice(0, 15) };
})();
```

## 5. Число колонок в сетке (перестроение 4→2→1)

```js
((sel) => {
  const g = document.querySelector(sel);
  return g ? { width: Math.round(g.getBoundingClientRect().width),
               columns: getComputedStyle(g).gridTemplateColumns } : "не найдено";
})("СЕЛЕКТОР_СЕТКИ");
```

На 390px в `columns` должно быть одно значение. Три-четыре узких значения — сетка не схлопнулась.

## 6. Фиксированные высоты в рантайме

Ловит то, что grep по классам не видит (инлайн-стили, значения из компонентов).

```js
(() => {
  const out = [];
  for (const el of document.body.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    for (const prop of ["height", "minHeight", "maxHeight", "width", "minWidth"]) {
      const v = el.style[prop];
      if (v && /px|rem/.test(v)) out.push({ prop, v, cls: (el.className || "").toString().slice(0, 60) });
    }
  }
  return { count: out.length, items: out.slice(0, 20) };
})();
```

## 7. Контраст текста (WCAG AA)

Грубая проверка: считает контраст текста к ближайшему непрозрачному фону. Порог — 4.5 для основного текста, 3.0 для крупного (≥24px или ≥18.66px bold).

```js
(() => {
  const lum = (c) => { const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const rgb = (s) => (s.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);
  const bgOf = (el) => { let n = el; while (n) { const b = getComputedStyle(n).backgroundColor;
    if (b && !/rgba\(0, 0, 0, 0\)|transparent/.test(b)) return rgb(b); n = n.parentElement; } return [255, 255, 255]; };
  const out = [];
  for (const el of document.body.querySelectorAll("p, span, a, h1, h2, h3, h4, li, button, label, small")) {
    if (el.children.length || !el.textContent.trim()) continue;
    const cs = getComputedStyle(el);
    const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700;
    const L1 = lum(rgb(cs.color)), L2 = lum(bgOf(el));
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
    if (ratio < need) out.push({ text: el.textContent.trim().slice(0, 40), ratio: +ratio.toFixed(2), need,
                                 color: cs.color, size });
  }
  return { fails: out.length, items: out.slice(0, 15) };
})();
```

Прогонять и в светлой, и в тёмной теме, и отдельно на секциях `ink` / `accent` — там пары цветов переопределяются через `[data-surface]`.

## 8. Дев-предупреждения шаблона

Каждое `console.warn` из секции = ошибка в `content/site.config.ts` (вариант молча откатился на дефолт).

```
mcp__claude-in-chrome__read_console_messages, pattern: "warn|Warning|variant|fallback"
```

## 9. Тупиковые ссылки и якоря

```js
(() => {
  const bad = [...document.querySelectorAll("a")]
    .map((a) => ({ href: a.getAttribute("href"), text: a.textContent.trim().slice(0, 30) }))
    .filter(({ href }) => !href || href === "#" || (href.startsWith("#") && href.length > 1 && !document.querySelector(href)));
  return { count: bad.length, bad };
})();
```
