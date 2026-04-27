'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const categories = [
  {
    id: 'cloud',
    label: '클라우드 & 데이터',
    en: 'Cloud & Data',
    color: '#00f5ff',
    skills: [
      { name: 'AWS S3', level: 85, detail: '대용량 파일 스토리지, 데이터 레이크 구축' },
      { name: 'AWS Glue', level: 80, detail: 'ETL 파이프라인 자동화' },
      { name: 'AWS Redshift', level: 78, detail: '클라우드 데이터 웨어하우스 쿼리' },
      { name: 'Snowflake', level: 82, detail: '멀티클라우드 데이터 플랫폼' },
      { name: 'AWS EC2', level: 75, detail: '서버 인프라, 배포 관리' },
    ],
  },
  {
    id: 'lang',
    label: '언어',
    en: 'Languages',
    color: '#7c3aed',
    skills: [
      { name: 'Python', level: 90, detail: 'ETL, 분석, 자동화 스크립팅' },
      { name: 'SQL', level: 88, detail: '복잡한 집계, 윈도우 함수' },
      { name: 'JavaScript', level: 70, detail: '웹 인터페이스, 자동화' },
    ],
  },
  {
    id: 'ai',
    label: 'AI/ML 도구',
    en: 'AI/ML Tools',
    color: '#a855f7',
    skills: [
      { name: 'Google Gemma API', level: 80, detail: 'LLM 기반 데이터 추출 파이프라인' },
      { name: 'LLM Integration', level: 85, detail: '프로덕션 AI 워크플로우 구축' },
      { name: 'Prompt Engineering', level: 92, detail: '고도화된 프롬프트 설계' },
    ],
  },
  {
    id: 'de',
    label: '데이터 엔지니어링',
    en: 'Data Engineering',
    color: '#39ff14',
    skills: [
      { name: 'ETL Pipelines', level: 85, detail: '배치 및 스트리밍 파이프라인' },
      { name: 'Apache Spark', level: 72, detail: '대규모 분산 데이터 처리' },
      { name: 'dbt', level: 75, detail: '데이터 변환 및 테스트' },
    ],
  },
  {
    id: 'other',
    label: '기타',
    en: 'Other',
    color: '#f59e0b',
    skills: [
      { name: 'Git', level: 88, detail: '버전 관리, 브랜치 전략' },
      { name: 'Docker', level: 76, detail: '컨테이너화, 환경 일관성' },
      { name: 'Tableau', level: 80, detail: '데이터 시각화 대시보드' },
    ],
  },
]

const aiTools = [
  { name: 'Claude', icon: '🤖', desc: (l: 'ko' | 'en') => l === 'ko' ? '주요 코딩 & 분석 파트너' : 'Primary coding & analysis partner' },
  { name: 'ChatGPT', icon: '💬', desc: (l: 'ko' | 'en') => l === 'ko' ? '아이디어 브레인스토밍' : 'Idea brainstorming' },
  { name: 'Cursor', icon: '⚡', desc: (l: 'ko' | 'en') => l === 'ko' ? 'AI 통합 IDE' : 'AI-powered IDE' },
  { name: 'GitHub Copilot', icon: '🐙', desc: (l: 'ko' | 'en') => l === 'ko' ? '코드 자동완성' : 'Code autocomplete' },
  { name: 'Gemini', icon: '✨', desc: (l: 'ko' | 'en') => l === 'ko' ? '멀티모달 분석' : 'Multimodal analysis' },
  { name: 'Perplexity', icon: '🔍', desc: (l: 'ko' | 'en') => l === 'ko' ? 'AI 기반 리서치' : 'AI-powered research' },
]

function FlipCard({ skill, color }: { skill: { name: string; level: number; detail: string }; color: string }) {
  return (
    <div className="flip-card h-28">
      <div className="flip-card-inner">
        {/* Front */}
        <div
          className="flip-card-front glass flex flex-col items-center justify-center p-3 cursor-pointer"
          style={{ border: `1px solid ${color}30` }}
        >
          <div className="text-sm font-mono font-semibold text-center" style={{ color }}>
            {skill.name}
          </div>
          <div className="mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: color, width: `${skill.level}%` }}
              initial={{ width: 0 }}
              whileInView={{ width: `${skill.level}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">{skill.level}%</div>
        </div>
        {/* Back */}
        <div
          className="flip-card-back flex flex-col items-center justify-center p-3 rounded-xl text-center"
          style={{ background: color + '15', border: `1px solid ${color}60` }}
        >
          <div className="text-xs font-mono" style={{ color }}>{skill.name}</div>
          <div className="text-xs text-gray-300 mt-2 leading-relaxed">{skill.detail}</div>
        </div>
      </div>
    </div>
  )
}

interface SkillsProps { lang: 'ko' | 'en' }

export default function Skills({ lang }: SkillsProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all'
    ? categories
    : categories.filter(c => c.id === activeCategory)

  return (
    <section id="skills" ref={ref} className="py-24 px-4" style={{ background: 'rgba(13,17,23,0.4)' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="font-mono text-[#00f5ff] text-sm tracking-widest uppercase">
            {lang === 'ko' ? '역량' : 'Capabilities'}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-2">
            {lang === 'ko' ? '기술 스택' : 'Tech Stack'}
          </h2>
          <div className="mt-3 h-0.5 w-20 bg-gradient-to-r from-[#00f5ff] to-[#7c3aed] mx-auto" />
        </motion.div>

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 justify-center mb-10"
        >
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-[#00f5ff] text-black'
                : 'glass text-gray-400 hover:text-white'
            }`}
          >
            {lang === 'ko' ? '전체' : 'All'}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'text-black font-bold'
                  : 'glass text-gray-400 hover:text-white'
              }`}
              style={activeCategory === cat.id ? { background: cat.color } : {}}
            >
              {lang === 'ko' ? cat.label : cat.en}
            </button>
          ))}
        </motion.div>

        {/* Skill cards grid */}
        <div className="space-y-10">
          {filtered.map((cat, ci) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * ci + 0.3, duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                <h3 className="font-semibold text-lg" style={{ color: cat.color }}>
                  {lang === 'ko' ? cat.label : cat.en}
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {cat.skills.map(skill => (
                  <FlipCard key={skill.name} skill={skill} color={cat.color} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Tools section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.7 }}
          className="mt-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold gradient-text">
              {lang === 'ko' ? '매일 사용하는 AI 도구' : 'AI Tools I Use Daily'}
            </h3>
            <p className="text-gray-500 text-sm mt-2">
              {lang === 'ko' ? 'AI 네이티브 워크플로우 — 코드 한 줄도 AI와 함께' : 'AI-native workflow — every line of code, paired with AI'}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {aiTools.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.8 + i * 0.07 }}
                whileHover={{ y: -4, scale: 1.05 }}
                className="glass rounded-xl p-4 text-center card-hover border border-[#7c3aed]/20 hover:border-[#7c3aed]/50 transition-all"
              >
                <div className="text-3xl mb-2">{tool.icon}</div>
                <div className="text-sm font-semibold text-white">{tool.name}</div>
                <div className="text-xs text-gray-500 mt-1">{tool.desc(lang)}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
