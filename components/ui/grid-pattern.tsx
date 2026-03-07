import { useId } from "react"

import { cn } from "@/lib/cn"

type GridPatternProps = React.SVGProps<SVGSVGElement> & {
  width?: number
  height?: number
  x?: number
  y?: number
  squares?: Array<[number, number]>
  strokeDasharray?: string
}

export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  squares,
  className,
  ...props
}: GridPatternProps) {
  const id = useId()

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-current text-[var(--line)]",
        className
      )}
      {...props}
    >
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" strokeDasharray={strokeDasharray} className="stroke-[var(--line-subtle)]" />
        </pattern>
      </defs>
      <rect fill={`url(#${id})`} height="100%" strokeWidth={0} width="100%" />
      {squares ? (
        <svg className="overflow-visible" x={x} y={y}>
          {squares.map(([squareX, squareY]) => (
            <rect
              className="fill-[var(--accent-soft)]"
              height={height - 1}
              key={`${squareX}-${squareY}`}
              strokeWidth={0}
              width={width - 1}
              x={squareX * width + 1}
              y={squareY * height + 1}
            />
          ))}
        </svg>
      ) : null}
    </svg>
  )
}
