import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function LoadingCurtain({
  onComplete,
}: {
  onComplete: () => void
}) {
  const curtainRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const [progress, setProgress] = useState(0)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const tl = gsap.timeline()
    const counter = { value: 0 }

    tl.to(
      counter,
      {
        value: 100,
        duration: 2.5,
        ease: 'power2.inOut',
        onUpdate: () => setProgress(Math.round(counter.value)),
      },
      0,
    )
    tl.to(logoRef.current, {
      scale: 1.05,
      duration: 0.8,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: 3,
    })
    tl.to(curtainRef.current, {
      yPercent: -100,
      duration: 1,
      ease: 'power3.inOut',
      delay: 0.3,
      onComplete: () => onCompleteRef.current(),
    })

    const failsafe = setTimeout(() => onCompleteRef.current(), 6500)

    return () => {
      tl.kill()
      clearTimeout(failsafe)
    }
  }, [])

  return (
    <div
      ref={curtainRef}
      className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center"
    >
      <img
        ref={logoRef}
        src="/assets/logo.png"
        alt="Legend ProteK"
        className="w-48 md:w-64 mb-8"
      />
      <div className="w-48 h-0.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#d4af37] to-[#fde68a] rounded-full transition-all duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-4 text-xs text-white/40 font-mono tracking-widest uppercase">
        Loading Experience
      </p>
    </div>
  )
}
