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
    github: null,
    color: '#00f5ff',
    icon: '🔋',
    highlights: ['AI 품질 검사 자동화', '실시간 데이터 처리', 'S3 → Snowflake 파이프라인'],
  },
  {
    id: 2,
    title: 'Student Analytics Dashboard',
    titleKo: '학생 데이터 분석 대시보드',
    category: 'data-engineering',
    categoryLabel: '데이터엔지니어링',
    size: 'medium',
    descKo: '비영리 교육 기관 Oakland Natives Give Back의 학생 성과 데이터를 시각화하는 인터랙티브 대시보드. Python으로 데이터를 정제하고 Tableau로 핵심 지표를 시각화하여 교육 프로그램 개선에 기여했습니다.',
    descEn: 'Interactive dashboard visualizing student performance data for Oakland Natives Give Back nonprofit. Python-powered data cleaning and Tableau visualization to drive educational program improvements.',
    tech: ['Python', 'SQL', 'BigQuery', 'Tableau', 'Pandas', 'Data Analysis'],
    aiUsage: 70,
    github: null,
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
    descKo: '현재 보고 계신 이 포트폴리오 사이트입니다! Next.js 16, Three.js, Framer Motion으로 구축된 AI 네이티브 포트폴리오. Claude AI와 함께 전체 설계 및 구현했습니다.',
    descEn: "The very site you're viewing! AI-native portfolio built with Next.js 16, Three.js, and Framer Motion. Designed and implemented entirely with Claude AI as a co-engineer.",
    tech: ['Next.js', 'TypeScript', 'Three.js', 'Framer Motion', 'Tailwind CSS'],
    aiUsage: 99,
    github: 'https://github.com/markyang0613/korean-portfolio',
    color: '#39ff14',
    icon: '🌐',
    highlights: ['Three.js 파티클 시스템', 'AI 챗봇 내장', '한/영 이중 언어'],
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
    github: null,
    color: '#f59e0b',
    icon: '⚙️',
    highlights: ['자동화 스케줄링', 'AWS Glue 연동'],
  },
  {
    id: 5,
    title: 'Severe Chronic Absenteeism Prediction',
    titleKo: '만성 결석 예측 AI 모델',
    category: 'ai',
    categoryLabel: 'AI',
    size: 'medium',
    descKo: '학교 내 심각한 만성 결석(SCA)의 핵심 예측 변수를 분석하고, 학생 출석률을 6% 이상 높이기 위한 데이터 기반 개입 방안을 설계했습니다. 머신러닝 모델로 위험군 학생을 조기 탐지합니다.',
    descEn: 'Identified key predictors of severe chronic absenteeism (SCA) in schools and designed data-driven interventions to boost student attendance by at least 6%. ML model for early-stage risk detection.',
    tech: ['Python', 'Machine Learning', 'Data Analysis', 'scikit-learn'],
    aiUsage: 78,
    github: 'https://github.com/markyang0613/Severe_Chronic_Absenteeism',
    color: '#a855f7',
    icon: '🎓',
    highlights: ['위험군 조기 탐지', '출석률 6%+ 개선 목표', 'ML 기반 분류'],
  },
  {
    id: 6,
    title: 'Most Streamed Songs 2024 Analysis',
    titleKo: '2024년 최다 스트리밍 음악 분석',
    category: 'data',
    categoryLabel: '데이터분석',
    size: 'small',
    descKo: '200개 이상의 고유 변수로 구성된 트렌드 곡 사용자 인터랙션 데이터셋을 생성하여 음악 마케터들의 캠페인 설계에 실질적인 인사이트를 제공했습니다.',
    descEn: 'Generated an original dataset of 200+ unique variables on user interactions with trending songs, directly influencing campaign design decisions for music marketers.',
    tech: ['Python', 'Data Analysis', 'Pandas', 'Music Analytics'],
    aiUsage: 65,
    github: 'https://github.com/joonseoyang/most_streamed_songs2024',
    color: '#00f5ff',
    icon: '🎵',
    highlights: ['200+ 변수 데이터셋', '마케팅 인사이트 도출'],
  },
  {
    id: 7,
    title: 'AI Tradebot',
    titleKo: 'AI 트레이딩 봇',
    category: 'ai',
    categoryLabel: 'AI',
    size: 'medium',
    descKo: '뉴스 기사의 감성 분석을 통해 주식 거래 결정을 자동화하는 ML 알고리즘. Alpaca 페이퍼 트레이딩 플랫폼에서 FinBERT를 활용한 NLP 기반 매수·매도 신호를 생성합니다.',
    descEn: 'ML algorithm automating stock trading decisions via sentiment analysis on news articles. Uses FinBERT NLP on Alpaca paper trading platform to generate buy/sell signals.',
    tech: ['Python', 'NLP', 'FinBERT', 'Machine Learning', 'Alpaca API'],
    aiUsage: 90,
    github: 'https://github.com/joonseoyang/Tradebot',
    color: '#39ff14',
    icon: '📈',
    highlights: ['FinBERT 감성 분석', '자동 매수·매도 신호', 'Alpaca 페이퍼 트레이딩'],
  },
  {
    id: 8,
    title: 'Food Safety Analysis',
    titleKo: 'SF 식품 안전 분석',
    category: 'data',
    categoryLabel: '데이터분석',
    size: 'small',
    descKo: 'SF 공중보건부 데이터를 활용해 샌프란시스코 레스토랑의 식품 안전 점수를 분석했습니다. Pandas 기반 데이터 정제 및 EDA에 중점을 두었습니다.',
    descEn: 'Investigated restaurant food safety scores in San Francisco using SF Dept of Public Health data, focusing on data cleaning and exploratory data analysis with Pandas.',
    tech: ['Python', 'Pandas', 'Data Analysis', 'EDA'],
    aiUsage: 55,
    github: 'https://github.com/markyang0613/Food-Safety',
    color: '#f59e0b',
    icon: '🍽️',
    highlights: ['공공 데이터 EDA', '데이터 정제 파이프라인'],
  },
  {
    id: 9,
    title: 'Electronics Sales Analysis',
    titleKo: '전자제품 판매 데이터 분석',
    category: 'data',
    categoryLabel: '데이터분석',
    size: 'medium',
    descKo: '12개월치 전자제품 매장 판매 데이터를 Python으로 분석해 핵심 비즈니스 질문에 답했습니다. 수십만 건의 구매 기록을 처리하여 시간대별 트렌드, 상품 번들 패턴, 지역별 매출을 도출했습니다.',
    descEn: 'Analyzed 12 months of electronics store sales data using Python Pandas & Matplotlib to answer key business questions, processing hundreds of thousands of purchase records for trend and revenue insights.',
    tech: ['Python', 'Pandas', 'Matplotlib', 'Data Analysis'],
    aiUsage: 60,
    github: 'https://github.com/markyang0613/Sales-Analysis',
    color: '#7c3aed',
    icon: '🛒',
    highlights: ['12개월 판매 트렌드', '지역별 매출 분석', '상품 번들 패턴'],
  },
  {
    id: 10,
    title: 'LLM Spam-Ham Classifier',
    titleKo: 'LLM 스팸 분류기',
    category: 'ai',
    categoryLabel: 'AI',
    size: 'small',
    descKo: 'ChatGPT-3.5 Turbo를 활용해 추가 파인튜닝 없이 고도화된 언어 이해력으로 스팸/햄 메시지를 분류하는 LLM 기반 분류기를 개발했습니다.',
    descEn: 'Developed a spam/ham classifier using ChatGPT-3.5 Turbo, leveraging advanced language understanding for accurate message classification without additional fine-tuning.',
    tech: ['Python', 'OpenAI API', 'NLP', 'LLM', 'Prompt Engineering'],
    aiUsage: 95,
    github: 'https://github.com/markyang0613/LLM_SpamHamClassifier',
    color: '#00f5ff',
    icon: '🤖',
    highlights: ['파인튜닝 없는 LLM 분류', 'GPT-3.5 Turbo 활용'],
  },
  {
    id: 11,
    title: 'Marketplace Analytics Dashboard',
    titleKo: '마켓플레이스 지표 분석 대시보드',
    category: 'data',
    categoryLabel: '데이터분석',
    size: 'large',
    descKo: '로컬 마켓플레이스의 건강 지표(GMV, 전환율, 리텐션)를 BigQuery로 집계하고 Looker Studio로 시각화한 분석 대시보드. 이상 탐지 알고리즘으로 지표 이상 징후를 자동 감지합니다.',
    descEn: 'Analytics dashboard aggregating local marketplace health metrics (GMV, conversion rate, retention) with BigQuery and Looker Studio. Automated anomaly detection for key KPI monitoring.',
    tech: ['BigQuery', 'Python', 'Looker Studio', 'SQL', 'Data Analysis'],
    aiUsage: 85,
    github: null,
    color: '#39ff14',
    icon: '📈',
    highlights: ['BigQuery SQL 집계 파이프라인', '핵심 마켓플레이스 KPI 추적', '이상 탐지 자동화'],
  },
]

const filterTabs = [
  { id: 'all', label: '전체', en: 'All' },
  { id: 'data-engineering', label: '데이터엔지니어링', en: 'Data Engineering' },
  { id: 'data', label: '데이터분석', en: 'Data Analysis' },
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
        {project.github ? (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors flex-shrink-0 text-sm"
          >
            GitHub ↗
          </a>
        ) : (
          <span className="text-xs px-2 py-1 rounded-md bg-white/5 text-gray-600 flex-shrink-0">
            🚧 준비 중
          </span>
        )}
      </div>

      {/* Status badge */}
      {'badge' in project && project.badge && (
        <span className="self-start text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-500 font-mono">
          🚧 {project.badge}
        </span>
      )}

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

      {/* AI usage */}
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
    <section id="projects" ref={ref} className="w-full py-24">
      <div className="section-inner">
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
      </div>
    </section>
  )
}
