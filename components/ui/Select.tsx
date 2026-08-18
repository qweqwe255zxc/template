"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import type { SelectOption } from "@/types/site";

interface SelectProps {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  /** Всегда пары label/value: простой список строк разворачивает Input. */
  options: SelectOption[];
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
}

/**
 * Свой listbox вместо нативного <select> — браузерное меню не стилизовать
 * под шрифты и линии сайта. Оформление то же, что у аккордеона: границы
 * между пунктами, без теней.
 *
 * Значение прокидываю в форму через скрытый input с тем же name, чтобы
 * ContactForm видел его как обычное controlled-поле и сам валидировал.
 * В стейте формы (и в заявке) лежит value, пользователь видит label.
 */
export function Select({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = "Выберите",
  invalid,
  describedBy,
}: SelectProps) {
  const indexOfValue = () => options.findIndex((option) => option.value === value);
  const selected = options.find((option) => option.value === value);

  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(() =>
    Math.max(0, indexOfValue()),
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxId = `${id}-listbox`;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const openAt = (index: number) => {
    setHighlighted(Math.max(0, Math.min(index, options.length - 1)));
    setOpen(true);
  };

  const commit = (index: number) => {
    const option = options[index];
    if (option) onChange(option.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openAt(Math.max(0, indexOfValue()));
      }
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlighted((current) => Math.min(current + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlighted((current) => Math.max(current - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setHighlighted(0);
        break;
      case "End":
        event.preventDefault();
        setHighlighted(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(highlighted);
        break;
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        aria-activedescendant={open ? `${id}-option-${highlighted}` : undefined}
        onClick={() => (open ? setOpen(false) : openAt(Math.max(0, indexOfValue())))}
        onKeyDown={handleKeyDown}
        className={cn(
          // Геометрия — та же .ui-control, что у обычного поля: подчёркивание
          // в «Экономе», коробка в «Стандарте». См. Input.tsx.
          "ui-control flex w-full items-center justify-between gap-3",
          "text-body text-left hover:border-fg focus:border-fg",
          "focus:outline-none focus-visible:outline-none",
          // Без альфы: «muted + /60» не проходит по контрасту в тёмной
          // теме (3.21 при норме 4.5). См. Input.tsx.
          value ? "text-fg" : "text-fg-muted",
        )}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 text-fg-muted transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <input type="hidden" name={name} value={value} />

      {/* панель на своей поверхности — если Select окажется в тёмном или
          акцентном блоке, цвета подхватятся сами */}
      <div
        data-surface="surface"
        className="accordion-panel absolute inset-x-0 top-full z-10 grid"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <ul
            id={listboxId}
            role="listbox"
            aria-label={placeholder}
            className="ui-popover mt-2 max-h-64 overflow-auto border border-rule bg-bg text-fg"
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={option.value === value}
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => commit(index)}
                className={cn(
                  "cursor-pointer border-b border-rule px-4 py-3 text-body last:border-b-0",
                  index === highlighted && "bg-paper",
                  option.value === value && "font-medium",
                )}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Select;
