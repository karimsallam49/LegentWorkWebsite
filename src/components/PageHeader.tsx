import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

export default function PageHeader() {
  const { t } = useLanguage()

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-black/70 backdrop-blur-2xl border-b border-white/[0.06]">
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(212, 175, 55, 0.3) 50%, transparent 100%)',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/assets/logo.png"
              alt="Legend ProteK"
              className="h-12 md:h-14 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]"
            />
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-lg text-xs tracking-wider uppercase text-[#d4af37] hover:bg-[#d4af37]/20 transition-all duration-300"
            >
              <ArrowLeft size={14} className="rtl:-scale-x-100" />
              {t('Back to site', 'العودة للموقع')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
