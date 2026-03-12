import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PullEmpire — Pokemon TCG Shop',
  description:
    'Nakupuj Pokemon karty ktore maju hodnotu. Booster boxy, PSA graded karty, singles a accessories.',
  keywords: ['pokemon', 'tcg', 'karty', 'booster box', 'psa graded', 'singles'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sk" className={outfit.variable}>
      <body className="min-h-screen bg-[#0a0a0f] text-[#e2e8f0] antialiased">
        <Navbar />
        <main>{children}</main>
        <footer className="mt-24 border-t border-[#1e1e2e] py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-[#64748b]">
                &copy; {new Date().getFullYear()} PullEmpire. Vsetky prava vyhradene.
              </p>
              <div className="flex gap-4 text-sm text-[#64748b]">
                <a href="/shop" className="hover:text-[#e2e8f0] transition-colors">
                  Obchod
                </a>
                <a href="/o-nas" className="hover:text-[#e2e8f0] transition-colors">
                  O nas
                </a>
                <a href="/kontakt" className="hover:text-[#e2e8f0] transition-colors">
                  Kontakt
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
