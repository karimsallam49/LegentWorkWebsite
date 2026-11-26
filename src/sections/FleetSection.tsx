import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePortfolio } from '../api/storefront'
import { useLanguage } from '../context/LanguageContext'

gsap.registerPlugin(ScrollTrigger)

interface FleetCar {
  key: string | number
  name: string
  image: string
  grade?: string
  category?: string
}

const PLACEHOLDER_IMAGE = '/assets/bgd.png'

const STATIC_FLEET: FleetCar[] = [
  { key: 'p911', name: 'Porsche 911 Carrera', image: '/assets/cars/1_Kinetics_Drive_in_Car_Photo_Studi.png', grade: 'A+', category: 'Track' },
  { key: 'gt4', name: 'Porsche Cayman GT4', image: '/assets/cars/2_A_Sleek_Modern_Luxury_Black_Car_On.png', grade: 'A+', category: 'Urban' },
  { key: 'f812', name: 'Ferrari 812 SF', image: '/assets/cars/3_Sleek_Black_Ferrari_812_superfast.png', grade: 'S', category: 'Track' },
  { key: 'gt3', name: 'Porsche 911 GT3', image: '/assets/cars/4_Photograph_porsche_medium_close_up.png', grade: 'S', category: 'Track' },
  { key: 'turbo', name: 'Porsche 911 Turbo', image: '/assets/cars/5_luxury_sport_car_in_dark_studio_with.png', grade: 'A+', category: 'VIP' },
  { key: 'roma', name: 'Ferrari Roma', image: '/assets/cars/6_300_Luxury_Car_Studio_Shot_Stock.png', grade: 'A+', category: 'Urban' },
  { key: 'svj', name: 'Lamborghini SVJ', image: '/assets/cars/7_lamborghini_dark.png', grade: 'S', category: 'Track' },
  { key: 'amg', name: 'Mercedes AMG GT', image: '/assets/cars/8_mercedes_dark.png', grade: 'A+', category: 'VIP' },
  { key: 'phantom', name: 'Rolls Royce Phantom', image: '/assets/cars/9_rollsroyce_dark.png', grade: 'Concours', category: 'VIP' },
  { key: 'm8', name: 'BMW M8 Competition', image: '/assets/cars/10_bmw_dark.png', grade: 'A+', category: 'Urban' },
]

export default function FleetSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { data: portfolio } = usePortfolio()
  const { lang, t } = useLanguage()

  const items: FleetCar[] =
    portfolio && portfolio.length > 0
      ? portfolio.map((p) => ({
          key: p.id,
          name: lang === 'ar' ? p.name_ar : (p.name_en ?? p.name_ar),
          image: p.image_url ?? PLACEHOLDER_IMAGE,
        }))
      : portfolio && portfolio.length === 0
        ? []
        : STATIC_FLEET

  const updateCards = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const center = track.scrollLeft + track.clientWidth / 2
    let closest = 0
    let closestDist = Infinity

    track.querySelectorAll<HTMLElement>('.fleet-card').forEach((el, i) => {
      const cardCenter = el.offsetLeft + el.offsetWidth / 2
      const d = (cardCenter - center) / el.offsetWidth
      const ad = Math.abs(d)
      if (ad < closestDist) {
        closestDist = ad
        closest = i
      }
      const scale = Math.max(0.85, 1 - ad * 0.08)
      const rotY = Math.max(-18, Math.min(18, -d * 2))
      const brightness = Math.max(0.5, 1 - ad * 0.15)
      el.style.transform = `perspective(1200px) scale(${scale}) rotateY(${rotY}deg)`
      el.style.filter = `brightness(${brightness})`
    })

    setActiveIndex(closest)
  }, [])

  useEffect(() => {
    updateCards()
    window.addEventListener('resize', updateCards)
    return () => window.removeEventListener('resize', updateCards)
  }, [updateCards, items.length])

  const scrollToCard = (index: number) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelectorAll<HTMLElement>('.fleet-card')[index]
    if (!card) return
    track.scrollTo({
      left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2,
      behavior: 'smooth',
    })
  }

  const handleScroll = () => {
    requestAnimationFrame(updateCards)
  }

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.fleet-header > *',
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
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  if (items.length === 0) return null

  return (
    <section
      ref={sectionRef}
      id="fleet"
      className="relative z-20 bg-black py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#d4af37]/[0.02] blur-[180px]" />
      </div>

      <div className="px-4 sm:px-6 lg:px-8 mb-16 md:mb-20">
        <div className="fleet-header max-w-7xl mx-auto text-center">
          <span className="text-[#d4af37] text-xs tracking-[0.4em] uppercase font-medium">
            {t('Our Work', 'أعمالنا')}
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
            <span className="gold-gradient-text">{t('Precision', 'الأسطول')}</span>{' '}
            {t('Fleet', 'المثالي')}
          </h2>
          <p className="mt-4 text-white/40 max-w-xl mx-auto text-sm md:text-base">
            {t(
              'Every vehicle entrusted to Legend ProteK receives treatment befitting its status. Browse our portfolio of protected legends.',
              'كل سيارة توكل إلى ليجند بروتك تلقى معاملة تليق بمكانتها. تصفح أعمالنا من الأساطير المحمية.',
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
      </div>

      <div className="relative" style={{ perspective: '1200px' }}>
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="flex gap-5 md:gap-8 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 pb-8"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {items.map((car, i) => (
            <div
              key={car.key}
              onClick={() => scrollToCard(i)}
              className="fleet-card flex-shrink-0 relative group cursor-pointer"
              style={{
                width: 'clamp(300px, 38vw, 420px)',
                scrollSnapAlign: 'center',
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), filter 0.5s',
              }}
            >
              <div className="relative overflow-hidden rounded-xl bg-[#0a0a0a]">
                <div className="aspect-[3/2] overflow-hidden">
                  <img
                    src={car.image}
                    alt={car.name}
                    draggable={false}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute inset-0 rounded-xl border border-transparent group-hover:border-[#d4af37]/30 transition-colors duration-500 pointer-events-none" />

                {car.grade && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-[#d4af37]/20 border border-[#d4af37]/40 rounded-full text-[10px] text-[#d4af37] tracking-widest uppercase font-mono">
                      {car.grade}
                    </span>
                  </div>
                )}
                {car.category && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/60 tracking-widest uppercase font-mono">
                      {car.category}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg md:text-xl font-semibold text-white group-hover:text-[#d4af37] transition-colors duration-300">
                    {car.name}
                  </h3>
                  <p className="text-xs text-white/40 mt-1 tracking-wider uppercase">
                    {t('Legend ProteK Protected', 'محمي من ليجند بروتك')}
                  </p>
                  <div
                    className="mt-3 h-[1px] w-0 group-hover:w-12 transition-all duration-500"
                    style={{
                      background: 'linear-gradient(90deg, rgb(212, 175, 55), transparent)',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8 gap-2">
        {items.map((car, i) => (
          <button
            key={car.key}
            onClick={() => scrollToCard(i)}
            aria-label={`Go to ${car.name}`}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === activeIndex
                ? 'bg-gradient-to-r from-[#d4af37] to-[#fde68a] w-8'
                : 'bg-white/15 w-1.5 hover:bg-white/30'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
