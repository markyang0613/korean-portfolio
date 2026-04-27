'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { downloadResumePDF } from '@/lib/pdfExport'

const TYPING_STRINGS = [
  '데이터 엔지니어',
  'AI 파이프라인 빌더',
  '클라우드 아키텍트',
  'UC Berkeley 졸업생',
]

const TYPING_STRINGS_EN = [
  'Data Engineer',
  'AI Pipeline Builder',
  'Cloud Architect',
  'UC Berkeley Graduate',
]

interface HeroProps {
  lang: 'ko' | 'en'
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let particles: Array<{
      x: number; y: number; vx: number; vy: number
      size: number; color: string; opacity: number
    }> = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120)
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        color: ['#00f5ff', '#7c3aed', '#39ff14'][Math.floor(Math.random() * 3)],
        opacity: Math.random() * 0.6 + 0.2,
      }))
    }

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        // Mouse repulsion
        const dx = p.x - mouseRef.current.x
        const dy = p.y - mouseRef.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100) {
          p.vx += (dx / dist) * 0.3
          p.vy += (dy / dist) * 0.3
        }

        p.vx *= 0.99
        p.vy *= 0.99
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0')
        ctx.fill()

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const cx = p.x - q.x
          const cy = p.y - q.y
          const d = Math.sqrt(cx * cx + cy * cy)
          if (d < 120) {
            const alpha = (1 - d / 120) * 0.25
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(0, 245, 255, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      animId = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouse)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.7 }}
    />
  )
}

function GlitchText({ text }: { text: string }) {
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 200)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className={`relative inline-block ${glitch ? 'animate-glitch' : ''}`}>
      {text}
      {glitch && (
        <>
          <span
            className="absolute inset-0"
            style={{
              color: '#00f5ff',
              clipPath: 'polygon(0 20%, 100% 20%, 100% 40%, 0 40%)',
              transform: 'translate(-3px, 0)',
              opacity: 0.8,
            }}
          >
            {text}
          </span>
          <span
            className="absolute inset-0"
            style={{
              color: '#7c3aed',
              clipPath: 'polygon(0 60%, 100% 60%, 100% 80%, 0 80%)',
              transform: 'translate(3px, 0)',
              opacity: 0.8,
            }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  )
}

function TypingText({ strings }: { strings: string[] }) {
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [pause, setPause] = useState(false)

  useEffect(() => {
    if (pause) return
    const target = strings[idx]
    const speed = deleting ? 50 : 80

    const timeout = setTimeout(() => {
      if (!deleting) {
        if (text.length < target.length) {
          setText(target.slice(0, text.length + 1))
        } else {
          setPause(true)
          setTimeout(() => {
            setDeleting(true)
            setPause(false)
          }, 2000)
        }
      } else {
        if (text.length > 0) {
          setText(text.slice(0, -1))
        } else {
          setDeleting(false)
          setIdx((idx + 1) % strings.length)
        }
      }
    }, speed)

    return () => clearTimeout(timeout)
  }, [text, deleting, idx, strings, pause])

  return (
    <span className="text-[#00f5ff] typing-cursor font-mono">{text}</span>
  )
}

export default function Hero({ lang }: HeroProps) {
  const orbRef = useRef<HTMLDivElement>(null)

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!orbRef.current) return
    const x = (e.clientX / window.innerWidth - 0.5) * 40
    const y = (e.clientY / window.innerHeight - 0.5) * 40
    orbRef.current.style.transform = `translate(${x}px, ${y}px)`
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [onMouseMove])

  const strings = lang === 'ko' ? TYPING_STRINGS : TYPING_STRINGS_EN

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 40%, #0d1117 0%, #0a0a0a 70%)' }}
    >
      {/* Particle network */}
      <ParticleCanvas />

      {/* Gradient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
      />
      <div
        ref={orbRef}
        className="absolute top-1/3 right-1/3 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] pointer-events-none transition-transform duration-700 ease-out"
        style={{ background: 'radial-gradient(circle, #00f5ff 0%, transparent 70%)' }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00f5ff]/30 bg-[#00f5ff]/5 text-[#00f5ff] text-sm font-mono mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse" />
          {lang === 'ko' ? 'AI 네이티브 엔지니어 · 채용 가능' : 'AI-Native Engineer · Open to Work'}
        </motion.div>

        {/* Main name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl sm:text-7xl md:text-8xl font-bold mb-4 leading-tight"
        >
          <GlitchText text="양준서" />
          <br />
          <span className="text-4xl sm:text-5xl md:text-6xl text-gray-400 font-light">
            Mark Yang
          </span>
        </motion.h1>

        {/* Typing animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-8 h-12"
        >
          <TypingText strings={strings} />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {lang === 'ko'
            ? 'UC Berkeley 데이터사이언스 졸업 · 클라우드 데이터 파이프라인 설계 · AI 도구로 10배 빠른 개발'
            : 'UC Berkeley Data Science · Cloud Data Pipelines · 10x Faster Dev with AI Tools'}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="magnetic-btn px-8 py-4 rounded-xl bg-[#00f5ff] text-black font-bold text-lg hover:bg-[#00c4cc] transition-all duration-200 shadow-lg shadow-[#00f5ff]/20"
          >
            {lang === 'ko' ? '포트폴리오 보기' : 'View Portfolio'}
          </button>
          <button
            onClick={downloadResumePDF}
            className="magnetic-btn px-8 py-4 rounded-xl border-2 border-[#00f5ff] text-[#00f5ff] font-bold text-lg hover:bg-[#00f5ff]/10 transition-all duration-200 flex items-center gap-2 glow-cyan"
          >
            <span>📄</span>
            {lang === 'ko' ? '이력서 PDF 다운로드' : 'Download Resume PDF'}
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-8 mt-16 text-center"
        >
          {[
            { num: '3+', label: lang === 'ko' ? '데이터 파이프라인' : 'Data Pipelines' },
            { num: '5+', label: lang === 'ko' ? '클라우드 서비스' : 'Cloud Services' },
            { num: 'UC', label: 'Berkeley Graduate' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl font-bold gradient-text">{s.num}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-gray-600 flex items-start justify-center p-1"
        >
          <div className="w-1 h-2 rounded-full bg-[#00f5ff]" />
        </motion.div>
      </motion.div>
    </section>
  )
}
