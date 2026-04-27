'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
      }
    }

    const animate = () => {
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.12
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.12
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${posRef.current.x - 20}px, ${posRef.current.y - 20}px)`
      }
      requestAnimationFrame(animate)
    }

    const onDown = () => {
      cursorRef.current?.classList.add('scale-50')
      dotRef.current?.classList.add('scale-150')
    }
    const onUp = () => {
      cursorRef.current?.classList.remove('scale-50')
      dotRef.current?.classList.remove('scale-150')
    }

    const onEnterLink = () => {
      cursorRef.current?.classList.add('scale-150', 'opacity-50')
    }
    const onLeaveLink = () => {
      cursorRef.current?.classList.remove('scale-150', 'opacity-50')
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    const links = document.querySelectorAll('a, button, [role="button"]')
    links.forEach(el => {
      el.addEventListener('mouseenter', onEnterLink)
      el.addEventListener('mouseleave', onLeaveLink)
    })

    const raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      {/* Ring */}
      <div
        ref={cursorRef}
        id="custom-cursor"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          border: '1.5px solid rgba(0,245,255,0.7)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99998,
          transition: 'transform 0.15s ease, opacity 0.2s, scale 0.2s',
          mixBlendMode: 'difference',
        }}
      />
      {/* Dot */}
      <div
        ref={dotRef}
        id="custom-cursor-dot"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          backgroundColor: '#00f5ff',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 99999,
          boxShadow: '0 0 8px #00f5ff',
          transition: 'scale 0.15s ease',
        }}
      />
    </>
  )
}
