import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Award,
  Briefcase,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Heart,
  Mail,
  MapPin,
  Phone,
  Send,
  TrendingUp,
  Upload,
  User,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCareers } from '../api/storefront'
import { EMAIL_RELAY_URL } from '../config'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

interface Benefit {
  title: { en: string; ar: string }
  description: { en: string; ar: string }
  icon: LucideIcon
}

const BENEFITS: Benefit[] = [
  {
    title: { en: 'Competitive Salary', ar: 'راتب تنافسي' },
    description: { en: 'Above-market compensation packages', ar: 'حزم رواتب أعلى من السوق' },
    icon: Award,
  },
  {
    title: { en: 'Career Growth', ar: 'نمو مهني' },
    description: { en: 'Clear progression paths & training', ar: 'مسارات ترقي واضحة وتدريب' },
    icon: TrendingUp,
  },
  {
    title: { en: 'Elite Team', ar: 'فريق متميز' },
    description: { en: 'Work with industry-leading professionals', ar: 'اعمل مع محترفين روّاد في المجال' },
    icon: Users,
  },
  {
    title: { en: 'Health Coverage', ar: 'تأمين صحي' },
    description: { en: 'Comprehensive medical insurance', ar: 'تأمين طبي شامل' },
    icon: Heart,
  },
  {
    title: { en: 'Flexible Hours', ar: 'ساعات مرنة' },
    description: { en: 'Work-life balance prioritized', ar: 'أولوية للتوازن بين العمل والحياة' },
    icon: Clock,
  },
  {
    title: { en: 'Performance Bonus', ar: 'حوافز أداء' },
    description: { en: 'Quarterly incentives & rewards', ar: 'مكافآت وحوافز ربع سنوية' },
    icon: DollarSign,
  },
]

interface Position {
  title: string
  department: string
  type: string
}

const POSITIONS: Position[] = [
  { title: 'PPF Installation Specialist', department: 'Technical', type: 'Full-time' },
  { title: 'Ceramic Coating Technician', department: 'Technical', type: 'Full-time' },
  { title: 'Detailer - Exterior', department: 'Detailing', type: 'Full-time' },
  { title: 'Detailer - Interior', department: 'Detailing', type: 'Full-time' },
  { title: 'Customer Relations Manager', department: 'Operations', type: 'Full-time' },
  { title: 'Quality Control Inspector', department: 'Technical', type: 'Full-time' },
]

export default function CareersSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [selectedPosition, setSelectedPosition] = useState('')
  const [fileName, setFileName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const { t, lang } = useLanguage()
  const { data: careers } = useCareers()

  const positions: Position[] = careers
    ? careers.positions.map((p) => ({
        title: lang === 'ar' ? p.title_ar : (p.title_en ?? p.title_ar),
        department:
          lang === 'ar'
            ? (p.department_ar ?? '')
            : (p.department_en ?? p.department_ar ?? ''),
        type: p.employment_type ?? '',
      }))
    : POSITIONS

  const location = careers
    ? careers.location
    : {
        address: 'Plot 13, El Marwaha Square, Katameya, Cairo, Egypt',
      }
  const hrEmail = careers ? careers.hr_email : 'hr@legendprotek.com'

  const handlePositionClick = (title: string) => {
    setSelectedPosition(title)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)

    setSending(true)
    setSendError('')
    try {
      if (EMAIL_RELAY_URL) {
        const fileInput = form.querySelector<HTMLInputElement>('input[name="attachment"]')
        const file = fileInput?.files?.[0]
        let fileData: { name: string; mimeType: string; base64: string } | null = null
        if (file) {
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })
          fileData = {
            name: file.name,
            mimeType: file.type || 'application/octet-stream',
            base64: dataUrl.split(',')[1],
          }
        }
        // no-cors: the request is delivered to Apps Script but the response
        // is opaque — success is assumed unless the request itself fails.
        await fetch(EMAIL_RELAY_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            to: hrEmail ?? undefined,
            subject: `Job Application — ${fd.get('position') || 'General'}`,
            name: fd.get('name'),
            email: fd.get('email'),
            phone: fd.get('phone'),
            experience: fd.get('experience'),
            position: fd.get('position'),
            message: fd.get('message'),
            file: fileData,
          }),
        })
      } else {
        fd.set('_subject', `Job Application — ${fd.get('position') || 'General'}`)
        fd.set('_template', 'table')
        fd.set(
          '_autoresponse',
          'Thank you for applying to Legend ProteK. We received your application and our HR team will get back to you soon.',
        )
        const res = await fetch(
          `https://formsubmit.co/ajax/${hrEmail ?? 'hr@legendprotek.com'}`,
          {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: fd,
          },
        )
        if (!res.ok) throw new Error('send failed')
      }
      setSubmitted(true)
      form.reset()
      setSelectedPosition('')
      setFileName('')
      setTimeout(() => setSubmitted(false), 6000)
    } catch {
      setSendError(
        t(
          'Failed to send. Please try again or email us directly.',
          'فشل الإرسال. حاول مرة أخرى أو راسلنا مباشرة.',
        ),
      )
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.careers-header > *',
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
        '.benefit-card',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.benefits-grid', start: 'top 80%', once: true },
        },
      )
      gsap.fromTo(
        '.position-card',
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.positions-list', start: 'top 80%', once: true },
        },
      )
      gsap.fromTo(
        '#application-form',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '#application-form', start: 'top 80%', once: true },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="careers"
      className="relative z-20 bg-black py-24 md:py-32"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[#d4af37]/[0.02] blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="careers-header text-center mb-16 md:mb-20">
          <span className="text-[#d4af37] text-xs tracking-[0.4em] uppercase font-medium">
            {t('Join The Team', 'انضم للفريق')}
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
            {t('Build Your', 'ابنِ')} <span className="gold-gradient-text">{t('Legacy', 'إرثك')}</span>
          </h2>
          <p className="mt-4 text-white/40 max-w-2xl mx-auto text-sm md:text-base">
            {t(
              "We're always looking for passionate professionals who share our obsession with perfection. Join the most elite automotive protection team in Egypt.",
              'نبحث دائمًا عن محترفين شغوفين يشاركونا هوسنا بالكمال. انضم لأمهر فريق حماية سيارات في مصر.',
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

        <div className="benefits-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title.en}
                className="benefit-card glass-panel rounded-xl p-4 text-center group hover:border-[#d4af37]/30 transition-all duration-500"
              >
                <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#d4af37]/20 transition-colors">
                  <Icon className="w-5 h-5 text-[#d4af37]" />
                </div>
                <p className="text-xs font-medium text-white group-hover:text-[#d4af37] transition-colors">
                  {t(benefit.title.en, benefit.title.ar)}
                </p>
                <p className="text-[10px] text-white/30 mt-1">
                  {t(benefit.description.en, benefit.description.ar)}
                </p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#d4af37]" />
              {t('Open Positions', 'الوظائف المتاحة')}
            </h3>
            <div className="positions-list space-y-3">
              {positions.length === 0 ? (
                <p className="glass-panel rounded-xl p-5 text-sm text-white/40 text-center">
                  {t(
                    'No open positions right now — check back soon.',
                    'لا توجد وظائف شاغرة حاليًا — تابعنا قريبًا.',
                  )}
                </p>
              ) : (
                positions.map((position) => (
                  <button
                    key={position.title}
                    onClick={() => handlePositionClick(position.title)}
                    className="position-card w-full glass-panel rounded-xl p-4 flex items-center justify-between group transition-all duration-300 text-left hover:border-[#d4af37]/20"
                  >
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-[#d4af37] transition-colors">
                        {position.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        {position.department && (
                          <span className="text-[10px] text-white/30 tracking-wider uppercase">
                            {position.department}
                          </span>
                        )}
                        {position.type && (
                          <span className="px-2 py-0.5 bg-[#d4af37]/15 border border-[#d4af37]/30 rounded-full text-[9px] text-[#d4af37] tracking-wider uppercase">
                            {position.type}
                          </span>
                        )}
                      </div>
                    </div>
                    <CheckCircle2
                      className={`w-5 h-5 flex-shrink-0 transition-all ${
                        selectedPosition === position.title
                          ? 'text-[#d4af37]'
                          : 'text-white/10 group-hover:text-white/30'
                      }`}
                    />
                  </button>
                ))
              )}
            </div>

            {location && (
              <div className="mt-8 glass-panel rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white">
                      {t('Work Location', 'مكان العمل')}
                    </p>
                    <p className="text-xs text-white/40 mt-1">{location.address}</p>
                    {hrEmail && (
                      <a
                        href={`mailto:${hrEmail}`}
                        className="text-xs text-[#d4af37]/60 hover:text-[#d4af37] transition-colors mt-2 inline-block"
                      >
                        {hrEmail}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <form
            ref={formRef}
            id="application-form"
            onSubmit={handleSubmit}
            className="glass-panel rounded-2xl p-6 md:p-8 space-y-5 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none">
              <div
                className="absolute top-0 left-0 w-full h-[1px]"
                style={{ background: 'linear-gradient(90deg, rgb(212, 175, 55), transparent)' }}
              />
              <div
                className="absolute top-0 left-0 h-full w-[1px]"
                style={{ background: 'linear-gradient(rgb(212, 175, 55), transparent)' }}
              />
            </div>

            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-2 flex items-center gap-2">
              <Send className="w-4 h-4 text-[#d4af37]" />
              {t('Apply Now', 'قدم الآن')}
            </h3>

            <input
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              style={{ display: 'none' }}
            />

            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type="text"
                name="name"
                placeholder={t('Full Name', 'الاسم بالكامل')}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#d4af37]/50 focus:bg-white/[0.06] transition-all duration-300 pl-11"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type="email"
                name="email"
                placeholder={t('Email Address', 'البريد الإلكتروني')}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#d4af37]/50 focus:bg-white/[0.06] transition-all duration-300 pl-11"
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type="tel"
                name="phone"
                placeholder={t('Phone Number', 'رقم الموبايل')}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#d4af37]/50 focus:bg-white/[0.06] transition-all duration-300 pl-11"
              />
            </div>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input
                type="text"
                name="experience"
                placeholder={t('Years of Experience', 'سنوات الخبرة')}
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#d4af37]/50 focus:bg-white/[0.06] transition-all duration-300 pl-11"
              />
            </div>

            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <select
                required
                name="position"
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#d4af37]/50 focus:bg-white/[0.06] transition-all duration-300 pl-11 appearance-none"
              >
                <option value="" disabled>
                  {t('Select Position', 'اختر الوظيفة')}
                </option>
                {positions.map((p) => (
                  <option key={p.title} value={p.title}>
                    {p.title}
                  </option>
                ))}
                <option value="Other">
                  {t('Other / General Application', 'أخرى / طلب عام')}
                </option>
              </select>
            </div>

            <textarea
              name="message"
              placeholder={t(
                'Tell us about yourself and why you want to join Legend ProteK...',
                'احكيلنا عن نفسك وليه عايز تنضم لليجند بروتك...',
              )}
              rows={4}
              className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-[#d4af37]/50 focus:bg-white/[0.06] transition-all duration-300 min-h-[100px] resize-none"
            />

            <label className="flex items-center gap-3 px-4 py-3 bg-white/[0.03] border border-white/10 border-dashed rounded-lg hover:border-[#d4af37]/30 transition-colors duration-300 cursor-pointer group">
              <Upload className="w-4 h-4 text-white/30 group-hover:text-[#d4af37] transition-colors" />
              <span className="text-sm text-white/30 group-hover:text-white/50 transition-colors">
                {fileName || t('Attach CV / Resume (PDF, DOC)', 'أرفق السيرة الذاتية (PDF, DOC)')}
              </span>
              <input
                type="file"
                name="attachment"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
              />
            </label>

            {sendError && (
              <p className="text-red-400 text-xs text-center">{sendError}</p>
            )}

            <button
              type="submit"
              disabled={sending}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-[#d4af37] to-[#b8942e] text-black font-semibold py-4 rounded-xl text-sm tracking-wider uppercase hover:from-[#fde68a] hover:to-[#d4af37] transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] disabled:opacity-60"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {sending
                  ? t('Sending...', 'جاري الإرسال...')
                  : submitted
                    ? t('Application Submitted', 'تم إرسال الطلب')
                    : t('Submit Application', 'إرسال الطلب')}
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>

            <p className="text-[10px] text-white/20 text-center">
              {t(
                'By applying, you agree to our privacy policy. All applications are handled confidentially.',
                'بالتقديم أنت توافق على سياسة الخصوصية. جميع الطلبات تُعامل بسرية تامة.',
              )}
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
