import { Boxed } from "./variants/Boxed";
import { Panels } from "./variants/Panels";
import { Split } from "./variants/Split";
import { Stacked } from "./variants/Stacked";
import { StickySplit } from "./variants/StickySplit";
import type { VariantMap } from "../variantMap";
import type { ContactFormProps } from "./types";
import type { ContactSection } from "@/types/site";

/**
 * Роутер секции контактов — единственной, у которой варианты клиентские
 * ("use client"): в них живёт стейт формы, антибот-таймер, honeypot и
 * fetch("/api/contact"). Сам роутер серверный: он только выбирает файл,
 * поэтому в клиентский бандл не тащит ничего лишнего.
 *
 * У секции две независимые оси: variant (колонки — сюда) и layout
 * (подложка под формой — parts/FormColumn.tsx). Любая раскладка
 * сочетается с любой подложкой — panels тоже читает layout и передаёт
 * его в FormColumn, хотя сама раскладка там уже нестандартная.
 *
 * Как добавить новый дизайн — docs/section-system.md, раздел 7.
 */
const variants: VariantMap<
  ContactFormProps,
  NonNullable<ContactSection["variant"]>
> = {
  split: Split,
  stacked: Stacked,
  boxed: Boxed,
  panels: Panels,
  "sticky-split": StickySplit,
};

/**
 * Служебные имена полей — те же, что app/api/contact/route.ts вычитает
 * из тела запроса как не введённые пользователем (SERVICE_FIELDS) плюс
 * honeypot. Поле конфига с таким name затирается при отправке молча —
 * лучше сказать об этом в dev, чем оставить необъяснимо пропадающее поле.
 */
const RESERVED_FIELD_NAMES = new Set(["_gotcha", "elapsed"]);

export function ContactForm(props: ContactFormProps) {
  if (process.env.NODE_ENV !== "production") {
    const reserved = props.fields.filter((field) => RESERVED_FIELD_NAMES.has(field.name));
    if (reserved.length > 0) {
      console.warn(
        `[ContactForm] Секция "${props.id}": имя поля ` +
          `${reserved.map((field) => `"${field.name}"`).join(", ")} зарезервировано ` +
          `под служебные данные (honeypot/таймер) и будет затёрто при отправке. ` +
          `Переименуйте поле в конфиге.`,
      );
    }

    const emptySelects = props.fields.filter(
      (field) =>
        field.type === "select" &&
        !field.options?.length &&
        !field.selectOptions?.length,
    );
    if (emptySelects.length > 0) {
      console.warn(
        `[ContactForm] Секция "${props.id}": поле ` +
          `${emptySelects.map((field) => `"${field.name}"`).join(", ")} — type="select" ` +
          `без options/selectOptions, выпадающий список будет пустым. ` +
          `Задайте options: string[] или selectOptions: {label, value}[].`,
      );
    }
  }

  const Variant = variants[props.variant ?? "split"] ?? Split;
  return <Variant {...props} />;
}

export default ContactForm;
