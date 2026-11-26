import { Apple, Mail, MapPin, Phone, Play, Shield } from 'lucide-react'
import { useSocialMedia } from '../api/storefront'
import SocialIcon from '../components/SocialIcon'
import { useLanguage } from '../context/LanguageContext'
import { scrollToSection } from '../utils/scroll'

const NAV_LINKS = [
  { id: 'services', en: 'Services', ar: 'الخدمات' },
  { id: 'fleet', en: 'Fleet', ar: 'الأسطول' },
  { id: 'citadel', en: 'Citadel', ar: 'القلعة' },
  { id: 'app', en: 'App', ar: 'التطبيق' },
  { id: 'careers', en: 'Careers', ar: 'الوظائف' },
  { id: 'blog', en: 'Blog', ar: 'المدونة' },
  { id: 'vault', en: 'Book', ar: 'احجز' },
]

const CONTACTS = [
  { en: 'General', ar: 'عام', email: 'info@legendprotek.com' },
  { en: 'Sales', ar: 'المبيعات', email: 'sales@legendprotek.com' },
  { en: 'After Sales', ar: 'ما بعد البيع', email: 'aftersales@legendprotek.com' },
  { en: 'Support', ar: 'الدعم', email: 'support@legendprotek.com' },
  { en: 'HR & Careers', ar: 'التوظيف', email: 'hr@legendprotek.com' },
]

const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61589834750593'
const INSTAGRAM_URL = 'https://www.instagram.com/legendprotek/'
const APP_STORE_URL = 'https://apps.apple.com/us/app/legend-protek/id6776637762'
const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.legendprotek.com&hl=ar'

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

export default function FooterSection() {
  const { t } = useLanguage()
  const { data: socials } = useSocialMedia()

  return (
    <footer className="relative z-20 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <img
              src="/assets/logo.png"
              alt="Legend ProteK"
              className="w-32 md:w-40 mb-6"
            />
            <p className="text-sm text-white/40 max-w-md leading-relaxed">
              {t(
                'Legend ProteK is the premier destination for discerning vehicle owners who demand absolute protection and perfection. Located at El Marwaha Square, Katameya, Cairo.',
                'ليجند بروتك هي الوجهة الأولى لملاك السيارات المميزين الذين يطلبون الحماية المطلقة والكمال. مقرنا في ميدان المروحة، القطامية، القاهرة.',
              )}
            </p>
            <div className="mt-6 flex items-center gap-4 flex-wrap">
              <Shield className="w-4 h-4 text-[#d4af37]" />
              <span className="text-xs text-[#d4af37]/60 tracking-wider uppercase">
                {t('12-Year PPF Warranty', 'ضمان PPF لمدة ١٢ سنة')}
              </span>
            </div>

            <div className="mt-6 space-y-2" dir="ltr">
              <div className="flex items-center gap-2 text-white/50">
                <Phone className="w-4 h-4 text-[#d4af37]/60" />
                <span className="text-xs text-white/40 tracking-wider uppercase">
                  {t('Phone', 'الهاتف')}
                </span>
              </div>
              <a
                href="tel:01515977771"
                className="flex items-center gap-3 text-white/50 hover:text-[#d4af37] transition-colors"
              >
                <span className="text-sm whitespace-nowrap">015 15977771</span>
              </a>
              <a
                href="tel:01515977772"
                className="flex items-center gap-3 text-white/50 hover:text-[#d4af37] transition-colors"
              >
                <span className="text-sm whitespace-nowrap">015 15977772</span>
              </a>
            </div>

            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-3 text-white/50 hover:text-[#3b5998] transition-colors"
              dir="ltr"
            >
              <FacebookIcon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm whitespace-nowrap">Facebook</span>
            </a>

            <div className="mt-4 flex items-start gap-3 text-white/50">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span className="text-sm">
                {t(
                  'Plot 13, El Marwaha Square, Katameya, Cairo, Egypt',
                  'قطعة ١٣، ميدان المروحة، القطامية، القاهرة، مصر',
                )}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-[#d4af37]/30 transition-all duration-300 group"
              >
                <Apple className="w-6 h-6 text-white/70 group-hover:text-[#d4af37] transition-colors" />
                <div>
                  <p className="text-[9px] text-white/40 leading-none">App Store</p>
                  <p className="text-sm font-semibold text-white leading-tight">App Store</p>
                </div>
              </a>
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-[#d4af37]/30 transition-all duration-300 group"
              >
                <Play className="w-6 h-6 text-white/70 group-hover:text-[#d4af37] transition-colors" />
                <div>
                  <p className="text-[9px] text-white/40 leading-none">Google Play</p>
                  <p className="text-sm font-semibold text-white leading-tight">Google Play</p>
                </div>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs text-white/60 tracking-[0.2em] uppercase font-medium mb-6">
              {t('Navigation', 'التنقل')}
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-sm text-white/40 hover:text-[#d4af37] transition-colors duration-300"
                  >
                    {t(link.en, link.ar)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs text-white/60 tracking-[0.2em] uppercase font-medium mb-6">
              {t('Contact', 'تواصل معنا')}
            </h4>
            <ul className="space-y-3">
              {CONTACTS.map((contact) => (
                <li key={contact.email}>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm text-white/40 hover:text-[#d4af37] transition-colors duration-300"
                  >
                    <span className="text-[10px] text-white/25 uppercase tracking-wider block">
                      {t(contact.en, contact.ar)}
                    </span>
                    {contact.email}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            {t('© 2026 Legend ProteK. All rights reserved.', '© ٢٠٢٦ ليجند بروتك. جميع الحقوق محفوظة.')}
          </p>
          <div className="flex items-center gap-6">
            {socials && socials.length > 0 ? (
              socials.map((s) => (
                <a
                  key={s.id}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  className="text-white/30 hover:text-[#d4af37] transition-colors"
                >
                  <SocialIcon item={s} className="w-5 h-5" />
                </a>
              ))
            ) : (
              <>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/30 hover:text-[#d4af37] transition-colors"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
                <a
                  href="mailto:info@legendprotek.com"
                  className="text-white/30 hover:text-[#d4af37] transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/30 hover:text-[#3b5998] transition-colors"
                >
                  <FacebookIcon className="w-5 h-5" />
                </a>
              </>
            )}
            <span className="text-xs text-white/30">
              {t('Where Protection Meets Perfection', 'حيث تلتقي الحماية بالكمال')}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
