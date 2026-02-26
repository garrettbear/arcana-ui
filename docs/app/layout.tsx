import './global.css'
import { RootProvider } from 'fumadocs-ui/provider'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}

export const metadata = {
  title: {
    template: '%s | Arcana UI',
    default: 'Arcana UI',
  },
  description:
    'A modern React component library with a warm stone/indigo design system, built for accessibility and AI-first workflows.',
}
