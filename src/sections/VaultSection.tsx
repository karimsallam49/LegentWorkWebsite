import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import type { Branch } from '../api/types'
import { useSocialMedia, type SocialLink } from '../api/storefront'
import SocialIcon, { socialMeta } from '../components/SocialIcon'
import BookingWizard, { branchAddress, branchTitle } from '../components/BookingWizard'
import FlipClock from '../components/FlipClock'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const PHONES = ['015 15977771', '015 15977772']

const EMAILS = [
  { label: { en: 'General', ar: 'عام' }, address: 'info@legendprotek.com' },
  { label: { en: 'Sales', ar: 'المبيعات' }, address: 'sales@legendprotek.com' },
  { label: { en: 'After Sales', ar: 'ما بعد البيع' }, address: 'aftersales@legendprotek.com' },
  { label: { en: 'Support', ar: 'الدعم' }, address: 'support@legendprotek.com' },
  { label: { en: 'HR & Careers', ar: 'التوظيف' }, address: 'hr@legendprotek.com' },
]

const MAP_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3457.0!2d31.4167!3d29.9667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDU4JzAwLjAiTiAzMcKwMjUnMDAuMCJF!5e0!3m2!1sen!2seg!4v1'

export default function VaultSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null)
  const { t, lang } = useLanguage()
  const { data: socials } = useSocialMedia()

  const lat =
    selectedBranch?.website_settings?.latitude ?? selectedBranch?.latitude
  const lng =
    selectedBranch?.website_settings?.longitude ?? selectedBranch?.longitude
  const hasCoords = lat != null && lng != null
  const mapSrc = !selectedBranch
    ? MAP_SRC
    : `https://maps.google.com/maps?q=${
        hasCoords
          ? `${lat},${lng}`
          : encodeURIComponent(`${selectedBranch.name}, Egypt`)
      }&z=${hasCoords ? 15 : 12}&output=embed`

  const mapTitle = selectedBranch
    ? branchTitle(selectedBranch, lang)
    : t('Plot 13, El Marwaha Square', 'قطعة ١٣، ميدان المروحة')
  const mapSubtitle = selectedBranch
    ? (branchAddress(selectedBranch) ??
      t('Branch location on map', 'موقع الفرع على الخريطة'))
    : t('Katameya, Cairo, Egypt', 'القطامية، القاهرة، مصر')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.vault-header > *',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
        },
      )
      gsap.fromTo(
        '.vault-form, .vault-sidebar > *',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.vault-content', start: 'top 75%', once: true },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="vault"
      className="relative z-20 bg-black py-24 md:py-32"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-[#d4af37]/[0.02] blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="vault-header text-center mb-16 md:mb-20">
          <span className="text-[#d4af37] text-xs tracking-[0.4em] uppercase font-medium">
            {t('Book Now', 'احجز الآن')}
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
            {t('The', 'الـ')} <span className="gold-gradient-text">{t('Vault', 'خزنة')}</span>
          </h2>
          <p className="mt-4 text-white/40 max-w-2xl mx-auto text-sm md:text-base">
            {t(
              'Reserve your appointment at Legend ProteK. Our concierge team will confirm your booking within 24 hours.',
              'احجز ميعادك في ليجند بروتك. فريق الكونسيرج هيأكد حجزك خلال ٢٤ ساعة.',
            )}
          </p>
          <div
            className="mx-auto mt-6 w-16 h-[1px]"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgb(212, 175, 55), transparent)',
            }}
          />
        </div>

        <div className="vault-content grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="vault-form glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none">
              <div
                className="absolute top-0 right-0 w-full h-[1px]"
                style={{ background: 'linear-gradient(90deg, transparent, rgb(212, 175, 55))' }}
              />
              <div
                className="absolute top-0 right-0 h-full w-[1px]"
                style={{ background: 'linear-gradient(rgb(212, 175, 55), transparent)' }}
              />
            </div>

            <BookingWizard onBranchChange={setSelectedBranch} />
          </div>

          <div className="vault-sidebar space-y-6">
            <div className="glass-panel rounded-2xl overflow-hidden">
              <div className="aspect-[4/3] relative">
                <iframe
                  key={selectedBranch?.id ?? 'default'}
                  src={mapSrc}
                  width="100%"
                  height="100%"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={mapTitle}
                  className="absolute inset-0 w-full h-full"
                  style={{
                    border: 0,
                    filter: 'invert(90%) hue-rotate(180deg) brightness(0.7) contrast(1.2)',
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-5">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-white">{mapTitle}</p>
                      <p className="text-xs text-white/50 mt-0.5">{mapSubtitle}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-5 space-y-3" dir="ltr">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-xl bg-[#d4af37]/10 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-[#d4af37]" />
                </div>
                <p className="text-[10px] text-white/40 tracking-wider uppercase">
                  {t('Phone', 'الهاتف')}
                </p>
              </div>
              {PHONES.map((phone, i) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className={`flex items-center justify-between group py-2 ${
                    i < PHONES.length - 1 ? 'border-b border-white/5' : ''
                  }`}
                >
                  <p className="text-sm text-white/70 group-hover:text-[#d4af37] transition-colors duration-300 whitespace-nowrap">
                    {phone}
                  </p>
                  <Phone className="w-3.5 h-3.5 text-white/20 group-hover:text-[#d4af37] transition-colors flex-shrink-0 ml-3" />
                </a>
              ))}
            </div>

            {socials && socials.length > 0 ? (
              socials.map((s) => <SocialCard key={s.id} item={s} />)
            ) : (
              <>
            <a
              href="https://www.facebook.com/profile.php?id=61589834750593"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel rounded-2xl p-5 flex items-center justify-between group hover:border-[#3b5998]/30 transition-all duration-300"
              dir="ltr"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#3b5998]/20 border border-[#3b5998]/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#3b5998]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-white/40">Facebook</p>
                  <p className="text-sm text-white group-hover:text-[#3b5998] transition-colors whitespace-nowrap">
                    Legend ProteK
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#3b5998] group-hover:translate-x-1 transition-all flex-shrink-0 ml-3" />
            </a>

            <div className="glass-panel rounded-2xl p-5 space-y-3" dir="ltr">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-[#d4af37]/10 flex items-center justify-center">
                  <Send className="w-4 h-4 text-[#d4af37]" />
                </div>
                <p className="text-[10px] text-white/40 tracking-wider uppercase">
                  {t('Email Contacts', 'جهات الاتصال')}
                </p>
              </div>
              {EMAILS.map((email) => (
                <a
                  key={email.address}
                  href={`mailto:${email.address}`}
                  className="flex items-center justify-between group py-2 border-b border-white/5 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] text-white/30 tracking-wider uppercase">
                      {t(email.label.en, email.label.ar)}
                    </p>
                    <p className="text-sm text-white/70 group-hover:text-[#d4af37] transition-colors duration-300 whitespace-nowrap">
                      {email.address}
                    </p>
                  </div>
                  <Mail className="w-3.5 h-3.5 text-white/20 group-hover:text-[#d4af37] transition-colors flex-shrink-0 ml-3" />
                </a>
              ))}
            </div>

            <div className="glass-panel rounded-2xl p-6 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-3.5 h-3.5 text-white/30" />
                <span className="text-[10px] text-white/40 tracking-[0.4em] uppercase">
                  {t('Local Time', 'التوقيت المحلي')}
                </span>
              </div>
              <FlipClock />
              <p className="mt-4 text-[10px] text-white/25 text-center">
                {t(
                  'Our vault operates 24/7 for secure vehicle storage',
                  'خزنتنا تعمل على مدار الساعة للتخزين الآمن للسيارات',
                )}
              </p>
            </div>

            <a
              href="https://www.instagram.com/legendprotek/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel rounded-2xl p-5 flex items-center justify-between group hover:border-[#d4af37]/30 transition-all duration-300"
              dir="ltr"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-white/40">Instagram</p>
                  <p className="text-sm text-white group-hover:text-[#d4af37] transition-colors whitespace-nowrap">
                    @legendprotek
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all flex-shrink-0 ml-3" />
            </a>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Social cards (from /ecommerce/social-media) ---------- */

function linkLabel(link: string) {
  if (/^(tel|mailto|sms):/i.test(link)) return link.split(':').slice(1).join(':')
  try {
    return new URL(link).hostname.replace(/^www\./, '')
  } catch {
    return link
  }
}

function SocialCard({ item }: { item: SocialLink }) {
  const meta = socialMeta(item.name, item.link)
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-panel rounded-2xl p-5 flex items-center justify-between group hover:border-[#d4af37]/30 transition-all duration-300"
      dir="ltr"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${meta.color}14`, border: `1px solid ${meta.color}4d` }}
        >
          <span style={{ color: meta.color }} className="flex items-center">
            <SocialIcon item={item} className="w-5 h-5" />
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-white/40">{item.name}</p>
          <p className="text-sm text-white group-hover:text-[#d4af37] transition-colors whitespace-nowrap">
            {linkLabel(item.link)}
          </p>
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#d4af37] group-hover:translate-x-1 transition-all flex-shrink-0 ml-3" />
    </a>
  )
}
