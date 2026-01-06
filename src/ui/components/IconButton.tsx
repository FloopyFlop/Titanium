import type { ButtonHTMLAttributes, ReactNode } from 'react'

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ')

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode
  label: string
  tone?: 'primary' | 'ghost'
}

export function IconButton({ icon, label, tone = 'ghost', className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn('ti-icon-btn', tone === 'primary' && 'ti-icon-btn--primary', className)}
      {...props}
    >
      {icon}
    </button>
  )
}
