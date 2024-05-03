import Link from 'next/link'
import React from 'react'

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en">
        <body>
          {/* Layout UI */}
          <main>
            
            {children}
            <Link href="http://localhost:3000/">Сюдэнс</Link>

          </main>
        </body>
      </html>
    )
  }