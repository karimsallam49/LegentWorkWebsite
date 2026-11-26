import { useEffect, useRef } from 'react'
import type { ComponentType, MouseEvent } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Asterisk, Cog, Gauge, Plug2, Search, Wrench } from 'lucide-react'
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
    tag: { en: 'QUICK', ar: 'سريع' },
    title: { en: 'Quick Maintenance', ar: 'الصيانة السريعة' },
    description: {
      en: 'Fast and efficient maintenance services to keep your car running smoothly.',
      ar: 'خدمات صيانة سريعة وفعالة للحفاظ على سيارتك تعمل بسلاسة.',
    },
    icon: Gauge,
  },
  {
    tag: { en: 'ELECTRIC', ar: 'كهرباء' },
    title: { en: 'Electrical & Mechanical', ar: 'الكهرباء والميكانيكا' },
    description: {
      en: 'Comprehensive electrical and mechanical repairs for all vehicle systems.',
      ar: 'إصلاحات كهربائية وميكانيكية شاملة لجميع أنظمة المركبات.',
    },
    icon: Plug2,
  },
  {
    tag: { en: 'SUSPENSION', ar: 'تعليق' },
    title: { en: 'Suspension & Chassis', ar: 'العفشة والتعليق' },
    description: {
      en: 'Professional suspension and chassis services for optimal vehicle performance.',
      ar: 'خدمات تعليق وهيكل احترافية لأداء مثالي للمركبة.',
    },
    icon: Cog,
  },
  {
    tag: { en: 'EMERGENCY', ar: 'طوارئ' },
    title: { en: 'Emergency Services', ar: 'خدمات الطوارئ' },
    description: {
      en: '24/7 roadside assistance and urgent repair services.',
      ar: 'مساعدة على الطريق 24/7 وخدمات إصلاح عاجلة.',
    },
    icon: Asterisk,
  },
  {
    tag: { en: 'INSPECTION', ar: 'فحص' },
    title: { en: 'External Inspection', ar: 'الفحص الخارجي' },
    description: {
      en: 'Comprehensive vehicle inspection to ensure safety and compliance standards.',
      ar: 'فحص شامل للمركبة لضمان معايير السلامة والامتثال.',
    },
    icon: Search,
  },
  {
    tag: { en: 'DIAGNOSTICS', ar: 'تشخيص' },
    title: { en: 'Diagnostics', ar: 'التشخيص' },
    description: {
      en: 'Advanced diagnostic services to identify and resolve vehicle issues.',
      ar: 'خدمات تشخيص متقدمة لتحديد وحل مشاكل المركبة.',
    },
    icon: Wrench,
  },
]

function ServiceCard({ service }: { service: Service }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const Icon = service.icon
  const { t } = useLanguage()

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    card.style.transform = `perspective(800px) rotateX(${(py - 0.5) * -8}deg) rotateY(${(px - 0.5) * 8}deg) scale(1.02)`
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(212, 175, 55, 0.15) 0%, transparent 60%)`
    }
  }

  const handleLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'perspective(800px)'
    }
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="service-card glass-panel rounded-xl p-6 md:p-8 group transition-all duration-500 relative"
      style={{
        transform: 'perspective(800px)',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.5s ease-out',
      }}
    >
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 60%)',
        }}
      />

      <span className="text-[10px] text-[#d4af37]/60 tracking-widest uppercase font-mono">
        {t(service.tag.en, service.tag.ar)}
      </span>

      <div className="mt-3 w-12 h-12 rounded-xl bg-[#d4af37]/15 flex items-center justify-center group-hover:bg-[#d4af37]/25 transition-colors duration-300">
        <Icon className="w-6 h-6 text-[#d4af37]" />
      </div>

      <h3 className="mt-4 text-lg md:text-xl font-semibold text-white group-hover:text-[#d4af37] transition-colors duration-300">
        {t(service.title.en, service.title.ar)}
      </h3>

      <p className="mt-3 text-sm text-white/40 leading-relaxed">
        {t(service.description.en, service.description.ar)}
      </p>

    </div>
  )
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
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
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.services-grid', start: 'top 75%', once: true },
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
          <h2 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
            <span>{t('Protection', 'الحماية')}</span>
            <span className="gold-gradient-text"> {t('Redefined', 'بمعايير جديدة')}</span>
          </h2>
          <p className="mt-4 text-white/40 max-w-2xl mx-auto text-sm md:text-base">
            {t(
              'Every vehicle that enters Legend ProteK receives treatment worthy of its pedigree. Our suite of premium services ensures your investment remains flawless.',
              'كل سيارة تدخل ليجند بروتك تلقى معاملة تليق بمكانتها. باقة خدماتنا الفاخرة تضمن بقاء استثمارك في أبهى صورة.',
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
