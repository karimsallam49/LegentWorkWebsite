import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = cursorRef.current
    if (!el) return

    let x = -100
    let y = -100
    let tx = -100
    let ty = -100
    let raf = 0

    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
    }

    const loop = () => {
      x += (tx - x) * 0.22
      y += (ty - y) * 0.22
      el.style.transform = `translate(${x}px, ${y}px)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
      style={{ willChange: 'transform' }}
    >
      <div
        className="w-5 h-5 border-[1.5px] border-[#d4af37] rounded-[3px] flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
        style={{ filter: 'drop-shadow(0 0 6px rgba(212, 175, 55, 0.6))' }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
      </div>
    </div>
  )
}
