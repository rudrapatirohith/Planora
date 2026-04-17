'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#8ea3be] mb-1.5 font-body">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            'flex min-h-[80px] w-full rounded-[10px] border border-[rgba(30,45,69,0.8)] bg-[#141d2e] px-3.5 py-2.5 text-[0.9375rem] text-white ring-offset-background placeholder:text-[#4d6080] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A017] focus-visible:border-[#D4A017] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 resize-y font-body',
            error && 'border-red-500/50 focus-visible:ring-red-500/30',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-400 font-body">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-xs text-[#4d6080] font-body">{hint}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
