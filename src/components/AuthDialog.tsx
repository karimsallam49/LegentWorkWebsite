import { useState } from 'react'
import type { FormEvent } from 'react'
import { Car, Loader2, LogOut, X } from 'lucide-react'
import { forgotPassword, resetPassword } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'

type Mode = 'login' | 'register' | 'forgot'

interface Props {
  open: boolean
  onClose: () => void
}

const inputCls =
  'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37]/50 transition-colors'

export default function AuthDialog({ open, onClose }: Props) {
  const { t } = useLanguage()
  const { user, isAuthenticated, login, register, logout } = useAuth()
  const [mode, setMode] = useState<Mode>('login')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  if (!open) return null

  const close = () => {
    setError('')
    setInfo('')
    setMode('login')
    setOtpSent(false)
    onClose()
  }

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true)
    setError('')
    try {
      await fn()
      return true
    } catch (e) {
      setError(
        e instanceof Error && e.message !== 'AUTO_LOGIN_FAILED'
          ? e.message
          : t('Something went wrong. Please try again.', 'حدث خطأ. حاول مرة أخرى.'),
      )
      return false
    } finally {
      setBusy(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (mode === 'login') {
      if (await run(() => login(mobile, password))) close()
    } else if (mode === 'register') {
      if (await run(() => register(name, mobile, email, password))) close()
    } else if (!otpSent) {
      if (
        await run(async () => {
          await forgotPassword(mobile)
          setOtpSent(true)
          setInfo(t('OTP sent to your mobile.', 'تم إرسال رمز التحقق على موبايلك.'))
        })
      ) {
        // sent
      }
    } else {
      if (
        await run(async () => {
          await resetPassword(mobile, otp, password)
          setMode('login')
          setOtpSent(false)
          setInfo(t('Password reset. Please login.', 'تم تغيير كلمة السر. سجل دخولك.'))
        })
      ) {
        // done
      }
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

        <div className="text-center mb-6">
          <img src="/assets/logo-icon.png" alt="Legend ProteK" className="w-14 mx-auto mb-3" />
          <h3 className="text-xl font-semibold text-white">
            {isAuthenticated
              ? t('My Account', 'حسابي')
              : mode === 'register'
                ? t('Create Account', 'إنشاء حساب')
                : mode === 'forgot'
                  ? t('Reset Password', 'استعادة كلمة السر')
                  : t('Welcome Back', 'أهلاً بعودتك')}
          </h3>
        </div>

        {isAuthenticated && user ? (
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-white font-medium">{user.name}</p>
              <p className="text-white/50 text-sm mt-1" dir="ltr">{user.mobile}</p>
              {user.email && <p className="text-white/50 text-sm">{user.email}</p>}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
              <Car size={18} className="text-[#d4af37]" />
              <span className="text-sm text-white/70">
                {t('Registered vehicles', 'العربيات المسجلة')}: {user.cars.length}
              </span>
            </div>
            <button
              onClick={() => {
                logout()
                close()
              }}
              className="w-full flex items-center justify-center gap-2 border border-red-400/30 text-red-300 rounded-lg py-3 text-sm hover:bg-red-400/10 transition-colors"
            >
              <LogOut size={16} />
              {t('Logout', 'تسجيل الخروج')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('Full name', 'الاسم بالكامل')}
                  className={inputCls}
                />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('Email', 'البريد الإلكتروني')}
                  className={inputCls}
                />
              </>
            )}
            <input
              required
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder={t('Mobile number', 'رقم الموبايل')}
              className={inputCls}
              dir="ltr"
            />
            {mode === 'forgot' && otpSent && (
              <input
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder={t('OTP code', 'رمز التحقق')}
                className={inputCls}
                dir="ltr"
              />
            )}
            {mode !== 'forgot' || otpSent ? (
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  mode === 'forgot'
                    ? t('New password', 'كلمة السر الجديدة')
                    : t('Password', 'كلمة السر')
                }
                className={inputCls}
              />
            ) : null}

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            {info && <p className="text-[#d4af37] text-xs text-center">{info}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-gradient-to-r from-[#d4af37] to-[#b8942e] text-black font-semibold rounded-lg py-3 text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {busy && <Loader2 size={16} className="animate-spin" />}
              {mode === 'register'
                ? t('Sign Up', 'إنشاء حساب')
                : mode === 'forgot'
                  ? otpSent
                    ? t('Reset Password', 'تغيير كلمة السر')
                    : t('Send OTP', 'إرسال الرمز')
                  : t('Login', 'تسجيل الدخول')}
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              {mode === 'forgot' ? (
                <button
                  type="button"
                  onClick={() => {
                    setMode('login')
                    setOtpSent(false)
                    setError('')
                    setInfo('')
                  }}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  {t('Back to login', 'رجوع لتسجيل الدخول')}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                    className="text-[#d4af37] hover:text-[#fde68a] transition-colors"
                  >
                    {mode === 'login'
                      ? t('Create account', 'إنشاء حساب جديد')
                      : t('Already have an account?', 'عندك حساب بالفعل؟')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot')
                      setError('')
                      setInfo('')
                    }}
                    className="text-white/50 hover:text-white transition-colors"
                  >
                    {t('Forgot password?', 'نسيت كلمة السر؟')}
                  </button>
                </>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
