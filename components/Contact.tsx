'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const EMAIL = 'myang7736@gmail.com'

interface ContactProps { lang: 'ko' | 'en' }

export default function Contact({ lang }: ContactProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [emailRevealed, setEmailRevealed] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    await navigator.clipboard.writeText(EMAIL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      id="contact"
      ref={ref}
      className="w-full py-24 relative overflow-hidden"
      style={{ background: 'rgba(13,17,23,0.5)' }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-3 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,245,255,0.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Gradient orbs */}
      <div
        className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-8 blur-[100px] pointer-events-none"
        style={{ background: '#7c3aed' }}
      />
      <div
        className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full opacity-8 blur-[100px] pointer-events-none"
        style={{ background: '#00f5ff' }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="font-mono text-[#00f5ff] text-sm tracking-widest uppercase">
            {lang === 'ko' ? '연락' : 'Contact'}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-2">
            {lang === 'ko' ? '연락하기' : 'Get In Touch'}
          </h2>
          <div className="mt-3 h-0.5 w-20 bg-gradient-to-r from-[#00f5ff] to-[#7c3aed] mx-auto" />
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            {lang === 'ko'
              ? '새로운 기회나 협업에 대한 이야기를 나누고 싶습니다. 언제든지 연락 주세요!'
              : "I'm always open to discussing new opportunities and collaborations. Feel free to reach out!"}
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-dark rounded-3xl p-8 sm:p-12"
          style={{ border: '1px solid rgba(0,245,255,0.12)' }}
        >
          <div className="grid md:grid-cols-2 gap-10">
            {/* Left: contact info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white mb-6">
                {lang === 'ko' ? '직접 연락하기' : 'Direct Contact'}
              </h3>

              {/* Email */}
              <div>
                <div className="text-xs text-gray-500 font-mono mb-2">EMAIL</div>
                <div className="flex items-center gap-3">
                  {emailRevealed ? (
                    <button
                      onClick={copyEmail}
                      className="text-[#00f5ff] font-mono text-sm hover:underline flex items-center gap-2"
                    >
                      {EMAIL}
                      <span className="text-xs px-2 py-0.5 rounded bg-[#00f5ff]/10">
                        {copied ? (lang === 'ko' ? '복사됨!' : 'Copied!') : (lang === 'ko' ? '복사' : 'Copy')}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setEmailRevealed(true)}
                      className="px-4 py-2 rounded-lg border border-[#00f5ff]/40 text-[#00f5ff] text-sm hover:bg-[#00f5ff]/10 transition-all"
                    >
                      {lang === 'ko' ? '이메일 보기 클릭' : 'Click to reveal email'}
                    </button>
                  )}
                </div>
              </div>

              {/* GitHub */}
              <div>
                <div className="text-xs text-gray-500 font-mono mb-2">GITHUB</div>
                <a
                  href="https://github.com/markyang0613"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
                >
                  <span className="text-xl">🐙</span>
                  <span className="font-mono text-sm group-hover:text-[#00f5ff] transition-colors">
                    github.com/markyang0613
                  </span>
                  <span className="text-gray-600 group-hover:text-[#00f5ff] transition-colors text-xs">↗</span>
                </a>
              </div>

              {/* LinkedIn */}
              <div>
                <div className="text-xs text-gray-500 font-mono mb-2">LINKEDIN</div>
                <a
                  href="https://linkedin.com/in/markyang0613"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group"
                >
                  <span className="text-xl">💼</span>
                  <span className="font-mono text-sm group-hover:text-[#7c3aed] transition-colors">
                    linkedin.com/in/markyang0613
                  </span>
                  <span className="text-gray-600 group-hover:text-[#7c3aed] text-xs">↗</span>
                </a>
              </div>

              {/* Location */}
              <div>
                <div className="text-xs text-gray-500 font-mono mb-2">LOCATION</div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <span>🇰🇷</span>
                    <span>Seoul, Korea</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>🇺🇸</span>
                    <span>Oakland, California</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: availability + CTA */}
            <div className="flex flex-col justify-between">
              {/* Status */}
              <div className="glass rounded-xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse" />
                  <span className="text-[#39ff14] text-sm font-semibold">
                    {lang === 'ko' ? '채용 가능' : 'Open to Work'}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {lang === 'ko'
                    ? '데이터 엔지니어 포지션을 적극적으로 탐색 중입니다. 클라우드 파이프라인, ETL, AI 통합 프로젝트에 관심이 있습니다.'
                    : "Actively seeking Data Engineer roles. Interested in cloud pipelines, ETL, and AI integration projects."}
                </p>
              </div>

              {/* Quick links */}
              <div className="space-y-3">
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#00f5ff] text-black font-bold hover:bg-[#00c4cc] transition-all duration-200 shadow-lg shadow-[#00f5ff]/20"
                >
                  ✉️ {lang === 'ko' ? '이메일 보내기' : 'Send Email'}
                </a>
                <a
                  href="https://github.com/markyang0613"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-[#7c3aed] text-[#a855f7] font-bold hover:bg-[#7c3aed]/10 transition-all duration-200"
                >
                  🐙 {lang === 'ko' ? 'GitHub 방문' : 'Visit GitHub'}
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="text-center mt-12 text-gray-600 text-sm"
        >
          <p>
            {lang === 'ko'
              ? '양준서 포트폴리오 © 2024 · Next.js + Three.js + Framer Motion · Built with ❤️ & Claude AI'
              : 'Yang Joon-seo Portfolio © 2024 · Next.js + Three.js + Framer Motion · Built with ❤️ & Claude AI'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
