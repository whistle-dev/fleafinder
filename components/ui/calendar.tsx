"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
} from "react-day-picker"

import { cn } from "@/lib/cn"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar p-2 [--cell-size:36px]",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit text-[var(--ink)]", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-[var(--cell-size)] p-0 select-none aria-disabled:opacity-50 hover:bg-[var(--paper-warm)] rounded-lg",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-[var(--cell-size)] p-0 select-none aria-disabled:opacity-50 hover:bg-[var(--paper-warm)] rounded-lg",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-[var(--cell-size)] w-full items-center justify-center px-[var(--cell-size)]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-[var(--cell-size)] w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-md border border-[var(--line)] shadow-sm focus-within:border-[var(--ink)] focus-within:ring-1 focus-within:ring-[var(--ink)]",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "font-medium select-none text-[15px]",
          captionLayout === "label"
            ? "text-[15px]"
            : "flex h-8 items-center gap-1 rounded-md pr-1 pl-2 text-[15px] [&>svg]:size-3.5 [&>svg]:text-[var(--ink-muted)]",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex mb-2", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-md text-[13px] font-normal text-[var(--ink-soft)] select-none capitalize",
          defaultClassNames.weekday
        ),
        week: cn("flex w-full mt-1", defaultClassNames.week),
        week_number_header: cn(
          "w-[var(--cell-size)] select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] text-[var(--ink-muted)] select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-[var(--cell-size)] w-[var(--cell-size)] p-0 text-center select-none",
          defaultClassNames.day
        ),
        range_start: cn(
          "rounded-l-md bg-[var(--paper-warm)]",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-[var(--paper-warm)]", defaultClassNames.range_end),
        today: cn(
          "text-[var(--ink)] font-semibold rounded-md border border-[var(--line-strong)]",
          defaultClassNames.today
        ),
        outside: cn(
          "text-[var(--ink-muted)] opacity-50 aria-selected:text-[var(--ink-muted)]",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-[var(--ink-muted)] opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[var(--cell-size)] items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "flex aspect-square size-[var(--cell-size)] w-full flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 focus-visible:ring-1 focus-visible:ring-[var(--ink)] focus-visible:border-[var(--ink)] transition-colors hover:bg-[var(--paper-warm)] hover:text-[var(--ink)] rounded-md text-[14px]",
        "data-[range-end=true]:rounded-r-md data-[range-end=true]:bg-[var(--ink)] data-[range-end=true]:text-[var(--surface)]",
        "data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-[var(--paper-cream)] data-[range-middle=true]:text-[var(--ink)]",
        "data-[range-start=true]:rounded-l-md data-[range-start=true]:bg-[var(--ink)] data-[range-start=true]:text-[var(--surface)]",
        "data-[selected-single=true]:bg-[var(--ink)] data-[selected-single=true]:!text-[var(--surface)] data-[selected-single=true]:font-medium data-[selected-single=true]:hover:bg-[var(--ink)] data-[selected-single=true]:hover:!text-[var(--surface)]",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
