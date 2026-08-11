import type { IconName } from "@/lib/icons";

// Типы конфига сайта. Секция = данные + surface + variant.
// Компоненты текст не хранят, всё приходит сюда пропсами из site.config.ts.

/** Фон секции, задаёт цвета через CSS-переменные (paper/surface/ink/accent). */
export type Surface = "paper" | "surface" | "ink" | "accent";

/**
 * Тариф оформления. Единственная ручка, которой «дорогой» сайт отличается
 * от базового — см. docs/presets.md.
 *
 * econom   — плоско и документно: линейки вместо карточек, теней нет,
 *            радиус 4px. То, чем шаблон был до появления пресетов.
 * standard — глубина: карточки на собственной поверхности, многослойные
 *            тени, крупные скругления, подсветка секций, плашки под
 *            иконками, живой hover, стеклянный хедер.
 *
 * Влияет на две вещи сразу: на токены (data-preset на <html> →
 * theme/tokens.css) и на дефолтные variant секций (lib/preset.ts).
 */
export type Preset = "econom" | "standard";

/**
 * Форма плашки .icon-tile: circle — круглая, squircle — скруглённый
 * квадрат (роль --radius-control, не зависит от тарифа), bare — голая
 * иконка без плашки/фона. Ставится сайтвайд в ThemeConfig.iconShape и
 * может переопределяться per-секцию через SectionBase.iconShape.
 */
export type IconShape = "circle" | "squircle" | "bare";

/**
 * Стиль заголовка секции (.section-title, theme/tokens.css): чисто
 * типографика самого <h2> — размер/выравнивание/max-width, не форма
 * кикера и не структура колонок (это layout/headerAlign, отдельная
 * ручка).
 *
 * standard — левый край, text-h2, max-width 22ch. Базовый вид SectionHeader.
 * centered — по центру, text-h1, max-width 46rem. Вид, которым сейчас
 *            рисуют заголовок Team/Steps/Stats/Features header'ы и
 *            CTA centered/boxed.
 *
 * Ставится сайтвайд в ThemeConfig.titleStyle, конкретная секция может
 * переопределить через SectionBase.titleStyle — см. SectionRenderer.tsx.
 */
export type TitleStyle = "standard" | "centered";

export interface SectionBase {
  /** Используется как anchor и как key, плюс scroll-margin-top под sticky-хедер. */
  id: string;
  surface?: Surface;
  /** Номер раздела на поле: «01», «02»… Пустая строка — не выводится. */
  number?: string;
  /** Колонтитул над заголовком. */
  eyebrow?: string;
  title?: string;
  lead?: string;
  /** Если задано — пункт появляется в навигации хедера. */
  nav?: string;
  /**
   * Переопределяет форму .icon-tile (см. IconShape) для этой секции.
   * Без поля секция берёт сайтвайдный дефолт из ThemeConfig.iconShape —
   * его резолвит SectionRenderer (`section.iconShape ?? context.iconShape`)
   * до того, как проп доедет до компонента, поэтому здесь почти всегда
   * можно ничего не указывать: одну ручку в site.config.ts достаточно
   * покрутить один раз на весь сайт.
   * Читают все секции, где есть .icon-tile: Features (все варианты),
   * Gallery cards-icon, About panel, Pricing (matrix/dark/playful),
   * Contact panels, FAQ (все варианты), Stats (badge/bento/photo/rows),
   * Steps (rail/stack/cards/cascade/split/numbered-cards). Не читают:
   * Stats plain (голая иконка — это сама суть варианта, отличающая его
   * от badge) и Steps timeline-horizontal (круглая нода на оси таймлайна
   * — непрозрачный фон там нужен, чтобы нода перекрывала линию, bare
   * сломал бы саму метафору). Тоже не читают инлайновые иконки-глифы
   * рядом с текстом, которые не являются самостоятельной плашкой: Hero/
   * Testimonials trust-row, About badge (пилюля-эйброу), Pricing
   * чек-листы, соцсети Footer/Team, рейтинг звёздами — это не «иконка
   * item.icon в контейнере», а часть другого элемента интерфейса.
   */
  iconShape?: IconShape;
  /**
   * Переопределяет положение центрированной пилюли-шапки (номер+колонтитул
   *+заголовок+лид) там, где она есть: center — прежний вид по умолчанию,
   * left — колонтитул и заголовок прижимаются к левому краю, без
   * mx-auto/text-center. Читают только карточные шапки, у которых это
   * центрирование в принципе есть (Features bento, Steps
   * cards/cascade/timeline/split/numbered-cards, Testimonials bento/
   * rated-cards/spotlight, Team photo-cards/badge-avatars/tags-cards,
   * Pricing dark/playful/glass/banner/matrix) — обычный `SectionHeader`
   * (колонтитул на левом поле) эту ось не читает, ему уже некуда
   * центрироваться. Смысл поля — не плодить варианты, различающиеся
   * только тем, где стоит шапка.
   */
  headerAlign?: "left" | "center";
  /**
   * Переопределяет typography-масштаб заголовка (.section-title) для
   * этой конкретной секции — см. TitleStyle. Без поля секция наследует
   * сайтвайдный дефолт ThemeConfig.titleStyle через CSS-каскад
   * ([data-title-style] на <html>, наследуется по DOM) — SectionRenderer
   * оборачивает секцию в свой data-title-style только когда это поле
   * реально задано, JS-резолва как у iconShape не требуется.
   */
  titleStyle?: TitleStyle;
}

export interface CtaLink {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "quiet";
}

// Hero

export interface HeroFact {
  value: string;
  label: string;
}

export interface HeroWidgetMetric {
  label: string;
  value: string;
  /** 0–100. Если задано — под строкой появляется полоса прогресса. */
  progress?: number;
}

/**
 * Столбиковая диаграмма в виджете hero.
 *
 * values — высоты столбцов в процентах (0–100), значения вне диапазона
 * подрезаются. Это витрина динамики, а не график с осями: подписей у
 * столбцов нет и не предполагается, поэтому диаграмма помечена
 * aria-hidden — ровно как полоса прогресса у метрики. Всё, что должно
 * быть озвучено, обязано быть в metrics или в caption.
 */
export interface HeroWidgetChart {
  /** Подпись под диаграммой — единственный её озвучиваемый текст. */
  caption?: string;
  values: number[];
  /** Индекс выделенного акцентом столбца. */
  peakIndex?: number;
}

/** Карточка с метриками рядом с заголовком (тариф «Стандарт»). */
export interface HeroWidget {
  badge?: string;
  title: string;
  metrics: HeroWidgetMetric[];
  /**
   * Как разложены метрики.
   * list (по умолчанию) — строками «подпись — значение», как в обычном
   *   виджете: годится для длинных подписей и любого их числа.
   * tiles — плитками в две колонки: крупное значение под короткой
   *   подписью. Требует коротких значений («24,5 млн», «12,4») —
   *   длинные в плитке переносятся и ломают ряд.
   */
  layout?: "list" | "tiles";
  chart?: HeroWidgetChart;
}

/** Поисковая строка в hero (variant="service"). */
export interface HeroSearch {
  /** Подпись над полем — она же <label> поля, а не плейсхолдер. */
  label: string;
  placeholder?: string;
  submitLabel: string;
  /** URL обработчика: форма уходит туда обычным GET. */
  action: string;
  /** Имя параметра запроса, по умолчанию "q". */
  name?: string;
}

/** Строка «нам доверяют» с логотипами-иконками (variant="service"). */
export interface HeroTrust {
  text: string;
  items: { label: string; icon?: IconName }[];
}

/**
 * Отзыв, лежащий поверх фото в первом экране (variant="service").
 * rating — число закрашенных звёзд из пяти; значения вне 0–5 подрезаются.
 */
export interface HeroOverlay {
  rating?: number;
  quote: string;
  author: string;
  role?: string;
}

/**
 * Строка доверия под кнопками hero: стопка аватаров и короткая фраза.
 * Читает только showcase.
 */
export interface HeroProof {
  /**
   * Локальные пути к фото (`/images/...`), как и любые картинки в
   * шаблоне — см. docs/section-system.md, раздел 2. Рендерятся внахлёст,
   * не больше четырёх; остальные игнорируются.
   */
  avatars?: string[];
  text: string;
}

export interface HeroSection extends SectionBase {
  type: "hero";
  /**
   * type-only — голая типографика, рельс на левом поле.
   * split     — текст слева, фото или виджет справа, рельс на поле (1/6/5).
   * centered  — центрированная афиша на тёмной земле, без второй колонки
   *             (image и widget в ней не рендерятся).
   * showcase  — витрина продукта 6/6: плашка над заголовком, медиа в
   *             поднятой панели справа, рельса нет (number/rail не читаются).
   * poster    — афиша во всю ширину окна: акцентная панель с текстом
   *             слева, фото встык к краю экрана справа. Без Container,
   *             number/rail и widget не читаются, image обязателен.
   * service   — первый экран сервиса: поисковая строка вместо кнопок,
   *             ряд доверия, фото с отзывом поверх. actions не читаются,
   *             image обязателен.
   */
  variant?:
    | "type-only"
    | "split"
    | "centered"
    | "showcase"
    | "poster"
    | "service"
    /** Парный к sticky-split остальных секций: та же ось 4/8, без залипания (в первом экране липнуть не к чему). */
    | "sticky-split";
  /**
   * Плашка-анонс над заголовком («Версия 2.0», «Набор открыт»).
   * Читают showcase и poster — в остальных раскладках её место занимает
   * рельс или колонтитул.
   */
  badge?: string;
  /**
   * Оправа медиа в панели showcase: plain — просто панель,
   * browser — с полосой окна сверху (витрина интерфейса, а не фото).
   * Без image не используется.
   */
  frame?: "plain" | "browser";
  /**
   * Строка доверия под кнопками (аватары + фраза). Читает только
   * showcase — в остальных раскладках роль социального доказательства
   * играют facts.
   */
  proof?: HeroProof;
  /**
   * Поисковая строка в первом экране. Читает только variant="service".
   * Это НАСТОЯЩАЯ форма method="get", а не декорация: значение уходит
   * на `action` обычным параметром запроса, без JS. Поэтому `action`
   * обязателен — страницу, которая примет запрос, должен предоставить
   * проект (каталог, поиск по сайту, внешний сервис). Формы, которая
   * молча съедает введённое, в шаблоне быть не должно.
   */
  search?: HeroSearch;
  /** Строка «нам доверяют» с логотипами. Читает только variant="service". */
  trust?: HeroTrust;
  /** Отзыв поверх фото. Читает только variant="service". */
  overlay?: HeroOverlay;
  /** Строки заголовка, переносы расставляем вручную. */
  headline: string[];
  actions?: CtaLink[];
  facts?: HeroFact[];
  /** Вертикальный колонтитул на левом поле. */
  rail?: string;
  /** Фон/фото для variant="split". Без variant="split" не используется. */
  image?: string;
  /**
   * Карточка с метриками во второй колонке. Включает ту же раскладку,
   * что и variant="split", даже если variant не задан. Если заданы и
   * image (при variant="split"), и widget — колонку занимает фото.
   * На мобильном виджет скрыт: он не должен уводить кнопки за экран.
   */
  widget?: HeroWidget;
  /**
   * Скрыть фото на мобильном (<md) и показывать только с md+. Читают
   * split/showcase/poster/service — там, где фото идёт полноширинным
   * блоком и на маленьком экране заметно отодвигает кнопки/действия
   * вниз. poster/service требуют image — при true с ним же первый
   * экран на мобильном становится чистой типографикой без второй колонки.
   */
  hideMediaOnMobile?: boolean;
}

// Stats

export interface StatItem {
  value: string;
  /**
   * Хвост после value. В карточных вариантах (badge/playful/plain/dark/
   * bento/photo) это цветной остаток числа («+», «%»); в rows — целая
   * фраза после числа («+ Cases», « Years», « Win Rate»), поэтому там
   * suffix пишут с пробелом впереди.
   */
  suffix?: string;
  label: string;
  /** Иконка над/рядом с числом. Читают badge, playful, plain, dark, bento, photo, rows. */
  icon?: IconName;
  /** Более длинное описание под числом. Читают bento, rows; для остальных не нужно. */
  text?: string;
  /**
   * Оправа карточки в variant="bento": accent — акцентная рамка, tint —
   * мягкая тонировка фона (темнее в светлой теме, светлее в тёмной).
   * Не задано — обычная framed-карточка. Без явного значения bento
   * по умолчанию красит только первый item accent — автоматической
   * тонировки последнего больше нет (читалась как случайное затемнение
   * там, где это не был содержательный акцент). Явный highlight на
   * любом item всегда главнее позиции.
   */
  highlight?: "accent" | "tint";
}

export interface StatsSection extends SectionBase {
  type: "stats";
  /**
   * band/grid — исходные плоские раскладки: номер + title строкой (без
   *             lead — это осталась бы полноценная шапка, а не лёгкая строка).
   * badge     — пилюля-эйробров + крупный заголовок в две строки + лид,
   *             карточки с круглой плашкой под иконкой.
   * rows      — заголовок слева, плоские колонки на линейках: иконка и
   *             подпись сверху, крупная фраза (value+suffix), описание
   *             (text) снизу.
   * bento     — заголовок по центру, сетка карточек; оправу каждой решает
   *             item.highlight ("accent" — рамка, "tint" — тонировка фона),
   *             без него — дефолт по позиции (первая accent, последняя tint).
   * photo     — фото с заголовком/лидом поверх слева, сетка 2×2 карточек
   *             справа (image обязателен, иначе фото нечем закрыть).
   * plain     — заголовок по центру, голая иконка без плашки, компактные
   *             карточки. Тёмный блок — тот же variant с surface="ink"
   *             (раньше был отдельным вариантом dark, отличавшимся только
   *             этим полем, которое и так есть у любой секции).
   */
  variant?:
    | "band"
    | "grid"
    | "badge"
    | "rows"
    | "bento"
    | "photo"
    | "plain"
    /** Цифры сеткой 2×2 справа от залипающего заголовка. Семейство sticky-split. */
    | "sticky-split";
  /**
   * Подложка под цифрами: flat — полоса во всю ширину с линейками
   * сверху/снизу (база), elevated — единый блок с тенью,
   * bordered — блок с акцентной рамкой. Линейки секции при elevated
   * и bordered снимаются, иначе блок «перечёркнут» ими. Читают только
   * band/grid — карточные варианты сами решают подложку каждой карточки.
   */
  containerVariant?: "flat" | "elevated" | "bordered";
  /** Фото для variant="photo". Без него эта раскладка не рендерится. */
  image?: string;
  /**
   * Растягивает карточки последнего неполного ряда сетки на пустые
   * колонки (максимум col-span-2 на карточку, см. lib/gridFill.ts).
   * Дефолт `true`; `false` отключает для этой секции. Читают только
   * карточные варианты: badge, plain, bento (не band/grid/rows/photo).
   */
  fillLastRow?: boolean;
  items: StatItem[];
}

// Features

export interface FeatureItem {
  number?: string;
  icon?: IconName;
  title: string;
  text: string;
  points?: string[];
  photo?: string;
  /** Ссылка «Подробнее» на элементе. Показывается сама, если задана — читают table, cards, bento. */
  link?: CtaLink;
  /** Короткие теги-плашки под описанием. Читает только bento. */
  tags?: string[];
}

export interface FeaturesSection extends SectionBase {
  type: "features";
  /**
   * table   — линейки-разделители без карточек; стрелка-ссылка в углу
   *           ячейки включается сама, если хотя бы у одного item задан
   *           `link` (раньше это был отдельный вариант `table-links`).
   * cards   — карточки; ссылка «Подробнее» (`item.link`) и кнопка `action`
   *           под сеткой читаются сами, если заданы (раньше — отдельный
   *           вариант `cards-cta`).
   * bento   — заголовок пилюлей по центру, асимметричная двухколоночная
   *           сетка карточек; `item.tags` — плашки под описанием первого
   *           элемента.
   * sticky-split — заголовок залипает слева, справа список строками на
   *           линейках. Для длинного перечня (6–10 пунктов), где сетка
   *           карточек превращается в стену прямоугольников.
   * alternating — чередующиеся ряды фото/текст, лево-право. Для 3–5
   *           крупных возможностей; единственная раскладка Features,
   *           построенная вокруг `item.photo`, а не игнорирующая его.
   * compact — плотная разлинованная сетка 1→2→3 без карточек. Для 6–9
   *           коротких пунктов («что входит», «стек»), где карточки дают
   *           девять почти пустых прямоугольников. `columns` не читает.
   */
  variant?: "table" | "cards" | "bento" | "sticky-split" | "alternating" | "compact";
  columns?: 2 | 3;
  /** Кнопка под сеткой карточек. Читает только cards. */
  action?: CtaLink;
  /**
   * Растягивает карточки последнего неполного ряда сетки на пустые
   * колонки (максимум col-span-2 на карточку, см. lib/gridFill.ts).
   * Дефолт `true`; `false` отключает для этой секции. Читают только
   * карточные варианты: cards, bento (не table).
   */
  fillLastRow?: boolean;
  items: FeatureItem[];
}

// Steps

export interface StepItem {
  number: string;
  title: string;
  text: string;
  meta?: string;
  /** Иконка шага. Читают cards, cascade, timeline-horizontal, split, numbered-cards, а также rail/stack — если задана. */
  icon?: IconName;
  /** Фото шага, локальный путь `/images/...` (см. раздел 2 section-system.md). Читают cascade, split, numbered-cards. */
  photo?: string;
  /** Визуально выделенный шаг (акцентная заливка). Читают split, numbered-cards — обычно последний шаг («Результат»). */
  featured?: boolean;
}

export interface StepsSection extends SectionBase {
  type: "steps";
  /**
   * rail                — 4 колонки на общей линейке, stack — 2 колонки.
   * timeline-vertical   — вертикальный таймлайн: номера-бейджи на оси,
   *                       карточки шагов расходятся по сторонам.
   * cards               — простой ряд карточек: круглая плашка под иконкой,
   *                       «N. Заголовок» одной строкой, описание.
   * cascade             — карточки каскадом (каждая следующая ниже и правее
   *                       предыдущей), номер — бейдж на углу карточки. С
   *                       `surface="ink"` и `photo` у items — тёмный вариант
   *                       с фото в подвале карточки; без них — светлый и без фото.
   * timeline-horizontal — горизонтальная линия с круглыми нодами-иконками,
   *                       заголовок и описание под каждой нодой, первая нода
   *                       выделена акцентным кольцом. (Пара с timeline-vertical —
   *                       тот же приём таймлайна в другой ориентации.)
   * split               — фото с заголовком/лидом поверх слева (как
   *                       Stats variant="photo"), сетка 2×2 карточек справа;
   *                       `featured` красит карточку акцентной заливкой.
   * numbered-cards      — ряд карточек: кружок-номер + соединительная линия,
   *                       иконка, заголовок, описание, фото в подвале;
   *                       `featured` — карточка на тёмной поверхности.
   */
  variant?:
    | "rail"
    | "stack"
    | "timeline-vertical"
    | "cards"
    | "cascade"
    | "timeline-horizontal"
    | "split"
    | "numbered-cards"
    /** Тот же приём, что у остальных секций: залипающий заголовок 4/12 слева, содержимое 8/12 справа. */
    | "sticky-split";
  /** Фото для variant="split" — эйброу/заголовок/лид ложатся поверх него. Без него вариант не рендерится. */
  image?: string;
  /**
   * Растягивает карточки последнего неполного ряда сетки на пустые
   * колонки (максимум col-span-2 на карточку, см. lib/gridFill.ts).
   * Дефолт `true`; `false` отключает для этой секции. Читают только
   * карточные варианты: cards, cascade, numbered-cards (не rail/stack/
   * timeline-vertical/timeline-horizontal/split).
   */
  fillLastRow?: boolean;
  items: StepItem[];
}

// Gallery (кейсы/работы)

export interface CaseItem {
  category: string;
  problem: string;
  result: string;
  year: string;
  /**
   * Колонка-статус: рендерится плашкой Badge variant="soft".
   * Колонка появляется в реестре, только если статус задан хотя бы
   * у одного элемента — иначе раскладка остаётся прежней.
   */
  status?: string;
  /** Колонка-теги: мелкие моноширинные плашки Badge variant="outline". */
  tags?: string[];
  /** Заголовок кейса. Читают cards-icon, photo-grid, photo-bento. */
  title?: string;
  /** Фото кейса, локальный путь `/images/...`. Читают photo-grid, photo-bento. */
  photo?: string;
  /** Ссылка «Подробнее». Читают cards-icon, photo-grid, photo-bento. */
  link?: CtaLink;
  /** Иконка в плашке карточки. Читает только cards-icon. */
  icon?: IconName;
  /** Дата публикации кейса («Май 2024»). Читает только photo-grid. */
  date?: string;
  /** Пара «значение — подпись» под описанием (сумма, срок). Читает только photo-bento. */
  stats?: { value: string; label: string }[];
}

export interface GallerySection extends SectionBase {
  type: "gallery";
  /**
   * table/grid — исходные раскладки, построчный реестр и карточки.
   * cards-icon — заголовок пилюлей, карточки с иконкой в плашке,
   *              категорией-ссылкой и ссылкой `link`.
   * photo-grid — заголовок пилюлей, ряд карточек с фото (категория —
   *              плашка поверх фото), ссылка `link` + `date` внизу.
   * photo-bento — заголовок пилюлей, асимметричная сетка: первый
   *              элемент — крупный, с фото и `stats`, остальные —
   *              обычная сетка (фото — если задано, иначе плашка).
   */
  variant?:
    | "table"
    | "grid"
    | "cards-icon"
    | "photo-grid"
    | "photo-bento"
    /** Тот же приём, что у остальных секций: залипающий заголовок 4/12 слева, содержимое 8/12 справа. */
    | "sticky-split";
  items: CaseItem[];
  note?: string;
  /** Кнопка в шапке секции. Читают cards-icon, photo-grid, photo-bento. */
  action?: CtaLink;
  /**
   * Выключка текста в карточке: left (по умолчанию) или center. Читают
   * все варианты, кроме table — там реестр строками, выключка не
   * применима.
   */
  align?: "left" | "center";
  /**
   * Растягивает карточки последнего неполного ряда сетки на пустые
   * колонки (максимум col-span-2 на карточку, см. lib/gridFill.ts).
   * Дефолт `true`; `false` отключает для этой секции. Читают только
   * карточные варианты: grid, cards-icon, photo-grid, photo-bento (не table).
   */
  fillLastRow?: boolean;
}

// Testimonials

export interface TestimonialItem {
  quote: string;
  author: string;
  meta?: string;
  /** Аватар автора. Читают bento, rated-cards, spotlight. */
  photo?: string;
  /** Оценка 0–5 (звёзды). Читают bento, rated-cards, spotlight. */
  rating?: number;
  /** Короткая строка результата с иконкой («Сделка закрыта на 1,4 млрд»). Читает только spotlight. */
  result?: string;
  /**
   * Выбирает, какой отзыв получает крупное место: в bento/spotlight —
   * кто становится крупной карточкой/колонкой (без пометки — первый по
   * порядку), в rated-cards — кто переходит на тёмную поверхность.
   * Позиция в массиве роли не играет — выбирай по содержанию отзыва,
   * не по тому, что он последний.
   */
  featured?: boolean;
}

export interface TestimonialsSection extends SectionBase {
  type: "testimonials";
  /**
   * quotes/cards   — исходные раскладки.
   * bento          — заголовок пилюлей по центру, первый отзыв —
   *                  крупный (рейтинг + большая цитата + автор с фото),
   *                  остальные — сетка поменьше.
   * rated-cards    — заголовок пилюлей, простой ряд карточек: рейтинг,
   *                  цитата, линейка, автор с фото. `item.featured` —
   *                  карточка на ink-поверхности.
   * spotlight      — заголовок слева, один крупный отзыв (рейтинг,
   *                  цитата, `result`, автор) слева, список остальных
   *                  отзывов справа (без карточек, на линейках).
   */
  variant?:
    | "quotes"
    | "cards"
    | "bento"
    | "rated-cards"
    | "spotlight"
    /** Тот же приём, что у остальных секций: залипающий заголовок 4/12 слева, содержимое 8/12 справа. */
    | "sticky-split";
  items: TestimonialItem[];
  /** Строка «нам доверяют» под отзывами. Тот же тип, что у Hero. */
  trust?: HeroTrust;
  /**
   * Растягивает карточки последнего неполного ряда сетки на пустые
   * колонки (максимум col-span-2 на карточку, см. lib/gridFill.ts).
   * Дефолт `true`; `false` отключает для этой секции. Читают только
   * карточные варианты: cards, bento, rated-cards (не quotes/spotlight).
   */
  fillLastRow?: boolean;
}

// Team

export interface TeamMember {
  name: string;
  role: string;
  focus: string;
  experience: string;
  photo?: string;
  /** Иконки-ссылки (почта, соцсеть). Читают photo-cards, badge-avatars, bento. */
  social?: { icon: IconName; href: string; label: string }[];
  /** Короткие теги-навыки под описанием. Читает только tags-cards. */
  tags?: string[];
  /** Ссылка «Подробнее»/«View Bio». Читают tags-cards, bento. */
  link?: CtaLink;
}

/**
 * Баннер «Хотите к нам?» под сеткой людей. Данные одни и те же для
 * любого variant — оправу (`TeamBannerBlock`'s `tone`: soft/solid/quote)
 * решает variant по умолчанию, но `tone` тут переопределяет её явно,
 * когда нужен другой вид баннера независимо от того, какой variant
 * выбран у самой секции.
 */
export interface TeamBanner {
  title: string;
  text: string;
  action: CtaLink;
  tone?: "soft" | "solid" | "quote";
}

export interface TeamSection extends SectionBase {
  type: "team";
  /**
   * columns        — 3 колонки на линейках.
   * rows           — одна колонка.
   * cards          — те же 3 колонки, каждый человек в карточке.
   * photo-cards    — заголовок пилюлей по центру, фото во всю ширину
   *                  карточки (без отступов сверху), роль/имя/описание
   *                  снизу, `social` — иконки-ссылки.
   * badge-avatars  — круглый аватар со значком-иконкой в углу, роль —
   *                  плашкой (Badge soft), описание, `social`.
   * tags-cards     — квадратное фото, ссылка `link` иконкой в углу
   *                  заголовка, роль капсом, описание, `tags`.
   * bento          — заголовок слева + фото справа (как About), дальше
   *                  сетка людей: первый — крупный с фото на всю ширину
   *                  ячейки и `social`/`link`, остальные — сетка поменьше.
   */
  variant?:
    | "columns"
    | "rows"
    | "cards"
    | "photo-cards"
    | "badge-avatars"
    | "tags-cards"
    | "bento"
    /** Тот же приём, что у остальных секций: залипающий заголовок 4/12 слева, содержимое 8/12 справа. */
    | "sticky-split";
  items: TeamMember[];
  /** Фото для шапки variant="bento". Без него шапка остаётся текстовой. */
  image?: string;
  banner?: TeamBanner;
  /**
   * Прижимает строку стажа (experience) к низу карточки (mt-auto) — так
   * она стоит на одной высоте у всех людей в ряду независимо от длины
   * focus. Читает только columns: строки там не в flex-колонке, и без
   * этого прижать стаж к низу нечем. rows/cards уже делают это сами.
   */
  alignExperienceBottom?: boolean;
  /**
   * Растягивает карточки последнего неполного ряда сетки на пустые
   * колонки (максимум col-span-2 на карточку, см. lib/gridFill.ts).
   * Дефолт `true`; `false` отключает для этой секции. Читают cards и
   * bento (для bento — сетка после первого крупного человека).
   * photo-cards/badge-avatars/tags-cards пока держат прежнюю (каждый
   * неполный ряд, не только последний) раскладку через lib/bentoSpan.ts.
   */
  fillLastRow?: boolean;
  /**
   * Ширина крупной карточки первого человека в variant="bento" — "full"
   * (дефолт) во всю ширину контейнера, "half" — вполовину, для проекта
   * без фото с подходящими для full-bleed landscape-пропорциями. Читает
   * только bento.
   */
  heroSpan?: "full" | "half";
}

// About ("о нас" / "о месте")

export interface AboutHighlight {
  icon?: IconName;
  title: string;
  text: string;
}

/** Боковая карточка со статами рядом с фото (variant="panel"). */
export interface AboutPanel {
  title: string;
  text: string;
  stats?: { value: string; label: string }[];
  link?: CtaLink;
}

export interface AboutSection extends SectionBase {
  type: "about";
  /**
   * photo         — исходный, фото 7/12; сторону фото задаёт photoPosition.
   * type-only    — econom: центрированная типографика, без фото и кнопок.
   * split-actions — текст 5/12 + кнопки, фото 7/12 в приподнятой карточке.
   *                Колонтитул — подпись с тире (number/eyebrow) либо
   *                пилюля (badge/badgeIcon), смотря что задано в конфиге —
   *                раньше это были четыре отдельных файла (split-actions/
   *                badge-split/playful/dark), различавшихся только тем,
   *                какие из этих полей прокидывались дальше и каким был
   *                surface по умолчанию. Тёмная поверхность — это
   *                split-actions с surface="ink" (+ обычно frame="browser"),
   *                не отдельный variant: surface уже своё независимое поле
   *                (SectionBase.surface) у любой секции.
   * quiet-split  — то же, что split-actions, но вторая кнопка — текстовая ссылка.
   * panel        — заголовок+реплика сверху, фото с плашкой снизу, боковая
   *                карточка со статами справа, ряд иконка+текст под фото.
   */
  variant?:
    | "photo"
    | "type-only"
    | "split-actions"
    | "quiet-split"
    | "panel"
    /** Тот же приём, что у остальных секций: залипающий заголовок 4/12 слева, содержимое 8/12 справа. */
    | "sticky-split";
  /** Абзацы, один <p> на элемент массива. */
  text: string[];
  /** Не читает только type-only — там второй колонки нет вовсе. */
  photo?: string;
  photoAlt?: string;
  /** Сторона фото. Читает только photo. */
  photoPosition?: "left" | "right";
  /** Кнопки под текстом. Читают все варианты кроме photo/type-only/panel. */
  actions?: CtaLink[];
  /**
   * Пилюля вместо обычной подписи-колонтитула над заголовком.
   * Читает только split-actions; без неё — обычная подпись с тире (number/eyebrow).
   */
  badge?: string;
  /** Иконка в пилюле. Читает только split-actions. */
  badgeIcon?: IconName;
  /** Акцентные пятна за фото (декоративные, `-z-10`). Читает только split-actions. */
  decorative?: boolean;
  /** Оправа медиа-панели — как у Hero showcase. Читает только split-actions. */
  frame?: "plain" | "browser";
  /** Короткая реплика рядом с заголовком, отделённая линией. Читает только panel. */
  aside?: string;
  /** Плашка поверх фото снизу слева. Читает только panel. */
  photoCaption?: { eyebrow: string; title: string };
  /** Боковая карточка со статами и ссылкой рядом с фото. Читает только panel. */
  panel?: AboutPanel;
  /** Ряд иконка+заголовок+текст под фото. Читает только panel. */
  highlights?: AboutHighlight[];
}

// FAQ

export interface FaqItem {
  question: string;
  answer: string;
  /** Иконка в плашке слева от вопроса. Читают split-sidebar, categorized. */
  icon?: IconName;
  /** Теги под ответом. Рендерятся в Accordion независимо от variant. */
  tags?: string[];
  /** Категория для фильтра-пилюль. Читает только categorized; без него у всех items пилюли не рендерятся. */
  category?: string;
}

/** Карточка «остались вопросы?» в боковой колонке split-sidebar. */
export interface FaqSupport {
  icon?: IconName;
  title: string;
  text: string;
  action: CtaLink;
}

export interface FaqSection extends SectionBase {
  type: "faq";
  /**
   * narrow/wide     — исходные, одна колонка на 760/1600px.
   * split-sidebar   — заголовок и опциональная карточка `support` слева,
   *                   аккордеон справа.
   * categorized     — заголовок пилюлей по центру, фильтр-пилюли по
   *                   `item.category` (настоящая фильтрация, клиентский
   *                   стейт), аккордеон карточками с иконкой у вопроса.
   */
  variant?:
    | "narrow"
    | "wide"
    | "split-sidebar"
    | "categorized"
    /** Тот же приём, что у остальных секций: залипающий заголовок 4/12 слева, содержимое 8/12 справа. */
    | "sticky-split";
  items: FaqItem[];
  /** Карточка поддержки в сайдбаре. Читает только split-sidebar. */
  support?: FaqSupport;
}

// Pricing

/**
 * Обычная строка возможности — или явно исключённая (зачёркнутый текст,
 * иконка-крестик вместо галочки). Читают только карточные варианты с
 * чек-листом (ribbon/playful/glass); table/cards/остальные видят везде
 * только строки — обратная совместимость не ломается.
 */
export type PricingFeature = string | { text: string; excluded?: boolean };

export interface PricingPlan {
  name: string;
  price: string;
  unit?: string;
  text?: string;
  features: PricingFeature[];
  action?: CtaLink;
  featured?: boolean;
  photo?: string;
  /** Пилюля-лейбл над карточкой («MOST POPULAR» и т.п.). Читают ribbon/split/dark/playful/glass/banner. */
  badge?: string;
  /** Короткий лейбл над названием тарифа («ENTRY», «01 / DISCOVERY»). Читают ribbon/quote/glass. */
  tag?: string;
  /** Иконка-аватар в кружке над названием. Читает только playful. */
  icon?: IconName;
}

/** Карточка-примечание под тарифами (variant="dark"). */
export interface PricingFootnote {
  icon?: IconName;
  title: string;
  text: string;
  /** accent — левая акцентная линия вместо рамки, как у выделяющейся из ряда карточки. */
  tone?: "plain" | "accent";
}

/**
 * Замыкающий блок под тарифами.
 * banner (surface="ink", без image/points) — variant="banner".
 * плашка с фото+пунктами (surface="surface") — variant="matrix".
 */
export interface PricingClosing {
  title: string;
  text?: string;
  points?: string[];
  image?: string;
  actions?: CtaLink[];
  surface?: "ink" | "surface";
}

export interface PricingComparisonRow {
  label: string;
  /** По одному значению на колонку из `comparison.columns`; true/false — галка/прочерк. */
  values: (string | boolean)[];
  highlight?: boolean;
}

export interface PricingComparisonGroup {
  title: string;
  rows: PricingComparisonRow[];
}

/** Таблица сравнения тарифов построчно (variant="matrix"). */
export interface PricingComparison {
  columns: string[];
  groups: PricingComparisonGroup[];
  /** Индекс колонки для подсветки — обычно рекомендуемый тариф. */
  highlightColumn?: number;
}

export interface PricingSection extends SectionBase {
  type: "pricing";
  /**
   * table/cards — исходные.
   * ribbon  — карточки с лейблом `tag` и цветной лентой `badge` поверх выделенной.
   * split   — текст+`trust` слева, тёмная панель с 2 карточками справа.
   * dark    — центрированная шапка на тёмной поверхности, ряд `footnotes` под тарифами.
   * playful — иконка-аватар в каждой карточке, скруглённые кнопки, `trust`-подпись снизу.
   * quote   — лейбл `tag` в каждой карточке, цитата поверх фото (`quote`) под тарифами.
   * glass   — лейбл `tag`, разноцветный градиент на выделенной карточке, unit «/quarter».
   * banner  — простые карточки, тёмный CTA-баннер `closing` под ними.
   * matrix  — карточки без списка внутри, `comparison`-таблица и `closing` с фото под ними.
   */
  variant?:
    | "table"
    | "cards"
    | "ribbon"
    | "split"
    | "dark"
    | "playful"
    | "quote"
    | "glass"
    | "banner"
    | "matrix"
    /** Тот же приём, что у остальных секций: залипающий заголовок 4/12 слева, содержимое 8/12 справа. */
    | "sticky-split";
  items: PricingPlan[];
  note?: string;
  /** Короткая подпись доверия под сеткой. Читают split/playful. */
  trust?: string;
  /**
   * Ряд карточек-примечаний под тарифами. Раньше жил только в dark —
   * теперь рендерится (parts/PricingFootnotes.tsx) при любом variant,
   * если задан: variant решает раскладку тарифов, не то, какой контент
   * под ними разрешён.
   */
  footnotes?: PricingFootnote[];
  /**
   * Замыкающий баннер/блок под тарифами (parts/PricingClosing.tsx).
   * Раньше жил только в banner/matrix — рендерится при любом variant.
   * closing.surface="ink" даёт сплошной баннер (заголовок+текст+кнопки
   * в строку, без фото/пунктов — прежний вид banner); любое другое
   * значение — раскладку с опциональным фото и списком пунктов (прежний
   * вид matrix). Сам site.config решает, какая оправа подходит контенту.
   */
  closing?: PricingClosing;
  /**
   * Цитата поверх фото под тарифами. Раньше жила только в quote —
   * теперь рендерится (parts/PricingQuoteBlock.tsx) при любом variant.
   */
  quote?: { text: string; author: string; photo: string };
  /**
   * Таблица сравнения тарифов. Раньше жила только в matrix — теперь
   * рендерится (parts/PricingComparisonTable.tsx) при любом variant.
   */
  comparison?: PricingComparison;
  /**
   * Растягивает карточки последнего неполного ряда сетки на пустые
   * колонки (максимум col-span-2 на карточку, см. lib/gridFill.ts).
   * Дефолт `true`; `false` отключает для этой секции. Читают только
   * карточные варианты: cards, ribbon, split, dark, playful, quote,
   * glass, banner, matrix (не table).
   */
  fillLastRow?: boolean;
}

// CTA

export interface CtaSection extends SectionBase {
  type: "cta";
  /**
   * band/quiet — исходные: заголовок слева, кнопки справа в одну строку
   *              (items-end), отличаются только вертикальным ритмом секции.
   * centered   — эйброу пилюлей, заголовок и кнопки по центру в одну колонку.
   * left       — то же по левому краю, эйброу точкой перед подписью вместо пилюли.
   * boxed      — контент в приподнятой карточке (Card variant="elevated")
   *              поверх акцентной заливки, а не прямо на ней.
   * panel      — текст слева, справа — карточка со списком actions
   *              строками на всю ширину, а не рядом кнопок.
   */
  variant?:
    | "band"
    | "quiet"
    | "centered"
    | "left"
    | "boxed"
    | "panel"
    /** Парный к sticky-split остальных секций: та же ось 4/8, без залипания (липнуть не к чему). */
    | "sticky-split";
  actions?: CtaLink[];
  note?: string;
}

// Contact

export interface SelectOption {
  label: string;
  value: string;
}

export interface ContactFieldConfig {
  name: string;
  label: string;
  type: "text" | "tel" | "email" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  /** Варианты селекта, когда подпись и отправляемое значение совпадают. */
  options?: string[];
  /**
   * Варианты селекта с разделением подписи и значения: в заявку уходит
   * value, пользователь видит label. Приоритетнее options, если заданы оба.
   */
  selectOptions?: SelectOption[];
}

export interface ContactSection extends SectionBase {
  type: "contact";
  /**
   * split/stacked — исходные: реквизиты + форма в колонках либо друг под
   *                 другом.
   * boxed         — то же деление 5/7, что у split, но реквизиты — сетка
   *                 карточек (parts/ContactDetailCards), а не список на
   *                 линейках.
   * panels        — полноширинная афиша без Container: форма слева
   *                 (выровнена по общей оси страницы), тёмная панель с
   *                 адресом/телефоном/почтой и картой справа, внахлёст
   *                 к краю окна.
   */
  variant?:
    | "split"
    | "stacked"
    | "boxed"
    | "panels"
    /** Тот же приём, что у остальных секций: залипающий заголовок 4/12 слева, содержимое 8/12 справа. */
    | "sticky-split";
  /**
   * plain — форма лежит прямо на поверхности секции (база),
   * cardContainer — форма упакована в Card variant="elevated".
   * Не путать с variant: variant задаёт раскладку колонок, layout —
   * подложку под самой формой.
   */
  layout?: "plain" | "cardContainer";
  fields: ContactFieldConfig[];
  submitLabel: string;
  consent: string;
  successTitle: string;
  successText: string;
  errorText: string;
  /** Заголовок левой колонки с реквизитами. */
  detailsTitle?: string;
  /** URL embed-iframe карты (Google/Yandex Maps). Без него карта не рендерится. */
  mapSrc?: string;
  /** Показывать карту. По умолчанию true — читает только наличие mapSrc. */
  showMap?: boolean;
  /**
   * Порядок формы и реквизитов НА МОБИЛЬНОМ, где split/boxed переходят
   * в один столбец (ниже lg). По умолчанию "form-first" — форма первая:
   * это то, ради чего человек открыл раздел, реквизиты — второстепенны.
   * На десктопе (lg+, где колонки идут бок о бок) порядок не меняет —
   * там расположение слева/справа решает сам variant, это отдельная ось.
   * Читают только split/boxed — у stacked/panels свой порядок уже задан
   * версткой напрямую.
   */
  order?: "form-first" | "info-first";
}

export type Section =
  | HeroSection
  | StatsSection
  | FeaturesSection
  | StepsSection
  | GallerySection
  | TestimonialsSection
  | TeamSection
  | AboutSection
  | FaqSection
  | PricingSection
  | CtaSection
  | ContactSection;

export type SectionType = Section["type"];

// Конфиг сайта целиком

export interface BrandConfig {
  name: string;
  /** Короткий знак в хедере/футере, единственное акцентное место в брендинге.
   * Либо текст ("К&П"), либо локальный путь к файлу лого (`/images/...`) —
   * определяется по ведущему слэшу в `components/ui/BrandMark.tsx`. */
  mark: string;
  legalName: string;
  tagline: string;
  description: string;
}

export interface ContactsConfig {
  phone: string;
  phoneHref: string;
  email: string;
  telegram: string;
  telegramHref: string;
  whatsapp?: string;
  whatsappHref?: string;
  instagram?: string;
  instagramHref?: string;
  address: string;
  addressShort: string;
  postalCode: string;
  city: string;
  country: string;
  geo: { lat: number; lng: number };
  hours: string;
  hoursSchema: string;
  inn?: string;
  ogrn?: string;
}

export interface SeoConfig {
  siteUrl: string;
  title: string;
  titleTemplate: string;
  description: string;
  keywords: string[];
  locale: string;
  ogImageAlt: string;
  /** Текст на OG-картинке (генерится через next/og). */
  ogHeadline: string;
  priceRange: string;
}

export interface ThemeConfig {
  darkModeToggle: boolean;
  defaultMode: "light" | "dark";
  /** Символ для favicon, если нет файла-картинки. */
  faviconGlyph: string;
  /**
   * Тариф оформления. Не задан — "econom" (плоская база).
   * Одно это поле включает всю глубину «Стандарта»: тени, радиусы,
   * поверхности карточек, подсветку секций, плашки под иконками — и
   * заодно переключает дефолтные раскладки секций на карточные.
   * Подробно — docs/presets.md.
   */
  preset?: Preset;
  /**
   * Форма .icon-tile по умолчанию для всего сайта: circle — круглая
   * плашка, squircle — скруглённый квадрат, bare — голая иконка без
   * плашки/фона. Не задано — "circle". Любая секция может переопределить
   * это своим SectionBase.iconShape — см. его doc-комментарий за списком
   * секций, которые вообще читают форму плашки.
   */
  iconShape?: IconShape;
  /**
   * Сайтвайдный дефолт typography-масштаба заголовков секций (.section-title,
   * theme/tokens.css). Не задано — "standard". Любая секция может
   * переопределить это своим SectionBase.titleStyle — см. TitleStyle.
   */
  titleStyle?: TitleStyle;
}

/**
 * Дизайн хедера. Header не проходит через SectionRenderer (его нет в
 * site.config.sections), поэтому свой вариант выбирает не lib/preset.ts,
 * а прямое поле здесь, в конфиге сайта.
 *
 * default   — знак слева, навигация по центру, кнопка справа (базовый).
 * bold      — жирный вордмарк, навигация и кнопка сгруппированы справа.
 * classic   — вордмарк слева, навигация по центру, текстовая ссылка +
 *             акцентная кнопка справа (двухуровневые actions).
 * compact   — навигация по центру, кнопка-таблетка справа.
 * monogram  — знак-плашка с инициалом на акцентном градиенте слева, кнопка с крупным радиусом.
 * centered  — знак и навигация в две строки, всё по центру, без кнопки.
 * glass     — стеклянная подложка включена всегда, а не только при скролле.
 * split     — навигация разбита на два кластера по бокам от вордмарка.
 */
export type HeaderVariant =
  | "default"
  | "bold"
  | "classic"
  | "compact"
  | "monogram"
  | "centered"
  | "glass"
  | "split";

export interface HeaderConfig {
  actions: CtaLink[];
  variant?: HeaderVariant;
  /**
   * До скролла хедер прозрачный и лежит поверх hero (см. .ui-header в
   * globals.css). true (по умолчанию) — так и остаётся: хедер сливается
   * с hero, пока страницу не прокрутили. false — хедер держит непрозрачный
   * фон/тень с первого кадра, как будто страница уже прокручена (нужно,
   * когда hero недостаточно контрастен для наплывающего хедера).
   */
  transparentBeforeScroll?: boolean;
  /**
   * Хедер уезжает за верхний край при скролле вниз и возвращается при
   * скролле вверх (после --header-height от начала страницы — самый
   * верх всегда его показывает). По умолчанию false — хедер обычный
   * sticky, всегда виден. Открытое мобильное меню всегда отменяет
   * скрытие, независимо от этого поля.
   */
  hideOnScroll?: boolean;
}

/** Колонка сгруппированных ссылок в футере (Bold/Classic/Monogram). */
export interface FooterColumn {
  title: string;
  links: CtaLink[];
}

/**
 * Иконка-«соцсеть» в футере. Это не логотипы конкретных сетей (Facebook,
 * X и т.п.), а нейтральные иконки из общего реестра — как и в HeroTrust,
 * чужой брендинг в шаблон не тащим. `label` — доступное имя ссылки для
 * скринридера, текстом на странице не выводится.
 */
export interface FooterSocialLink {
  icon: IconName;
  href: string;
  label: string;
}

/**
 * Форма подписки в футере (Monogram). Настоящая форма method="get",
 * как HeroSearch — уходит на `action` без JS, никакая форма в шаблоне не
 * должна молча съедать введённое.
 */
export interface FooterNewsletter {
  title: string;
  text: string;
  placeholder: string;
  submitLabel: string;
  action: string;
}

/**
 * Дизайн футера. Как и Header, футер не проходит через SectionRenderer —
 * вариант выбирает не lib/preset.ts, а прямое поле здесь.
 *
 * default   — знак и тег слева, плоский список разделов, реквизиты справа.
 * bold      — знак+соцссылки слева, сгруппированные колонки ссылок справа.
 * classic   — то же, три колонки вместо плоского списка.
 * compact   — одна строка: знак+копирайт слева, ссылки справа.
 * monogram  — колонки + форма подписки, знак-плашка с инициалом
 *             (см. monogramBackground — раньше это были два почти
 *             идентичных варианта, gradient и glass, отличавшиеся только
 *             фоном плашки и поверхностью секции).
 * centered  — всё по центру: знак, один ряд ссылок, копирайт, соцссылки.
 * split     — ссылки двумя кластерами по бокам от центрального вордмарка.
 */
export type FooterVariant =
  | "default"
  | "bold"
  | "classic"
  | "compact"
  | "monogram"
  | "centered"
  | "split";

export interface FooterConfig {
  note: string;
  legal: string[];
  links: CtaLink[];
  variant?: FooterVariant;
  /** Сгруппированные колонки ссылок. Без них колончатые варианты (bold,
   *  classic, monogram) просто не рендерят блок колонок. */
  columns?: FooterColumn[];
  social?: FooterSocialLink[];
  newsletter?: FooterNewsletter;
  /**
   * Фон знака-плашки и поверхность секции у варианта monogram.
   * "gradient" (по умолчанию) — плашка на акцентном градиенте, секция на
   * paper (бывший вариант gradient). "surface" — сплошной акцент в
   * плашке, секция на собственной поверхности surface (бывший glass).
   */
  monogramBackground?: "gradient" | "surface";
}

export interface SiteConfig {
  brand: BrandConfig;
  contacts: ContactsConfig;
  seo: SeoConfig;
  theme: ThemeConfig;
  analytics: { yandexMetrikaId: string | null };
  header: HeaderConfig;
  footer: FooterConfig;
  sections: Section[];
}
