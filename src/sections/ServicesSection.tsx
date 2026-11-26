import { useEffect, useRef, useState } from 'react'
import type { ComponentType, MouseEvent } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Car, Droplets, Lock, Shield, Sparkles, Sun } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

interface Service {
  tag: { en: string; ar: string }
  title: { en: string; ar: string }
  description: { en: string; ar: string }
  icon: ComponentType<{ className?: string }>
}

const SERVICES: Service[] = [
  {
    tag: { en: 'PPF', ar: 'PPF' },
    title: { en: 'Paint Protection Film', ar: 'فيلم حماية الطلاء' },
    description: {
      en: 'Self-healing PPF that shields your paint from rock chips, scratches, and environmental damage. Our premium films offer 12-year warranty with hydrophobic self-leveling technology.',
      ar: 'فيلم PPF ذاتي الشفاء يحمي طلاء سيارتك من الحصى والخدوش والعوامل البيئية. أفلامنا المتميزة تأتي بضمان 12 عاماً مع تقنية التسوية المائية.',
    },
    icon: Shield,
  },
  {
    tag: { en: 'COATING', ar: 'كوتينج' },
    title: { en: 'Ceramic Coating', ar: 'الطلاء السيراميكي' },
    description: {
      en: 'Nano-ceramic protection that creates a permanent bond with your paint. Provides unmatched gloss, chemical resistance, and hydrophobic properties that last for years.',
      ar: 'حماية نانو سيراميك تخلق رابطة دائمة مع طلاء سيارتك. توفر لمعاناً لا مثيل له ومقاومة كيميائية وخصائص مائية تدوم لسنوات.',
    },
    icon: Droplets,
  },
  {
    tag: { en: 'TINT', ar: 'تظليل' },
    title: { en: 'Window Tinting', ar: 'تظليل النوافذ' },
    description: {
      en: 'Premium ceramic window films that block 99% of UV rays and reduce interior heat. Available in various shades to match your style while ensuring privacy and comfort.',
      ar: 'أفلام سيراميك متميزة تحجب 99٪ من الأشعة فوق البنفسجية وتقلل حرارة المقصورة. متاحة بعدة درجات لتناسب أسلوبك مع ضمان الخصوصية والراحة.',
    },
    icon: Sun,
  },
  {
    tag: { en: 'DETAIL', ar: 'تفصيل' },
    title: { en: 'Interior Detailing', ar: 'تفصيل المقصورة الداخلية' },
    description: {
      en: 'Meticulous interior restoration including leather conditioning, deep cleaning, and protection treatments. We bring your cabin back to showroom condition.',
      ar: 'ترميم دقيق للمقصورة الداخلية يشمل العناية بالجلد والتنظيف العميق والمعالجات الواقية. نعيد مقصورتك لحالة الصالة.',
    },
    icon: Sparkles,
  },
  {
    tag: { en: 'CORRECT', ar: 'تصحيح' },
    title: { en: 'Exterior Detailing', ar: 'تفصيل الهيكل الخارجي' },
    description: {
      en: 'Complete paint correction and polishing to eliminate swirl marks, oxidation, and imperfections. Followed by sealant application for lasting protection.',
      ar: 'تصحيح طلاء كامل وتلميع لإزالة الحلقات الدائرية والأكسدة والعيوب. يتباه بطلاء واقٍ لحماية دائمة.',
    },
    icon: Car,
  },
  {
    tag: { en: 'VAULT', ar: 'المخزن' },
    title: { en: 'Secure Storage', ar: 'التخزين الآمن' },
    description: {
      en: 'Climate-controlled, 24/7 monitored vehicle storage for your prized possessions. Concierge-level care with regular maintenance checks and battery tender service.',
      ar: 'تخزين مركبات بمراقبة 24/7 وتحكم في المناخ لممتلكاتك الثمينة. رعاية بمستوى الكونسيرج مع فحوصات صيانة منتظمة وخدمة شاحن البطارية.',
    },
    icon: Lock,
  },
]

function GradientTitle({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, i) => {
        const isLast = i === words.length - 1
        return (
          <span key={i}>
            <span className={isLast ? 'gold-gradient-text' : undefined}>{word}</span>
            {i < words.length - 1 && ' '}
          </span>
        )
      })}
    </>
  )
}

function ServiceCard({ service }: { service: Service }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const Icon = service.icon
  const { t } = useLanguage()

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setHovered(true)
    setMouse({ x, y })
  }

  const handleLeave = () => {
    setHovered(false)
    setMouse({ x: 0.5, y: 0.5 })
  }

  const scrollToVault = () => {
    document.getElementById('vault')?.scrollIntoView({ behavior: 'smooth' })
  }

  const rotateX = hovered ? (mouse.y - 0.5) * -12 : 0
  const rotateY = hovered ? (mouse.x - 0.5) * 12 : 0
  const scale = hovered ? 1.02 : 1

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      className="service-card glass-panel rounded-xl p-6 md:p-8 group transition-all duration-500 relative"
      style={{
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
        transformStyle: 'preserve-3d',
        transition: hovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        background: hovered
          ? 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)'
          : undefined,
        borderColor: hovered ? 'rgba(212, 175, 55, 0.3)' : undefined,
      }}
    >
      <div
        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(212, 175, 55, 0.15) 0%, transparent 60%)`,
        }}
      />

      <span className="text-[10px] text-[#d4af37]/60 tracking-widest uppercase font-mono">
        {t(service.tag.en, service.tag.ar)}
      </span>

      <div className="mt-4 w-14 h-14 rounded-xl bg-[#d4af37]/10 flex items-center justify-center group-hover:bg-[#d4af37]/20 transition-colors duration-300">
        <Icon className="w-6 h-6 text-[#d4af37]" />
      </div>

      <h3 className="mt-4 text-lg md:text-xl font-semibold text-white group-hover:text-[#d4af37] transition-colors duration-300">
        {t(service.title.en, service.title.ar)}
      </h3>

      <p className="mt-3 text-sm text-white/40 leading-relaxed">
        {t(service.description.en, service.description.ar)}
      </p>

      <button
        type="button"
        onClick={scrollToVault}
        className="mt-4 flex items-center gap-2 text-[#d4af37]/60 group-hover:text-[#d4af37] transition-colors duration-300"
      >
        <span className="text-xs tracking-wider uppercase">
          {t('Book Now', 'احجز الآن')}
        </span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-transform duration-300" />
      </button>
    </div>
  )
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.services-header > *',
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
        '.service-card',
        { y: 60, opacity: 0, rotateX: 15 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.services-grid', start: 'top 85%', once: true },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative z-20 bg-black py-24 md:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-[#d4af37]/[0.02] blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#d4af37]/[0.015] blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="services-header text-center mb-16 md:mb-20">
          <span className="text-[#d4af37] text-xs tracking-[0.4em] uppercase font-medium">
            {t('Our Services', 'خدماتنا')}
          </span>
          <h2
            ref={titleRef}
            className="mt-4 text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight"
          >
            <GradientTitle text={t('Protection Redefined', 'حماية بمعايير جديدة')} />
          </h2>
          <p className="mt-4 text-white/40 max-w-2xl mx-auto text-sm md:text-base">
            {t(
              'Every vehicle that enters Legend ProteK receives treatment worthy of its pedigree. Our suite of premium services ensures your investment remains flawless.',
              'كل مركبة تدخل ليجند بروتيك تتلقى معاملة تليق بمكانتها. مجموعة خدماتنا المتميزة تضمن بقاء استثمارك في أبهى حالاته.',
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

        <div
          className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          style={{ perspective: '1000px' }}
        >
          {SERVICES.map((service) => (
            <ServiceCard key={service.tag.en} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}
