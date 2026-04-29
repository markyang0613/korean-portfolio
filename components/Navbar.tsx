'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { downloadResumePDF, printPortfolioAsPDF } from '@/lib/pdfExport'

const navItems = [
  { label: '소개', en: 'About', href: '#about' },
  { label: '기술', en: 'Skills', href: '#skills' },
  { label: '경력', en: 'Experience', href: '#experience' },
  { label: '프로젝트', en: 'Projects', href: '#projects' },
  { label: '학력', en: 'Education', href: '#education' },
  { label: 'AI 챗', en: 'AI Chat', href: '#ai-chat' },
  { label: '연락', en: 'Contact', href: '#contact' },
]

interface NavbarProps {
  lang: 'ko' | 'en'
  onLangToggle: () => void
}

export default function Navbar({ lang, onLangToggle }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showPrintTip, setShowPrintTip] = useState(false)

  const handlePortfolioPDF = () => {
    setShowPrintTip(true)

    /**
     * Framer Motion keeps elements in their `initial` state (opacity:0,
     * transform:translateX(-40px), or layout-computed width:0px) for
     * sections the user hasn't scrolled to.  CSS !important can override
     * transform/opacity but NOT inline `width`/`height` set by FM's layout
     * feature — those cause text to wrap character-by-character.
     *
     * The `beforeprint` event fires synchronously right before the browser
     * captures the DOM snapshot.  We strip every inline animation property
     * here so @media print CSS (not FM) owns the layout.
     */
    const clearFMStyles = () => {
      document.querySelectorAll<HTMLElement>('*').forEach(el => {
        const s = el.style
        if (s.transform)                      s.transform  = ''
        if (s.opacity)                        s.opacity    = ''
        if (s.width  && s.width.includes('px'))  s.width  = ''
        if (s.height && s.height.includes('px')) s.height = ''
        if (s.visibility)                     s.visibility = ''
      })
    }

    window.addEventListener('beforeprint', clearFMStyles, { once: true })

    setTimeout(() => {
      setShowPrintTip(false)
      printPortfolioAsPDF()
    }, 1800)
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const sections = navItems.map(n => n.href.replace('#', ''))
      for (const id of sections.reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActive(id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href: string) => {
    const id = href.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass-dark py-3' : 'py-5'
        }`}
      >
        <div className="section-inner flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-bold text-2xl font-mono"
          >
            <span className="gradient-text">YJS</span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active === item.href.replace('#', '')
                    ? 'text-[#00f5ff] bg-[#00f5ff]/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {lang === 'ko' ? item.label : item.en}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Lang toggle */}
            <button
              onClick={onLangToggle}
              className="px-3 py-1.5 rounded-lg text-xs font-mono border border-[#00f5ff]/30 text-[#00f5ff] hover:bg-[#00f5ff]/10 transition-all"
            >
              {lang === 'ko' ? 'EN' : 'KO'}
            </button>

            {/* Resume PDF */}
            <button
              onClick={downloadResumePDF}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#00f5ff] text-[#00f5ff] text-sm font-medium hover:bg-[#00f5ff] hover:text-black transition-all duration-200 glow-cyan"
            >
              <span>📄</span>
              <span>{lang === 'ko' ? '이력서' : 'Resume'}</span>
            </button>

            {/* Portfolio PDF Save */}
            <button
              onClick={handlePortfolioPDF}
              disabled={showPrintTip}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#7c3aed] text-[#a855f7] text-sm font-medium hover:bg-[#7c3aed] hover:text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-wait"
            >
              <span>📥</span>
              <span>{lang === 'ko' ? '저장' : 'Save PDF'}</span>
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white"
            >
              <div className="w-5 flex flex-col gap-1">
                <span className={`h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[60px] left-0 right-0 z-40 glass-dark border-b border-white/10 md:hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {navItems.map(item => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className="text-left px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  {lang === 'ko' ? item.label : item.en}
                </button>
              ))}
              <button
                onClick={downloadResumePDF}
                className="mt-2 px-4 py-3 rounded-lg border border-[#00f5ff] text-[#00f5ff] text-center font-medium"
              >
                📄 {lang === 'ko' ? '이력서 PDF 다운로드' : 'Download Resume PDF'}
              </button>
              <button
                onClick={() => { setMenuOpen(false); handlePortfolioPDF() }}
                disabled={showPrintTip}
                className="px-4 py-3 rounded-lg border border-[#7c3aed] text-[#a855f7] text-center font-medium disabled:opacity-60"
              >
                📥 {lang === 'ko' ? '포트폴리오 PDF 저장' : 'Save Portfolio as PDF'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Print tip toast — appears for 1.8s before print dialog opens */}
      <AnimatePresence>
        {showPrintTip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] print:hidden"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className="flex items-start gap-3 px-5 py-4 rounded-2xl text-sm max-w-sm"
              style={{
                background: 'rgba(13,17,23,0.97)',
                border: '1px solid rgba(124,58,237,0.5)',
                boxShadow: '0 8px 40px rgba(124,58,237,0.25)',
              }}
            >
              <span className="text-xl flex-shrink-0">💡</span>
              <div>
                <div className="font-semibold text-white mb-1">
                  {lang === 'ko' ? '인쇄 창이 곧 열립니다' : 'Print dialog opening soon'}
                </div>
                <div className="text-gray-400 text-xs leading-relaxed">
                  {lang === 'ko'
                    ? '다크 테마를 유지하려면 인쇄 설정에서 "배경 그래픽(Background graphics)"을 활성화해주세요.'
                    : 'Enable "Background graphics" in print settings to preserve the dark theme.'}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
