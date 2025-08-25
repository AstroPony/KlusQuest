import './globals.css'
import type { ReactNode } from 'react'
import { Providers } from './providers'

export const metadata = {
  title: "KlusQuest",
  description: "Gamified chores & allowance tracker",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <body className="min-h-screen antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 