'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface Sparkle {
  id: number
  x: number
  y: number
  dots: Array<{ angle: number; color: string; dist: number }>
}

const COLORS = ['#00f5ff', '#7c3aed', '#39ff14', '#00f5ff', '#a855f7']

function makeSparkle(id: number, x: number, y: number): Sparkle {
  const count = 7
  const dots = Array.from({ length: count }, (_, i) => ({
    angle: (360 / count) * i + Math.random() * 20,
    color: COLORS[i % COLORS.length],
    dist: 22 + Math.random() * 16,
  }))
  return { id, x, y, dots }
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const idRef = useRef(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top  = `${e.clientY}px`
      }
    }

    const onClick = (e: MouseEvent) => {
      const s = makeSparkle(idRef.current++, e.clientX, e.clientY)
      setSparkles(prev => [...prev, s])
      setTimeout(() => setSparkles(prev => prev.filter(p => p.id !== s.id)), 600)
    }

    const onDown = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = 'translate(-50%,-50%) scale(0.5)'
        dotRef.current.style.background = '#a855f7'
      }
    }
    const onUp = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = 'translate(-50%,-50%) scale(1)'
        dotRef.current.style.background = '#00f5ff'
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('click', onClick)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click', onClick)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  return (
    <>
      {/* Glowing dot */}
      <div ref={dotRef} id="cursor-dot" />

      {/* Sparkle bursts */}
      {sparkles.map(s => (
        <SparkleEffect key={s.id} sparkle={s} />
      ))}
    </>
  )
}

function SparkleEffect({ sparkle }: { sparkle: Sparkle }) {
  return (
    <>
      {/* Expanding ring */}
      <div
        className="sparkle-ring"
        style={{ left: sparkle.x, top: sparkle.y }}
      />
      {/* Flying particles */}
      {sparkle.dots.map((dot, i) => {
        const rad = (dot.angle * Math.PI) / 180
        const tx = Math.cos(rad) * dot.dist
        const ty = Math.sin(rad) * dot.dist
        return (
          <div
            key={i}
            className="sparkle-dot"
            style={{
              left: sparkle.x,
              top: sparkle.y,
              background: dot.color,
              boxShadow: `0 0 6px ${dot.color}`,
              animationDuration: `${0.45 + Math.random() * 0.15}s`,
              // CSS custom props for the fly-out direction
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
            } as React.CSSProperties}
          />
        )
      })}
    </>
  )
}
