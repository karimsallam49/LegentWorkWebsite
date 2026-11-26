import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import CustomCursor from './components/CustomCursor'
import LoadingCurtain from './components/LoadingCurtain'
import Navigation from './components/Navigation'
import ParticleBackground from './components/ParticleBackground'
import AppSection from './sections/AppSection'
import BlogsSection from './sections/BlogsSection'
import CareersSection from './sections/CareersSection'
import CitadelSection from './sections/CitadelSection'
import CyberVoidSection from './sections/CyberVoidSection'
import FleetSection from './sections/FleetSection'
import FooterSection from './sections/FooterSection'
import HeroSection from './sections/HeroSection'
import ServicesSection from './sections/ServicesSection'
import VaultSection from './sections/VaultSection'

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.config({
  ignoreMobileResize: true,
  autoRefreshEvents: 'orientationchange,load',
})

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Lenis smooth scroll — same as old build, fixes iOS
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.raf(time)
      ScrollTrigger.update()
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    const refresh = () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.refresh())
      ScrollTrigger.refresh()
    }
    const timers = [
      setTimeout(refresh, 600),
      setTimeout(refresh, 2000),
      setTimeout(refresh, 4500),
    ]
    window.addEventListener('load', refresh)
    window.addEventListener('orientationchange', () => setTimeout(refresh, 100))
    document.fonts?.ready.then(refresh)

    return () => {
      lenis.destroy()
      timers.forEach(clearTimeout)
      window.removeEventListener('load', refresh)
      window.removeEventListener('orientationchange', () => {})
    }
  }, [])

  return (
    <div className="bg-black min-h-screen">
      <CustomCursor />
      {loading && (
        <LoadingCurtain
          onComplete={() => {
            setLoading(false)
            ScrollTrigger.refresh()
          }}
        />
      )}
      <ParticleBackground />
      <Navigation />
      <main>
        <HeroSection />
        <CyberVoidSection />
        <ServicesSection />
        <FleetSection />
        <CitadelSection />
        <AppSection />
        <VaultSection />
        <CareersSection />
        <BlogsSection />
        <FooterSection />
      </main>
      <div
        className="fixed inset-0 z-[5] pointer-events-none"
        style={{
          background:
            'radial-gradient(transparent 50%, rgba(0, 0, 0, 0.4) 100%)',
        }}
      />
    </div>
  )
}
