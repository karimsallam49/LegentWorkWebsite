import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Car, CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import {
  createGuestBooking,
  useBranches,
  useBrands,
  useModels,
  useServices,
} from '../api/booking'
import { BUSINESS_ID } from '../config'
import type { BookingResult, Branch } from '../api/types'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

interface Props {
  onBranchChange?: (branch: Branch | null) => void
}

const cardCls = (selected: boolean) =>
  `text-start rounded-xl border p-4 transition-all duration-300 ${
    selected
      ? 'border-[#d4af37]/60 bg-[#d4af37]/10'
      : 'border-white/10 bg-white/[0.03] hover:border-[#d4af37]/30'
  }`

const inputCls =
  'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]/50 transition-colors'

const labelCls = 'block text-white/40 text-xs uppercase tracking-wider mb-3 mt-6 first:mt-0'

export const branchTitle = (b: Branch, lang: string) =>
  lang === 'ar' && b.website_settings?.title_ar
    ? b.website_settings.title_ar
    : (b.website_settings?.title ?? b.name)

export const branchAddress = (b: Branch) => {
  const a = b.website_settings?.address ?? b.address
  return a && a.trim() !== '.' ? a : null
}

export default function BookingWizard({ onBranchChange }: Props) {
  const { t, lang } = useLanguage()
  const { user } = useAuth() // optional — used only to prefill guest fields

  const [branch, setBranch] = useState<Branch | null>(null)
  const [serviceId, setServiceId] = useState<number | null>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [brandId, setBrandId] = useState<number | null>(null)
  const [modelId, setModelId] = useState<number | null>(null)
  const [year, setYear] = useState('')
  const [sendSms, setSendSms] = useState(true)
  const [note, setNote] = useState('')
  const [results, setResults] = useState<BookingResult[] | null>(null)
  const [submitError, setSubmitError] = useState('')
  const [step, setStep] = useState(1)
  const topRef = useRef<HTMLDivElement>(null)

  const { data: branches, isLoading: branchesLoading } = useBranches()
  const { data: brands } = useBrands()
  const { data: models } = useModels(brandId)

  // Prefill guest fields when a logged-in customer is present
  useEffect(() => {
    if (!user) return
    setName((v) => v || user.name || '')
    setMobile((v) => v || user.mobile || '')
  }, [user])

  const isMaster =
    !!branch?.website_settings?.is_master &&
    (branch.website_settings.master_branch_ids?.length ?? 0) > 0

  const locationIds = useMemo(() => {
    if (!branch) return []
    return isMaster
      ? [branch.id, ...(branch.website_settings!.master_branch_ids ?? [])]
      : [branch.id]
  }, [branch, isMaster])

  const { data: services, isLoading: servicesLoading } = useServices(locationIds)

  const isCarService = !!(
    branch?.website_settings?.is_car_service ??
    branch?.is_car_service ??
    branch?.is_car_station
  )

  const visibleBranches = (branches ?? []).filter(
    (b) => b.website_settings?.is_visible !== false,
  )

  // Auto-select the first location — no branch picking (quick guest booking)
  useEffect(() => {
    if (branch || branchesLoading || visibleBranches.length === 0) return
    setBranch(visibleBranches[0])
    onBranchChange?.(visibleBranches[0])
  }, [visibleBranches, branch, branchesLoading])

  const selectedService = (services ?? []).find((s) => s.id === serviceId)

  const bookingMutation = useMutation({
    mutationFn: createGuestBooking,
    onSuccess: (data) => setResults(data),
    onError: (e) => {
      setSubmitError(
        e instanceof Error ? e.message : t('Booking failed. Please try again.', 'فشل الحجز. حاول مرة أخرى.'),
      )
    },
  })

  const canSubmit =
    !!serviceId && !!date && !!time && !!name.trim() && !!mobile.trim()

  const canNext = !!name.trim() && !!mobile.trim()

  const goStep = (s: number) => {
    setStep(s)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const submit = () => {
    if (!canSubmit || bookingMutation.isPending) return
    setSubmitError('')
    bookingMutation.mutate({
      business_id: Number(BUSINESS_ID),
      location_id: branch!.id,
      service_id: serviceId,
      name: name.trim(),
      mobile: mobile.trim(),
      booking_date: date,
      booking_time: time,
      ...(note.trim() ? { notes: note.trim() } : {}),
      send_notification: sendSms,
      ...(isCarService
        ? {
            ...(brandId ? { brand_id: brandId } : {}),
            ...(modelId ? { model_id: modelId } : {}),
            ...(year.trim() ? { manufacturing_year: year.trim() } : {}),
          }
        : {}),
    })
  }

  const reset = () => {
    setServiceId(null)
    setDate('')
    setTime('')
    setName(user?.name ?? '')
    setMobile(user?.mobile ?? '')
    setBrandId(null)
    setModelId(null)
    setYear('')
    setSendSms(true)
    setNote('')
    setResults(null)
    setSubmitError('')
    setStep(1)
  }

  /* ---------- Success ---------- */
  if (results) {
    return (
      <div className="max-w-md mx-auto text-center">
        <CheckCircle2 size={48} className="text-[#d4af37] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          {t('Booking Confirmed', 'تم تأكيد الحجز')}
        </h3>
        <p className="text-white/40 text-sm mb-6">
          {t(
            'Your appointment request has been received. Our team will contact you to confirm.',
            'تم استلام طلبك. فريقنا هيتواصل معاك لتأكيد الميعاد.',
          )}
        </p>
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-2 text-sm text-start mb-6">
          {(results ?? []).map((r, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <span className="text-white/70">
                {[r.service_name ?? (selectedService ? (lang === 'ar' ? selectedService.name : (selectedService.name_en ?? selectedService.name)) : ''), r.location_name]
                  .filter(Boolean)
                  .join(' — ')}
              </span>
              {r.booking_id != null && (
                <span className="text-[#d4af37] font-mono text-xs">#{r.booking_id}</span>
              )}
            </div>
          ))}
          {results.length === 0 && selectedService && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-white/70">
                {lang === 'ar' ? selectedService.name : (selectedService.name_en ?? selectedService.name)} — {date} {time}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={reset}
          className="border border-[#d4af37]/40 text-[#d4af37] rounded-lg px-6 py-2.5 text-sm hover:bg-[#d4af37]/10 transition-colors"
        >
          {t('Book Another', 'حجز آخر')}
        </button>
      </div>
    )
  }

  /* ---------- Single form ---------- */
  if (branchesLoading || !branch) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-[#d4af37]" size={24} />
      </div>
    )
  }

  return (
    <div ref={topRef}>
      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {[
          { n: 1, label: t('Your Details', 'بياناتك') },
          { n: 2, label: t('Service & Schedule', 'الخدمة والميعاد') },
        ].map((s, i) => {
          const active = step === s.n
          const done = step > s.n
          return (
            <div key={s.n} className={`flex items-center ${i === 0 ? 'flex-1' : ''}`}>
              <div className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors duration-300 ${
                    active
                      ? 'bg-[#d4af37] text-black border-[#d4af37]'
                      : done
                        ? 'border-[#d4af37] text-[#d4af37]'
                        : 'border-white/15 text-white/40'
                  }`}
                >
                  {done ? <CheckCircle2 size={14} /> : s.n}
                </span>
                <span
                  className={`text-xs whitespace-nowrap transition-colors ${
                    active ? 'text-white font-medium' : 'text-white/40'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i === 0 && (
                <div className="flex-1 h-px mx-4 bg-white/10 relative overflow-hidden">
                  <div
                    className={`absolute inset-y-0 start-0 bg-[#d4af37] transition-all duration-500 ${
                      done ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {step === 1 ? (
        <>
          {/* Contact */}
          <p className={labelCls}>{t('Your details', 'بياناتك')}</p>
          <div className="space-y-3">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('Full name *', 'الاسم بالكامل *')}
              className={inputCls}
            />
            <input
              type="tel"
              required
              dir="ltr"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder={t('Mobile number *', 'رقم الموبايل *')}
              className={`${inputCls} text-start`}
            />
          </div>

          {/* Vehicle — optional, car-service branches only */}
          {isCarService && (
            <>
              <p className={labelCls}>{t('Vehicle details (optional)', 'بيانات العربية (اختياري)')}</p>
              <div className="grid grid-cols-2 gap-3">
                <select
                  dir="ltr"
                  value={brandId ?? ''}
                  onChange={(e) => {
                    const v = Number(e.target.value) || null
                    setBrandId(v)
                    setModelId(null)
                  }}
                  className={`${inputCls} appearance-none text-start`}
                >
                  <option value="" className="bg-[#0a0a0a]">
                    {t('Brand', 'الماركة')}
                  </option>
                  {(brands ?? []).map((b) => (
                    <option key={b.id} value={b.id} className="bg-[#0a0a0a]">
                      {lang === 'ar' ? (b.name_ar ?? b.name) : b.name}
                    </option>
                  ))}
                </select>
                <select
                  dir="ltr"
                  value={modelId ?? ''}
                  disabled={!brandId}
                  onChange={(e) => setModelId(Number(e.target.value) || null)}
                  className={`${inputCls} appearance-none text-start disabled:opacity-40`}
                >
                  <option value="" className="bg-[#0a0a0a]">
                    {t('Model', 'الموديل')}
                  </option>
                  {(models ?? []).map((m) => (
                    <option key={m.id} value={m.id} className="bg-[#0a0a0a]">
                      {lang === 'ar' ? (m.name_ar ?? m.name) : m.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  inputMode="numeric"
                  dir="ltr"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder={t('Year', 'سنة الصنع')}
                  className={`${inputCls} text-start`}
                />
              </div>
            </>
          )}

          <button
            onClick={() => canNext && goStep(2)}
            disabled={!canNext}
            className="w-full mt-8 flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4af37] to-[#b8942e] text-black font-semibold rounded-lg px-6 py-3.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-30"
          >
            {t('Next', 'التالي')}
            {lang === 'ar' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </>
      ) : (
        <>
          {/* Services */}
          <p className={labelCls}>{t('Service', 'الخدمة المطلوبة')} *</p>
          {servicesLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-[#d4af37]" size={24} />
            </div>
          ) : (services ?? []).length === 0 ? (
            <p className="text-white/40 text-sm py-4 text-center">
              {t('No services available.', 'لا توجد خدمات متاحة حاليًا.')}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {(services ?? []).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setServiceId(s.id)}
                  className={cardCls(serviceId === s.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white font-medium text-sm">
                        {lang === 'ar' ? s.name : (s.name_en ?? s.name)}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-white/40">
                        {(s.price ?? s.priceFrom) != null && (s.price ?? s.priceFrom)! > 0 && (
                          <span className="text-[#d4af37]">
                            {t('From', 'من')} {s.price ?? s.priceFrom}{' '}
                            {s.currency_symbol ?? t('EGP', 'جم')}
                          </span>
                        )}
                        {s.duration != null && s.duration > 0 && (
                          <span>{s.duration} {t('min', 'دقيقة')}</span>
                        )}
                      </div>
                    </div>
                    {serviceId === s.id && (
                      <CheckCircle2 size={18} className="text-[#d4af37] shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Schedule */}
          <p className={labelCls}>{t('Schedule', 'الميعاد')} *</p>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              required
              value={date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setDate(e.target.value)}
              className={`${inputCls} [color-scheme:dark]`}
            />
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={`${inputCls} [color-scheme:dark]`}
            />
          </div>

          {/* Notes + SMS */}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t('Notes (optional)', 'ملاحظات (اختياري)')}
            rows={2}
            className={`${inputCls} resize-none mt-6`}
          />
          <label className="flex items-center gap-2 text-xs text-white/60 cursor-pointer select-none mt-3">
            <input
              type="checkbox"
              checked={sendSms}
              onChange={(e) => setSendSms(e.target.checked)}
              className="accent-[#d4af37] w-4 h-4 cursor-pointer"
            />
            {t('Send SMS confirmation to my phone', 'إرسال رسالة تأكيد SMS على الموبايل')}
          </label>

          {submitError && <p className="text-red-400 text-xs text-center mt-4">{submitError}</p>}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => goStep(1)}
              className="flex items-center justify-center gap-1 border border-white/15 text-white/60 rounded-lg px-5 py-3.5 text-sm hover:border-[#d4af37]/40 hover:text-[#d4af37] transition-colors"
            >
              {lang === 'ar' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              {t('Back', 'رجوع')}
            </button>
            <button
              onClick={submit}
              disabled={!canSubmit || bookingMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4af37] to-[#b8942e] text-black font-semibold rounded-lg px-6 py-3.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-30"
            >
              {bookingMutation.isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Car size={16} />
              )}
              {t('Confirm Booking', 'تأكيد الحجز')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
