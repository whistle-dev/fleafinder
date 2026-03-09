import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  icons?: LucideIcon[]
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  title,
  description,
  icons = [],
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "bg-transparent border-[var(--line)] hover:border-[var(--accent-soft)] text-center",
      "border-2 border-dashed rounded-3xl p-14 w-full max-w-[620px]",
      "group transition duration-500 hover:duration-200",
      className
    )}>
      <div className="flex justify-center isolate">
        {icons.length === 3 ? (
          <>
            <div className="bg-[var(--paper)] size-12 grid place-items-center rounded-xl relative left-2.5 top-1.5 -rotate-6 shadow-lg ring-1 ring-[var(--line)] group-hover:-translate-x-5 group-hover:-rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
              {React.createElement(icons[0], {
                className: "w-6 h-6 text-[var(--accent)]"
              })}
            </div>
            <div className="bg-[var(--paper)] size-12 grid place-items-center rounded-xl relative z-10 shadow-lg ring-1 ring-[var(--line)] group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
              {React.createElement(icons[1], {
                className: "w-6 h-6 text-[var(--accent)]"
              })}
            </div>
            <div className="bg-[var(--paper)] size-12 grid place-items-center rounded-xl relative right-2.5 top-1.5 rotate-6 shadow-lg ring-1 ring-[var(--line)] group-hover:translate-x-5 group-hover:rotate-12 group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
              {React.createElement(icons[2], {
                className: "w-6 h-6 text-[var(--accent)]"
              })}
            </div>
          </>
        ) : (
          <div className="bg-[var(--paper)] size-12 grid place-items-center rounded-xl shadow-lg ring-1 ring-[var(--line)] group-hover:-translate-y-0.5 transition duration-500 group-hover:duration-200">
            {icons[0] && React.createElement(icons[0], {
              className: "w-6 h-6 text-[var(--accent)]"
            })}
          </div>
        )}
      </div>
      <h2 className="font-display text-3xl tracking-tight text-[var(--accent)] mt-6">{title}</h2>
      <p className="text-[var(--ink-soft)] mt-4 whitespace-pre-line max-w-md mx-auto">{description}</p>
      {action && (
        <Button
          onClick={action.onClick}
          variant="outline"
          className={cn(
            "mt-8",
            "shadow-sm active:shadow-none"
          )}
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
