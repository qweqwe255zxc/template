# Система секций

Справочник по тому, что реально в коде: `types/site.ts`,
`components/SectionRenderer.tsx`, `components/sections/*`,
`content/site.config.ts`. Если код и файл разойдутся — верить коду и
поправить файл.

Каждая секция — папка одного устройства: `index.tsx` (роутер по
`variant`), `variants/` (файл на дизайн), `parts/` (общие куски). Как
добавить новый вариант — раздел 7.

Базовые поля секции — `SectionBase` (`types/site.ts:9`): `id`
(обязательное, anchor + key), `surface?`, `number?`, `eyebrow?`,
`title?`, `lead?`, `nav?`, `iconShape?`, `headerAlign?`, `titleStyle?`. Не все
компоненты читают все эти поля — расхождения отмечены в таблицах ниже,
это форма конкретной секции, а не баг.

`nav?` не читается компонентом секции вообще — его использует
`lib/seo.ts:107` (`buildNav`), чтобы собрать меню хедера из секций, где
`nav` задан. Единственное поле уровня страницы, а не компонента.

**`iconShape?: "circle" | "squircle" | "bare"`** — форма плашки
`.icon-tile` для этой секции. Без поля секция берёт сайтвайдный дефолт
из `theme.iconShape` (`ThemeConfig`, необязательное поле, дефолт
`"circle"`) — резолвит их `SectionRenderer.tsx`
(`section.iconShape ?? context.iconShape`) до того, как проп доедет до
компонента. Практически это значит: одну ручку в `theme.iconShape`
достаточно покрутить один раз на весь сайт, а `iconShape` на отдельной
секции нужен только для сознательного исключения из общего правила.
Читают все секции, где есть `.icon-tile`: Features (все варианты),
Gallery `cards-icon`, About `panel`, Pricing (`matrix`/`dark`/`playful`),
Contact `panels`, FAQ (все варианты), Stats (`badge`/`bento`/`photo`/
`rows`), Steps (`rail`/`stack`/`cards`/`cascade`/`split`/
`numbered-cards`). Не читают: Stats `plain` (голая иконка — это сама
суть варианта, отличающая его от `badge`, а не значение по умолчанию)
и Steps `timeline-horizontal` (круглая нода на оси таймлайна — ей нужен
непрозрачный фон, чтобы перекрывать линию под собой; `bare` сломал бы
саму метафору). Инлайновые иконки-глифы рядом с текстом, которые не
являются самостоятельной плашкой (Hero/Testimonials trust-row, About
`badge`/`badgeIcon`, чек-листы Pricing, соцсети Footer/Team, рейтинг
звёздами) эту форму тоже не читают — это часть другого элемента
интерфейса, не `item.icon` в контейнере.

**`titleStyle?: "standard" | "centered"`** — typography-масштаб заголовка
секции (класс `.section-title`/`.section-title-scale`, `app/globals.css`):
`standard` — `text-h2`, `max-width: 22ch`, левый край (дефолт, если поле
не задано вообще ни на секции, ни в `theme`); `centered` — `text-h1`,
`max-width: 46rem`, по центру. Резолвится тем же способом, что и
`iconShape`, но не в JS, а каскадом CSS custom properties: `theme.titleStyle`
(`ThemeConfig`, дефолт `"standard"`) выставляет `data-title-style` на
`<html>` (`app/layout.tsx`), секция с явным `titleStyle` получает свою
обёртку `<div data-title-style>` от `SectionRenderer.tsx` — без неё
атрибут просто наследуется по DOM, JS-резолва не нужно.

Два разных класса читают эти токены по-разному:
- `.section-title` — полный набор (размер+выключка+`max-width`+отступы);
  читают `SectionHeader` (общий для `table`/`band`/`grid`/`rail`/`stack`/
  `timeline-vertical`/`quotes`/`cards`/`columns`/`rows`/`narrow`/`table`
  раскладок — везде, где шапка левая) и CTA `centered`/`boxed`.
- `.section-title-scale` — только размер/кегль, без выключки и
  `max-width`; читают `*Header`-обёртки, у которых выравнивание уже
  решает `headerAlign`/свой JS-переключатель, а не токен: `StatsHeader`,
  `FeaturesHeader`, `StepsHeader`, `GalleryHeader`, `TestimonialsHeader`,
  `TeamHeader`, `PricingHeader`, `CtaBody`.

**Важная ловушка для `centered`/`boxed` CTA.** Раньше их заголовок был
хардкожен `text-h1` внутри своей же центрирующей обёртки (`mx-auto
max-w-[46rem] text-center`) — центр и крупный размер были гарантированы
всегда. Теперь размер и выключка идут из `.section-title`, а он
объявлен прямо на `<h2>`: унаследованный от обёртки `text-center`
проигрывает собственному `text-align` заголовка (наследуемое свойство
всегда проигрывает явному значению на самом элементе, независимо от
специфичности). При дефолтном `titleStyle: "standard"` заголовок CTA
`centered`/`boxed` уменьшится до `text-h2`, сузится до `22ch` и
**перестанет быть центрированным** — текст уйдёт к левому краю своей же
центрированной колонки. Если сайт использует `centered`/`boxed` CTA
(или хочет прежний крупный вид у `*Header`-обёрток) — обязательно
поставить `theme.titleStyle: "centered"` сайтвайдно, либо `titleStyle:
"centered"` на конкретной секции. Это не выбор дизайна «на будущее», а
условие, без которого эти два варианта визуально ломаются на дефолтном
конфиге.

**Колонка «По умолчанию»** для `variant` (и для
`Stats.containerVariant` / `Contact.layout`) везде показывает значение
тарифа «Эконом». Если `variant` не задан в конфиге, его подставляет
`SectionRenderer.tsx` из `lib/preset.ts` по текущему `theme.preset` — в
«Стандарте» это карточные раскладки. Явно указанный `variant` всегда
главнее. Подробно — `docs/presets.md`.

**`fillLastRow?: boolean`** — растягивает карточки последнего неполного
ряда сетки на пустые колонки вместо того, чтобы оставлять хвост ряда
пустым. Дефолт `true`; `false` отключает для конкретной секции. Общая
логика — `lib/gridFill.ts`, `fillLastRowClasses(total, breakpoints)`:
для последнего неполного ряда `emptySlots = cols - (total % cols)`,
растягиваются последние `min(emptySlots, rowItems)` карточек, каждая на
+1 к span, но не больше `col-span-2` суммарно (пример на `cols=4`: 1
item в ряду → одна карточка `col-span-2`, два слота остаются пустыми —
максимум растяжки жёсткий, не «на всю ширину»; 2 item → обе
`col-span-2`, ряд заполнен; 3 item → только последняя `col-span-2`, ряд
заполнен). Bento-варианты (Stats/Features/Gallery/Testimonials/Team)
считают это по «хвосту» после первой крупной карточки, а не по всему
`items`.

Читают **только карточные** grid-варианты — там, где элемент оборачивает
`Card` и число элементов может не делиться на число колонок нацело:

| Секция | Читают | Не читают (не карточные/линейные раскладки) |
|---|---|---|
| Stats | `badge`, `plain`, `bento` | `band`, `grid`, `rows`, `photo` |
| Features | `cards`, `bento` | `table` |
| Steps | `cards`, `cascade`, `numbered-cards` | `rail`, `stack`, `timeline-vertical`, `timeline-horizontal`, `split` |
| Gallery | `grid`, `cards-icon`, `photo-grid`, `photo-bento` | `table` |
| Testimonials | `cards`, `bento`, `rated-cards` | `quotes`, `spotlight` |
| Team | `cards`, `bento` | `columns`, `rows`, `photo-cards`, `badge-avatars`, `tags-cards` (последние три растягивают каждый неполный ряд через `lib/bentoSpan.ts`, не только последний, — `fillLastRow` их не выключает) |
| Pricing | `cards`, `ribbon`, `split`, `dark`, `playful`, `quote`, `glass`, `banner`, `matrix` | `table` |

Не читают варианты, где границы/разделители завязаны на позицию
элемента в сетке (`border-l`/`border-t` по `index % cols`, как у
`Stats.band`/`Stats.rows`/`Features.table`/`Gallery.table`/
`Team.columns`) — растянутая карточка сдвинула бы
позицию всех следующих за ней ячеек и сломала бы это построение. Такие
раскладки вообще не оборачивают элемент в `Card`.

---

## 1. Секции и их props

### Hero — `components/sections/Hero/`, тип `"hero"`

Шесть вариантов. Роутер разрешает `type-only` ↔ `split` через
`resolveHeroLayout` (`widget` сам включает `split`; `split` без
`image`/`widget` откатывается на `type-only`) — для остальных четырёх
`resolved === props.variant`. Несовместимые комбинации полей дают
`console.warn` в dev (без падения).

| Поле | Обязательное | По умолчанию | Примечание |
|---|---|---|---|
| `headline: string[]` | да | — | строки заголовка, переносы вручную |
| `id` | да | — | |
| `surface` | нет | `"paper"` | `centered` держит `"ink"` |
| `variant` | нет | `"type-only"` | см. таблицу вариантов |
| `rail?` | нет | — | колонтитул на левом поле; читают только `type-only`/`split`/`centered` |
| `lead?` | нет | — | |
| `actions?: CtaLink[]` | нет | `[]` | не читает `service` (там поле вместо кнопок) |
| `facts?: HeroFact[]` | нет | `[]` | «шапка дела», 3 факта в ряд |
| `image?` | нет | — | локальный путь `/images/...` (раздел 2); вторая колонка/панель в `split`/`showcase`/`poster`/`service` |
| `widget?: HeroWidget` | нет | — | карточка метрик во второй колонке, **сама включает `split`**. Работает в `showcase` (вместо фото); в `poster`/`service` не рендерится (только фото, dev-warn) |
| — | — | — | `image` и `widget` делят одну колонку: заданы оба → показывается фото, виджет пропускается (dev-warn) |
| `badge?` | нет | — | плашка-анонс над заголовком; только `showcase`/`service` |
| `frame?: "plain"\|"browser"` | нет | `"plain"` | оправа медиа-панели `showcase`; `browser` рисует полосу окна поверх фото |
| `proof?: HeroProof` | нет | — | строка доверия под кнопками (аватары + фраза); только `showcase` |
| `search?: HeroSearch` | нет | — | настоящая форма `method="get"`; только `service`, обязательна для него |
| `trust?: HeroTrust` | нет | — | строка «нам доверяют» (текст+иконка, не логотипы); только `service` |
| `overlay?: HeroOverlay` | нет | — | отзыв поверх фото; только `service`, требует `image` |
| `number`, `eyebrow`, `title`, `nav` | — | — | **не используются Hero** — заголовок только из `headline` |

**Варианты:**

| Значение | Раскладка | Требует |
|---|---|---|
| `type-only` | голая типографика, рельс слева | — |
| `split` | текст слева, фото/виджет справа (1/6/5); потолок H1 48px | `image` или `widget`, иначе откат на `type-only` |
| `centered` | центрированная афиша на тёмной земле, без второй колонки | — (image/widget не рендерятся, dev-warn) |
| `showcase` | витрина 6/6: `badge`, медиа в `Card variant="elevated"` справа, `proof` под кнопками | `image` или `widget` (dev-warn) |
| `poster` | афиша во всю ширину: акцентная панель слева без `Container`, фото встык справа | `image` обязателен (не widget) |
| `service` | сервисный экран 7/5: поиск вместо кнопок, `trust`, фото с `overlay` | `image` обязателен (не widget) |

Общие куски (`HeroPanel`, `HeroProof`, `HeroSearch`, `HeroTrust`,
`HeroOverlay`, `headlineScale.ts`) лежат в `Hero/parts/`.

Все шесть вариантов идут со `spacing="hero"` у `Section` — отдельная
ступень ритма, а не `"lg"`: верхний отступ (`--space-hero-top`) выкупает
высоту фиксированного хедера, нижний (`--space-hero`) тише секционного.
CTA остаётся на `"lg"`. Раньше налог на хедер прибавлял вручную один
`Hero/Split`, остальные пять жили с 32px воздуха под шапкой.

### Stats — `Stats/`, тип `"stats"`

Семь вариантов. `band`/`grid` — плоские, без заголовка секции (только
`number`, не `eyebrow`/`title`/`lead`). Остальные пять — карточные,
читают заголовок через `parts/StatsHeader.tsx`.

Было семь карточных вариантов — `playful` и `dark` поглощены `badge`/
`plain` как дубликаты (различались только `eyebrowStyle`/`surface`, не
вёрсткой). Не заводить их обратно отдельными `variant`.

| Поле | Обязательное | По умолчанию | Примечание |
|---|---|---|---|
| `items: StatItem[]` (`value`, `label`, `suffix?`, `icon?`, `text?`) | да | — | `icon`/`text` читают только карточные варианты |
| `surface` | нет | `"paper"` | для тёмного блока — `"ink"` на любом карточном варианте, чаще всего на `plain` |
| `variant` | нет | `"band"` | см. ниже |
| `containerVariant: "flat"\|"elevated"\|"bordered"` | нет | `"flat"` | подложка под цифрами; читают **только** `band`/`grid` (карточные сами решают через `Card`). `elevated` = `rounded-card bg-card shadow-md`, `bordered` = рамка акцентом; у обоих снимаются линейки секции |
| `image?` | нет | — | для `variant="photo"`; без него раскладка не рендерится (dev-warn) |
| `number`, `eyebrow`, `title`, `lead` | нет | — | только карточные варианты; `band`/`grid` — только `number` |

**Варианты:**

| Значение | Раскладка | `icon`/`text` |
|---|---|---|
| `band` | плотная полоса 2/4 кол. с разделителями, центр | не читает |
| `grid` | свободная сетка `sm:2 lg:4`, слева | не читает |
| `badge` | эйброу пилюлей + крупный заголовок по центру; плашка `.icon-tile` под иконкой (форма — `iconShape`) | `icon` — плашка; `text` — абзац |
| `plain` | заголовок по центру без пилюли, иконка всегда без плашки (не читает `iconShape` — бареность тут и есть отличие от `badge`), компактные карточки | `icon`, `text` |
| `rows` | заголовок слева, колонки на линейке: иконка (`.icon-tile`, форма — `iconShape`) + подпись, «value+suffix» строкой, описание снизу | `icon` у подписи; `text` — описание |
| `bento` | эйброу по центру, 2 колонки: первая карточка — акцентная рамка по умолчанию (`item.highlight` переопределяет явно, `"accent"` или `"tint"`, на любом элементе — автоматической тонировки последней карточки больше нет, только явный `highlight: "tint"`), остальные `framed`. При нечётном числе `items` последняя растягивается на всю ширину (`md:col-span-2`). Асимметрию spans референса не повторяет (см. раздел 6, «Стандарт — сложный SaaS») | `icon`; `text` заменяет `label` |
| `photo` | фото с заголовком поверх слева, сетка карточек справа | `icon` |

### Features — `Features/`, тип `"features"`

Шесть вариантов. `table`/`cards`/`alternating`/`compact` — заголовок
через `SectionHeader`. `bento` центрирует его через
`parts/FeaturesHeader.tsx`. `sticky-split` собирает шапку сам: она уезжает
в левую колонку и на `lg+` залипает при прокрутке.

Раньше были ещё `cards-cta` и `table-links` — поглощены `cards`/
`table` как дубликаты: отличались только опциональной ссылкой на
элементе, которая и так читается из `item.link`, если задана. `table`
сам рисует стрелку-ссылку в углу ячейки, `cards` — строку «Подробнее»
под текстом и (опционально) кнопку `action` под сеткой. Не заводить
`cards-cta`/`table-links` обратно отдельными `variant`.

| Поле | Обязательное | По умолчанию | Примечание |
|---|---|---|---|
| `items: FeatureItem[]` (`title`, `text`, `icon?`, `points?`, `number?`, `photo?`, `link?`, `tags?`) | да | — | `icon` — ключ `lib/icons.ts`; `link` — читают `table`/`cards`/`bento` (сам решает, показывать ли ссылку/стрелку); `tags` — только `bento` |
| `surface` | нет | `"surface"` | |
| `variant` | нет | `"table"` | см. ниже |
| `columns: 2\|3` | нет | `2` у `table`, `3` у `cards` | читают оба; `bento` игнорирует (сама сетка асимметричная) |
| `action?` | нет | — | кнопка под сеткой; только `cards` |
| `number`, `eyebrow`, `title`, `lead` | нет | — | обычные |
| — | — | — | `photo` рендерится в `aspect-[4/3] overflow-hidden`, не произвольным размером |

**Варианты:**

| Значение | Раскладка | `photo` |
|---|---|---|
| `table` | линейки-разделители; стрелка-ссылка в углу ячейки включается сама, если хотя бы у одного `item` задан `link` (мобильный горизонтальный паддинг тоже включается вместе со стрелкой — иначе ей не хватает места и текст лезет под неё) | форсирует `cards` |
| `cards` | `Card variant="framed"`, сетка `sm:grid-cols-2 lg:grid-cols-3` (или только `sm:grid-cols-2` при `columns:2`) — не `md:grid-cols-3` напрямую, три карточки в ряд между 768–1023px были зажаты; ссылка «Подробнее» и кнопка `action` включаются сами, если заданы | ок |
| `bento` | эйброу по центру, первый элемент во всю ширину с акцентной рамкой (`tags` под описанием), остальные — сетка 2 кол. | ок |
| `sticky-split` | заголовок в колонке 4/12 слева (`lg:sticky` под хедером), список строками на линейках справа. Для длинного перечня 6–10 пунктов | форсирует `cards` |
| `alternating` | чередующиеся ряды фото/текст, лево-право; переворот только на `md+`, ниже фото всегда над текстом. Ряд без `photo` раскладывается редакторской парой 4/7 (заголовок слева, описание справа), а не растягивает текст на 12 колонок | **ок — единственный вариант, построенный вокруг `photo`** |
| `compact` | разлинованная сетка `1 → sm:2 → lg:3` без карточек; вертикальные линейки между колонками через `nth-child` на контейнере. Для 6–9 коротких пунктов. `columns` не читает | форсирует `cards` |

**Если у хотя бы одного `item` задан `photo`, а `variant` — `table`,
`sticky-split` или `compact`** — роутер форсирует `variant="cards"`
(dev-warn), см. раздел 2: рамки там рисует `grid`, а не карточка, и
высота фото произвольного размера ломает сетку. `alternating` в этот
список не входит — она фото ждёт.

### Steps — `Steps/`, тип `"steps"`

Восемь вариантов. `rail`/`stack`/`timeline-vertical` — заголовок через
`SectionHeader`. Пять новых — через свой `parts/StepsHeader.tsx`.

| Поле | Обязательное | По умолчанию | Примечание |
|---|---|---|---|
| `items: StepItem[]` (`number`, `title`, `text`, `meta?`, `icon?`, `photo?`, `featured?`) | да | — | `number` — строка шага («01»), не `SectionBase.number`. `icon`/`photo`/`featured` — только карточные варианты; `rail`/`stack` тоже читают `icon` |
| `surface` | нет | `"paper"` | |
| `variant` | нет | `"rail"` | см. ниже |
| `image?` | нет | — | для `variant="split"`; без него не рендерится (dev-warn) |
| `number`, `eyebrow`, `title`, `lead` | нет | — | обычные |
| — | — | — | `timeline-vertical`: `item.number` — бейдж-нода на оси, шаг — `Card variant="elevated"`; зазор — `padding-bottom` внутри `<li>` (не margin, т.к. ось рисуется абсолютом там же) |

**Варианты:**

| Значение | Раскладка |
|---|---|
| `rail` | 4 колонки на общей линейке; `icon` (`.icon-tile`, форма — `iconShape`) над номером |
| `stack` | та же линейка, 2 колонки |
| `timeline-vertical` | вертикальный таймлайн: бейджи-номера на оси, карточки по сторонам |
| `cards` | эйброу по центру, ряд карточек: плашка `.icon-tile` под иконкой (форма — `iconShape`), «N. Заголовок», описание |
| `cascade` | карточки каскадом, номер — бейдж на углу, иконка — `.icon-tile` (форма — `iconShape`). Тёмная/светлая версия — те же данные на разной поверхности (`surface="ink"` + `photo` даёт мрачный вид) |
| `timeline-horizontal` | горизонтальная линия с круглыми нодами-иконками; первая нода с акцентным кольцом (статичный акцент, не «текущий шаг»). Нода не читает `iconShape` — см. раздел 1, поле `iconShape` |
| `split` | фото с заголовком поверх слева, сетка 2×2 справа с числом-водяным знаком; `featured` красит карточку акцентом; иконка — `.icon-tile` (форма — `iconShape`) |
| `numbered-cards` | ряд карточек: кружок-номер + линия, иконка `.icon-tile` (форма — `iconShape`), заголовок, фото в подвале; `featured` → `ink` |

### Gallery — `Gallery/`, тип `"gallery"` (кейсы)

Пять вариантов. `table`/`grid` — `surface="ink"` по умолчанию
(единственный тёмный блок), заголовок через `SectionHeader`. Три новых
карточных — через `parts/GalleryHeader.tsx` (эйброу + опц. кнопка
`action` справа), по умолчанию `surface="surface"`.

| Поле | Обязательное | По умолчанию | Примечание |
|---|---|---|---|
| `items: CaseItem[]` (`category`, `problem`, `result`, `year`, `status?`, `tags?`, `title?`, `photo?`, `link?`, `icon?`, `date?`, `stats?`) | да | — | опциональные поля — только карточные варианты |
| `note?` | нет | — | сноска под реестром (`table`/`grid`) |
| `surface` | нет | `"ink"` (`table`/`grid`) | карточные — `"surface"` |
| `variant` | нет | `"table"` | см. ниже |
| `action?` | нет | — | кнопка в шапке; только `cards-icon` |
| `status?` (элемент) | нет | — | колонка-статус (`Badge variant="soft"`); появляется, только если задана хотя бы у одного элемента (сетка 3/4/4/1 → 3/3/3/2/1) |
| `tags?: string[]` (элемент) | нет | — | плашки `outline` под категорией; своей колонки не занимают |
| `number`, `eyebrow`, `title`, `lead` | нет | — | обычные |

**Варианты:**

| Значение | Раскладка |
|---|---|
| `table` | строка реестра на всю ширину |
| `grid` | карточки `framed` (`sm:2 lg:3`) |
| `cards-icon` | шапка с кнопкой, карточки: иконка в плашке, год, заголовок, `problem`, ссылка внизу |
| `photo-grid` | эйброу, карточки с фото (категория плашкой поверх), `link`+`date` внизу; без `photo` — текстовая карточка |
| `photo-bento` | эйброу, первый элемент крупный с фото и `stats`, остальные — сетка поменьше |

### Testimonials — `Testimonials/`, тип `"testimonials"`

Пять вариантов. `quotes`/`cards` — заголовок через `SectionHeader`.
`bento`/`rated-cards`/`spotlight` — через `parts/TestimonialsHeader.tsx`.

| Поле | Обязательное | По умолчанию | Примечание |
|---|---|---|---|
| `items: TestimonialItem[]` (`quote`, `author`, `meta?`, `photo?`, `rating?`, `result?`, `featured?`) | да | — | опциональные — только карточные варианты |
| `surface` | нет | `"paper"` | |
| `variant` | нет | `"quotes"` | см. ниже |
| `trust?: HeroTrust` | нет | — | тот же тип, что `Hero.trust`; читают `bento`/`rated-cards`/`spotlight` |
| `title?` | нет | — | без него — `spacing="none"` (только `quotes`/`cards`); при `number: ""` `SectionHeader` не рендерится вовсе |

**Варианты:**

| Значение | Раскладка |
|---|---|
| `quotes` | по цитате в ряд, автор слева, кегль `text-quote` |
| `cards` | `md:grid-cols-3`, `Card variant="framed"`, кегль `text-lead`, подпись прижата `mt-auto` |
| `bento` | эйброу по центру, первый отзыв крупный (рейтинг, автор с фото), остальные — сетка поменьше |
| `rated-cards` | эйброу, ряд карточек: рейтинг, цитата, автор с фото; `featured` → `ink` |
| `spotlight` | заголовок слева, один крупный отзыв в карточке слева, список остальных справа на линейках |

`RatingStars` — 5 звёзд, `aria-hidden` + отдельный `sr-only` текст.
`showPhoto` на `TestimonialBody` по умолчанию `false`.

### Team — `Team/`, тип `"team"`

Семь вариантов. `columns`/`rows`/`cards` — заголовок через
`SectionHeader`. `photo-cards`/`badge-avatars`/`tags-cards` — через
`parts/TeamHeader.tsx`. `bento` строит свою шапку в 2 колонки (как
`About`).

| Поле | Обязательное | По умолчанию | Примечание |
|---|---|---|---|
| `items: TeamMember[]` (`name`, `role`, `focus`, `experience`, `photo?`, `social?`, `tags?`, `link?`) | да | — | опциональные — только карточные варианты |
| `surface` | нет | `"paper"` | |
| `variant` | нет | `"columns"` | см. ниже |
| `image?` | нет | — | фото шапки `variant="bento"` |
| `banner?: TeamBanner` | нет | — | баннер «Хотите к нам?» под сеткой; читают все семь вариантов. Оправу (`soft`/`solid`/`quote`) решает variant по умолчанию (`columns`/`rows`/`cards`/`photo-cards` → `soft`, `badge-avatars` → `solid`, `tags-cards`/`bento` → `quote`), но `banner.tone` переопределяет её явно независимо от variant |
| `number`, `eyebrow`, `title`, `lead` | нет | — | обычные (кроме `bento`) |
| `fillLastRow?` | нет | `true` | растягивает последний неполный ряд (`lib/gridFill.ts`); читают только `cards`/`bento` |
| `heroSpan?: "full"\|"half"` | нет | `"full"` | ширина крупной карточки первого человека; читает только `bento` |
| — | — | — | аватар в `columns`/`rows`/`cards` — единый бокс `aspect-[3/4]`: фото или заглушка-инициалы того же размера |

**Варианты:**

| Значение | Раскладка |
|---|---|
| `columns` | 3 колонки на линейках |
| `rows` | 1 колонка, фото слева фиксированного горизонтального `aspect-[4/3]` (не растягивается по высоте текста — иначе на узкой колонке превращается в вертикальную полосу), содержимое справа |
| `cards` | `sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`, `Card variant="framed"` — дефолт «Стандарта» |
| `photo-cards` | фото во всю ширину карточки, роль акцентом, `social` |
| `badge-avatars` | круглый аватар по центру, роль плашкой, `social` |
| `tags-cards` | квадратное фото, имя+`link` в углу, `tags` |
| `bento` | заголовок слева + фото справа; первый человек крупный с фото/именем поверх (градиент снизу, ширина — `heroSpan`), остальные — сетка поменьше |

### About — `About/`, тип `"about"`

Пять вариантов. `photo` — исходный, через `parts/AboutLayout.tsx`, `photo`
там обязателен; сторону задаёт `photoPosition` ("right" по умолчанию,
"left" — зеркально через `md:order-*`, а не отдельный variant — раньше это
были `photo-right`/`photo-left`, различавшиеся только этим флагом).
`type-only` — единственный без фото вообще (econom, центрированная
типографика). Два split-варианта
(`split-actions`/`quiet-split`) делят общие `parts/AboutTextBlock.tsx`
(колонтитул+заголовок+текст+кнопки) и `parts/AboutMedia.tsx` (медиа-панель,
как `Hero/parts/HeroPanel.tsx`) — отличаются только данными и парой флагов.
`panel` — самостоятельный, самый насыщенный.

Было пять split-вариантов — `badge-split`, `playful` и `dark` поглощены
`split-actions`, который сам решает форму колонтитула по конфигу
(`badge`/`badgeIcon`, `decorative`) и читает `surface`/`frame` для тёмной
версии. Тёмный вид — это `split-actions` + `surface: "ink"` (+ обычно
`frame: "browser"`), не отдельное значение `variant`. Не заводить
`dark`/`playful`/`badge-split` обратно.

| Поле | Обязательное | По умолчанию | Примечание |
|---|---|---|---|
| `text: string[]` | да | — | абзацы, по `<p>` на элемент |
| `photo?` | нет* | — | *обязателен для всех вариантов, кроме `type-only` (dev-warn, если не задан) |
| `photoAlt?` | нет | `title` или `""` | |
| `variant` | нет | `"photo"` | см. таблицу вариантов |
| `photoPosition?: "left"\|"right"` | нет | `"right"` | сторона фото; читает только `photo` |
| `surface` | нет | `"paper"` | тёмный вид — `"ink"` при любом split-варианте, не отдельный variant |
| `actions?: CtaLink[]` | нет | — | кнопки под текстом; не читают `photo`/`type-only`/`panel` |
| `badge?` | нет | — | пилюля вместо подписи с тире; читает только `split-actions` |
| `badgeIcon?` | нет | — | иконка в пилюле; читает только `split-actions` |
| `decorative?` | нет | `false` | акцентные пятна за фото (декоративные, `-z-10`); читает только `split-actions` |
| `frame?: "plain"\|"browser"` | нет | `"plain"` | оправа медиа-панели (как у Hero showcase); читает только `split-actions` |
| `aside?` | нет | — | реплика; читает только `panel` — в текстовой колонке под абзацами, с разделительной линией |
| `photoCaption?` | нет | — | плашка поверх фото снизу слева; читает только `panel` |
| `panel?: AboutPanel` | нет | — | карточка со статами и ссылкой под фото; читает только `panel` |
| `highlights?: AboutHighlight[]` | нет | — | ряд иконка+заголовок+текст под фото; читает только `panel` |
| `number`, `eyebrow`, `title`, `lead` | нет | — | рендерятся в текстовой колонке, не через `SectionHeader` (как Hero); `lead` нигде не читается |

**Варианты:**

| Значение | Раскладка |
|---|---|
| `photo` | текст 5/12 (подпись с тире), фото 7/12, `AboutLayout` — дефолт; `photoPosition="left"` зеркалит раскладку |
| `type-only` | econom: центрированная типографика, без фото и кнопок |
| `split-actions` | текст 5/12 (подпись с тире или пилюля) + кнопки, фото 7/12 в приподнятой карточке; `surface: "ink"` + `frame: "browser"` даёт прежний тёмный вид |
| `quiet-split` | то же, что `split-actions`, но вторая кнопка — текстовая ссылка |
| `panel` | текст 5/12 (заголовок+абзацы+`aside`) слева, фото+`photoCaption`+`panel` (статы) 7/12 справа, `highlights` строкой под всем этим |

Единственная секция с сознательно асимметричной 5/7 раскладкой у
`photo`/split-вариантов; фото `md:h-full` там же, на
мобильном `aspect-[4/3]`.

### FAQ — `FAQ/`, тип `"faq"`

Четыре варианта. `narrow`/`wide` делят общий `parts/FaqBody.tsx` (шапка +
аккордеон, отличаются только шириной контейнера). `split-sidebar` и
`categorized` — самостоятельные раскладки.

| Поле | Обязательное | По умолчанию | Примечание |
|---|---|---|---|
| `items: FaqItem[]` (`question`, `answer`, `icon?`, `tags?`, `category?`) | да | — | через клиентский `components/ui/Accordion`; `tags` рендерятся в `Accordion` независимо от variant |
| `surface` | нет | `"surface"` | |
| `variant` | нет | `"narrow"` | см. ниже |
| `support?: FaqSupport` | нет | — | карточка «Остались вопросы?»; читают все четыре варианта |
| `iconShape?` | нет | — | форма `.icon-tile` карточки `support` — см. раздел 1, `SectionBase.iconShape` |
| `number`, `eyebrow`, `title`, `lead` | нет | — | обычные |

**Варианты:**

| Значение | Раскладка |
|---|---|
| `narrow` | `Container width="narrow"` (760px), `SectionHeader layout="stacked"` (боковое поле слишком узкое для колонтитула) |
| `wide` | Та же шапка+аккордеон, `Container width="page"` (1600px). Имя буквальное — своей двухколоночной раскладки у варианта нет и не было, только контейнер шире |
| `split-sidebar` | Заголовок и `support` слева, аккордеон справа — настоящий двухколоночный split |
| `categorized` | Заголовок пилюлей по центру, фильтр-пилюли по `item.category` (настоящая фильтрация, клиентский стейт), аккордеон карточками с иконкой у вопроса |

### Pricing — `Pricing/`, тип `"pricing"`

Десять вариантов. `table`/`cards` — исходные, через `parts/PlanContent.tsx`
(общее содержимое тарифа для всех вариантов). Восемь новых читают
центрированный заголовок через `parts/PricingHeader.tsx` (как
`TestimonialsHeader`).

| Поле | Обязательное | По умолчанию | Примечание |
|---|---|---|---|
| `items: PricingPlan[]` (`name`, `price`, `features: PricingFeature[]`, `unit?`, `text?`, `action?`, `featured?`, `photo?`, `badge?`, `tag?`, `icon?`) | да | — | `PricingFeature = string \| {text, excluded?}` — `excluded` рисует зачёркнутый пункт с крестиком вместо галки (только там, где включён `checkIcon`, см. ниже); `badge`/`tag`/`icon` — только новые варианты |
| `note?` | нет | — | |
| `surface` | нет | `"paper"` (`dark` → `"ink"`) | |
| `variant` | нет | `"table"` | см. таблицу вариантов |
| `trust?: string` | нет | — | короткая подпись доверия под сеткой; читают `split`/`playful` |
| `footnotes?: PricingFootnote[]` | нет | — | ряд карточек-примечаний под тарифами; читает только `dark` |
| `closing?: PricingClosing` | нет | — | замыкающий блок: тёмный баннер (`banner`) или фото+пункты (`matrix`) |
| `quote?` | нет | — | цитата поверх фото под тарифами (как `HeroOverlay`); читает только `quote` |
| `comparison?: PricingComparison` | нет | — | таблица сравнения тарифов по группам строк; читает только `matrix` |
| `number`, `eyebrow`, `title`, `lead` | нет | — | обычные |
| — | — | — | `photo` на плане — тот же бокс `aspect-[4/3]`, что у Features. **Если у любого `plan` есть `photo` — форсируется `"cards"`**, независимо от `variant` в конфиге (как у Features) |
| — | — | — | **в `content/site.config.ts` сейчас не используется** — компонент существует, но не мёртвый код |

**Варианты:**

| Значение | Раскладка |
|---|---|
| `table` | 3 кол. с разделителями, цена `text-stat`, `featured` подсвечен `border-fg` — дефолт |
| `cards` | `Card variant="framed"`, цена `text-h2`, кнопка `mt-auto` |
| `ribbon` | econom: `tag` над названием, у `featured` — сплошная лента `badge` во всю ширину сверху карточки |
| `split` | текст+`trust` слева (5/12), тёмная панель с карточками справа (7/12); `featured` получает поверхность `accent` |
| `dark` | центрированная шапка на тёмной поверхности, `featured` — поверхность `accent`, ряд `footnotes` под тарифами |
| `playful` | иконка-аватар (`plan.icon`) над названием, `featured` — сплошная поверхность `accent`, `trust`-подпись снизу |
| `quote` | `tag` в каждой карточке, `featured` — мягкая подложка `bg-badge-soft` с плавающей пилюлей, цитата `quote` поверх фото под тарифами |
| `glass` | `tag`, `featured` — поверхность `accent` с лёгким белым бликом поверх (не буквальный радужный градиент референса) |
| `banner` | простые карточки (`featured` — просто `elevated`), тёмный CTA-баннер `closing` (заголовок+кнопки) под ними |
| `matrix` | карточки с `plan.icon`, без чек-листа в данных на практике; `comparison`-таблица и `closing` с фото+пунктами под ними |

Чек-лист тарифа — тире по умолчанию, `checkIcon` (внутренний флаг
`PlanContent`, не поле конфига) включает галку/крестик — им управляет
сам вариант: `ribbon`/`split`/`dark`/`playful`/`quote`/`glass` его
включают, `table`/`cards`/`banner`/`matrix` — нет.

### CTA — `CTA/`, тип `"cta"`

Шесть вариантов. `band`/`quiet` не читают `eyebrow` (заголовок
слева/кнопки справа, `parts/CtaBody.tsx`), отличаются только
вертикальным ритмом. Четыре новых читают `eyebrow` через
`parts/CtaEyebrow.tsx` (пилюля или подпись с точкой).

| Поле | Обязательное | По умолчанию | Примечание |
|---|---|---|---|
| `title?`, `lead?`, `note?` | нет | — | |
| `actions?: CtaLink[]` | нет | `[]` | |
| `surface` | нет | `"accent"` | единственная секция с акцентной заливкой по умолчанию |
| `variant` | нет | `"band"` | см. ниже |
| `number`, `nav` | — | — | **не используются CTA** ни одним вариантом |
| `eyebrow` | нет | — | только `centered`/`left`/`boxed`/`panel` |

**Варианты:**

| Значение | Раскладка |
|---|---|
| `band` | заголовок слева/кнопки справа в строку, `spacing="lg"` — дефолт |
| `quiet` | то же, `spacing="default"` — для повторяющихся CTA |
| `centered` | эйброу пилюлей, всё по центру в одну колонку. **Требует `theme.titleStyle: "centered"`** (раздел 1, «Важная ловушка») — без него заголовок мельче и не центрирован |
| `left` | по левому краю, эйброу точкой, без второй колонки |
| `boxed` | контент в `Card variant="elevated"` поверх акцентной заливки. Тот же **`titleStyle`-риск**, что у `centered` |
| `panel` | текст слева, справа — карточка со списком `actions` строками (`full`) |

### Contact / ContactForm — `ContactForm/`, тип `"contact"`

Единственная `"use client"` секция (стейт формы, антибот-таймер,
honeypot, `fetch("/api/contact")`). `split`/`stacked` — реквизиты через
`parts/ContactDetails.tsx` (линейки). `boxed` — те же данные через
`parts/ContactDetailCards.tsx` (карточка на строку). `panels` не
использует `Container` (полноширинная афиша) и не читает `number`.

| Поле | Обязательное | По умолчанию | Примечание |
|---|---|---|---|
| `fields: ContactFieldConfig[]` | да | — | `type: "select"` требует `options` или `selectOptions` |
| `submitLabel`, `consent`, `successTitle`, `successText`, `errorText` | да | — | тексты формы/тоста |
| `surface` | нет | `"surface"` | |
| `variant` | нет | `"split"` | см. ниже |
| `layout: "plain"\|"cardContainer"` | нет | `"plain"` | подложка под самой формой (не колонки); `cardContainer` — `<form>` в `Card variant="elevated"`. Читают все четыре варианта |
| `order: "form-first"\|"info-first"` | нет | `"form-first"` | порядок формы/реквизитов **только на мобильном** (ниже `lg`, где `split`/`boxed` сворачиваются в одну колонку) — форма первая, реквизиты вторичны. На `lg`+ порядок колонок решает сам variant, ось не действует. Читают только `split`/`boxed`; у `stacked`/`panels` порядок задан вёрсткой напрямую |
| `selectOptions?: {label, value}[]` (поле) | нет | — | пользователь видит `label`, в заявку уходит `value`; приоритетнее `options` |
| `detailsTitle?` | нет | — | заголовок колонки реквизитов; `panels` его не показывает |
| `number`, `eyebrow`, `title`, `lead` | нет | — | обычные, кроме `panels` (без `number`) |
| — | — | — | принимает `contacts: ContactsConfig` отдельно через `context` в `SectionRenderer` (раздел 3) |
| — | — | — | `instagram?`/`instagramHref?`, `whatsapp?`/`whatsappHref?` — отдельные поля; без `*Href` строка не ссылка. В `panels` — только телефон и почта |

**Варианты:**

| Значение | Раскладка |
|---|---|
| `split` | реквизиты слева (5/12), форма справа (7/12) — дефолт всех тарифов |
| `stacked` | одна колонка: реквизиты сверху, форма под ними |
| `boxed` | то же 5/7, реквизиты — сетка карточек |
| `panels` | форма слева, тёмная панель (адрес/телефон/почта+карта) справа, без `Container` |

### Блоки вне `site.config.sections`

`Header`, `Footer`, `NotFound`, `Privacy` живут в `components/sections/`
по тому же устройству папки, но **не проходят через
`SectionRenderer`** и не описаны в union `Section` — их рендерят
напрямую файлы `app/`. Своего `SectionBase` и строки в `lib/preset.ts`
у них нет. `Header`/`Footer` — вариант приходит из отдельных полей
`siteConfig.header.variant` / `siteConfig.footer.variant`.

| Папка | Кто рендерит | Пропсы | Варианты |
|---|---|---|---|
| `Header/` | `app/page.tsx` | `brandName`, `brandMark`, `nav`, `actions`, `showThemeToggle`, `variant?`, `transparentBeforeScroll?` | `default`, `bold`, `classic`, `compact`, `monogram`, `centered`, `glass`, `split` |
| `Footer/` | `app/page.tsx` | `brand`, `contacts`, `footer`, `nav` | `default`, `bold`, `classic`, `compact`, `monogram`, `centered`, `split` (7 — без отдельного `glass`, см. ниже) |
| `NotFound/` | `app/not-found.tsx` | `brand`, `contacts` | `Default` |
| `Privacy/` | `app/privacy/page.tsx` | `brand`, `contacts`, `siteUrl` | `Default` |

`NotFound`/`Privacy` держат один вариант каждый — роутер всё равно
есть, ради единообразия алгоритма добавления (раздел 7).

**Header** (`siteConfig.header.variant`, дефолт `"default"`):

| Значение | Макет |
|---|---|
| `default` | знак слева, навигация по центру, кнопка справа |
| `bold` | жирный вордмарк слева; навигация+кнопка кластером справа |
| `classic` | вордмарк слева, навигация по центру с подчёркнутым активным пунктом, две зоны `actions` |
| `compact` | навигация по центру без подчёркивания активного пункта (только цвет) — тише, чем в Default |
| `monogram` | плашка с инициалом на акцентной заливке вместо `BrandMark` |
| `centered` | знак и навигация в две строки по центру, без кнопки. Список ссылок — центрированный ряд, пока помещается; при переполнении (`useNavOverflow`, тот же хук, что у остальных хедеров) прячется и заменяется бургером с той же выезжающей панелью — не переносится на несколько строк (`flex-wrap`), это раздувало бы высоту fixed-хедера. Переполненный `nav` не просто `invisible` — он ещё и `absolute`, иначе невидимая строка навигации всё равно резервирует высоту в `flex-col`, и под шапкой остаётся пустая полоса |
| `glass` | стеклянный фон включён с первого кадра (не по скроллу). Единственный вариант с блюром: `.ui-header--glass` локально подменяет `--header-bg`/`--header-blur`, поэтому стекло работает одинаково в обоих тарифах и больше не навязывается остальным хедерам пресетом |
| `split` | навигация в два кластера, вордмарк — пункт между ними; без CTA и переключателя темы в общей строке (как в `centered` — тема в углу всегда, CTA только в выезжающей панели). Раньше здесь был 3-колоночный grid с невидимым зеркалом правого блока для симметрии — при переполнении он крал ширину у вордмарка (обрезался до одной буквы) и держал бургер видимым даже когда nav реально помещался; заменён на `relative`-строку с абсолютным правым углом, как у `centered` |

CTA-кнопки в баре хедера (`default`/`bold`/`classic`/`compact`/`monogram`/`glass`) рендерит общий `parts/HeaderCtaGroup.tsx` — без вариант-специфичных оверрайдов формы (радиус/регистр задаёт `.ui-button` и токены пресета, см. Button.tsx). Ниже `sm` видна только одна кнопка — с `variant: "primary"` (или первая, если primary среди `actions` нет), а не буквально `actions[0]`: конфиг обычно кладёт "тихую" CTA первой для десктопного порядка, и на самом узком экране должна остаться самая заметная кнопка, а не та, что просто оказалась первой.

Общие куски: `parts/BurgerButton.tsx`, `parts/MobileNav.tsx`,
`parts/useNavOverflow.ts` (переполнение nav даже на lg+ — переключает на
бургер тем же способом, что и узкий экран, вместо горизонтального
скролла).

`transparentBeforeScroll` (по умолчанию `true`) — до скролла хедер
прозрачный и лежит поверх hero; `false` держит непрозрачный фон/тень с
первого кадра.

**Footer** (`siteConfig.footer.variant`, дефолт `"default"`) — поле
`columns?` читают только `bold`/`classic`/`monogram` (колончатые
раскладки); `social?`/`newsletter?` читают **все семь** вариантов —
без данных вариант просто не рисует соответствующий блок, макет не
ломается:

| Значение | Макет | Где встаёт `newsletter` |
|---|---|---|
| `default` | знак+тег слева, `nav` по центру, реквизиты справа | 4-я колонка верхней сетки (без неё — 3 колонки по `md:col-span-4`, с ней все четыре — `md:col-span-3`) |
| `bold` | вордмарк+описание+`social` слева, `columns` справа | делит правую зону с `columns` (`md:col-span-3`/`4`, по аналогии с `monogram`); без `columns` занимает всю правую зону |
| `classic` | тот же состав, мягче типографика | та же логика долей, что у `bold` |
| `compact` | одна строка: знак+копирайт слева, `links` справа | отдельная строка над основной, с `border-b` — единственный вариант, где newsletter добавляет вторую строку поверх «однострочной» идеи (осознанный компромисс, только если проект явно просит форму именно здесь) |
| `monogram` | плашка на градиенте (или сплошном акценте), `columns`+`newsletter`; `footer.monogramBackground: "gradient"\|"surface"` — раньше это были два отдельных файла (`gradient`/`glass`), отличавшихся только фоном плашки и поверхностью секции | отдельная колонка `md:col-span-3` справа от `columns` |
| `centered` | знак, `nav`, копирайт, `social` — всё по центру | центрированный блок (`max-w-xs`) между `nav` и копирайтом |
| `split` | `nav` в два кластера вокруг вордмарка, копирайт+`social` снизу | центрированный блок (`max-w-xs`) между навигацией и нижней строкой |

Общие куски: `parts/SocialLinks.tsx`, `parts/FooterColumns.tsx`,
`parts/BottomBar.tsx`, `parts/NewsletterForm.tsx` — форма подписки,
`method="get"` как у `HeroSearch`. Перенос строки в
`NewsletterForm` — по содержимому (`flex-wrap`), не по брейкпоинту:
поле берёт почти всё свободное место в ряду (`grow-[999]`), а кнопка
(`grow`) остаётся по размеру контента, пока стоит рядом с полем, и
растягивается на всю ширину блока, когда переносится на свою строку
одна — там ей достаётся весь свободный remainder этой flex-строки.

`Header` — единственный из четырёх с клиентским JS (`"use client"` на
вариантах и `parts/useHeaderState.ts`: мобильное меню, скролл, Escape).
Страницы в `app/` — только обёртки (`metadata` + данные из
`siteConfig`); текст политики лежит в `Privacy/parts/legalBlocks.ts`.

---

## 2. Фото в секциях: обязательное правило

Любая секция, у элемента которой в `types/site.ts` есть `photo?`
(`FeatureItem`, `PricingPlan`, `TeamMember`) — обязана рендерить такие
элементы только через `Card variant="framed"` (или эквивалент с
независимой высотой ячейки) и фиксированный aspect-ratio контейнер
(один и тот же на всех карточках секции). Табличный/бордюрный `variant`
(`Features`/`Pricing` `"table"`) и фото в одном компоненте **не
смешивать никогда** — там рамки рисует сетка (`border-top`/`border-l`),
а не карточка, и она не знает про высоту фото произвольного размера.

Следствие: `Features` и `Pricing` **сами** форсируют `variant="cards"`,
если хотя бы у одного элемента задан `photo`, независимо от конфига
(`console.warn` в dev) — специально, чтобы это нельзя было случайно
сломать. У `Team` нет табличного варианта, но фото и заглушка-инициалы
по той же логике делят один бокс `aspect-[3/4]`.

При добавлении нового типа секции с `photo?` на элементах — это
правило обязательное: без форсирования `variant` и без aspect-ratio
контейнера сетка при смешанных данных поплывёт.

### Источник картинок: только `public/images/`

Все `photo?`, `AboutSection.photo`, `HeroSection.image` — обязаны быть
локальным путём `/images/имя-файла.jpg`, реально лежащим в
`public/images/` проекта. Внешний URL (Unsplash и т.п.) — **нельзя**:
`next.config.ts` не задаёт `images.remotePatterns`, и `next/image` по
умолчанию отклоняет любой внешний хост — ошибка `Invalid src prop...
hostname is not configured` прямо в браузере, только в момент рендера
конкретной секции (легко пропустить при тестировании на локальных
фото). Это осознанный выбор шаблона — не расширять
`images.remotePatterns`. Перед прописыванием `photo`/`image` в конфиг
файл нужно сначала скачать в `public/images/` этого проекта.

---

## 3. Как SectionRenderer сопоставляет конфиг с компонентами

`components/SectionRenderer.tsx` — реестр `{ [K in SectionType]:
Renderer<K> }`: ключ — `type` секции, значение — `(section, context) =>
ReactNode`. Рендер проходит `sections` через `.map`, для каждого берёт
`registry[section.type]` и вызывает с `context = { contacts }` — так
`ContactForm` получает `contacts`, не будучи частью объекта секции.

`Extract<Section, { type: K }>` даёт типобезопасность: пропсы,
доходящие до компонента, соответствуют интерфейсу именно этого типа.

Если `type` не найден в `registry` (опечатка/недобавленный тип) —
`SectionRenderer` не падает: в dev пишет `console.warn` и рендерит
`null` (`SectionRenderer.tsx:75-81`); в проде — тихо `null`.

---

## 4. Неиспользуемые секции: обычный `import`, вручную

В файле — статические импорты, не `next/dynamic`. Это осознанный
откат: `registry[section.type]` — выбор компонента **по строке из
данных**, а не по литеральному условию в коде, и бандлер (Turbopack и
Webpack — оба проверены) не может доказать, что конкретный `type`
никогда не встретится, поэтому не выкидывает код компонента.
Экспериментально: обернув компоненты в `dynamic(() => import(...))` и
убрав `faq`/`contact` из конфига, JS `Accordion`/`ContactForm` всё
равно остаётся в бандле — байт в байт. `next/dynamic` тут не даёт
выигрыша, только усложняет код.

У большинства секций (`Hero`, `Stats`, `Features`, `Steps`, `Gallery`,
`Testimonials`, `Team`, `About`, `Pricing`, `CTA`) вообще нет
клиентского JS — чистые Server Components, их код не попадает в бандл
браузера независимо от способа импорта. Реальный клиентский вес есть
только у `FAQ` (`Accordion`) и `ContactForm` (форма, `Toast`, `Select`)
— и если секция есть на странице, этот вес неизбежен.

### Чтобы убрать JS ненужной секции вручную

Единственный рабочий способ — руками убрать секцию из
`SectionRenderer.tsx` в конкретном проекте. Пример (нет FAQ и формы):

1. Удалить импорты `FAQ`/`ContactForm` из шапки файла.
2. Удалить строки `faq:`/`contact:` из `registry`.
3. Убрать `FaqSection`/`ContactSection` из union `Section` в
   `types/site.ts` (обязательный шаг: `registry` типизирован как
   `{ [K in SectionType]: Renderer<K> }` без `?`, и без сужения union
   TypeScript даст `TS2741` на объявлении `registry`).
4. Альтернатива без правки `types/site.ts`: сменить тип `registry` на
   `Partial<{ [K in SectionType]: Renderer<K> }>` — существующая ветка
   `if (!render) {...warn...; return null;}` уже готова к этому. Минус:
   случайный `type: "faq"` в конфиге пройдёт тайпчек и молча не
   отрендерится (заметно только по dev-warn).
5. Убедиться, что в конфиге нет объектов `type: "faq"`/`"contact"`.
6. Пересобрать и проверить, что `Accordion`/`Toast`/`Select` не
   встречаются в `.next/static/chunks/*.js`.

### Чтобы добавить новую секцию

1. Тип и интерфейс в `types/site.ts`, добавить в union `Section`.
2. Папка `components/sections/<Название>/` по общему шаблону
   (`index.tsx` + `variants/`) — раздел 7.
3. Обычный `import` в `SectionRenderer.tsx` + строка в `registry`.
4. Если есть `variant` — добавить дефолт в `lib/preset.ts`.
5. Объект в `sections` внутри `content/site.config.ts`.

---

## 5. Примитивы: `Card`, `Badge` и слой глубины

Тем, чем тарифы отличаются технически. Полная картина — `docs/presets.md`.

### `components/ui/Card.tsx`

Ни одного значения тени/радиуса/цвета в компоненте нет — только классы
слоя глубины, значения приходят из токенов `--card-*`/`--radius-card`
и зависят от тарифа.

| `variant` | Классы | Когда |
|---|---|---|
| `cell` (дефолт) | только паддинги | ячейка табличной сетки |
| `framed` | `ui-card border` | **карточка по умолчанию**: Эконом — hairline без тени, Стандарт — своя поверхность + контактная тень + радиус 12px |
| `elevated` | `ui-card ui-card--elevated border` | подъём независимо от тарифа: виджет hero, `layout="cardContainer"`, шаг таймлайна |
| `bordered-accent` | `ui-card ui-card--accent border` | глубина рамкой, тень принудительно `none` |
| `plain` | ничего | контент сам оформляет себя |

`hoverEffect?: boolean` (дефолт `false`) добавляет
`ui-card--interactive cursor-pointer` — усиленный подъём/тень на hover
(под `prefers-reduced-motion`). Включать только там, где карточка
реально кликабельна — `cursor-pointer` входит в набор. Для «живого, но
не кликабельного» блока в Стандарте ничего включать не нужно (реакция
на курсор есть у любой карточки); в Экономе её нет и не должно быть.

`framed` не привязан к `bg-bg`: цвет из `--card-bg` — фон своей секции
в базе, `--surface-card` в дорогих тарифах.

### Классы слоя глубины (`app/globals.css`, `@layer components`)

В `components/` не должно быть `shadow-*`, `rounded-xl`,
`hover:-translate-y-*` — только роли:

| Класс | Роль | Где |
|---|---|---|
| `ui-card` (+`--elevated`/`--accent`/`--featured`/`--live`/`--interactive`) | карточка | `Card`, контейнер `Stats`, таймлайн `Steps` |
| `ui-button` | радиус/тень/подъём кнопки | `Button` |
| `ui-control` | геометрия поля | `Input`, `Select` |
| `ui-media` | скругление медиа без соседнего паддинга `Card` (без тени) | фото Features `table`, аватар Team `rows`/`columns` (без `Card`-обёртки — сравнивать не с чем) |
| `ui-media-inset` | то же, но радиус уменьшен на паддинг родительской `Card` (концентрические дуги: угол фото должен отставать от угла карточки ровно на её паддинг, иначе на равных `--radius-card`/`--radius-media` дуги не делят центр), с нижней границей `--radius-control` — на Стандарте паддинг Card (28–36px) больше `--radius-card` (12px), и без пола честная разница уходит в минус (острый угол фото вплотную к мягкому углу карточки) | фото `Pricing.plan.photo` (`PlanContent`), фото `Steps` `cascade`/`numbered-cards`, фото About/Hero-панели с `frame: "plain"` (`AboutMedia`, `HeroPanel`), фото Features `cards`/`bento` (`FeatureContent` с `mediaInset`), аватар Team `cards` (`MemberContent` с `mediaInset`) |
| `ui-media-raised` | скругление+тень самостоятельного медиа | фото Hero/About, карта в контактах |
| `ui-popover` | радиус/тень всплывающей панели | `Toast`, меню `Select` |
| `ui-accordion`, `ui-accordion-item` | линейки (Эконом) / карточки (Стандарт) | `Accordion` |
| `ui-header` | фон/blur/тень хедера | `Header` |
| `icon-tile` | плашка под иконкой (в Экономе — голая иконка) | `Features` |
| `[data-section]`, `[data-tint="hero"]` | фоновая подсветка секции | `Section` |

Лежат в `@layer components`, чтобы обычные утилиты Tailwind их
перебивали (слой utilities идёт после).

### `components/ui/Badge.tsx`

| `variant` | Классы | Когда |
|---|---|---|
| `soft` (дефолт) | `bg-badge-soft text-badge-soft-fg` | статусы реестра, бейдж виджета hero |
| `outline` | `border border-rule font-mono uppercase text-fg-muted` | теги, коды |

Кегль — `text-caption` (13px+трекинг) из общей шкалы. Пара `soft` —
`--badge-soft-bg`/`--badge-soft-fg`, переопределена в
`[data-surface="ink"]`/`[data-surface="accent"]` (реестр живёт на
`ink`, где базовый акцент не читается).

### Токены глубины и радиусов

Полная таблица значений по тарифам (Эконом/Стандарт) —
`docs/presets.md`, раздел 2.1. Здесь — только то, что в ту таблицу не
попадает:

Важные детали:

- Токены, зависящие от поверхности (`--card-bg`, `--surface-card`),
  объявляются **внутри `[data-surface]`**, не в `:root` — `var()` в
  custom property считается один раз в момент объявления, и в `:root`
  просто наследовался бы от `paper`, игнорируя тёмный блок.
- `--radius-sm`/`--radius-md` намеренно остались 2/4px — на них
  свёрстана вся база; шкала растёт вверх, а компоненты выбирают роль
  (`--radius-card` и т.п.), не ступень.
- Имена — `--elevation-*`, а не `--shadow-*` (иначе самоссылка в
  `@theme inline`).
- В тёмной теме `--elevation-*` усилены (альфа 0.4–0.6 вместо
  0.05–0.12) — форма и радиусы те же.

Дубли лежат в `theme/palette.ts` (`elevation`, `radius`) — для
рантайма без CSS (og-картинка, письма из `/api/contact`).

---

## 6. Тарифы и ниши

На этом шаблоне реально собираются только два тарифа — «Эконом»
(`econom`) и «Стандарт» (`standard`); подробно они описаны в
`docs/presets.md` (чек-лист сборки, разбор почему «Стандарт» раньше
выходил плоским, готовый пример конфига). Здесь — только то, что
касается ниш поверх тарифа.

«Бизнес» (индивидуальный сайт премиум-класса) — это вообще не тариф
шаблона: такой проект всегда пишется с нуля отдельным репозиторием, ни
один компонент отсюда не переиспользуется.

```ts
theme: { /* ... */ preset: "standard" }, // весь тариф целиком
```

Переключает пластику (тени, радиусы, поверхности карточек, плашки под
иконками, поля-коробки, аккордеон карточками, тень хедера) и
дефолтные `variant` секций. Компонентная система общая для всех
проектов и тарифов — разница между **нишами** делается палитрой
(`--palette-*` + `theme/palette.ts`), шрифтами и составом секций, не
новыми компонентами.

Текущая база (юрбюро): один акцент `#14452f` в шести местах,
документный радиус 4px, без теней, Source Serif 4/Playfair + Golos
Text, `preset: "econom"`.

### Эконом — кофейня

`preset: "econom"`. Минимальные изменения: снять строгость, добавить
тепла.

- **Акцент**: тёплый (`#a8582f` или похожий) вместо хвойного. Правило
  «6 мест» — оставить.
- **Радиус**: если нужно мягче — поднять роль `--radius-card` до
  `--radius-lg` (12px), не трогая `--radius-md` (документный, на нём
  вся база) и `--radius-control`.
- **Тени**: не добавлять — Эконом плоский по определению; глубина = смена тарифа.
- **Шрифты**: serif можно оставить или заменить `--font-heading-stack`
  на более круглый — по бренду.
- **Секции**: `hero` `type-only`; `features` → `"cards"` (не `"table"`);
  `gallery` не обязателен; `testimonials` → `"quotes"`; `pricing` не
  нужен (меню — это `features`); `contact` — минимум полей (имя+телефон).

### Стандарт — курс/товар

`preset: "standard"` — пластику даёт сам, руками не настраивать.

- **Акцент**: один яркий цвет под продукт. Правило «6 мест» пресет уже
  ослабляет в двух местах (плашка иконки, рамка featured) — дальше
  ослаблять только явно.
- **Секции**: `variant` лучше не указывать (дефолты уже карточные).
  По содержанию: `hero.image` товара **или** `hero.widget` с метриками
  (иначе `split` откатится); `features` → `icon` каждому элементу;
  `gallery` → примеры со `status`/`tags`; `pricing` →
  `featured: true` на рекомендуемом; `contact` → форма записи.
- **`hoverEffect`** — только если карточка реально ведёт на страницу
  товара/урока.

### Стандарт — сложный SaaS (референс Aeterna)

Всё ещё тариф «Стандарт», не отдельный «Бизнес» — такого тарифа у
шаблона нет (см. врезку в начале раздела). Название «Aeterna» — просто
имя референса сложной SaaS-ниши внутри «Стандарта». Самый дальний отход
от базы среди ниш «Стандарта»; часть требований не покрыта компонентами.
`preset: "standard"`.

- **Акцент**: синий (`#2563eb` или похожий); пересчитать `--accent-fg`
  под контраст (обычно чистый белый, не тёплый оффвайт).
- **Радиус/тени/пластика** — закрыто тарифом целиком, ручных правок
  `Button`/`Input` не требуется.
- **Bento-сетка — не реализована**: `Card` умеет только
  `cell`/`framed`/`plain` с одинаковыми ячейками, разных col/row-span
  нет ни у `Features`, ни у `Pricing`. Нужна доработка: новый
  `variant="bento"` с ручными spans или отдельный компонент.
- **SaaS-тарифы**: `pricing` покрывает `variant:"cards"`, `featured`,
  `unit`, `action`. Не хватает переключателя «месяц/год» — `types/site.ts`
  такого поля не описывает, нужна доработка типа+компонента.
- **Секции**: дефолты `standard` уже соответствуют референсу (`hero:
  split`, `features: cards`, `stats: grid+elevated`, `pricing: cards`,
  `contact: cardContainer`). По содержанию: `hero.image`/`hero.widget`
  со скриншотом/метриками продукта, короткая форма контактов (email
  ± компания).

---

## 7. Как добавить новый вариант дизайна

Всё в `components/sections/` устроено одинаково — секции из конфига и
четыре блока вне его (`Header`, `Footer`, `NotFound`, `Privacy`), даже
с одним вариантом. Новый дизайн всегда добавляется одним алгоритмом.

### Структура папки

```
components/sections/<Название>/
  index.tsx            — роутер: по props.variant выбирает файл из variants/
  variants/<V>.tsx      — законченный вариант: рендерит секцию ЦЕЛИКОМ
  parts/*.tsx           — куски разметки, общие для нескольких вариантов
  types.ts              — только если пропсы шире типа секции (ContactForm,
                          и все четыре блока вне конфига)
```

Импорт не меняется: `SectionRenderer.tsx` пишет `import { Hero } from
"@/components/sections/Hero"` — путь резолвится в `index.tsx`.

### Три шага

**1. Файл в `variants/`** — принимает пропсы секции целиком, рендерит
всё от `<Section>` до закрывающего тега:

```tsx
// components/sections/Features/variants/Bento.tsx
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { FeaturesSection } from "@/types/site";

export function Bento(props: FeaturesSection) {
  const { id, surface = "surface", number, eyebrow, title, lead, items } = props;
  return (
    <Section id={id} surface={surface}>
      <Container>
        <SectionHeader number={number} eyebrow={eyebrow} title={title} lead={lead} />
        {/* ...своя раскладка... */}
      </Container>
    </Section>
  );
}

export default Bento;
```

**2. Значение в тип секции** (`types/site.ts`):

```ts
export interface FeaturesSection extends SectionBase {
  type: "features";
  variant?: "table" | "cards" | "bento";   // ← новое значение
  ...
}
```

**3. Строка в `index.tsx` роутере:**

```tsx
import { Bento } from "./variants/Bento";

const variants: VariantMap<FeaturesSection, NonNullable<FeaturesSection["variant"]>> = {
  table: Table,
  cards: Cards,
  bento: Bento,   // ← новая строка
};
```

Порядок важен: `VariantMap` — `Record<V, …>` по всему union `variant`.
Добавили значение в тип, но забыли строку в роутере — TypeScript не
соберётся («Property 'bento' is missing»), а не отрендерит пустоту.

### Вариант vs `parts/`

- **В вариант** — что отличает дизайн: сетка, оболочка элемента,
  вертикальный ритм, поверхность по умолчанию.
- **В `parts/`** — что повторяется дословно между вариантами:
  содержимое карточки, общая оболочка секции, клиентская логика.

Скопировали блок разметки без изменений во второй вариант — значит
ему место в `parts/`.

### Два правила карточного варианта

Карточки в ряду имеют одну высоту (по самой высокой), содержимое —
разное:

1. **Низ карточки — `mt-auto`, не `mt-*`.** Карточка `flex h-full
   flex-col`, обёртка `flex flex-1 flex-col`, последний элемент —
   `mt-auto pt-*` (не `mt-*`: табличные раскладки без flex-колонки
   игнорируют `margin-top: auto`, нужен паддинг). Так сделано в
   `Testimonials/Cards`, `Pricing`, `Team`, `Gallery/Grid`,
   `Features/Cards`. Медиа-бокс с фиксированным aspect-ratio внутри
   такой колонки — обязательно `shrink-0`.
2. **Ступень кегля передаёт вариант, не `parts/`.** Крупные ступени
   (`text-stat` до 60px, `text-quote` до 28px) рассчитаны на широкую
   колонку — в карточке 1/3 ширины они ломаются. Поэтому у
   `TestimonialBody`/`PlanContent` базового размера нет:
   `quoteClassName`/`priceClassName` обязательны, каждый вариант
   передаёт свою ступень (`quotes`→`text-quote`, `cards`→`text-lead`;
   `table`→`text-stat`, `cards`→`text-h2`) — проп, а не переопределение
   класса (два `font-size` в одном `className` конфликтуют
   непредсказуемо по порядку в собранном CSS). Цена — в
   `whitespace-nowrap` (перенос должен рвать по единице измерения, не
   внутри числа).

### Шапка раздела в узкой колонке

`SectionHeader` кладёт номер+колонтитул на левое поле (3/12 колонок).
В `Container width="narrow"` (760px) это ~170px — колонтитул рвётся на
строки. Для этого — `layout="stacked"` (номер+колонтитул строкой над
заголовком, заголовок во всю ширину). `FAQ/parts/FaqBody` выбирает
раскладку по ширине автоматически; новым узким секциям — так же.

### Чего в варианте быть не должно

Ни `shadow-*`, ни `rounded-xl`, ни `hover:-translate-y-*`, ни
hex-цветов — глубина и пластика приходят из тарифа (`ui-card`,
`ui-button`, `ui-media`, `icon-tile`, роли-радиусы). Вариант отвечает
за раскладку, тариф — за глубину. Карточку ставить через `Card
variant="framed"`; `elevated` — только если подъём нужен по смыслу
независимо от тарифа.

### Дефолт варианта по тарифу

Если новый вариант должен становиться умолчанием в тарифе — правка в
`lib/preset.ts` (`PRESET_DEFAULTS`), не в самой секции.

### Вторая ось

`Stats.containerVariant` и `ContactForm.layout` — второй переключатель,
независимый от `variant`. Такие оси НЕ попадают в `variants/` (иначе
файл на каждую комбинацию) — живут в `parts/` общим хелпером
(`Stats/parts/container.ts`, `ContactForm/parts/FormColumn.tsx`). Для
новой секции со второй осью — делать так же.

---

## Проверка расхождений с кодом

Таблицы сверены построчно с текущим состоянием: `types/site.ts`,
`components/SectionRenderer.tsx`, каждой папкой в
`components/sections/`, `components/ui/*`, `lib/preset.ts`,
`theme/tokens.css`, `theme/palette.ts`, `app/globals.css`,
`app/layout.tsx`, `app/page.tsx`, `app/not-found.tsx`,
`app/privacy/page.tsx`, `content/site.config.ts`, `lib/seo.ts`. При
следующем изменении любого из этих файлов — сверять в первую очередь
таблицы секций (защитных тестов на соответствие типов и реального
поведения нет).

Этот файл описывает **механику секций**, `docs/presets.md` —
**тарифы**. Правка про глубину/радиусы/тени/дефолтные `variant` почти
всегда должна отразиться там, а не здесь.

---

## Семейство `sticky-split`

Один и тот же `variant` в одиннадцати секциях: Hero, Stats, Features,
Steps, About, Gallery, Testimonials, Team, Pricing, FAQ, ContactForm,
CTA. Заголовок раздела — колонка 4/12 слева, залипает на `lg+` под
хедером (`top: calc(var(--header-height) + 2rem)`); содержимое — 8/12
справа. Смысл в том, чтобы весь сайт собирался одной раскладкой: см.
CLAUDE.md §2.13.

Ось держит **один** компонент — `components/ui/StickySplit.tsx`. Вариант
секции отдаёт ему `number/eyebrow/title/lead` (или `titleSlot`, если
заголовок не `<h2>` — так делает Hero со своим `<h1>`), опциональный
`aside` в левую колонку и содержимое правой через `children`.

| Проп | Зачем |
|---|---|
| `sticky` | `false` у Hero и CTA: в первом экране прокручивать мимо заголовка нечего, а CTA короче экрана. Ось при этом остаётся общей |
| `titleSlot` | Своя разметка заголовка вместо `<h2>`. Взаимоисключающ с `title` |
| `aside` | Довесок в левую колонку под лидом: кнопки (About), реквизиты (ContactForm), кикер-точка (CTA) |
| `contained` | `false`, если оправа уже своя. По умолчанию оборачивает в `Container` |

Почему заголовок здесь `text-h2`, а не `.section-title`: ступень
`--title-size` переключается `ThemeConfig.titleStyle` и в режиме
`centered` доходит до 48px — в колонке 230–400px это гарантированный
перенос посреди слова. Раскладке нужен предсказуемый кегль, потому что
от него зависит, поместится ли заголовок в колонку.

Почему `lg`, а не `md`: на 768–1023px колонка 4/12 — около 230px.
Заголовок в ней рвётся на 5–6 строк, а залипающий блок занимает треть
экрана и мешает читать список. Ниже `lg` раскладка схлопывается в одну
колонку.
