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
    company: '한신포차',
    role: 'Service Staff',
    roleKo: '서비스 직원',
    period: '2020 – 2021',
    location: 'Seoul, Korea 🇰🇷',
    descKo: '약 1년간 서비스직으로 근무하며 고객 응대, 팀워크, 압박 상황에서의 문제 해결 능력을 키웠습니다. 이 경험이 현재 데이터 엔지니어로서의 꼼꼼함과 협업 능력의 기반이 되었습니다.',
    descEn: 'Worked in service for approximately one year, developing customer relations, teamwork, and problem-solving under pressure — foundations that now shape my thoroughness and collaboration as a data engineer.',
    tech: ['Communication', 'Teamwork', 'Problem Solving'],
    aiTools: [],
    color: '#39ff14',
    icon: '🍻',
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
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: idx * 0.2 + 0.3 }}
      className={`relative flex items-start gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'} mb-12`}
    >
      {/* Line connector dot */}
      <div className="absolute left-1/2 top-8 -translate-x-1/2 hidden md:flex flex-col items-center">
        <div
          className="w-4 h-4 rounded-full border-2 z-10"
          style={{ borderColor: exp.color, background: '#0a0a0a', boxShadow: `0 0 12px ${exp.color}80` }}
        />
      </div>

      {/* Card */}
      <div className={`md:w-[45%] ${isLeft ? 'md:pr-12' : 'md:pl-12'} w-full`}>
        <motion.div
          whileHover={{ y: -4, boxShadow: `0 20px 60px ${exp.color}20, 0 0 0 1px ${exp.color}30` }}
          className="glass rounded-2xl p-6 transition-all duration-300 cursor-default"
          style={{ borderColor: exp.color + '20' }}
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
      </div>

      {/* Spacer for opposite side */}
      <div className="hidden md:block md:w-[45%]" />
    </motion.div>
  )
}

interface ExperienceProps { lang: 'ko' | 'en' }

export default function Experience({ lang }: ExperienceProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="experience" ref={ref} className="py-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto w-full">
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
    </section>
  )
}
