import React, { useState } from 'react'
import { cn } from '../../utils/cn'
import styles from './Avatar.module.css'

// ─── Avatar ───────────────────────────────────────────────────────────────────

export interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function getColorFromName(name: string): string {
  const colors = [
    '#4f46e5', '#7c3aed', '#db2777', '#dc2626',
    '#d97706', '#16a34a', '#0284c7', '#0891b2',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, name, size = 'md', className }, ref) => {
    const [imgError, setImgError] = useState(false)

    const showImage = src && !imgError
    const showInitials = !showImage && name
    const bgColor = name ? getColorFromName(name) : 'var(--arcana-surface-tertiary)'

    return (
      <div
        ref={ref}
        className={cn(styles.avatar, styles[size], className)}
        style={showInitials ? { backgroundColor: bgColor } : undefined}
        aria-label={alt ?? name}
        role="img"
      >
        {showImage && (
          <img
            src={src}
            alt={alt ?? name ?? 'Avatar'}
            className={styles.image}
            onError={() => setImgError(true)}
          />
        )}
        {showInitials && (
          <span className={styles.initials} aria-hidden="true">
            {getInitials(name!)}
          </span>
        )}
        {!showImage && !showInitials && (
          <span className={styles.fallback} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12a5 5 0 110-10 5 5 0 010 10zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4z" />
            </svg>
          </span>
        )}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'

// ─── AvatarGroup ──────────────────────────────────────────────────────────────

export interface AvatarGroupProps {
  max?: number
  children: React.ReactNode
  className?: string
}

export const AvatarGroup = ({ max, children, className }: AvatarGroupProps) => {
  const childArray = React.Children.toArray(children)
  const visible = max ? childArray.slice(0, max) : childArray
  const overflow = max ? childArray.length - max : 0

  return (
    <div className={cn(styles.group, className)} role="group">
      {visible.map((child, i) => (
        <div
          key={i}
          className={styles.groupItem}
          style={{ zIndex: visible.length - i }}
        >
          {child}
        </div>
      ))}
      {overflow > 0 && (
        <div className={cn(styles.avatar, styles.md, styles.overflow)} style={{ zIndex: 0 }}>
          <span className={styles.initials}>+{overflow}</span>
        </div>
      )}
    </div>
  )
}
AvatarGroup.displayName = 'AvatarGroup'
