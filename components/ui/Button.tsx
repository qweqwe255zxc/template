import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "quiet";
type Size = "md" | "sm";

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** true — на всю ширину всегда. "mobile" — во всю ширину только ниже sm, дальше по контенту. */
  full?: boolean | "mobile";
  /**
   * Разрешить подписи переноситься на вторую строку. По умолчанию false —
   * кнопка это одна строка, и так и должно быть везде, где её ширину
   * задаёт собственное содержимое.
   *
   * Включается там, где ширину диктует НЕ содержимое, а колонка: в
   * `ActionGroup` кнопки лежат в равных треках грида, и трек бывает уже
   * самой длинной подписи. С `whitespace-nowrap` подпись в таком треке не
   * переносится, а вылезает за край кнопки — то есть текст, который
   * написал клиент, молча теряется (§1.5, п. 2 CLAUDE.md).
   *
   * Отдельным пропом, а не `className="whitespace-normal"`: обе утилиты
   * задают одно свойство, и какая победит, решает порядок в собранном
   * CSS, а не порядок в строке класса. Заодно `wrap` переключает высоту с
   * фиксированной на минимальную — иначе двухстрочная подпись просто
   * вылезла бы за `h-12` по вертикали вместо горизонтали.
   */
  wrap?: boolean;
  onClick?: () => void;
}

interface LinkProps extends CommonProps {
  href: string;
  type?: never;
  disabled?: never;
}

interface ActionProps
  extends CommonProps,
    Pick<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "disabled"> {
  href?: undefined;
}

type ButtonProps = LinkProps | ActionProps;

/**
 * Радиус, тень и подъём под курсором приходят из класса .ui-button
 * (app/globals.css) и ручек пресета --radius-control / --btn-* :
 * в «Экономе» это 2px, тень none и сдвиг 0 — ровно плоская кнопка базы,
 * в «Стандарте» — 12px, тень покоя и подъём. Хардкодить их тут нельзя,
 * иначе кнопка перестанет отличаться между тарифами. quiet не получает
 * .ui-button вовсе: это текстовая ссылка без своей рамки/фона, и в
 * «Стандарте» тень+подъём кнопки рисовали вокруг текста фантомную рамку.
 */
const base =
  "inline-flex shrink-0 items-center justify-center text-button font-medium select-none cursor-pointer " +
  "disabled:cursor-not-allowed disabled:opacity-55 disabled:pointer-events-none";

const sizes: Record<Size, string> = {
  md: "h-12 px-7",
  sm: "h-10 px-5",
};

/**
 * Те же отступы, но высота минимальная, а не фиксированная: подпись в
 * две строки обязана растить кнопку, а не вылезать за неё. text-center
 * тут нужен отдельно — `justify-center` центрирует анонимный flex-item с
 * текстом целиком, но вторую строку внутри него выключает уже
 * `text-align`.
 */
const wrapSizes: Record<Size, string> = {
  md: "min-h-12 px-7 py-2.5 text-center",
  sm: "min-h-10 px-5 py-2 text-center",
};

/**
 * primary — заливка акцентным цветом. Внутри [data-surface="accent"]
 * bg/fg инвертируются на уровне токенов, кнопка об этом даже не знает.
 * secondary — просто обводка, без заливки и без акцента.
 */
const variants: Record<Variant, string> = {
  primary:
    "bg-btn-primary text-btn-primary-fg hover:bg-btn-primary-hover active:bg-btn-primary-active",
  secondary:
    "border border-rule-strong text-fg hover:border-fg bg-transparent",
  quiet:
    "text-fg-muted hover:text-fg underline decoration-rule-strong underline-offset-4 h-auto px-0",
};

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className,
    full,
    wrap = false,
    onClick,
  } = props;

  const classes = cn(
    base,
    !wrap && "whitespace-nowrap",
    variant !== "quiet" && "ui-button",
    variant !== "quiet" && (wrap ? wrapSizes[size] : sizes[size]),
    variants[variant],
    full === true && "w-full",
    full === "mobile" && "w-full sm:w-auto",
    className,
  );

  if ("href" in props && props.href) {
    const { href } = props;
    const external = /^(https?:|mailto:|tel:)/.test(href);

    if (external) {
      return (
        <a
          href={href}
          className={classes}
          onClick={onClick}
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const { type = "button", disabled } = props as ActionProps;

  return (
    <button type={type} disabled={disabled} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
