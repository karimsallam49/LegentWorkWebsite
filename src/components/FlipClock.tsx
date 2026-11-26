import { useEffect, useRef, useState } from 'react'

function FlipUnit({ digit }: { digit: string }) {
  const [current, setCurrent] = useState(digit)
  const [next, setNext] = useState(digit)
  const [flipping, setFlipping] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (digit === current) return
    setNext(digit)
    setFlipping(true)
    timerRef.current = setTimeout(() => {
      setCurrent(digit)
      setFlipping(false)
    }, 650)
    return () => clearTimeout(timerRef.current)
  }, [digit, current])

  return (
    <div className={`flip-unit-container flip-down ${flipping ? 'flipping' : ''}`}>
      <div className="upper-card current">
        <span className="digit">{current}</span>
      </div>
      <div className="upper-card next">
        <span className="digit">{next}</span>
      </div>
      <div className="lower-card current">
        <span className="digit">{current}</span>
      </div>
      <div className="lower-card next">
        <span className="digit">{next}</span>
      </div>
    </div>
  )
}

function Colon() {
  return (
    <div className="flex flex-col gap-2 px-1">
      <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
      <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
    </div>
  )
}

export default function FlipClock() {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const pad = (n: number) => n.toString().padStart(2, '0')
  const hh = pad(time.getHours())
  const mm = pad(time.getMinutes())
  const ss = pad(time.getSeconds())

  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div className="flex gap-1">
        <FlipUnit digit={hh[0]} />
        <FlipUnit digit={hh[1]} />
      </div>
      <Colon />
      <div className="flex gap-1">
        <FlipUnit digit={mm[0]} />
        <FlipUnit digit={mm[1]} />
      </div>
      <Colon />
      <div className="flex gap-1">
        <FlipUnit digit={ss[0]} />
        <FlipUnit digit={ss[1]} />
      </div>
    </div>
  )
}
