'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Education from '@/components/Education'
import AIChat from '@/components/AIChat'
import Contact from '@/components/Contact'
import PDFResume from '@/components/PDFResume'
import CustomCursor from '@/components/ui/CustomCursor'
import ScrollProgress from '@/components/ui/ScrollProgress'
import KonamiEgg from '@/components/ui/KonamiEgg'

export default function Page() {
  const [lang, setLang] = useState<'ko' | 'en'>('ko')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    }
  }, [theme])

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <KonamiEgg />

      <Navbar
        lang={lang}
        onLangToggle={() => setLang(l => l === 'ko' ? 'en' : 'ko')}
        theme={theme}
        onThemeToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />

      <main className="w-full">
        <Hero lang={lang} />
        <About lang={lang} />
        <Skills lang={lang} />
        <Experience lang={lang} />
        <Projects lang={lang} />
        <Education lang={lang} />
        <AIChat lang={lang} />
        <Contact lang={lang} />
      </main>

      <PDFResume />
    </>
  )
}
