import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Quote, Star } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const PHRASES = [
  { en: 'UNMATCHED PPF QUALITY', ar: 'جودة PPF لا تضاهى' },
  { en: 'LEGENDARY SERVICE', ar: 'خدمة أسطورية' },
  { en: 'SECURE STORAGE', ar: 'تخزين آمن' },
  { en: 'PERFECTION GUARANTEED', ar: 'الكمال مضمون' },
  { en: 'CONCIERGE LEVEL CARE', ar: 'عناية بمستوى الكونسيرج' },
  { en: 'PREMIUM CERAMIC COATING', ar: 'نانو سيراميك فاخر' },
  { en: 'FLAWLESS PAINT CORRECTION', ar: 'تصحيح طلاء بلا عيوب' },
  { en: 'EXCLUSIVE WINDOW TINTING', ar: 'تظليل زجاج حصري' },
  { en: 'CLIMATE CONTROLLED VAULT', ar: 'خزنة بتحكم مناخي' },
  { en: 'WHERE CARS BECOME LEGENDS', ar: 'حيث تصبح السيارات أساطير' },
  { en: 'ABSOLUTE PROTECTION', ar: 'حماية مطلقة' },
  { en: 'ZERO COMPROMISE', ar: 'بلا مساومة' },
  { en: 'TREATMENT WORTHY OF ROYALTY', ar: 'معاملة تليق بالملوك' },
  { en: 'BEYOND DETAILING', ar: 'أبعد من التلميع' },
  { en: 'THE GOLD STANDARD', ar: 'المعيار الذهبي' },
]

const RING_COLORS = ['#d4af37', '#fde68a', '#6b6b6b']
const RING_SHADOWS = [
  '0 0 30px rgba(212, 175, 55, 0.6)',
  '0 0 20px rgba(253, 230, 138, 0.3)',
  'none',
]

const RADIUS_Y = 140
const RADIUS_Z = 200

interface Testimonial {
  quote: { en: string; ar: string }
  name: string
  detail: { en: string; ar: string }
  initial: string
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: {
      en: 'Legend ProteK transformed my Porsche. The PPF installation is invisible yet provides absolute protection. Concierge-level service from start to finish.',
      ar: 'ليجند بروتك غيّرت شكل بورش بتاعتي. تركيب الـ PPF غير مرئي لكنه يوفر حماية مطلقة. خدمة بمستوى الكونسيرج من البداية للنهاية.',
    },
    name: 'James R.',
    detail: { en: 'Porsche 911 GT3', ar: 'بورش 911 GT3' },
    initial: 'J',
  },
  {
    quote: {
      en: 'I trust no one else with my collection. The secure storage facility is unmatched, and their attention to detail borders on obsessive. Exactly what I demand.',
      ar: 'لا أثق بأحد غيرهم في مجموعتي. منشأة التخزين الآمن لا مثيل لها، واهتمامهم بالتفاصيل يكاد يكون هوسًا. بالضبط ما أطلبه.',
    },
    name: 'Marcus T.',
    detail: { en: 'Ferrari Collection Owner', ar: 'مالك مجموعة فيراري' },
    initial: 'M',
  },
  {
    quote: {
      en: 'The ceramic coating they applied has kept my Mercedes looking showroom-new for over two years. The hydrophobic effect is genuinely remarkable.',
      ar: 'النانو سيراميك اللي ركبوه خلّى مرسيدسي تبدو جديدة كأنها في المعرض لأكتر من سنتين. تأثير طرد الماء مذهل فعلاً.',
    },
    name: 'Alexandra K.',
    detail: { en: 'Mercedes AMG GT', ar: 'مرسيدس AMG GT' },
    initial: 'A',
  },
]

function WordRing() {
  const ringRef = useRef<HTMLDivElement>(null)
  const { lang } = useLanguage()

  useEffect(() => {
    let raf = 0
    let rotation = 0
    const tick = () => {
      rotation += 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `rotateX(${rotation}deg)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const step = 360 / PHRASES.length

  return (
    <div className="relative h-[400px] md:h-[500px]" style={{ perspective: '800px' }}>
      <div
        ref={ringRef}
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}
      >
        {PHRASES.map((phrase, i) => {
          const angle = (i * step * Math.PI) / 180
          const cos = Math.cos(angle)
          const opacity = 0.2 + 0.8 * ((cos + 1) / 2)
          const colorIdx = i % 3
          return (
            <div
              key={phrase.en}
              className="absolute whitespace-nowrap font-mono text-xs md:text-sm lg:text-base tracking-[0.25em] uppercase font-medium"
              style={{
                transform: `translateY(${RADIUS_Y * Math.sin(angle)}px) translateZ(${RADIUS_Z * cos}px)`,
                opacity,
                color: RING_COLORS[colorIdx],
                textShadow: RING_SHADOWS[colorIdx],
              }}
            >
              {lang === 'ar' ? phrase.ar : phrase.en}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function CitadelSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.citadel-header > *',
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
        '.testimonial-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.testimonials-grid', start: 'top 80%', once: true },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="citadel"
      className="relative z-20 bg-black py-24 md:py-40 overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-[#d4af37]/[0.03] blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="citadel-header text-center mb-16 md:mb-24">
          <span className="text-[#d4af37] text-xs tracking-[0.4em] uppercase font-medium">
            {t('Testimonials', 'آراء العملاء')}
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
            {t('The', 'ال')}<span className="gold-gradient-text">{t(' Citadel', 'قلعة')}</span>
          </h2>
          <p className="mt-4 text-white/40 max-w-2xl mx-auto text-sm md:text-base">
            {t(
              'Words from those who demand nothing less than absolute perfection for their vehicles.',
              'كلمات من لا يقبلون لسياراتهم إلا الكمال المطلق.',
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

        <WordRing />

        <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.name}
              className="testimonial-card glass-panel rounded-xl p-6 md:p-8 group hover:border-[#d4af37]/30 transition-all duration-500"
            >
              <Quote className="w-6 h-6 text-[#d4af37]/30 mb-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-[#d4af37] text-[#d4af37]" />
                ))}
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                {t(item.quote.en, item.quote.ar)}
              </p>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{item.name}</p>
                  <p className="text-xs text-[#d4af37]/60 mt-0.5">
                    {t(item.detail.en, item.detail.ar)}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#d4af37]/5 border border-[#d4af37]/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#d4af37]">{item.initial}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
