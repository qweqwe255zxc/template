import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Приём подписки из футера (components/sections/Footer/parts/NewsletterForm.tsx).
 *
 * Форма там — настоящий `method="get"` без JS, поэтому и роут отвечает
 * редиректом, а не JSON: браузер возвращается на страницу сам, без
 * клиентского кода. Возврат идёт на `#newsletter` с `?subscribed=1` —
 * по этому параметру форма показывает подтверждение.
 *
 * Заглушка намеренно ничего не хранит: письмо только печатается в лог
 * сервера. Куда подписка уходит на самом деле (рассылка, CRM, таблица) —
 * решает конкретный проект: допишите отправку здесь, интерфейс формы
 * при этом менять не придётся. Если подписка проекту не нужна вовсе —
 * уберите ключ `footer.newsletter` из site.config.ts, и блок исчезнет
 * из всех вариантов футера (он опционален).
 */

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(
    (time) => now - time < RATE_LIMIT_WINDOW_MS,
  );
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((time) => now - time >= RATE_LIMIT_WINDOW_MS)) {
        hits.delete(key);
      }
    }
  }

  return recent.length > RATE_LIMIT_MAX;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = (url.searchParams.get("email") ?? "").trim();

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  // Куда возвращать: на ту же страницу, откуда пришла форма. Referer может
  // не прийти (или прийти с чужого домена) — тогда просто на главную.
  // new URL(..., url.origin) заодно не даёт увести редирект на чужой хост.
  const referer = request.headers.get("referer");
  const back = (() => {
    if (!referer) return new URL("/", url.origin);
    try {
      const parsed = new URL(referer, url.origin);
      return parsed.origin === url.origin ? parsed : new URL("/", url.origin);
    } catch {
      return new URL("/", url.origin);
    }
  })();
  back.hash = "newsletter";

  if (!EMAIL_PATTERN.test(email)) {
    back.searchParams.set("subscribed", "invalid");
    return NextResponse.redirect(back, 303);
  }

  if (rateLimited(ip)) {
    back.searchParams.set("subscribed", "invalid");
    return NextResponse.redirect(back, 303);
  }

  console.log(`[subscribe] подписка: ${email} (ip=${ip})`);

  back.searchParams.set("subscribed", "1");
  return NextResponse.redirect(back, 303);
}
