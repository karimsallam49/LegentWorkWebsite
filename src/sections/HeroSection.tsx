import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useSliders } from '../api/storefront'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

const SLIDE_DURATION = 7000

function HeroMedia({ mediaRef }: { mediaRef: RefObject<HTMLDivElement | null> }) {
  const { data: sliders } = useSliders()
  const [index, setIndex] = useState(0)
  const items = sliders ?? []

  useEffect(() => {
    if (items.length < 2) return
    const id = setInterval(
      () => setIndex((i) => (i + 1) % items.length),
      SLIDE_DURATION,
    )
    return () => clearInterval(id)
  }, [items.length])

  useEffect(() => {
    setIndex(0)
  }, [items.length])

  const mediaClass =
    'absolute inset-0 w-full h-full object-cover scale-110 transition-opacity duration-1000'

  return (
    <div ref={mediaRef} className="absolute inset-0">
      {items.length === 0 && (
        <video
          className={mediaClass}
          autoPlay
          muted
          loop
          playsInline
          poster="/assets/bgd.png"
        >
          <source src="/assets/hero-video.mp4" type="video/mp4" />
        </video>
      )}

      {items.map((item, i) =>
        item.media_type === 'video' ? (
          i === index && (
            <video
              key={item.id}
              src={item.media_url}
              muted
              autoPlay
              loop
              playsInline
              className={mediaClass}
              style={{ opacity: 1 }}
            />
          )
        ) : (
          <img
            key={item.id}
            src={item.media_url}
            alt=""
            draggable={false}
            className={mediaClass}
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ),
      )}
    </div>
  )
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLSpanElement>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        })
        .to(mediaRef.current, { yPercent: 14, ease: 'none' }, 0)
        .to(overlayRef.current, { opacity: 1, ease: 'none' }, 0)
        .to('.hero-logo', { y: -90, opacity: 0, ease: 'power1.in' }, 0)
        .to('.hero-title', { y: -90, opacity: 0, ease: 'power1.in' }, 0.05)
        .to('.hero-divider', { opacity: 0 }, 0.1)
        .to('.hero-tagline', { y: -50, opacity: 0, ease: 'power1.in' }, 0.3)
        .to(hintRef.current, { opacity: 1 }, 0.1)
        .fromTo(lineRef.current, { scaleY: 0 }, { scaleY: 1, ease: 'none' }, 0)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="hero" className="relative h-[200vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <HeroMedia mediaRef={mediaRef} />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_70%,rgba(0,0,0,0.95)_100%)]" />
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black"
          style={{ opacity: 0.4 }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px)',
          }}
        />

        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-48 md:w-72 h-[1px]"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgb(212, 175, 55), transparent)',
          }}
        />

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
          <img
            src="/assets/logo-icon.png"
            alt="Legend ProteK"
            className="hero-logo w-36 md:w-48 lg:w-56 mb-5"
            style={{ filter: 'drop-shadow(0 0 50px rgba(212, 175, 55, 0.4))' }}
          />

          <h1
            className="hero-title text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-center"
            style={{
              background:
                'linear-gradient(rgb(255,255,255) 0%, rgb(212,175,55) 50%, rgb(184,148,46) 100%) text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.3))',
            }}
          >
            Legend ProteK
          </h1>

          <div
            className="hero-divider w-24 md:w-40 h-[1px] mt-6 mb-4"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgb(212, 175, 55), transparent)',
            }}
          />

          <p className="hero-tagline text-xs md:text-sm lg:text-base text-white/50 tracking-[0.3em] uppercase text-center">
            {t('Where Protection Meets Perfection', 'حيث تلتقي الحماية بالكمال')}
          </p>

          <div className="absolute bottom-16 flex flex-col items-center gap-3">
            <span
              ref={hintRef}
              className="text-[10px] text-white/30 tracking-[0.4em] uppercase opacity-0"
            >
              {t('Scroll to Begin', 'اسحب للأسفل للبدء')}
            </span>
            <div
              ref={lineRef}
              className="w-px h-16 bg-gradient-to-b from-[#d4af37] to-transparent"
              style={{ transformOrigin: '50% 0%', transform: 'scaleY(0)' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
