"use client";

import { useSearchParams } from "next/navigation";

interface NewsletterNoticeProps {
  successText: string;
  errorText: string;
}

/**
 * Ответ формы подписки. Форма отправляется настоящим `method="get"` и
 * возвращается сюда редиректом с `?subscribed=1|invalid` (см.
 * app/api/subscribe/route.ts) — без этого блока подписка выглядела бы
 * как «нажал и ничего не произошло».
 *
 * Отдельный клиентский кусок, а не вся форма: `useSearchParams` требует
 * клиента, а форме клиент не нужен — она работает и без JS.
 */
export function NewsletterNotice({
  successText,
  errorText,
}: NewsletterNoticeProps) {
  const state = useSearchParams().get("subscribed");
  if (state !== "1" && state !== "invalid") return null;

  return (
    <p
      role="status"
      className={
        state === "1"
          ? "mt-3 text-small text-fg"
          : "mt-3 text-small text-accent"
      }
    >
      {state === "1" ? successText : errorText}
    </p>
  );
}

export default NewsletterNotice;
