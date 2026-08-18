import { cn } from "@/lib/cn";
import { formatRuPhone } from "@/lib/phoneMask";
import { Select } from "@/components/ui/Select";
import type { ContactFieldConfig, SelectOption } from "@/types/site";

/**
 * Конфиг допускает два вида списка: простые строки (options) и пары
 * label/value (selectOptions, когда в заявку должно уйти не то же самое,
 * что видит пользователь). Дальше по коду форма знает только про пары.
 */
function selectOptionsOf(field: ContactFieldConfig): SelectOption[] {
  if (field.selectOptions) return field.selectOptions;
  return (field.options ?? []).map((option) => ({
    label: option,
    value: option,
  }));
}

interface InputProps {
  field: ContactFieldConfig;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

/**
 * Геометрия поля — класс .ui-control и ручки --control-* (theme/tokens.css):
 * в «Экономе» это подчёркивание без фона и радиуса, в «Стандарте» —
 * коробка с заливкой и скруглением. Компонент задаёт только типографику
 * и цвет линии на hover/focus.
 *
 * Цвет линии — --color-rule-strong (контраст 3.4:1), обычный hairline
 * тут недостаточно контрастен для границы интерактивного поля (WCAG 1.4.11).
 */
/* Плейсхолдер — `text-fg-muted` без альфы. Пара «muted + /60» давала 3.21 контраста в тёмной теме при норме 4.5, то есть подсказка в поле читалась хуже, чем должна. Приглушённого тона достаточно, чтобы отличить подсказку от введённого значения (`text-fg`), — гасить его ещё и прозрачностью незачем. */
const control =
  "ui-control w-full text-body text-fg " +
  "placeholder:text-fg-muted hover:border-fg focus:border-fg " +
  "focus:outline-none focus-visible:outline-none appearance-none";

/**
 * Полностью контролируемое поле: значение и маска телефона живут
 * в ContactForm, чтобы валидация и сброс формы работали через один
 * источник истины, а не через несинхронизированный DOM-стейт.
 */
export function Input({ field, value, onChange, error, className }: InputProps) {
  const id = `field-${field.name}`;
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className={cn("group", className)}>
      <label
        htmlFor={id}
        className="mb-2 block text-caption font-medium uppercase text-fg-muted"
      >
        {field.label}
        {field.required ? <span aria-hidden="true"> *</span> : null}
      </label>

      {field.type === "textarea" ? (
        <textarea
          id={id}
          name={field.name}
          rows={4}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(control, "resize-y min-h-28")}
        />
      ) : field.type === "select" ? (
        <Select
          id={id}
          name={field.name}
          value={value}
          onChange={onChange}
          options={selectOptionsOf(field)}
          placeholder={field.placeholder ?? "Выберите"}
          invalid={Boolean(error)}
          describedBy={describedBy}
        />
      ) : (
        <input
          id={id}
          name={field.name}
          type={field.type === "tel" ? "tel" : field.type}
          inputMode={field.type === "tel" ? "tel" : undefined}
          value={value}
          onChange={(event) => {
            const next =
              field.type === "tel"
                ? formatRuPhone(event.target.value)
                : event.target.value;
            onChange(next);
          }}
          placeholder={field.placeholder}
          autoComplete={
            field.type === "tel"
              ? "tel"
              : field.type === "email"
                ? "email"
                : field.name === "name"
                  ? "name"
                  : "off"
          }
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={control}
        />
      )}

      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-small text-fg-muted">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default Input;
