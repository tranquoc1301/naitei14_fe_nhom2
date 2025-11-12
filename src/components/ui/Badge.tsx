import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'new' | 'discount'
  discountPercent?: number
  className?: string
}

export const Badge = ({ children, variant = 'new', discountPercent, className }: BadgeProps) => {
  if (variant === 'discount' && discountPercent) {
    return (
      <span className={cn(
        "absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded-full z-10",
        className
      )}>
        -{discountPercent}%
      </span>
    )
  }

  return (
    <span className={cn(
      "absolute top-2 left-2 bg-green-primary text-white px-2 py-1 text-xs font-semibold rounded-full z-10",
      className
    )}>
      {children}
    </span>
  )
}



