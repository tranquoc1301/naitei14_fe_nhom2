import { cn } from '@/lib/utils'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export const RenderButton = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className,
  type = 'button',
}: ButtonProps) => {
  const variantClasses = {
    primary: 'bg-green-primary text-white hover:bg-green-dark',
    secondary: 'bg-gray-dark text-white hover:bg-gray-700',
    outline: 'border-2 border-green-primary text-green-primary hover:bg-green-primary hover:text-white',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        'font-semibold rounded-md transition-colors duration-200',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </button>
  )
}



