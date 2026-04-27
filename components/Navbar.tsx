'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { downloadResumePDF } from '@/lib/pdfExport'

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
  theme: 'dark' | 'light'
  onThemeToggle: () => void
}

export default function Navbar({ lang, onLangToggle, theme, onThemeToggle }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

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
            {/* Theme toggle */}
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm"
              title="테마 변경"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Lang toggle */}
            <button
              onClick={onLangToggle}
              className="px-3 py-1.5 rounded-lg text-xs font-mono border border-[#00f5ff]/30 text-[#00f5ff] hover:bg-[#00f5ff]/10 transition-all"
            >
              {lang === 'ko' ? 'EN' : 'KO'}
            </button>

            {/* PDF Button */}
            <button
              onClick={downloadResumePDF}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#00f5ff] text-[#00f5ff] text-sm font-medium hover:bg-[#00f5ff] hover:text-black transition-all duration-200 glow-cyan"
            >
              <span>📄</span>
              <span>{lang === 'ko' ? '이력서' : 'Resume'}</span>
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
