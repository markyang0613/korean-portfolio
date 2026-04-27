'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const KONAMI = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a',
]

export default function KonamiEgg() {
  const [seq, setSeq] = useState<string[]>([])
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      setSeq(prev => {
        const next = [...prev, e.key].slice(-10)
        if (next.join(',') === KONAMI.join(',')) {
          setShow(true)
          return []
        }
        return next
      })
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
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: ['#00f5ff','#7c3aed','#39ff14'][i % 3],
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -200, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                repeat: Infinity,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
