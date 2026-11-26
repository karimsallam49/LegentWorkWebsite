import { Globe } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'
import type { Language } from '../context/LanguageContext'

const LANGUAGES: { id: Language; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'ar', label: 'العربية' },
]

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="flex items-center gap-1.5">
      <Globe className="w-3.5 h-3.5 text-[#d4af37]/60" />
      {LANGUAGES.map((l, i) => (
        <span key={l.id} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-white/20 text-[8px]">|</span>}
          <button
            onClick={() => setLang(l.id)}
            className={`text-[10px] tracking-wider px-2 py-1 rounded transition-all duration-300 ${
              lang === l.id
                ? 'bg-[#d4af37]/20 text-[#d4af37] font-medium uppercase'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            {l.label}
          </button>
        </span>
      ))}
    </div>
  )
}
