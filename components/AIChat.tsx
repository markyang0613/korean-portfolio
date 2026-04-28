'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const QA_KO: Array<{ q: string[]; a: string }> = [
  {
    q: ['프로젝트', '어떤 프로젝트'],
    a: '주요 프로젝트는 세 가지입니다! 1️⃣ 배터리 제조 클라우드 데이터 파이프라인 (EC2 + S3 + Snowflake + Google Gemma API), 2️⃣ 학생 데이터 분석 대시보드 (Python + Tableau), 3️⃣ 이 포트폴리오 웹사이트 (Next.js + Three.js + Claude AI). 특히 배터리 파이프라인에서 AI 기반 품질 검사 시스템을 구현했어요 🔋',
  },
  {
    q: ['강점', '잘하는 것', '잘하는'],
    a: '제 강점은 세 가지입니다: ① AI 네이티브 사고방식 — Claude, ChatGPT, Cursor를 개발의 핵심으로 사용해 생산성을 극대화합니다. ② 클라우드 파이프라인 설계 능력 — AWS 서비스들을 실무에서 직접 연동해봤습니다. ③ 데이터 엔지니어링 + 분석의 융합 — 파이프라인 구축부터 인사이트 도출까지 전 과정을 커버합니다 💪',
  },
  {
    q: ['데이터 엔지니어링', '왜 데이터'],
    a: 'UC Berkeley에서 데이터사이언스를 공부하면서 "데이터를 잘 분석하는 것"보다 "데이터가 잘 흐르게 만드는 것"이 더 임팩트가 크다는 걸 깨달았습니다. LSP USA에서 배터리 공정 데이터 파이프라인을 구축하며 확신을 얻었어요. 데이터 엔지니어링은 AI 시대의 인프라를 만드는 일입니다 🚀',
  },
  {
    q: ['UC Berkeley', 'berkeley', '버클리', '학교'],
    a: 'UC Berkeley 데이터사이언스 학사를 졸업했습니다! 캘리포니아 버클리 캠퍼스에서 머신러닝, 통계학, 데이터베이스, 알고리즘 등을 공부했어요. 전통적인 명문대 교육에 AI 도구를 융합한 실무 중심의 엔지니어로 성장했습니다 🐻',
  },
  {
    q: ['aws', 'snowflake', '클라우드', '기술'],
    a: '주요 기술 스택입니다: 클라우드 — AWS (S3, Glue, Redshift, EC2), Snowflake. 언어 — Python (90%), SQL (88%), JavaScript. AI/ML — Google Gemma API, LLM Integration, Prompt Engineering. 데이터 엔지니어링 — ETL Pipeline, Apache Spark, dbt. 도구 — Git, Docker, Tableau ⚙️',
  },
  {
    q: ['연락', '연락처', '이메일', '이메일 주소'],
    a: '연락하고 싶으시면 myang7736@gmail.com으로 이메일 주세요! GitHub는 github.com/markyang0613에서 코드를 볼 수 있습니다. 서울과 오클랜드를 오가며 활동하고 있어요 📧',
  },
  {
    q: ['ai', '인공지능', 'claude', '어떤 ai'],
    a: '매일 사용하는 AI 도구들: Claude (메인 코딩 파트너), ChatGPT (아이디어 브레인스토밍), Cursor (AI IDE), GitHub Copilot (코드 자동완성), Gemini (멀티모달 분석), Perplexity (리서치). AI를 단순 도구가 아닌 개발 파트너로 활용하는 AI 네이티브 엔지니어입니다 🤖',
  },
  {
    q: ['채용', '취업', '구직', '일자리'],
    a: '네, 현재 데이터 엔지니어 포지션을 찾고 있습니다! 클라우드 데이터 파이프라인, ETL 시스템, AI 통합 프로젝트에 특히 관심이 있습니다. 한국과 미국 양쪽 기회에 열려 있어요. 이력서는 상단의 PDF 버튼으로 다운로드 가능합니다 ✨',
  },
  {
    q: ['경력', '경험', '회사'],
    a: '주요 경력: 1) LSP USA — 배터리 제조 데이터 파이프라인 구축 (클라우드 + AI 활용). 2) Oakland Natives Give Back — 비영리 데이터 분석 인턴. 3) Avellino Lab — CNN·Vision Transformer로 안암 예측 모델 개발 (88% 정확도). 각 경험이 현재의 제 역량을 만들었습니다 💼',
  },
  {
    q: ['취미', '관심사', '좋아하는 것'],
    a: '데이터와 AI 외에도: 새로운 AI 도구 탐구하기 (얼리어답터!), 한국 야구 관람, 새로운 기술 블로그 읽기, 오픈소스 기여 등을 즐깁니다. 그리고 당연히... 커피 ☕ 없이는 파이프라인도 없습니다!',
  },
]

const QA_EN: Array<{ q: string[]; a: string }> = [
  {
    q: ['project', 'what have you built', 'work'],
    a: "Three main projects: 1️⃣ Battery Manufacturing Cloud Data Pipeline (EC2 + S3 + Snowflake + Google Gemma API), 2️⃣ Student Analytics Dashboard (Python + Tableau), 3️⃣ This portfolio website (Next.js + Three.js + Claude AI). The battery pipeline is especially exciting — AI-powered quality inspection! 🔋",
  },
  {
    q: ['strength', 'strong', 'good at'],
    a: 'Three core strengths: ① AI-native mindset — Claude, ChatGPT, Cursor are at the center of my workflow, maximizing productivity. ② Cloud pipeline design — hands-on experience connecting real AWS services. ③ Full-stack data — from pipeline architecture to insight generation 💪',
  },
  {
    q: ['data engineering', 'why data'],
    a: 'At UC Berkeley, I realized that making data flow correctly matters more than analyzing it well. Building the battery manufacturing pipeline at LSP USA cemented that. Data engineering is infrastructure for the AI era 🚀',
  },
  {
    q: ['contact', 'email', 'reach you'],
    a: 'Reach me at myang7736@gmail.com, or check my code at github.com/markyang0613. I split time between Seoul, Korea 🇰🇷 and Oakland, CA 🇺🇸 📧',
  },
  {
    q: ['skills', 'tech', 'stack', 'tools'],
    a: 'Tech stack: Cloud — AWS (S3, Glue, Redshift, EC2), Snowflake. Languages — Python (90%), SQL (88%), JavaScript. AI/ML — Google Gemma API, LLM Integration, Prompt Engineering. Data Eng — ETL, Spark, dbt. Tools — Git, Docker, Tableau ⚙️',
  },
  {
    q: ['berkeley', 'school', 'education', 'degree'],
    a: "B.S. Data Science from UC Berkeley! Studied ML, statistics, databases, and algorithms. Combined that rigorous foundation with aggressive AI tool adoption to become the AI-native engineer I am today 🐻",
  },
  {
    q: ['ai', 'artificial intelligence', 'claude'],
    a: 'Daily AI stack: Claude (main coding partner), ChatGPT (brainstorming), Cursor (AI IDE), GitHub Copilot (autocomplete), Gemini (multimodal), Perplexity (research). I treat AI as a co-engineer, not just a tool 🤖',
  },
  {
    q: ['hire', 'job', 'open', 'available'],
    a: "Yes, I'm actively seeking Data Engineer roles! Especially interested in cloud data pipelines, ETL systems, and AI-integration projects. Open to both Korean and US opportunities. Download my resume via the PDF button above ✨",
  },
]

function getBotResponse(input: string, lang: 'ko' | 'en'): string {
  const lower = input.toLowerCase()
  const qa = lang === 'ko' ? QA_KO : QA_EN

  for (const item of qa) {
    if (item.q.some(k => lower.includes(k))) {
      return item.a
    }
  }

  return lang === 'ko'
    ? '좋은 질문이에요! 더 구체적으로 물어봐 주세요 😊 예: "어떤 프로젝트를 했나요?", "AWS 경험이 있나요?", "연락처가 어떻게 되나요?" 등을 물어볼 수 있어요!'
    : "Good question! Try asking something like: 'What projects have you built?', 'What are your strengths?', 'How can I contact you?' — I know quite a bit about Mark 😊"
}

const SUGGESTED_KO = ['어떤 프로젝트를 했나요?', '강점이 뭔가요?', 'AI 도구 뭐 써요?', '연락처 알려주세요']
const SUGGESTED_EN = ['What projects did you build?', 'What are your strengths?', 'What AI tools do you use?', 'How do I contact you?']

interface Message {
  role: 'user' | 'bot'
  text: string
  ts: number
}

interface AIChatProps { lang: 'ko' | 'en' }

export default function AIChat({ lang }: AIChatProps) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: lang === 'ko'
        ? '안녕하세요! 저는 양준서에 대해 뭐든 알고 있는 AI 어시스턴트입니다 🤖 궁금한 점을 자유롭게 물어보세요!'
        : "Hi! I'm an AI assistant who knows everything about Mark (Yang Joon-seo) 🤖 Ask me anything!",
      ts: Date.now(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const suggested = lang === 'ko' ? SUGGESTED_KO : SUGGESTED_EN

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { role: 'user', text: text.trim(), ts: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      const response = getBotResponse(text, lang)
      setMessages(prev => [...prev, { role: 'bot', text: response, ts: Date.now() }])
      setIsTyping(false)
    }, 800 + Math.random() * 600)
  }

  return (
    <section id="ai-chat" ref={ref} className="w-full py-24">
      <div className="section-inner">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="text-center mb-10"
      >
        <span className="font-mono text-[#00f5ff] text-sm tracking-widest uppercase">
          {lang === 'ko' ? '인터랙티브' : 'Interactive'}
        </span>
        <h2 className="text-4xl sm:text-5xl font-bold mt-2">
          {lang === 'ko' ? '궁금한 게 있으시면 물어보세요 🤖' : 'Ask Me Anything 🤖'}
        </h2>
        <div className="mt-3 h-0.5 w-20 bg-gradient-to-r from-[#00f5ff] to-[#7c3aed] mx-auto" />
        <p className="text-gray-500 text-sm mt-4">
          {lang === 'ko'
            ? '양준서에 대해 무엇이든 물어보세요 — AI 어시스턴트가 답변합니다'
            : 'Ask anything about Yang Joon-seo — the AI assistant will answer'}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="glass-dark rounded-3xl overflow-hidden"
        style={{ border: '1px solid rgba(0,245,255,0.15)' }}
      >
        {/* Chat header bar */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="text-xs font-mono text-gray-500">
              {lang === 'ko' ? 'YJS AI 어시스턴트' : 'YJS AI Assistant'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#39ff14]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#39ff14] animate-pulse" />
            {lang === 'ko' ? '온라인' : 'Online'}
          </div>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-6 space-y-4 flex flex-col">
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.ts}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}
              >
                {msg.role === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00f5ff] to-[#7c3aed] flex items-center justify-center text-sm flex-shrink-0 mt-1">
                    🤖
                  </div>
                )}
                <div
                  className={`max-w-[80%] text-sm leading-relaxed ${
                    msg.role === 'user' ? 'chat-bubble-user text-white' : 'chat-bubble-bot text-gray-200'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00f5ff] to-[#7c3aed] flex items-center justify-center text-sm flex-shrink-0">
                  🤖
                </div>
                <div className="chat-bubble-bot flex gap-1 items-center">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      className="w-1.5 h-1.5 rounded-full bg-[#00f5ff]"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        {/* Suggested questions */}
        <div className="px-6 py-3 border-t border-white/5 flex gap-2 flex-wrap">
          {suggested.map(q => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-[#00f5ff]/10 hover:border-[#00f5ff]/30 border border-transparent transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-white/5">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder={lang === 'ko' ? '질문을 입력하세요...' : 'Type your question...'}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#00f5ff]/50 transition-all"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="px-5 py-3 rounded-xl bg-[#00f5ff] text-black font-bold text-sm hover:bg-[#00c4cc] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              →
            </button>
          </div>
        </div>
      </motion.div>
      </div>
    </section>
  )
}
