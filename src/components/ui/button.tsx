import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-[3px] text-[14px] font-medium whitespace-nowrap transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-[#0052CC] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-[#0052CC] text-white hover:bg-[#0747A6]",
        outline: "border border-[#DFE1E6] bg-white text-[#172B4D] hover:bg-[#F4F5F7]",
        secondary: "bg-[#F4F5F7] text-[#172B4D] hover:bg-[#DFE1E6]",
        ghost: "text-[#6B778C] hover:bg-[#F4F5F7] hover:text-[#172B4D]",
        destructive: "bg-[#FFEBE6] text-[#DE350B] border border-[#FFBDAD] hover:bg-[#FFBDAD]",
        link: "text-[#0052CC] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 gap-1.5 px-[14px] py-[6px]",
        xs: "h-6 gap-1 rounded-[3px] px-2 text-[12px] [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-2.5 text-[12px] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-3.5",
        icon: "size-8",
        "icon-xs": "size-6 rounded-[3px] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
