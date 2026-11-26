import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

interface Line {
  en: string
  ar: string
  color: string
}

const LINES: Line[] = [
  { en: 'ABSOLUTE PROTECTION', ar: 'حماية مطلقة', color: '#d4af37' },
  { en: 'ZERO COMPROMISE', ar: 'بلا مساومة', color: '#ffffff' },
  { en: 'CONCIERGE LEVEL CARE', ar: 'عناية بمستوى الكونسيرج', color: '#d4af37' },
  { en: 'PAINT PERFECTION', ar: 'كمال الطلاء', color: '#ffffff' },
  { en: 'UNMATCHED QUALITY', ar: 'جودة لا تضاهى', color: '#d4af37' },
  { en: 'LEGENDARY SERVICE', ar: 'خدمة أسطورية', color: '#ffffff' },
]

const BEAM_COLORS = ['#d4af37', '#fde68a', '#b8942e']
const BEAM_OPACITIES = [0.22, 0.16, 0.23, 0.22, 0.11, 0.13, 0.19, 0.24]

function RollingLine({ line }: { line: Line }) {
  const { lang } = useLanguage()
  // Arabic is a connected script — animate per word, not per character.
  const units = lang === 'ar' ? line.ar.split(' ') : line.en.split('')

  return (
    <div className="overflow-hidden">
      <div className="flex">
        {units.map((u, i) => (
          <span
            key={i}
            className="rolling-char inline-block text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight"
            style={{
              color: line.color,
              transform: 'translate(-30px, 60px) rotate(90deg)',
              opacity: 0,
              minWidth: u === ' ' ? '0.3em' : undefined,
              marginInlineEnd:
                lang === 'ar' && i < units.length - 1 ? '0.25em' : undefined,
            }}
          >
            {u}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function CyberVoidSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx2d = canvas.getContext('2d')
    if (!ctx2d) return

    let raf = 0
    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.4 + 0.3,
      s: Math.random() * 0.0004 + 0.0001,
      o: Math.random() * 0.5 + 0.1,
    }))

    const resize = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      raf = requestAnimationFrame(draw)
      const { width: w, height: h } = canvas
      ctx2d.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.y -= p.s
        if (p.y < 0) p.y = 1
        ctx2d.beginPath()
        ctx2d.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2)
        ctx2d.fillStyle = `rgba(212, 175, 55, ${p.o})`
        ctx2d.fill()
      }
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.rolling-char', {
        x: 0,
        y: 0,
        rotate: 0,
        opacity: 1,
        duration: 1.1,
        ease: 'power3.out',
        stagger: 0.035,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          once: true,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="cyber-void"
      className="relative z-20 bg-black min-h-[150vh] flex items-center justify-center overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none w-full h-full"
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#d4af37]/[0.02] blur-[200px]" />
      </div>

      <div className="absolute inset-0 flex justify-around pointer-events-none opacity-20">
        {BEAM_OPACITIES.map((opacity, i) => (
          <div
            key={i}
            className="w-px h-full"
            style={{
              background: `linear-gradient(transparent 0%, ${BEAM_COLORS[i % 3]} 30%, transparent 100%)`,
              opacity,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 md:gap-12 py-32 px-4">
        <span className="text-[10px] text-[#d4af37]/40 tracking-[0.6em] uppercase">
          {t('Our Philosophy', 'فلسفتنا')}
        </span>

        {LINES.map((line) => (
          <RollingLine key={line.en} line={line} />
        ))}

        <p className="mt-12 text-sm md:text-base text-white/30 max-w-lg text-center leading-relaxed">
          {t(
            "Every vehicle that enters our facility is treated not as a machine, but as a legacy. We don't just protect paint — we preserve stories.",
            'كل سيارة تدخل منشأتنا نعاملها ليس كآلة، بل كإرث. نحن لا نحمي الطلاء فقط — بل نحفظ القصص.',
          )}
        </p>
      </div>
    </section>
  )
}
