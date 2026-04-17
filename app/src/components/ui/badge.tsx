import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase transition-colors font-body border',
  {
    variants: {
      variant: {
        default: 'bg-[#D4A017]/10 text-[#D4A017] border-[#D4A017]/20',
        planning: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        completed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
        archived: 'bg-gray-700/20 text-gray-500 border-gray-700/20',
        pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
        danger: 'bg-red-500/10 text-red-400 border-red-500/20',
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        teal: 'bg-[#0891B2]/10 text-[#22d3ee] border-[#0891B2]/20',
        secondary: 'bg-white/5 text-[#8ea3be] border-white/8',
      },
      size: {
        sm: 'text-[10px] px-2 py-0.5',
        default: 'text-xs px-2.5 py-0.5',
        lg: 'text-sm px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
