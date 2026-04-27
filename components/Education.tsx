'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface EducationProps { lang: 'ko' | 'en' }

function BerkeleyLogo() {
  return (
    <motion.div
      animate={{ rotate: [0, 5, -5, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-20 h-20 flex items-center justify-center"
    >
      <div
        className="absolute inset-0 rounded-full opacity-20 blur-xl"
        style={{ background: 'radial-gradient(circle, #003262, #FDB515)' }}
      />
      <div className="text-5xl">🐻</div>
    </motion.div>
  )
}

export default function Education({ lang }: EducationProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="education" ref={ref} className="w-full py-24" style={{ background: 'rgba(13,17,23,0.4)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="font-mono text-[#00f5ff] text-sm tracking-widest uppercase">
            {lang === 'ko' ? '학력' : 'Education'}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-2">
            {lang === 'ko' ? '학력' : 'Education'}
          </h2>
          <div className="mt-3 h-0.5 w-20 bg-gradient-to-r from-[#00f5ff] to-[#7c3aed] mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* UC Berkeley */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="glass rounded-2xl p-8 transition-all duration-300 relative overflow-hidden"
            style={{ border: '1px solid #003262' }}
          >
            {/* BG accent */}
            <div
              className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5 blur-3xl"
              style={{ background: '#FDB515' }}
            />

            <div className="flex items-start gap-5">
              <BerkeleyLogo />
              <div>
                <div className="text-xs font-mono text-[#FDB515] mb-1">
                  {lang === 'ko' ? '2020 – 2024' : '2020 – 2024'}
                </div>
                <h3 className="text-xl font-bold text-white">UC Berkeley</h3>
                <p className="text-[#FDB515] font-semibold mt-0.5">
                  {lang === 'ko' ? '데이터사이언스 학사 (B.S.)' : 'B.S. Data Science'}
                </p>
                <p className="text-gray-500 text-sm mt-0.5">Berkeley, California</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {[
                { label: lang === 'ko' ? '전공' : 'Major', value: lang === 'ko' ? '데이터사이언스' : 'Data Science' },
                { label: lang === 'ko' ? '관련 과목' : 'Coursework', value: lang === 'ko' ? '머신러닝, 통계, 데이터베이스, 알고리즘' : 'ML, Stats, Databases, Algorithms' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-2">
                  <span className="text-gray-500 text-sm w-16 flex-shrink-0">{item.label}</span>
                  <span className="text-gray-300 text-sm">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {['Python', 'R', 'SQL', 'Statistics', 'ML'].map(s => (
                <span key={s} className="text-xs px-2 py-0.5 rounded bg-[#FDB515]/10 text-[#FDB515] font-mono">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Certification */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col gap-4"
          >
            {/* AWS cert card */}
            <motion.div
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 flex-1 relative overflow-hidden transition-all duration-300"
              style={{ border: '1px solid rgba(255,153,0,0.3)' }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-3xl"
                style={{ background: '#FF9900' }}
              />

              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">☁️</span>
                <div>
                  <div className="text-xs font-mono text-gray-500 mb-0.5">
                    {lang === 'ko' ? '자격증 준비 중' : 'Certification In Progress'}
                  </div>
                  <h3 className="font-bold text-white">AWS Certified</h3>
                  <p className="text-sm" style={{ color: '#FF9900' }}>Data Engineer Associate</p>
                </div>
                {/* Animated badge */}
                <div className="ml-auto flex-shrink-0">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="px-2 py-1 rounded-full text-xs font-mono border flex items-center gap-1"
                    style={{ borderColor: '#FF9900', color: '#FF9900', background: '#FF990015' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF9900] animate-pulse" />
                    {lang === 'ko' ? '준비 중' : 'In Progress'}
                  </motion.div>
                </div>
              </div>

              <p className="text-gray-400 text-sm leading-relaxed">
                {lang === 'ko'
                  ? 'AWS 데이터 파이프라인, 분석 서비스, 데이터 보안 및 거버넌스 역량을 공식 인증받기 위해 준비하고 있습니다.'
                  : 'Preparing to officially certify expertise in AWS data pipelines, analytics services, data security, and governance.'}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {['S3', 'Glue', 'Redshift', 'Athena', 'Lake Formation'].map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded font-mono bg-[#FF9900]/10 text-[#FF9900]">
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Self-learning card */}
            <motion.div
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 transition-all duration-300"
              style={{ border: '1px solid rgba(0,245,255,0.15)' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    {lang === 'ko' ? 'AI 도구 자기학습' : 'AI Tools Self-Learning'}
                  </h3>
                  <p className="text-xs text-[#00f5ff]">
                    {lang === 'ko' ? '지속적 학습' : 'Continuous Learning'}
                  </p>
                </div>
              </div>
              <p className="text-gray-500 text-xs leading-relaxed">
                {lang === 'ko'
                  ? 'Claude, ChatGPT, Cursor 등 최신 AI 도구를 실무에 통합하며 AI 네이티브 워크플로우를 지속적으로 발전시키고 있습니다.'
                  : 'Continuously evolving AI-native workflows by integrating Claude, ChatGPT, Cursor, and other cutting-edge tools into real-world engineering.'}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
