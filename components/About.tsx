'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const skills = [
  { name: 'Python', level: 90, color: '#00f5ff', desc: '데이터 파이프라인, ETL, 스크립팅' },
  { name: 'SQL', level: 88, color: '#7c3aed', desc: '복잡한 쿼리, 데이터 분석' },
  { name: 'AWS', level: 82, color: '#00f5ff', desc: 'S3, Glue, Redshift, EC2' },
  { name: 'Snowflake', level: 78, color: '#39ff14', desc: '클라우드 데이터 웨어하우스' },
  { name: 'Claude AI', level: 95, color: '#7c3aed', desc: 'AI 네이티브 워크플로우' },
  { name: 'Git/Docker', level: 80, color: '#00f5ff', desc: '버전 관리, 컨테이너화' },
]

function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0
          const increment = target / (duration / 16)
          const timer = setInterval(() => {
            start += increment
            if (start >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 16)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

function CounterStat({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  const { count, ref } = useCountUp(value)

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold gradient-text">
        {count}{suffix}
      </div>
      <div className="text-gray-400 text-sm mt-1">{label}</div>
    </div>
  )
}

function SkillTooltip({ skill }: { skill: typeof skills[0] }) {
  const [hovered, setHovered] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const inView = useInView(barRef, { once: true })

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="px-4 py-2 rounded-full border cursor-default transition-all duration-200"
        style={{
          borderColor: skill.color + '60',
          background: hovered ? skill.color + '15' : 'transparent',
          color: hovered ? skill.color : '#a1a1aa',
        }}
      >
        <span className="text-sm font-mono font-medium">{skill.name}</span>
      </div>

      {hovered && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-3 rounded-xl glass-dark z-20 pointer-events-none"
        >
          <div className="text-white text-xs font-medium mb-2">{skill.name}</div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{skill.desc}</span>
            <span style={{ color: skill.color }}>{skill.level}%</span>
          </div>
          <div ref={barRef} className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${skill.level}%` } : {}}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: skill.color }}
            />
          </div>
          {/* Arrow */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
            style={{ borderTopColor: 'rgba(13,17,23,0.9)' }}
          />
        </motion.div>
      )}
    </div>
  )
}

function ConstellationViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const nodes = [
      { x: 0.5, y: 0.15, label: 'Python', color: '#00f5ff' },
      { x: 0.2, y: 0.35, label: 'SQL', color: '#7c3aed' },
      { x: 0.8, y: 0.35, label: 'AWS', color: '#00f5ff' },
      { x: 0.35, y: 0.6, label: 'Snowflake', color: '#39ff14' },
      { x: 0.65, y: 0.6, label: 'Claude', color: '#7c3aed' },
      { x: 0.15, y: 0.75, label: 'Docker', color: '#00f5ff' },
      { x: 0.85, y: 0.75, label: 'dbt', color: '#39ff14' },
      { x: 0.5, y: 0.88, label: 'Tableau', color: '#7c3aed' },
    ]

    const edges = [
      [0,1],[0,2],[0,3],[0,4],[1,3],[2,4],[3,5],[4,6],[5,7],[6,7],[1,5],[2,6]
    ]

    let t = 0
    let animId: number

    const draw = () => {
      canvas.width = canvas.offsetWidth * 2
      canvas.height = canvas.offsetHeight * 2
      ctx.scale(2, 2)
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight

      ctx.clearRect(0, 0, w, h)

      // Edges
      edges.forEach(([a, b]) => {
        const na = nodes[a], nb = nodes[b]
        const pulse = (Math.sin(t * 0.02 + a) + 1) / 2
        ctx.beginPath()
        ctx.moveTo(na.x * w, na.y * h)
        ctx.lineTo(nb.x * w, nb.y * h)
        ctx.strokeStyle = `rgba(0,245,255,${0.1 + pulse * 0.15})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      })

      // Nodes
      nodes.forEach((node, i) => {
        const pulse = (Math.sin(t * 0.03 + i) + 1) / 2
        const x = node.x * w
        const y = node.y * h

        // Glow
        const grd = ctx.createRadialGradient(x, y, 0, x, y, 20 + pulse * 10)
        grd.addColorStop(0, node.color + 'aa')
        grd.addColorStop(1, node.color + '00')
        ctx.beginPath()
        ctx.arc(x, y, 20 + pulse * 10, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        // Dot
        ctx.beginPath()
        ctx.arc(x, y, 4 + pulse * 2, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()

        // Label
        ctx.font = '10px monospace'
        ctx.fillStyle = '#a1a1aa'
        ctx.textAlign = 'center'
        ctx.fillText(node.label, x, y + 18)
      })

      t++
      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  )
}

interface AboutProps { lang: 'ko' | 'en' }

export default function About({ lang }: AboutProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" ref={ref} className="w-full py-24">
      <div className="section-inner">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="font-mono text-[#00f5ff] text-sm tracking-widest uppercase">
            {lang === 'ko' ? '소개' : 'About Me'}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-2">
            {lang === 'ko' ? '나에 대해서' : 'About'}
          </h2>
          <div className="mt-3 h-0.5 w-20 bg-gradient-to-r from-[#00f5ff] to-[#7c3aed] mx-auto" />
        </div>

        {/* Split layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Bio */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              {lang === 'ko'
                ? 'UC Berkeley에서 데이터사이언스를 전공하며 데이터가 세상을 어떻게 변화시키는지 배웠습니다. 현재는 클라우드 기반 데이터 파이프라인을 설계하고, AI 도구를 적극적으로 활용하여 개발 효율을 극대화하는 데이터 엔지니어로 성장하고 있습니다.'
                : "I studied Data Science at UC Berkeley, learning how data transforms industries. Now I design cloud-based data pipelines and leverage AI tools aggressively to maximize engineering efficiency."}
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              {lang === 'ko'
                ? '단순히 AI 도구를 "사용"하는 것을 넘어, AI를 개발 워크플로우의 핵심 레이어로 통합하는 AI 네이티브 사고방식을 지향합니다. 배터리 제조 공정의 데이터 파이프라인 구축부터 학생 데이터 분석까지, 데이터로 실질적인 임팩트를 만들어왔습니다.'
                : "Beyond merely \"using\" AI tools, I integrate AI as a core layer in my development workflow — an AI-native mindset. From battery manufacturing pipelines to student analytics, I build data systems that create real impact."}
            </p>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-2 mb-10">
              {skills.map(s => (
                <SkillTooltip key={s.name} skill={s} />
              ))}
            </div>

            {/* Counter stats */}
            <div className="grid grid-cols-3 gap-6 p-6 rounded-2xl glass">
              <CounterStat value={3} suffix="+" label={lang === 'ko' ? '파이프라인 구축' : 'Pipelines Built'} />
              <CounterStat value={5} suffix="+" label={lang === 'ko' ? '클라우드 서비스' : 'Cloud Services'} />
              <CounterStat value={13} suffix="년" label={lang === 'ko' ? '성실함의 증거' : 'Years of Grit'} />
            </div>
          </motion.div>

          {/* Right: Constellation viz */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass rounded-2xl p-4 h-[420px] relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-5"
              style={{ backgroundImage: 'radial-gradient(circle, #00f5ff 1px, transparent 1px)', backgroundSize: '30px 30px' }}
            />
            <div className="absolute top-4 left-4 text-xs font-mono text-gray-500">
              {lang === 'ko' ? '기술 스택 성좌도' : 'Tech Constellation'}
            </div>
            <ConstellationViz />
          </motion.div>
        </div>
      </motion.div>
      </div>
    </section>
  )
}
