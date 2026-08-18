import type { SiteConfig } from "@/types/site";

// Весь контент сайта живёт здесь, компоненты только рендерят.
//
// Это ДЕМО-КОНФИГ шаблона «Модуль» — вымышленный SaaS-бренд «конструктор
// сайтов», собранный нарочно так, чтобы у каждой секции были заполнены
// ВСЕ опциональные поля, которые читает выбранный variant. Цель — не
// продакшен-лендинг, а рабочий стенд для сравнения раскладок: над каждым
// полем `variant` (и над двумя вторыми осями — Stats.containerVariant и
// ContactForm.layout) стоит комментарий со списком всех допустимых значений
// из types/site.ts — меняете строку, сохраняете, смотрите разницу.
//
// Под реального клиента: см. алгоритм в CLAUDE.md, §5 (референсы →
// палитра/шрифты → варианты секций → ритм поверхностей → пресет), затем
// полностью переписать бренд/контакты/SEO и контент секций под него.
//
// Два места, где этот файл СПЕЦИАЛЬНО не образец:
//   1. variant у каждой секции свой и максимально непохожий на соседей —
//      это стенд каталога. Реальный проект держится на 2–3 сквозных
//      приёмах (docs/section-system.md, врезка в начале файла).
//   2. Палитра и шрифты здесь — демо-бренд. Переписываются целиком по
//      референсам клиента, а не «подвигаются» от текущих значений.
export const siteConfig: SiteConfig = {
    brand: {
        name: "Модуль",
        mark: "М",
        legalName: "ООО «Модуль Студио»",
        tagline: "Конструктор сайтов на готовых блоках",
        description:
            "«Модуль» — конструктор лендингов для агентств и фрилансеров: готовые секции, два тарифа оформления, вёрстка на токенах вместо хардкода.",
    },

    contacts: {
        phone: "+7 495 000-11-22",
        phoneHref: "tel:+74950001122",
        email: "hello@modul.site",
        telegram: "@modul_team",
        telegramHref: "https://t.me/modul_team",
        // whatsapp/whatsappHref, instagram/instagramHref — опциональны в
        // ContactsConfig, но заполнены: без *Href строка не становится
        // ссылкой (см. docs/section-system.md, раздел про ContactForm).
        whatsapp: "+7 495 000-11-22",
        whatsappHref: "https://wa.me/74950001122",
        instagram: "@modul.site",
        instagramHref: "https://instagram.com/modul.site",
        address: "125009, Москва, Тверская ул., 22, БЦ «Северный», офис 401",
        addressShort: "Тверская ул., 22, офис 401",
        postalCode: "125009",
        city: "Москва",
        country: "RU",
        geo: { lat: 55.7601, lng: 37.6064 },
        hours: "Пн–Пт, 10:00–19:00",
        hoursSchema: "Mo-Fr 10:00-19:00",
        inn: "7701234567",
        ogrn: "1157746012345",
    },

    seo: {
        siteUrl: "https://modul.site",
        title: "Модуль — конструктор сайтов для агентств и фрилансеров",
        titleTemplate: "%s — Модуль",
        description:
            "Демо-шаблон «Модуль»: 12 типов секций, 120 вариантов раскладок и два тарифа оформления — econom, standard. Меняете site.config.ts, а не компоненты.",
        keywords: [
            "конструктор сайтов",
            "шаблон лендинга",
            "next.js шаблон",
            "варианты секций",
            "econom standard",
            "site.config.ts",
            "готовые блоки для лендинга",
        ],
        locale: "ru_RU",
        ogImageAlt: "Модуль — конструктор сайтов на готовых блоках",
        ogHeadline: "Соберите лендинг из готовых секций за один день",
        priceRange: "₽₽",
    },

    theme: {
        // Включён нарочно: демо-конфиг должен проверять и светлую, и тёмную
        // тему одной кнопкой в хедере.
        darkModeToggle: true,
        // defaultMode: "light" | "dark"
        defaultMode: "light",
        faviconGlyph: "М",
        // Тариф оформления — одна ручка на весь сайт.
        // "econom"   — плоско и документно: линейки вместо карточек, теней нет.
        // "standard" — глубина: своя поверхность и контактная тень у
        //              карточек, крупнее скругления, плашки под иконками,
        //              поля-коробки, живой hover; заодно все секции без
        //              явного variant переключаются на карточные раскладки.
        // Что именно меняется и как собирать «Стандарт» — docs/presets.md.
        preset: "standard",
        // Форма .icon-tile по умолчанию для всего сайта — одна ручка на
        // все секции сразу (Features, Stats, Steps, Gallery, Pricing,
        // Contact, FAQ, About). Любая секция может переопределить своим
        // iconShape. "circle" | "squircle" | "bare".
        iconShape: "bare",
    },

    analytics: {
        // Вписать ID Яндекс.Метрики — скрипт подключится сам. null = метрики нет.
        // На демо-стенде намеренно null: подделывать чужой ID счётчика незачем.
        yandexMetrikaId: null,
    },

    header: {
        // variant: "default" | "bold" | "classic" | "compact" | "monogram" |
        //          "centered" | "glass" | "split" | "editorial" |
        //          "product" | "atelier"
        variant: "split",
        actions: [
            { label: "Смотреть демо", href: "#hero", variant: "secondary" },
            { label: "Обсудить проект", href: "#contact", variant: "primary" },
        ],
    },

    footer: {
        // variant: "default" | "bold" | "classic" | "compact" | "monogram" |
        //          "centered" | "split" | "editorial" |
        //          "product" | "atelier"
        variant: "monogram",
        // monogramBackground: "gradient" | "surface" — только для variant: "monogram".
        monogramBackground: "gradient",
        note: "Это демо-конфиг шаблона «Модуль»: тексты, цифры и кейсы вымышленные — для сравнения вариантов секций, а не продакшен-лендинг.",
        legal: [
            "ООО «Модуль Студио»",
            "ИНН 7701234567 · ОГРН 1157746012345",
        ],
        links: [{ label: "Политика конфиденциальности", href: "/privacy" }],
        // columns читают только bold/classic/monogram; social/newsletter
        // читают все варианты футера — без данных секция просто не
        // рисует соответствующий блок.
        columns: [
            {
                title: "Продукт",
                links: [
                    { label: "Возможности", href: "#services" },
                    { label: "Тарифы оформления", href: "#pricing" },
                    { label: "Кейсы на шаблоне", href: "#cases" },
                ],
            },
            {
                title: "Компания",
                links: [
                    { label: "О шаблоне", href: "#about" },
                    { label: "Команда", href: "#team" },
                    { label: "Контакты", href: "#contact" },
                ],
            },
            {
                title: "Документы",
                links: [
                    { label: "Политика конфиденциальности", href: "/privacy" },
                    { label: "Публичная оферта", href: "/privacy#oferta" },
                ],
            },
        ],
        social: [
            { icon: "messageCircle", href: "https://t.me/modul_team", label: "Telegram" },
            { icon: "mail", href: "mailto:hello@modul.site", label: "Почта" },
            { icon: "globe", href: "https://modul.site", label: "Сайт" },
        ],
        newsletter: {
            title: "Новые варианты секций — на почту",
            text: "Раз в месяц присылаем, что добавили в шаблон и какие ниши закрыли новыми пресетами.",
            placeholder: "you@company.com",
            submitLabel: "Подписаться",
            action: "/api/subscribe",
        },
    },

    // Секции страницы, по порядку. surface у каждой — просто фон
    // (paper/surface/ink/accent), чередуем их по схеме из CLAUDE.md §3:
    // paper → surface → paper → surface → paper → ink → surface → paper →
    // surface → paper → accent → surface.
    sections: [
        {
            id: "hero",
            type: "hero",
            surface: "paper",
            // variant: "type-only" | "split" | "centered" | "showcase" |
            //          "poster" | "service" | "sticky-split" | "editorial" |
            //          "product" | "atelier"
            variant: "service",
            // rail читают только type-only/split/centered — showcase его
            // игнорирует (номер/рельс уступают место badge). Оставлено
            // заполненным для быстрого переключения variant.
            rail: "Конструктор сайтов · демо-сборка",
            headline: ["Это шаблон", "конструктора,", "а не готовый сайт"],
            lead: "Демо-сборка «Модуль»: та же вёрстка, те же токены, что получит ваш клиент. Переключайте variant у любой секции ниже — данные и раскладка уже на месте.",
            badge: "Демо-сборка · 120 вариантов секций",
            // frame: "plain" | "browser" — оправа медиа-панели, без image не используется.
            frame: "browser",
            image: "/images/hero-product.jpg",
            actions: [
                { label: "Смотреть возможности", href: "#services", variant: "primary" },
                { label: "Как собрать лендинг", href: "#process", variant: "secondary" },
            ],
            facts: [
                { value: "120", label: "готовых вариантов секций" },
                { value: "2 тарифа", label: "econom / standard" },
                { value: "12 типов", label: "секций — у каждой своя раскладка" },
            ],
            proof: {
                avatars: [
                    "/images/testimonial-1.jpg",
                    "/images/testimonial-2.jpg",
                    "/images/testimonial-3.jpg",
                    "/images/testimonial-4.jpg",
                ],
                text: "Уже используют 60+ студий и фрилансеров",
            },
            // widget читают split/showcase (там image главнее — см.
            // resolveHeroLayout) и product, где карточка метрик и есть
            // вторая колонка: без неё product откатывается на centered.
            // Заполнен, чтобы переключение variant не требовало дописывать
            // данные — как и rail выше.
            widget: {
                badge: "Сборка за 15 минут",
                title: "Что уходит в прототип",
                metrics: [
                    { label: "Готовых вариантов секций", value: "120", progress: 100 },
                    { label: "Типов секций", value: "12", progress: 75 },
                    { label: "Тарифа оформления", value: "2", progress: 40 },
                ],
                chart: {
                    caption: "Секций собрано за неделю в демо-проектах",
                    values: [38, 54, 46, 68, 80, 62, 94],
                    peakIndex: 6,
                },
            },
        },

        {
            id: "stats",
            type: "stats",
            surface: "surface",
            // variant: "band" | "grid" | "badge" | "rows" | "bento" | "photo" |
            //          "plain" | "sticky-split" | "editorial" |
            //          "product" | "atelier"
            variant: "plain",
            // containerVariant: "flat" | "elevated" | "bordered" — читают
            // только band/grid, для photo не применяется.
            number: "01",
            eyebrow: "Цифры",
            title: "Шаблон в цифрах",
            lead: "Коротко — почему агентства выбирают «Модуль» для клиентских лендингов вместо вёрстки с нуля.",
            image: "/images/stats-photo.jpg",
            items: [
                { value: "60", suffix: "+", label: "студий и агентств", icon: "globe" },
                { value: "120", label: "вариантов секций", icon: "check" },
                { value: "15", suffix: "", label: "минут на сборку прототипа", icon: "clock" },
                { value: "4.8", label: "средний рейтинг в отзывах ниже", icon: "star" },
            ],
        },

        {
            id: "services",
            type: "features",
            surface: "paper",
            // variant: "table" | "cards" | "bento" | "alternating" | "compact" |
            //          "sticky-split" | "editorial" |
            //          "product" | "atelier"
            variant: "bento",
            number: "02",
            nav: "Возможности",
            eyebrow: "Возможности",
            title: "Из чего собран шаблон",
            lead: "12 типов секций, у каждой — несколько независимых раскладок. Меняется variant в конфиге, компоненты трогать не нужно.",
            items: [
                {
                    icon: "globe",
                    title: "120 вариантов раскладки",
                    text: "У Hero — 7 вариантов, у Stats — 8, у Steps — 9, у Pricing — 11. Переключаются одним полем variant в site.config.ts, без правки компонентов.",
                    points: [
                        "Каждый вариант — законченный React-компонент",
                        "Дефолт зависит от тарифа, если variant не задан",
                        "Явный variant в конфиге всегда главнее дефолта",
                    ],
                    tags: ["Hero", "Stats", "Features", "Steps", "Gallery"],
                    link: { label: "Смотреть кейсы", href: "#cases", variant: "quiet" },
                },
                {
                    icon: "check",
                    title: "2 тарифа оформления",
                    text: "econom — плоско и документно. standard — карточки, тени, живой hover.",
                    points: [
                        "Одна ручка theme.preset на весь сайт",
                        "Дефолтные раскладки секций переключаются вместе с тарифом",
                        "dev-warning, если раскладка не может показать глубину тарифа",
                    ],
                    link: { label: "Сравнить тарифы", href: "#pricing", variant: "quiet" },
                },
                {
                    icon: "clock",
                    title: "Готово за один день",
                    text: "Палитра, шрифты и состав секций собираются по референсам клиента за один проход: см. алгоритм в CLAUDE.md.",
                    points: [
                        "Шаг 0: без 2–4 референсов токены не трогаются",
                        "Правило ритма поверхностей — paper/surface/ink/accent",
                        "Чек-лист сборки «Стандарта» в docs/presets.md",
                    ],
                    link: { label: "Как собрать лендинг", href: "#process", variant: "quiet" },
                },
                {
                    icon: "shieldCheck",
                    title: "Честные предупреждения в консоли",
                    text: "Если конфиг просит невозможное — фото в табличной раскладке, плоский вариант в дорогом тарифе — dev-режим скажет об этом вслух.",
                    points: [
                        "Нет молчаливых пустых блоков",
                        "Готовая замена в тексте предупреждения",
                        "В проде проверки не выполняются вообще",
                    ],
                    link: { label: "Частые вопросы", href: "#faq", variant: "quiet" },
                },
                {
                    icon: "star",
                    title: "SEO и OG-картинка из коробки",
                    text: "Метатеги, хлебные крошки и OG-изображение собираются из того же site.config.ts — второй раз содержимое вводить не нужно.",
                    points: [
                        "OG-картинка рендерится через next/og",
                        "JSON-LD для организации и контактов",
                        "Дубли палитры для рантайма без CSS — theme/palette.ts",
                    ],
                    link: { label: "Задать вопрос", href: "#contact", variant: "quiet" },
                },
            ],
        },

        {
            id: "about",
            type: "about",
            surface: "surface",
            // variant: "photo" | "type-only" | "split-actions" |
            //          "quiet-split" | "panel" | "sticky-split" | "editorial" |
            //          "product" | "atelier"
            variant: "panel",
            number: "03",
            eyebrow: "Наш подход",
            title: "Гибкость поверх строгой системы",
            text: [
                "Мы убираем трение между дизайном и вёрсткой: инженерим правила, чтобы решения оставались за вами, а не за компонентом.",
            ],
            actions: [
                { label: "Изучить возможности", href: "#services", variant: "primary" },
                { label: "Скачать site.config.ts", href: "#contact" },
            ],
            photo: "/images/about-team.jpg",
            photoAlt: "Команда студии «Модуль» за работой",
            // highlights читают panel и editorial (в editorial это две
            // врезки на волосяных линейках под крупной репликой — без них
            // левая колонка там остаётся из одного абзаца и не набирает
            // высоту фотографии).
            highlights: [
                {
                    title: "Подход",
                    text: "Раскладку решает variant, глубину — тариф. Компоненты не трогают ни то, ни другое: и то и другое приезжает из токенов.",
                },
                {
                    title: "Принципы",
                    text: "Ничего не обрезаем многоточием, фиксированных высот не ставим, каждый ряд выравниваем по внутренним линиям — а не по краю карточки.",
                },
            ],
            // panel.stats читают panel (боковая карточка) и product
            // (сетка метрик 2×2 справа вместо фотографии).
            panel: {
                title: "Что внутри",
                text: "Двенадцать типов секций, три сквозных семейства и два тарифа оформления — всё переключается полями конфига.",
                stats: [
                    { value: "2021", label: "Год первой версии шаблона" },
                    { value: "120", label: "Готовых вариантов секций" },
                    { value: "12", label: "Типов секций в конфиге" },
                    { value: "4.8", label: "Средняя оценка в отзывах" },
                ],
            },
        },

        {
            id: "process",
            type: "steps",
            surface: "paper",
            // variant: "rail" | "stack" | "timeline-vertical" | "cards" | "cascade" |
            //          "timeline-horizontal" | "split" | "numbered-cards" |
            //          "sticky-split" | "editorial" |
            //          "product" | "atelier"
            variant: "cards",
            number: "04",
            nav: "Как собрать",
            eyebrow: "Процесс",
            title: "Как за один день собрать лендинг из этого шаблона",
            lead: "Тот же порядок, что в CLAUDE.md, §5 — только применённый к самому шаблону.",
            items: [
                {
                    number: "01",
                    title: "Соберите референсы",
                    text: "Просите у клиента 2–4 реальных референса — ссылки, скриншоты, лого. Без них палитру и шрифты трогать нельзя: CLAUDE.md, §5, шаг 0.",
                    meta: "до первой правки",
                    icon: "search",
                    photo: "/images/steps-1.jpg",
                },
                {
                    number: "02",
                    title: "Соберите тон",
                    text: "По референсам переписываете палитру в theme/tokens.css и theme/palette.ts, подбираете шрифтовую пару под бренд и подключаете её в app/layout.tsx.",
                    meta: "токены + шрифты",
                    icon: "check",
                    photo: "/images/steps-2.jpg",
                },
                {
                    number: "03",
                    title: "Подберите варианты",
                    text: "Выбираете 2–3 сквозных приёма под бренд и проставляете variant по каталогу CLAUDE.md, §2 — не по одной «самой интересной» раскладке на секцию.",
                    meta: "120 вариантов секций",
                    icon: "globe",
                    photo: "/images/steps-3.jpg",
                },
                {
                    number: "04",
                    title: "Замените данные",
                    text: "Переписываете site.config.ts под контент клиента: бренд, контакты, SEO, содержимое секций — как в этом демо-файле.",
                    meta: "полностью готово",
                    icon: "shieldCheck",
                    photo: "/images/steps-4.jpg",
                    featured: true,
                },
            ],
        },

        {
            id: "cases",
            type: "gallery",
            surface: "ink",
            // variant: "table" | "grid" | "cards-icon" | "photo-grid" |
            //          "photo-bento" | "sticky-split" | "editorial" |
            //          "product" | "atelier"
            variant: "photo-grid",
            number: "05",
            nav: "Кейсы",
            eyebrow: "Реестр кейсов",
            title: "Что уже собрано на этом шаблоне",
            lead: "Фабулы для демо-стенда — реальные проекты студий, которые используют «Модуль», обезличены до формата кейса.",
            items: [
                {
                    category: "SaaS-платформа",
                    title: "Личный кабинет для агентства недвижимости",
                    problem: "Агентству нужен был лендинг под запуск личного кабинета за две недели, без верстальщика в штате.",
                    result: "Собрали на тарифе standard, заменили только контент и палитру под бренд агентства.",
                    year: "2025",
                    status: "Запущено",
                    tags: ["Next.js", "standard"],
                    photo: "/images/gallery-1.jpg",
                    link: { label: "Обсудить похожий проект", href: "#contact", variant: "quiet" },
                    stats: [
                        { value: "3 недели", label: "от брифа до продакшена" },
                        { value: "96", label: "баллов Lighthouse" },
                    ],
                },
                {
                    category: "Лендинг",
                    title: "Промо-страница фитнес-марафона",
                    problem: "Нужен был яркий одностраничник под разовую акцию с ограниченным бюджетом.",
                    result: "Взяли тариф econom, вариант poster для Hero — без теней, но с ярким фоновым фото.",
                    year: "2025",
                    status: "В работе",
                    tags: ["econom", "poster"],
                    photo: "/images/gallery-2.jpg",
                    link: { label: "Обсудить похожий проект", href: "#contact", variant: "quiet" },
                },
                {
                    category: "Каталог услуг",
                    title: "Сайт стоматологической клиники",
                    problem: "Клинике нужна была спокойная, «медицинская» подача без продуктового глянца.",
                    result: "Палитру собрали по вывеске и полиграфии клиники, Features variant=table, Hero variant=split с фото врача.",
                    year: "2024",
                    status: "Запущено",
                    tags: ["econom", "table"],
                    photo: "/images/gallery-3.jpg",
                    link: { label: "Обсудить похожий проект", href: "#contact", variant: "quiet" },
                },
                {
                    category: "Портфолио",
                    title: "Витрина архитектурного бюро",
                    problem: "Бюро хотело сдержанный имиджевый сайт без карточек и теней — плоская документная подача вместо продуктового глянца.",
                    result: "Тариф econom, Hero variant=showcase с фото проекта в рамке browser.",
                    year: "2024",
                    status: "Запущено",
                    tags: ["econom", "showcase"],
                    photo: "/images/gallery-4.jpg",
                    link: { label: "Обсудить похожий проект", href: "#contact", variant: "quiet" },
                },
            ],
            note: "Фабулы обезличены и частично изменены для демонстрации — детали конкретных проектов охраняются NDA студий.",
        },

        {
            id: "testimonials",
            type: "testimonials",
            surface: "surface",
            // variant: "quotes" | "cards" | "bento" | "rated-cards" | "spotlight" |
            //          "sticky-split" | "editorial" |
            //          "product" | "atelier"
            variant: "spotlight",
            number: "06",
            nav: "Отзывы",
            eyebrow: "Отзывы",
            title: "Что говорят те, кто уже собирал на «Модуле»",
            lead: "Тоже демо-контент — но фразы списаны с реальных сообщений в поддержку, только имена изменены.",
            items: [
                {
                    quote: "Взяли шаблон под лендинг марафона за день до старта продаж. Успели — потому что не пришлось спорить с версткой, только с текстами.",
                    author: "Марина Соколова",
                    meta: "арт-директор студии «Формат»",
                    photo: "/images/testimonial-1.jpg",
                    rating: 5,
                },
                {
                    quote: "Дал джуну задачу собрать посадочную по этому шаблону — справился за смену, включая замену палитры под нишу клиента.",
                    author: "Тимур Ким",
                    meta: "тимлид фронтенда, аутсорс-команда",
                    photo: "/images/testimonial-4.jpg",
                    rating: 5,
                    featured: true,
                },
                {
                    quote: "Раньше на лендинг под клиента уходила неделя. На «Модуле» — день на контент и полдня на палитру с шрифтами.",
                    author: "Дмитрий Ковалёв",
                    meta: "фрилансер, лендинги под ключ",
                    photo: "/images/testimonial-2.jpg",
                    rating: 5,
                },
                {
                    quote: "Понравилось, что тариф — это буквально одна строчка в конфиге, а не три разных проекта на поддержке.",
                    author: "Анна Гареева",
                    meta: "продюсер digital-агентства «Северный полюс»",
                    photo: "/images/testimonial-3.jpg",
                    rating: 4,
                },
            ],
            trust: {
                text: "Каждую неделю на шаблоне собирают 10+ новых лендингов",
                items: [
                    { label: "Агентства", icon: "briefcase" },
                    { label: "Фрилансеры", icon: "users" },
                    { label: "Продуктовые команды", icon: "globe" },
                ],
            },
        },

        {
            id: "team",
            type: "team",
            surface: "paper",
            // variant: "columns" | "rows" | "cards" | "photo-cards" |
            //          "badge-avatars" | "tags-cards" | "bento" |
            //          "sticky-split" | "editorial" |
            //          "product" | "atelier"
            variant: "bento",
            number: "07",
            nav: "Команда",
            eyebrow: "Команда",
            title: "Кто делает «Модуль»",
            lead: "Дело ведёт конкретный человек, а не абстрактный отдел поддержки шаблона.",
            items: [
                {
                    name: "Ковалёв Илья",
                    role: "Основатель, продукт",
                    focus: "Архитектура секций, токенов и системы пресетов",
                    experience: "9 лет в вебе",
                    photo: "/images/team-1.jpg",
                    tags: ["Design systems", "Next.js", "Tailwind"],
                    link: { label: "Написать", href: "#contact", variant: "quiet" },
                },
                {
                    name: "Светлана Орлова",
                    role: "Арт-директор",
                    focus: "Палитры и типографика под нишу клиента",
                    experience: "7 лет в брендинге",
                    photo: "/images/team-2.jpg",
                    tags: ["Брендинг", "Типографика"],
                    link: { label: "Написать", href: "#contact", variant: "quiet" },
                },
                {
                    name: "Артём Белов",
                    role: "Frontend-инженер",
                    focus: "Компоненты и пресеты econom / standard",
                    experience: "6 лет на React",
                    photo: "/images/team-3.jpg",
                    tags: ["React", "Server Components"],
                    link: { label: "Написать", href: "#contact", variant: "quiet" },
                },
                {
                    name: "Полина Чернова",
                    role: "Контент-стратег",
                    focus: "Тексты и структура секций под клиентский бриф",
                    experience: "5 лет в копирайтинге",
                    photo: "/images/team-4.jpg",
                    tags: ["UX-копирайтинг", "SEO"],
                    link: { label: "Написать", href: "#contact", variant: "quiet" },
                },
            ],
            banner: {
                title: "Хотите такой же конструктор для своей студии?",
                text: "Пришлите бриф — соберём фирменный шаблон под вашу нишу за 5 рабочих дней.",
                action: { label: "Обсудить проект", href: "#contact", variant: "primary" },
            },
        },

        {
            id: "faq",
            type: "faq",
            surface: "surface",
            // variant: "narrow" | "wide" | "split-sidebar" | "categorized" |
            //          "sticky-split" | "editorial" |
            //          "product" | "atelier"
            variant: "categorized",
            number: "08",
            nav: "Вопросы",
            eyebrow: "Вопросы и ответы",
            title: "Что чаще всего спрашивают про шаблон",
            items: [
                {
                    question: "Сколько стоит лицензия на шаблон?",
                    answer: "Тарифы в разделе «Тарифы» — это тарифы ОФОРМЛЕНИЯ (глубина карточек, тени, радиусы), а не число доступных секций: все 12 типов секций и все 120 вариантов доступны в любом из двух. Цена лицензии считается отдельно, по брифу.",
                    icon: "handCoins",
                    category: "Тарифы",
                    tags: ["Тарифы", "Оплата"],
                },
                {
                    question: "Как переключить вариант секции?",
                    answer: "Одно поле variant в объекте секции в site.config.ts. Если поле не задано — подставляется дефолт текущего тарифа (lib/preset.ts). Явно указанный variant всегда главнее дефолта.",
                    icon: "check",
                    category: "Настройка",
                    tags: ["Варианты", "Конфиг"],
                },
                {
                    question: "Что делать, если раскладка выглядит плоско на тарифе standard?",
                    answer: "Скорее всего, у секции явно указан табличный variant (table/quotes/columns) — в дорогом тарифе тени и радиусы физически некуда положить, глубину показывает только карточка. Уберите variant совсем или поставьте карточный вариант — dev-режим подскажет какой именно.",
                    icon: "shieldCheck",
                    category: "Настройка",
                    tags: ["Поддержка", "Пресеты"],
                },
                {
                    question: "На чём хостить готовый сайт?",
                    answer: "Шаблон — обычное Next.js App Router приложение, без специфичных зависимостей от одной платформы. Деплоится куда угодно, где есть Node.js-рантайм.",
                    icon: "globe",
                    category: "Технические",
                    tags: ["Хостинг", "Деплой"],
                },
                {
                    question: "Сколько времени уходит на адаптацию под нишу?",
                    answer: "По чек-листу из CLAUDE.md — палитра, шрифты, варианты секций и ритм поверхностей — обычно укладываются в один рабочий день, без учёта написания контента.",
                    icon: "clock",
                    category: "Настройка",
                    tags: ["Сроки"],
                },
                {
                    question: "Есть ли SEO и OG-картинка из коробки?",
                    answer: "Да: метатеги, JSON-LD для организации и адреса, а также OG-изображение собираются из того же site.config.ts через lib/seo.ts — второй раз вводить контент не нужно.",
                    icon: "search",
                    category: "Технические",
                    tags: ["SEO", "OG"],
                },
            ],
            support: {
                icon: "mail",
                title: "Не нашли ответ?",
                text: "Опишите задачу — подскажем, какой пресет и какие варианты секций подойдут под вашу нишу.",
                action: { label: "Написать в Telegram", href: "https://t.me/modul_team", variant: "primary" },
            },
        },

        {
            id: "pricing",
            type: "pricing",
            surface: "paper",
            // variant: "table" | "cards" | "ribbon" | "split" | "dark" | "playful" |
            //          "quote" | "glass" | "banner" | "matrix" |
            //          "sticky-split" | "editorial" |
            //          "product" | "atelier"
            variant: "matrix",
            number: "09",
            nav: "Тарифы",
            eyebrow: "Тарифы оформления",
            title: "econom / standard — в чём разница",
            lead: "Тариф — это глубина и пластика (поверхность карточки, тень, радиусы), а не количество доступных секций: оба открывают полный каталог.",
            items: [
                {
                    name: "Econom",
                    tag: "СТАРТ",
                    icon: "search",
                    price: "0 ₽",
                    unit: "/ навсегда",
                    text: "Для первого прототипа и учебных лендингов.",
                    features: [
                        "Плоские раскладки без теней",
                        "Все 12 типов секций",
                        { text: "Поддержка в Telegram", excluded: true },
                    ],
                    action: { label: "Скачать шаблон", href: "#contact", variant: "secondary" },
                },
                {
                    name: "Standard",
                    tag: "ВЫБОР СТУДИЙ",
                    icon: "star",
                    price: "14 900 ₽",
                    unit: "/ проект",
                    text: "То, что выбирает большинство студий по умолчанию.",
                    features: [
                        "Карточки, тени, живой hover",
                        "Карточные дефолты вариантов секций",
                        "Поддержка в Telegram 30 дней",
                    ],
                    featured: true,
                    action: { label: "Взять тариф", href: "#contact", variant: "primary" },
                },
            ],
            note: "Тариф можно сменить в любой момент — это одна строка theme.preset, а не пересборка секций.",
            trust: "Больше 60 студий уже собрали лендинг на «Модуле»",
            footnotes: [
                {
                    icon: "palette",
                    title: "Нужен свой пресет?",
                    text: "Соберём индивидуальную палитру и шрифтовую пару под нишу клиента.",
                    tone: "accent",
                },
                {
                    icon: "shieldCheck",
                    title: "Честная поддержка",
                    text: "Отвечаем в Telegram в течение рабочего дня.",
                },
                {
                    icon: "clock",
                    title: "Быстрый старт",
                    text: "Лендинг на шаблоне собирается за один день.",
                },
            ],
            closing: {
                title: "Не знаете, какой тариф выбрать?",
                text: "Пришлите нишу и пару референсов — за 15 минут скажем, хватит econom или нужен standard.",
                actions: [
                    { label: "Написать в Telegram", href: "https://t.me/modul_team", variant: "primary" },
                    { label: "Сравнить тарифы", href: "#pricing", variant: "secondary" },
                ],
            },
            quote: {
                text: "«Модуль» избавил нас от вёрстки с нуля — теперь лендинг клиента это конфиг, а не спринт.",
                author: "Дарья Волкова, студия «Полынь»",
                photo: "/images/stats-photo.jpg",
            },
            comparison: {
                columns: ["Econom", "Standard"],
                highlightColumn: 1,
                groups: [
                    {
                        title: "Пластика",
                        rows: [
                            { label: "Тени карточек", values: [false, true] },
                            { label: "Радиус карточки", values: ["4px", "12px"], highlight: true },
                            { label: "Своя поверхность у карточек", values: [false, true] },
                            { label: "Плашки под иконками", values: [false, true] },
                        ],
                    },
                    {
                        title: "Поддержка",
                        rows: [
                            { label: "Telegram 30 дней", values: [false, true] },
                            { label: "Личный менеджер", values: [false, false] },
                        ],
                    },
                ],
            },
        },

        {
            id: "cta",
            type: "cta",
            surface: "accent",
            // variant: "band" | "quiet" | "centered" | "left" | "boxed" | "panel" |
            //          "sticky-split" | "editorial" |
            //          "product" | "atelier"
            variant: "panel",
            eyebrow: "Следующий шаг",
            title: "Клонируйте шаблон и замените site.config.ts",
            lead: "Компоненты трогать не нужно — только тексты, картинки в public/images и поле variant у каждой секции.",
            actions: [
                { label: "Открыть репозиторий", href: "https://github.com/modul-team/site-template", variant: "primary" },
                { label: "Документация по секциям", href: "#faq", variant: "secondary" },
                { label: "Написать в Telegram", href: "https://t.me/modul_team", variant: "quiet" },
            ],
            note: "Правки в site.config.ts не требуют трогать компоненты — только тексты, картинки и variant.",
        },

        {
            id: "contact",
            type: "contact",
            surface: "surface",
            // variant: "split" | "stacked" | "boxed" | "panels" |
            //          "sticky-split" | "editorial" |
            //          "product" | "atelier"
            variant: "panels",
            // layout: "plain" | "cardContainer" — подложка под самой формой,
            // отдельная ось от variant (раскладки колонок).
            layout: "cardContainer",
            // showMap: false — скрыть карту, даже если mapSrc задан. По умолчанию true.
            number: "10",
            nav: "Контакты",
            eyebrow: "Контакты",
            title: "Расскажите, что собираете",
            lead: "Чем подробнее опишете задачу, тем точнее ответ: конкретный тариф, набор секций и сроки — без общих фраз.",
            detailsTitle: "Как с нами связаться",
            mapSrc: "https://yandex.ru/map-widget/v1/?ll=37.6064,55.7601&z=16&pt=37.6064,55.7601,pm2rdm",
            fields: [
                {
                    name: "name",
                    label: "Как к вам обращаться",
                    type: "text",
                    placeholder: "Мария",
                    required: true,
                },
                {
                    name: "phone",
                    label: "Телефон",
                    type: "tel",
                    placeholder: "+7 900 000-00-00",
                    required: true,
                },
                {
                    name: "email",
                    label: "Почта",
                    type: "email",
                    placeholder: "you@company.com",
                    required: true,
                },
                {
                    name: "topic",
                    label: "Что нужно собрать",
                    type: "select",
                    required: true,
                    // options — подпись и отправляемое значение совпадают
                    options: [
                        "Лендинг под продукт",
                        "Сайт-визитка",
                        "Каталог услуг",
                        "Портфолио",
                        "Другое",
                    ],
                },
                {
                    name: "budget",
                    label: "Ориентировочный бюджет",
                    type: "select",
                    // selectOptions — приоритетнее options, если заданы оба;
                    // пользователь видит label, в заявку уходит value.
                    selectOptions: [
                        { label: "До 50 000 ₽", value: "lt50" },
                        { label: "50 000 – 150 000 ₽", value: "50-150" },
                        { label: "150 000 ₽ и выше", value: "gt150" },
                    ],
                },
                {
                    name: "message",
                    label: "Кратко о задаче",
                    type: "textarea",
                    placeholder: "Что за проект и когда нужен запуск",
                },
            ],
            submitLabel: "Отправить заявку",
            consent: "Нажимая кнопку, вы соглашаетесь на обработку персональных данных.",
            successTitle: "Заявка отправлена",
            successText: "Ответим в рабочие часы в течение 30 минут.",
            errorText: "Не удалось отправить заявку. Напишите нам в Telegram — это быстрее, чем разбираться с формой.",
        },
    ],
};

export default siteConfig;
