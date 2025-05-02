'use client';

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-400 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-gray-800 to-gray-700 text-gray-100 shadow hover:from-gray-700 hover:to-gray-600",
        destructive:
          "bg-gradient-to-br from-red-900/80 to-red-800/80 text-gray-100 shadow-sm hover:from-red-800/80 hover:to-red-700/80",
        outline:
          "border border-gray-700 bg-transparent shadow-sm hover:bg-gray-800/50 hover:text-gray-100",
        secondary:
          "bg-gradient-to-br from-gray-700/50 to-gray-600/50 text-gray-100 shadow-sm hover:from-gray-600/50 hover:to-gray-500/50",
        ghost: "hover:bg-gray-800/50 hover:text-gray-100",
        link: "text-gray-400 underline-offset-4 hover:underline hover:text-gray-300",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }