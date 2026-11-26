import { useState } from 'react'
import { User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { scrollToSection } from '../utils/scroll'
import AuthDialog from './AuthDialog'
import LanguageSwitcher from './LanguageSwitcher'

interface NavItem {
  id: string
  en: string
  ar: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'services', en: 'Services', ar: 'الخدمات' },
  { id: 'fleet', en: 'Fleet', ar: 'الأسطول' },
  { id: 'citadel', en: 'Citadel', ar: 'القلعة' },
  { id: 'app', en: 'App', ar: 'التطبيق' },
  { id: 'careers', en: 'Careers', ar: 'الوظائف' },
  { id: 'blog', en: 'Blog', ar: 'المدونة' },
  { id: 'vault', en: 'Book', ar: 'احجز' },
]

export default function Navigation() {
  const { t } = useLanguage()
  const { isAuthenticated } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/70 backdrop-blur-2xl border-b border-white/[0.06] transition-all duration-700 ease-out">
        <div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.3) 50%, transparent 100%)',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 group"
            >
              <img
                src="/assets/logo.png"
                alt="Legend ProteK"
                className="h-16 md:h-20 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]"
              />
            </button>

            <div className="hidden md:flex items-center gap-8 lg:gap-10">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="relative text-xs tracking-[0.15em] uppercase text-white/50 hover:text-[#d4af37] transition-colors duration-300 py-2 group whitespace-nowrap"
                >
                  {t(item.en, item.ar)}
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#d4af37] group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <LanguageSwitcher />
              </div>
              <button
                onClick={() => setAuthOpen(true)}
                aria-label={t('Account', 'الحساب')}
                className={`relative p-2 rounded-lg border transition-all duration-300 ${
                  isAuthenticated
                    ? 'border-[#d4af37]/50 text-[#d4af37] bg-[#d4af37]/10'
                    : 'border-white/10 text-white/50 hover:text-[#d4af37] hover:border-[#d4af37]/30'
                }`}
              >
                <User size={16} />
                {isAuthenticated && (
                  <span className="absolute -top-0.5 -end-0.5 w-2 h-2 rounded-full bg-[#d4af37]" />
                )}
              </button>
              <button
                onClick={() => scrollToSection('vault')}
                className="px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg text-xs tracking-wider uppercase text-[#d4af37] hover:bg-[#d4af37]/20 hover:border-[#d4af37]/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300"
              >
                {t('Book', 'احجز')}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
