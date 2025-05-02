import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-gray-700 bg-gradient-to-br from-gray-800 to-gray-700 text-gray-100 hover:from-gray-700 hover:to-gray-600",
        secondary:
          "border-gray-700 bg-gradient-to-br from-gray-700/50 to-gray-600/50 text-gray-100 hover:from-gray-600/50 hover:to-gray-500/50",
        destructive:
          "border-red-900/80 bg-gradient-to-br from-red-900/80 to-red-800/80 text-gray-100 hover:from-red-800/80 hover:to-red-700/80",
        outline: "text-gray-300 border-gray-700",
        success: "border-transparent bg-primary text-white hover:bg-primary/80",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-500/80",
        error: "border-transparent bg-destructive text-white hover:bg-destructive/80",
        info: "border-transparent bg-primary text-white hover:bg-primary/80",
        purple: "border-transparent bg-purple-500 text-white hover:bg-purple-500/80"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants } 