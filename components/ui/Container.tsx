import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ContainerProps {
  children: ReactNode;
  /** page — 1600px, narrow — 760px (колонка FAQ и текстовые блоки). */
  width?: "page" | "narrow";
  className?: string;
}

export function Container({
  children,
  width = "page",
  className,
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-gutter",
        width === "page" ? "max-w-page" : "max-w-narrow",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default Container;
