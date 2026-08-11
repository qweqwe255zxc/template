import { Fragment } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { PricingComparison } from "@/types/site";

interface PricingComparisonTableProps {
  comparison: PricingComparison;
  className?: string;
}

/**
 * Таблица сравнения тарифов построчно, по группам. Раньше жила только в
 * variants/Matrix.tsx — вынесена сюда, чтобы `comparison` можно было
 * задать при любом variant, а не только там, где для нёй случайно
 * нашлось место в вёрстке.
 */
export function PricingComparisonTable({ comparison, className }: PricingComparisonTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)} data-reveal>
      {/* min-w — не фиксированный размер блока, а порог горизонтальной
          прокрутки: ниже 640px таблица сравнения нечитаема, и её честнее
          прокручивать, чем сжимать колонки. Не убирать по §1.5 п.3. */}
      <table className="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr className="border-b border-rule">
            <th className="py-4" />
            {comparison.columns.map((column, colIndex) => (
              <th
                key={column}
                className={cn(
                  "px-4 py-4 text-center text-caption font-medium uppercase",
                  colIndex === comparison.highlightColumn ? "text-accent" : "text-fg-muted",
                )}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {comparison.groups.map((group) => (
            <Fragment key={group.title}>
              <tr className="bg-badge-soft">
                <td
                  colSpan={comparison.columns.length + 1}
                  className="px-4 py-3 text-caption font-medium uppercase text-fg-muted"
                >
                  {group.title}
                </td>
              </tr>
              {group.rows.map((row) => (
                <tr key={row.label} className="border-b border-rule">
                  <td className="py-4 pr-4 text-small text-fg">{row.label}</td>
                  {row.values.map((value, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn(
                        "px-4 py-4 text-center text-small",
                        colIndex === comparison.highlightColumn && "bg-badge-soft/50",
                        row.highlight ? "font-semibold text-fg" : "text-fg-muted",
                      )}
                    >
                      {typeof value === "boolean" ? (
                        value ? (
                          <Check
                            aria-hidden="true"
                            strokeWidth={1.5}
                            className="mx-auto size-4 text-accent"
                          />
                        ) : (
                          <span aria-hidden="true">—</span>
                        )
                      ) : (
                        value
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PricingComparisonTable;
