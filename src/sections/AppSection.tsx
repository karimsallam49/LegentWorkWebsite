import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Bell,
  CalendarCheck,
  CreditCard,
  FileText,
  Search,
  ShieldCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

interface Feature {
  title: { en: string; ar: string }
  description: { en: string; ar: string }
  icon: LucideIcon
}

const FEATURES: Feature[] = [
  {
    title: { en: 'Book Appointments', ar: 'حجز المواعيد' },
    description: {
      en: 'Schedule your vehicle service in seconds. Choose your preferred date, time, and service tier directly from your phone.',
      ar: 'احجز خدمة سيارتك في ثوانٍ. اختر التاريخ والوقت ومستوى الخدمة المناسب مباشرة من هاتفك.',
    },
    icon: CalendarCheck,
  },
  {
    title: { en: 'Digital Invoicing', ar: 'فواتير رقمية' },
    description: {
      en: 'Receive detailed digital invoices instantly. Review costs, approve estimates, and keep records of every service.',
      ar: 'استلم فواتير رقمية مفصلة فورًا. راجع التكاليف ووافق على التقديرات واحتفظ بسجل لكل خدمة.',
    },
    icon: FileText,
  },
  {
    title: { en: 'Track Job Orders', ar: 'تتبع أوامر العمل' },
    description: {
      en: "Follow your vehicle's progress in real-time. From intake to completion, know exactly what stage your car is at.",
      ar: 'تابع تقدم سيارتك في الوقت الحقيقي. من الاستلام حتى الانتهاء، اعرف بالضبط في أي مرحلة سيارتك.',
    },
    icon: Search,
  },
  {
    title: { en: 'Warranty Manager', ar: 'إدارة الضمان' },
    description: {
      en: 'Access your PPF and coating warranties digitally. View coverage details, validity periods, and claim status.',
      ar: 'اطلع على ضمانات الـ PPF والسيراميك رقميًا. عرض تفاصيل التغطية وفترات السريان وحالة المطالبات.',
    },
    icon: ShieldCheck,
  },
  {
    title: { en: 'Smart Notifications', ar: 'إشعارات ذكية' },
    description: {
      en: 'Get alerts when your service is complete, warranty reminders, and maintenance schedules for your protected vehicle.',
      ar: 'استقبل تنبيهات عند اكتمال الخدمة، وتذكيرات الضمان، وجداول الصيانة لسيارتك المحمية.',
    },
    icon: Bell,
  },
  {
    title: { en: 'Secure Payments', ar: 'مدفوعات آمنة' },
    description: {
      en: 'Pay securely through the app. Save payment methods, view transaction history, and manage billing preferences.',
      ar: 'ادفع بأمان من خلال التطبيق. احفظ وسائل الدفع واطلع على سجل المعاملات وأدر تفضيلات الفوترة.',
    },
    icon: CreditCard,
  },
]

export default function AppSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.app-header > *',
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
        '.app-screen',
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.app-screen', start: 'top 80%', once: true },
        },
      )
      gsap.fromTo(
        '.app-feature-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.app-features', start: 'top 80%', once: true },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="app"
      className="relative z-20 bg-black py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#d4af37]/[0.02] blur-[180px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="app-header text-center mb-16 md:mb-20">
          <span className="text-[#d4af37] text-xs tracking-[0.4em] uppercase font-medium">
            {t('Mobile Experience', 'تجربة الموبايل')}
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
            {t('Legend ProteK', 'تطبيق')}{' '}
            <span className="gold-gradient-text">{t('App', 'ليجند بروتك')}</span>
          </h2>
          <p className="mt-4 text-white/40 max-w-2xl mx-auto text-sm md:text-base">
            {t(
              'Your vehicle protection journey, fully digital. Book, track, pay, and manage warranties — all from your pocket.',
              'رحلة حماية سيارتك رقمية بالكامل. احجز وتتبع وادفع وأدر الضمانات — كل ده من جيبك.',
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

        <div className="app-screen flex justify-center mb-20">
          <div className="relative max-w-sm w-full">
            <img
              src="/assets/app-screen-2.png"
              alt="Legend ProteK App"
              className="w-full h-auto rounded-3xl border border-white/10 shadow-2xl"
              style={{
                boxShadow:
                  'rgba(212, 175, 55, 0.15) 0px 0px 80px, rgba(0, 0, 0, 0.5) 0px 20px 60px',
              }}
            />
            <div className="absolute -inset-4 bg-[#d4af37]/5 rounded-3xl blur-2xl -z-10" />
          </div>
        </div>

        <div className="app-features grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title.en}
                  className="app-feature-card glass-panel rounded-xl p-5 group hover:border-[#d4af37]/30 transition-all duration-500"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center mb-3 group-hover:bg-[#d4af37]/20 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#d4af37] transition-colors duration-300 mb-1">
                    {t(feature.title.en, feature.title.ar)}
                  </h3>
                  <p className="text-xs text-white/40 leading-relaxed">
                    {t(feature.description.en, feature.description.ar)}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap gap-4">
              <a
                href="https://apps.apple.com/us/app/legend-protek/id6776637762"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-[#d4af37]/40 transition-all duration-500 group flex-1 min-w-[180px]"
              >
                <svg
                  className="w-8 h-8 text-white/70 group-hover:text-[#d4af37] transition-colors duration-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 16.94 2.94 12.33 4.7 9.19C5.57 7.6 7.08 6.62 8.74 6.6C10.06 6.58 11.27 7.5 12.08 7.5C12.89 7.5 14.35 6.38 15.97 6.54C16.63 6.57 18.36 6.81 19.43 8.44C19.35 8.49 17.23 9.75 17.26 12.33C17.29 15.38 19.97 16.46 20.03 16.48C19.98 16.61 19.58 17.97 18.71 19.5ZM13 3.5C13.73 2.63 14.94 2.01 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.2 6.06 13.06 6.7 11.95 6.59C11.8 5.45 12.36 4.28 13 3.5Z" />
                </svg>
                <div>
                  <p className="text-[9px] text-white/40 leading-none">
                    {t('Download on the', 'حمّل من')}
                  </p>
                  <p className="text-base font-semibold text-white leading-tight group-hover:text-[#d4af37] transition-colors duration-300">
                    App Store
                  </p>
                </div>
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=com.legendprotek.com&hl=ar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-[#d4af37]/40 transition-all duration-500 group flex-1 min-w-[180px]"
              >
                <svg
                  className="w-8 h-8 text-white/70 group-hover:text-[#d4af37] transition-colors duration-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5ZM16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12ZM20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81ZM6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" />
                </svg>
                <div>
                  <p className="text-[9px] text-white/40 leading-none">
                    {t('Get it on', 'حمّل من')}
                  </p>
                  <p className="text-base font-semibold text-white leading-tight group-hover:text-[#d4af37] transition-colors duration-300">
                    Google Play
                  </p>
                </div>
              </a>
            </div>
            <p className="mt-6 text-xs text-white/30">
              {t(
                'Available on iOS and Android. Your protection journey starts with a tap.',
                'متوفر على iOS و Android. رحلة الحماية تبدأ بضغطة واحدة.',
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
