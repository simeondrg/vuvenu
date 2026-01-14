/**
 * Composant Button temporaire pour VuVenu
 *
 * ⚠️ IMPORTANT: Ce fichier sera remplacé par la version shadcn/ui
 * avec la commande: npx shadcn@latest add button
 *
 * Version basique pour les besoins temporaires du système d'erreurs
 */

import React from 'react'
import { cn } from '@/lib/utils'

// =============================================
// TYPES & INTERFACES
// =============================================

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}

// =============================================
// BUTTON VARIANTS (STYLE)
// =============================================

const buttonVariants = {
  variant: {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  },
  size: {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    icon: 'h-10 w-10',
  },
}

// =============================================
// BUTTON COMPONENT
// =============================================

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    // Classes de base
    const baseClasses = [
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md',
      'text-sm font-medium ring-offset-background transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0'
    ].join(' ')

    // Classes selon variant et size
    const variantClasses = buttonVariants.variant[variant]
    const sizeClasses = buttonVariants.size[size]

    // Classes finales
    const finalClasses = cn(baseClasses, variantClasses, sizeClasses, className)

    if (asChild) {
      // TODO: Implémenter Slot quand disponible
      return (
        <button className={finalClasses} ref={ref} {...props} />
      )
    }

    return (
      <button className={finalClasses} ref={ref} {...props} />
    )
  }
)

Button.displayName = 'Button'

// =============================================
// EXPORTS
// =============================================

export { Button, buttonVariants }