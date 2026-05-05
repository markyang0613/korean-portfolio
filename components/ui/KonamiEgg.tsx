'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const KONAMI = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a',
]

interface Particle {
  left: number
  top: number
  duration: number
  delay: number
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 2 + Math.random() * 2,
    delay: Math.random() * 0.5,
  }))
}

export default function KonamiEgg() {
  const [show, setShow] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    let seq: string[] = []
    const handler = (e: KeyboardEvent) => {
      seq = [...seq, e.key].slice(-10)
      if (seq.join(',') === KONAMI.join(',')) {
        setShow(true)
        setParticles(generateParticles(20))
        seq = []
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="konami-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShow(false)}
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="text-center px-8"
          >
            <div className="text-8xl mb-6">🤖</div>
            <h2 className="text-4xl font-bold gradient-text mb-4">
              Konami Code 발동!
            </h2>
            <p className="text-xl text-gray-300 mb-2">
              당신은 진정한 게이머입니다 🎮
            </p>
            <p className="text-[#00f5ff] font-mono text-lg mb-6">
              &quot;AI도 코드로 먹고 삽니다&quot; — 양준서
            </p>
            <div className="flex gap-3 justify-center flex-wrap mb-8">
              {['Python','AWS','Snowflake','Claude AI','SQL','ETL'].map(t => (
                <span key={t} className="px-3 py-1 rounded-full text-sm font-mono border border-[#00f5ff]/40 text-[#00f5ff]">
                  {t}
                </span>
              ))}
            </div>
            <p className="text-gray-500 text-sm">클릭하여 닫기</p>
          </motion.div>

          {/* Particles */}
          {particles.map((p, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: ['#00f5ff','#7c3aed','#39ff14'][i % 3],
                left: `${p.left}%`,
                top: `${p.top}%`,
              }}
              animate={{
                y: [0, -200, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
