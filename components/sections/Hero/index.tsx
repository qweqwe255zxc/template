import { resolveHeroLayout } from "./parts/resolveHeroLayout";
import { Atelier } from "./variants/Atelier";
import { Centered } from "./variants/Centered";
import { Editorial } from "./variants/Editorial";
import { Product } from "./variants/Product";
import { Poster } from "./variants/Poster";
import { Service } from "./variants/Service";
import { Showcase } from "./variants/Showcase";
import { Split } from "./variants/Split";
import { TypeOnly } from "./variants/TypeOnly";
import { StickySplit } from "./variants/StickySplit";
import type { VariantMap } from "../variantMap";
import type { HeroSection } from "@/types/site";

/**
 * Роутер секции Hero.
 *
 * Единственный роутер, который выбирает вариант не только по
 * props.variant: у пары type-only ↔ split вторая колонка может включиться
 * сама (widget) или не включиться вопреки конфигу (split без image). Все
 * правила собраны в resolveHeroLayout — там же, где их читает сам Split,
 * чтобы они не разъехались между роутером и вариантом. Для остальных
 * вариантов resolved === props.variant, то есть работает обычный выбор
 * по карте.
 *
 * Как добавить новый дизайн — docs/section-system.md, раздел 7.
 */
/* --------------------------------------------------------------------------
   ТАРИФНАЯ ПОМЕТКА (временная, поставлена при переносе лендинга
   Sirotov Architects).

   ЭКОНОМ-КЛАСС — весь каталог вариантов, существовавший ДО семейств
   `editorial`, `product` и `atelier`: type-only, split, centered, showcase, poster, service,
   sticky-split.

   EDITORIAL — новое семейство: печатная сетка, волосяные линейки,
   нумерованные колонтитулы, крупный заголовок в верхнем регистре. Общая
   шапка семейства — components/ui/EditorialHeader.tsx.

   Семейство закрыто целиком: вариант `editorial` есть у всех
   двенадцати секций и у Header/Footer, то есть сайт этим приёмом
   собирается без примеси карточных раскладок.

   PRODUCT — карточки и метрики: каждый блок в Card, у каждого раздела
   измеримый показатель, числа tabular. Общая шапка семейства —
   components/ui/ProductHeader.tsx. Тоже закрыто целиком.

   ATELIER — разграфлённый бланк: решётка на волосяных швах
   (components/ui/SeamGrid.tsx), короткий акцентный штрих под заголовком
   раздела, плитка квадратов встык. Общая шапка семейства —
   components/ui/AtelierHeader.tsx. Тоже закрыто целиком.

   Пометка НАМЕРЕННО лежит отдельно от тарифной механики шаблона:
   theme.preset ("econom"/"standard"), PRESET_DEFAULTS в lib/preset.ts и
   блоки [data-preset] в theme/tokens.css не тронуты вообще. Чтобы
   вернуть как было, достаточно снять этот комментарий, строки
   `editorial`/`product`/`atelier` из карты ниже и значения из union в
   types/site.ts.
   -------------------------------------------------------------------------- */
const variants: VariantMap<HeroSection, NonNullable<HeroSection["variant"]>> = {
  // Эконом-класс
  "type-only": TypeOnly,
  split: Split,
  centered: Centered,
  showcase: Showcase,
  poster: Poster,
  service: Service,
  "sticky-split": StickySplit,
  // Семейство editorial
  editorial: Editorial,
  // Семейство product
  product: Product,
  // Семейство atelier
  atelier: Atelier,
};

/** Варианты без второй колонки: image и widget им положить некуда. */
const SINGLE_COLUMN: NonNullable<HeroSection["variant"]>[] = ["centered"];

/** Варианты, которым вторая колонка нужна: без неё половина экрана пуста. */
const NEEDS_MEDIA: NonNullable<HeroSection["variant"]>[] = [
  "showcase",
  "poster",
  "service",
];

/** Варианты без рельса на левом поле: number и rail в них не рендерятся. */
const NO_RAIL: NonNullable<HeroSection["variant"]>[] = [
  "showcase",
  "poster",
  "service",
];

/**
 * Варианты, которые умеют показать только фото, но не виджет метрик.
 *
 * editorial и atelier входят сюда, но, в отличие от poster/service, image
 * им НЕ обязателен (в PHOTO_FALLBACK их нет): у editorial фотография —
 * полоса-горизонт под первым экраном, у atelier — правая половина, и обе
 * раскладки без неё остаются законченными (atelier сам сворачивается в
 * одну колонку внутри контейнера). А вот виджет положить некуда — второй
 * колонки под него нет ни там, ни там.
 */
const IMAGE_ONLY: NonNullable<HeroSection["variant"]>[] = [
  "poster",
  "service",
  "editorial",
  "atelier",
];

/**
 * poster/service без обязательного image откатываются на type-only —
 * у них, в отличие от showcase (сам раздвигает текстовую колонку без
 * медиа), нет собственной «безфотошной» раскладки: poster — акцентная
 * панель без Container + фото встык, service — 7/5 с поиском и фото с
 * overlay. Раздвигать эти раскладки под пустую колонку значит строить
 * бесполезный отдельный дизайн ради edge-case; откат на самый безопасный
 * вариант — тот же приём, что у About/index.tsx и у пары type-only ↔
 * split в resolveHeroLayout.ts.
 */
const PHOTO_FALLBACK: NonNullable<HeroSection["variant"]>[] = ["poster", "service"];

/**
 * product требует widget по той же логике, что poster/service требуют
 * image, только по другому полю: вторая колонка там — карточка метрик, и
 * без неё от раскладки остаётся половина тёмного экрана и пустота
 * справа. Откат на centered, а не на type-only: тёмный первый экран в
 * этом семействе — часть приёма, и centered единственный, кто его
 * сохраняет без второй колонки.
 */
const WIDGET_FALLBACK: NonNullable<HeroSection["variant"]>[] = ["product"];

/**
 * Варианты, где image и widget делят одну колонку и image побеждает
 * (см. resolveHeroLayout для split, HeroSection.tsx:73-83 для showcase —
 * `image ? <HeroPanel> : widget ? <HeroWidget> : null` в обоих случаях).
 * poster/service сюда не входят: у них своё предупреждение ниже —
 * widget в них не рендерится вообще, независимо от image.
 */
const IMAGE_BEATS_WIDGET: NonNullable<HeroSection["variant"]>[] = [
  "split",
  "showcase",
];

export function Hero(props: HeroSection) {
  const { resolved: requested } = resolveHeroLayout(props);
  const needsPhotoFallback = PHOTO_FALLBACK.includes(requested) && !props.image;
  const needsWidgetFallback =
    !needsPhotoFallback && WIDGET_FALLBACK.includes(requested) && !props.widget;
  const resolved = needsPhotoFallback
    ? "type-only"
    : needsWidgetFallback
      ? "centered"
      : requested;

  if (process.env.NODE_ENV !== "production") {
    if (needsWidgetFallback) {
      console.warn(
        `[Hero] Секция "${props.id}": variant="${requested}" без widget — вторую колонку ` +
          `занять нечем, показан "centered". Дайте widget: { title, metrics } или возьмите ` +
          `другой variant. См. docs/section-system.md.`,
      );
    }

    if (needsPhotoFallback) {
      console.warn(
        `[Hero] Секция "${props.id}": variant="${requested}" без image — фото занять нечем, ` +
          `показан "type-only". Дайте image: "/images/..." или возьмите другой variant. ` +
          `См. docs/section-system.md.`,
      );
    }

    if (props.widget && props.image && IMAGE_BEATS_WIDGET.includes(resolved)) {
      console.warn(
        `[Hero] Секция "${props.id}": widget и image заняли бы одну колонку — показано фото, widget пропущен.`,
      );
    }

    if (SINGLE_COLUMN.includes(resolved) && (props.image || props.widget)) {
      console.warn(
        `[Hero] Секция "${props.id}": variant="${resolved}" — раскладка без второй колонки, ` +
          `${props.image ? "image" : "widget"} в ней не рендерится. Уберите поле из конфига ` +
          `или возьмите variant: "split". См. docs/section-system.md.`,
      );
    }

    if (NEEDS_MEDIA.includes(resolved) && !props.image && !props.widget) {
      console.warn(
        `[Hero] Секция "${props.id}": variant="${resolved}" — вторая колонка пуста. ` +
          `Дайте image: "/images/..." или widget, иначе половина первого экрана ` +
          `остаётся белой. См. docs/section-system.md.`,
      );
    }

    if (IMAGE_ONLY.includes(resolved) && props.widget) {
      console.warn(
        `[Hero] Секция "${props.id}": variant="${resolved}" показывает только фото — ` +
          `widget в этой раскладке не рендерится (карточка метрик на полноэкранной ` +
          `половине читается как случайный объект в пустоте). Дайте image или ` +
          `возьмите variant: "showcase". См. docs/section-system.md.`,
      );
    }

    // Зеркало IMAGE_ONLY: product показывает только карточку метрик, и
    // фотографии в нём положить некуда — вторая колонка занята виджетом,
    // который и есть причина существования раскладки.
    if (resolved === "product" && props.image) {
      console.warn(
        `[Hero] Секция "${props.id}": variant="product" показывает только widget — ` +
          `image в этой раскладке не рендерится (вторая колонка занята карточкой ` +
          `метрик). Уберите image из конфига или возьмите variant: "split". ` +
          `См. docs/section-system.md.`,
      );
    }

    if (NO_RAIL.includes(resolved) && (props.number || props.rail)) {
      console.warn(
        `[Hero] Секция "${props.id}": variant="${resolved}" не рендерит number/rail — ` +
          `в этой раскладке нет левого поля под колонтитул. Анонс над заголовком ` +
          `задаётся полем badge. См. docs/section-system.md.`,
      );
    }
  }

  const Variant = variants[resolved] ?? TypeOnly;
  return <Variant {...props} />;
}

export default Hero;
