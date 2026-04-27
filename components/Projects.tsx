'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const projects = [
  {
    id: 1,
    title: 'Battery Manufacturing Data Pipeline',
    titleKo: '배터리 제조 데이터 파이프라인',
    category: 'data-engineering',
    categoryLabel: '데이터엔지니어링',
    size: 'large',
    descKo: '배터리 제조 공정에서 수집된 QA 데이터를 실시간으로 처리하는 엔드투엔드 클라우드 파이프라인. Amazon EC2 서버에서 Google Gemma API를 통한 AI 품질 검사 후, S3 → Snowflake로 데이터를 이동시키는 완전 자동화 시스템을 구현했습니다.',
    descEn: 'End-to-end cloud pipeline for real-time QA data from battery manufacturing. AI-powered quality inspection via Google Gemma API on EC2, with fully automated data flow from S3 to Snowflake.',
    tech: ['AWS EC2', 'Amazon S3', 'Snowflake', 'Google Gemma API', 'Python', 'ETL'],
    aiUsage: 95,
    github: 'https://github.com/markyang0613',
    color: '#00f5ff',
    icon: '🔋',
    highlights: ['AI 품질 검사 자동화', '실시간 데이터 처리', 'S3 → Snowflake 파이프라인'],
  },
  {
    id: 2,
    title: 'Student Analytics Dashboard',
    titleKo: '학생 데이터 분석 대시보드',
    category: 'cloud',
    categoryLabel: '클라우드',
    size: 'medium',
    descKo: '비영리 교육 기관 Oakland Natives Give Back의 학생 성과 데이터를 시각화하는 인터랙티브 대시보드. Python으로 데이터를 정제하고 Tableau로 핵심 지표를 시각화하여 교육 프로그램 개선에 기여했습니다.',
    descEn: 'Interactive dashboard visualizing student performance data for Oakland Natives Give Back nonprofit. Python-powered data cleaning and Tableau visualization to drive educational program improvements.',
    tech: ['Python', 'SQL', 'Tableau', 'Pandas', 'Data Analysis'],
    aiUsage: 70,
    github: 'https://github.com/markyang0613',
    color: '#7c3aed',
    icon: '📊',
    highlights: ['인터랙티브 시각화', '데이터 정제 자동화', '비영리 임팩트'],
  },
  {
    id: 3,
    title: 'AI Portfolio Website',
    titleKo: 'AI 포트폴리오 웹사이트',
    category: 'ai',
    categoryLabel: 'AI',
    size: 'medium',
    descKo: '현재 보고 계신 이 포트폴리오 사이트입니다! Next.js 14, Three.js, Framer Motion으로 구축된 AI 네이티브 포트폴리오. Claude AI와 함께 전체 설계 및 구현했습니다.',
    descEn: "The very site you're viewing! AI-native portfolio built with Next.js 14, Three.js, and Framer Motion. Designed and implemented entirely with Claude AI as a co-engineer.",
    tech: ['Next.js 14', 'TypeScript', 'Three.js', 'Framer Motion', 'Tailwind CSS'],
    aiUsage: 99,
    github: 'https://github.com/markyang0613',
    color: '#39ff14',
    icon: '🌐',
    highlights: ['Three.js 파티클 시스템', 'AI 챗봇 내장', 'PDF 이력서 생성'],
  },
  {
    id: 4,
    title: 'ETL Automation Framework',
    titleKo: 'ETL 자동화 프레임워크',
    category: 'data-engineering',
    categoryLabel: '데이터엔지니어링',
    size: 'small',
    descKo: '반복적인 데이터 추출·변환·적재 작업을 자동화하는 Python 기반 프레임워크. AWS Glue와 연동하여 스케줄 기반 파이프라인을 구현했습니다.',
    descEn: 'Python-based framework automating repetitive ETL tasks. Integrated with AWS Glue for schedule-driven pipeline execution.',
    tech: ['Python', 'AWS Glue', 'S3', 'Boto3'],
    aiUsage: 80,
    github: 'https://github.com/markyang0613',
    color: '#f59e0b',
    icon: '⚙️',
    highlights: ['자동화 스케줄링', 'AWS Glue 연동'],
  },
]

const filterTabs = [
  { id: 'all', label: '전체', en: 'All' },
  { id: 'data-engineering', label: '데이터엔지니어링', en: 'Data Engineering' },
  { id: 'cloud', label: '클라우드', en: 'Cloud' },
  { id: 'ai', label: 'AI', en: 'AI' },
]

function AIUsageBadge({ level }: { level: number }) {
  const color = level >= 90 ? '#39ff14' : level >= 70 ? '#00f5ff' : '#7c3aed'
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-gray-500">🤖 AI 활용도</span>
      <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden" style={{ width: 60 }}>
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${level}%`, background: color }}
        />
      </div>
      <span className="text-xs font-mono" style={{ color }}>{level}%</span>
    </div>
  )
}

interface ProjectCardProps {
  project: typeof projects[0]
  featured?: boolean
  lang: 'ko' | 'en'
}

function ProjectCard({ project, featured, lang }: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className={`glass gradient-border rounded-2xl p-6 flex flex-col gap-4 transition-all duration-300
        hover:border-opacity-60 cursor-default
        ${featured ? 'col-span-2 md:col-span-2' : 'col-span-1'}`}
      style={{ border: `1px solid ${project.color}20` }}
    >
      {/* Top */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{project.icon}</span>
          <div>
            <div className="text-xs font-mono px-2 py-0.5 rounded-md mb-1" style={{ background: project.color + '15', color: project.color }}>
              {lang === 'ko' ? project.categoryLabel : project.category}
            </div>
            <h3 className="font-bold text-base leading-tight">
              {lang === 'ko' ? project.titleKo : project.title}
            </h3>
          </div>
        </div>
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-white transition-colors flex-shrink-0 text-sm"
        >
          GitHub ↗
        </a>
      </div>

      {/* Desc */}
      <p className="text-gray-400 text-sm leading-relaxed flex-1">
        {lang === 'ko' ? project.descKo : project.descEn}
      </p>

      {/* Highlights */}
      {featured && (
        <div className="flex flex-wrap gap-2">
          {project.highlights.map(h => (
            <span key={h} className="text-xs px-2 py-1 rounded-md glass text-gray-300">
              ✓ {h}
            </span>
          ))}
        </div>
      )}

      {/* Tech */}
      <div className="flex flex-wrap gap-1.5">
        {project.tech.map(t => (
          <span key={t} className="text-xs px-2 py-0.5 rounded-md font-mono bg-white/5 text-gray-400">
            {t}
          </span>
        ))}
      </div>

      {/* AI usage + GitHub */}
      <div className="pt-3 border-t border-white/5">
        <AIUsageBadge level={project.aiUsage} />
      </div>
    </motion.div>
  )
}

interface ProjectsProps { lang: 'ko' | 'en' }

export default function Projects({ lang }: ProjectsProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter)

  return (
    <section id="projects" ref={ref} className="py-24 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="text-center mb-12"
      >
        <span className="font-mono text-[#00f5ff] text-sm tracking-widest uppercase">
          {lang === 'ko' ? '작업물' : 'Portfolio'}
        </span>
        <h2 className="text-4xl sm:text-5xl font-bold mt-2">
          {lang === 'ko' ? '프로젝트' : 'Projects'}
        </h2>
        <div className="mt-3 h-0.5 w-20 bg-gradient-to-r from-[#00f5ff] to-[#7c3aed] mx-auto" />
      </motion.div>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 justify-center mb-10"
      >
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              filter === tab.id
                ? 'bg-[#00f5ff] text-black shadow-lg shadow-[#00f5ff]/20'
                : 'glass text-gray-400 hover:text-white'
            }`}
          >
            {lang === 'ko' ? tab.label : tab.en}
          </button>
        ))}
      </motion.div>

      {/* Bento grid */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              featured={i === 0 && filter === 'all'}
              lang={lang}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
