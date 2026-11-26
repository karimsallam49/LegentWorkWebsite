import { useState } from 'react'
import type { FormEvent } from 'react'
import { Loader2, X } from 'lucide-react'
import { addCar, useBrands, useModels } from '../api/booking'
import type { CustomerCar } from '../api/types'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

interface Props {
  open: boolean
  onClose: () => void
  onAdded?: (car: CustomerCar) => void
}

const inputCls =
  'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]/50 transition-colors'

export default function AddCarDialog({ open, onClose, onAdded }: Props) {
  const { t } = useLanguage()
  const { user, refreshUser } = useAuth()
  const { data: brands } = useBrands()

  const [brandId, setBrandId] = useState<number | null>(null)
  const { data: models } = useModels(brandId)

  const [modelId, setModelId] = useState<number | null>(null)
  const [plate, setPlate] = useState('')
  const [year, setYear] = useState('')
  const [color, setColor] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const close = () => {
    setError('')
    onClose()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user || !brandId || !modelId) return
    setBusy(true)
    setError('')
    try {
      const modelName = models?.find((m) => m.id === modelId)?.name
      const car = await addCar(user.id, {
        car_brand_id: brandId,
        car_model_id: modelId,
        model: modelName,
        plate_number: plate,
        manufacturing_year: year || undefined,
        color: color || undefined,
      })
      await refreshUser()
      onAdded?.(car)
      close()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Failed to add car', 'فشل إضافة العربية'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md glass-panel rounded-2xl p-8 border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label={t('Close', 'إغلاق')}
          className="absolute top-4 end-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <h3 className="text-xl font-semibold text-white text-center mb-6">
          {t('Add Vehicle', 'إضافة عربية')}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            required
            value={brandId ?? ''}
            onChange={(e) => {
              setBrandId(Number(e.target.value) || null)
              setModelId(null)
            }}
            className={`${inputCls} appearance-none`}
          >
            <option value="" disabled className="bg-[#0a0a0a]">
              {t('Select brand', 'اختر الماركة')}
            </option>
            {(brands ?? []).map((b) => (
              <option key={b.id} value={b.id} className="bg-[#0a0a0a]">
                {b.name}
              </option>
            ))}
          </select>

          <select
            required
            disabled={!brandId}
            value={modelId ?? ''}
            onChange={(e) => setModelId(Number(e.target.value) || null)}
            className={`${inputCls} appearance-none disabled:opacity-40`}
          >
            <option value="" disabled className="bg-[#0a0a0a]">
              {t('Select model', 'اختر الموديل')}
            </option>
            {(models ?? []).map((m) => (
              <option key={m.id} value={m.id} className="bg-[#0a0a0a]">
                {m.name}
              </option>
            ))}
          </select>

          <input
            required
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            placeholder={t('Plate number', 'رقم اللوحة')}
            className={inputCls}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder={t('Year', 'سنة الصنع')}
              className={inputCls}
            />
            <input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder={t('Color', 'اللون')}
              className={inputCls}
            />
          </div>

          {error && <p className="text-red-400 text-xs text-center">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-gradient-to-r from-[#d4af37] to-[#b8942e] text-black font-semibold rounded-lg py-3 text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {busy && <Loader2 size={16} className="animate-spin" />}
            {t('Add Vehicle', 'إضافة العربية')}
          </button>
        </form>
      </div>
    </div>
  )
}
