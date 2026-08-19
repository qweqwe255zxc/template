import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Camera,
  Check,
  ChevronDown,
  Clock,
  FileSignature,
  Gavel,
  Globe,
  HandCoins,
  Home,
  Landmark,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Palette,
  Phone,
  Scale,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Star,
  Sun,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

/**
 * Реестр иконок вручную, а не динамический импорт всей библиотеки —
 * в бандл попадает только то, что реально используется в конфиге.
 *
 * Иконки везде красим в --color-fg-muted: цветная пиктограмма рядом с
 * цветным заголовком даёт два акцента на один блок и оба гасит.
 *
 * Одно оговорённое исключение — семейство `market` (CLAUDE.md §2.19).
 * Там акцент по замыслу делает всю работу разом (заголовки разделов,
 * цифры, иконки, навигация), плашки под иконкой нет вовсе, и
 * приглушённый глиф читался бы как забытый от другой раскладки. Это
 * исключение целиком, а не приоткрытая дверь: в остальных вариантах
 * правило действует как прежде.
 */
export const icons = {
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  briefcase: Briefcase,
  camera: Camera,
  check: Check,
  chevronDown: ChevronDown,
  clock: Clock,
  fileSignature: FileSignature,
  gavel: Gavel,
  globe: Globe,
  handCoins: HandCoins,
  home: Home,
  landmark: Landmark,
  mail: Mail,
  mapPin: MapPin,
  menu: Menu,
  messageCircle: MessageCircle,
  moon: Moon,
  palette: Palette,
  phone: Phone,
  scale: Scale,
  search: Search,
  send: Send,
  share: Share2,
  shieldCheck: ShieldCheck,
  star: Star,
  sun: Sun,
  users: Users,
  x: X,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons;

export function getIcon(name?: IconName): LucideIcon | null {
  if (!name) return null;
  return icons[name] ?? null;
}
