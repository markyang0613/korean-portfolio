'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const experiences = [
  {
    company: 'LSP USA, LLC',
    role: 'Quality Inspection Engineer',
    roleKo: '품질 검사 엔지니어',
    period: '2023 – 2024',
    location: 'Oakland, CA',
    descKo: '배터리 제조 공정의 클라우드 데이터 파이프라인을 설계 및 구축했습니다. Amazon EC2에서 Google Gemma API를 활용한 AI 품질 검사 시스템을 개발하고, S3와 Snowflake를 연동한 실시간 데이터 흐름을 구현했습니다.',
    descEn: 'Designed and built cloud data pipelines for battery manufacturing QA. Developed an AI-powered quality inspection system using Google Gemma API on Amazon EC2, implementing real-time data flows between S3 and Snowflake.',
    tech: ['AWS EC2', 'Amazon S3', 'Snowflake', 'Google Gemma API', 'Python', 'ETL'],
    aiTools: ['Google Gemma API', 'Python AI libs'],
    color: '#00f5ff',
    icon: '🔋',
  },
  {
    company: 'Oakland Natives Give Back',
    role: 'Data Analyst Intern',
    roleKo: '데이터 분석 인턴',
    period: '2022 – 2023',
    location: 'Oakland, CA',
    descKo: '비영리 교육 기관에서 학생 데이터를 분석하여 프로그램 개선에 활용했습니다. Python과 SQL을 이용해 학생 성과 대시보드를 구축하고, 데이터 기반 인사이트로 의사결정을 지원했습니다.',
    descEn: 'Analyzed student data at a nonprofit to improve educational programs. Built student performance dashboards with Python and SQL, providing data-driven insights to support organizational decision-making.',
    tech: ['Python', 'SQL', 'Tableau', 'Excel', 'Data Analysis'],
    aiTools: ['ChatGPT', 'GitHub Copilot'],
    color: '#7c3aed',
    icon: '📊',
  },
  {
    company: 'Avellino Lab',
    role: 'Data Science Intern',
    roleKo: '데이터사이언스 인턴',
    period: 'Sep. 2021 – Dec. 2021',
    location: 'Menlo Park, CA',
    descKo: 'CNN과 Vision Transformer를 개발하여 X-ray 이미지와 유전자 특성 기반 안암 발생 예측 모델을 구현했으며, Confusion Matrix 기반 88% 정확도를 달성했습니다. AWS에 약 2GB의 환자 유전자 및 방사선 영상 데이터를 중앙화된 데이터베이스로 구축하여 4명의 연구원이 거버넌스 환경에서 접근할 수 있도록 했습니다. 유전학자·방사선 전문의·소프트웨어 엔지니어 간 협업을 조율하여 200명 이상의 환자에 대한 안암 위험 예측 효율성을 향상시켰습니다.',
    descEn: 'Developed CNN and Vision Transformer models to predict eye cancer likelihood from X-ray images and genetic features, achieving 88% accuracy via confusion matrix evaluation. Built a centralized AWS database organizing ~2GB of patient genetics and radiographic imagery for 4 researchers with proper data governance. Coordinated geneticists, radiologists, and software engineers to consolidate diverse datasets, improving eye cancer risk prediction for 200+ patients.',
    tech: ['Python', 'CNN', 'Vision Transformer', 'AWS', 'PyTorch', 'Medical Imaging', 'SQL'],
    aiTools: ['PyTorch', 'scikit-learn'],
    color: '#39ff14',
    icon: '🔬',
  },
]

interface ExpCardProps {
  exp: typeof experiences[0]
  idx: number
  inView: boolean
  lang: 'ko' | 'en'
}

function ExpCard({ exp, idx, inView, lang }: ExpCardProps) {
  const isLeft = idx % 2 === 0

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: idx * 0.2 + 0.3 }}
      className="relative grid md:grid-cols-2 mb-12"
    >
      {/* Center dot — sits on the grid dividing line */}
      <div className="absolute left-1/2 top-8 -translate-x-1/2 hidden md:block z-10">
        <div
          className="w-4 h-4 rounded-full border-2"
          style={{ borderColor: exp.color, background: '#0a0a0a', boxShadow: `0 0 12px ${exp.color}80` }}
        />
      </div>

      {/* Left cell — card when isLeft, empty when isRight */}
      <div className={`${isLeft ? 'md:pr-10' : ''} flex items-start justify-end`}>
        {isLeft && <CardContent exp={exp} lang={lang} />}
      </div>

      {/* Right cell — card when isRight, empty when isLeft */}
      <div className={`${!isLeft ? 'md:pl-10' : ''} flex items-start justify-start`}>
        {!isLeft && <CardContent exp={exp} lang={lang} />}
      </div>
    </motion.div>
  )
}

function CardContent({ exp, lang }: { exp: typeof experiences[0]; lang: 'ko' | 'en' }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: `0 20px 60px ${exp.color}20, 0 0 0 1px ${exp.color}30` }}
      className="glass rounded-2xl p-6 transition-all duration-300 cursor-default w-full"
      style={{ border: `1px solid ${exp.color}20` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{exp.icon}</span>
            <h3 className="font-bold text-lg text-white">{exp.company}</h3>
          </div>
          <div className="font-semibold text-sm" style={{ color: exp.color }}>
            {lang === 'ko' ? exp.roleKo : exp.role}
          </div>
        </div>
        <div className="text-right text-xs text-gray-500 flex-shrink-0">
          <div className="font-mono mb-0.5">{exp.period}</div>
          <div>{exp.location}</div>
        </div>
      </div>

      {/* Desc */}
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        {lang === 'ko' ? exp.descKo : exp.descEn}
      </p>

      {/* Tech tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {exp.tech.map(t => (
          <span
            key={t}
            className="px-2 py-0.5 rounded-md text-xs font-mono"
            style={{ background: exp.color + '15', color: exp.color }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* AI Tools */}
      {exp.aiTools.length > 0 && (
        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
          <span className="text-xs text-gray-500">🤖 AI Tools:</span>
          <div className="flex gap-1.5 flex-wrap">
            {exp.aiTools.map(t => (
              <span key={t} className="px-2 py-0.5 rounded-md text-xs bg-[#7c3aed]/15 text-[#a855f7] font-mono">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

interface ExperienceProps { lang: 'ko' | 'en' }

export default function Experience({ lang }: ExperienceProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="experience" ref={ref} className="w-full py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-[#00f5ff] text-sm tracking-widest uppercase">
            {lang === 'ko' ? '경험' : 'Experience'}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-2">
            {lang === 'ko' ? '경력 및 경험' : 'Work Experience'}
          </h2>
          <div className="mt-3 h-0.5 w-20 bg-gradient-to-r from-[#00f5ff] to-[#7c3aed] mx-auto" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center vertical line */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block origin-top"
            style={{ background: 'linear-gradient(180deg, #00f5ff, #7c3aed, #39ff14)' }}
          />

          {experiences.map((exp, idx) => (
            <ExpCard key={exp.company} exp={exp} idx={idx} inView={inView} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  )
}
