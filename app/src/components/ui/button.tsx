'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-[0.9375rem] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A017] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none font-body',
  {
    variants: {
      variant: {
        default:
          'bg-[#D4A017] text-[#0B1120] border border-[#D4A017] hover:bg-[#e8b832] hover:border-[#e8b832] hover:-translate-y-px hover:shadow-glow-gold active:translate-y-0',
        secondary:
          'bg-white/5 backdrop-blur-sm text-white border border-white/8 hover:bg-white/10 hover:border-white/12',
        ghost:
          'text-[#8ea3be] hover:bg-white/5 hover:text-white border border-transparent',
        destructive:
          'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
        outline:
          'border border-[rgba(30,45,69,0.8)] bg-transparent text-white hover:bg-white/5',
        link:
          'text-[#D4A017] underline-offset-4 hover:underline border-0 bg-transparent p-0 h-auto',
        teal:
          'bg-[#0891B2]/10 text-[#22d3ee] border border-[#0891B2]/20 hover:bg-[#0891B2]/20',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 rounded-lg px-3 text-sm',
        lg: 'h-12 rounded-xl px-8 text-base',
        xl: 'h-14 rounded-xl px-10 text-lg',
        icon: 'h-9 w-9',
        'icon-sm': 'h-7 w-7 rounded-lg text-sm',
        'icon-lg': 'h-11 w-11 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
