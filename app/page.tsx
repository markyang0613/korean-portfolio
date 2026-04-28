'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Skills from '@/components/Skills'
import Experience from '@/components/Experience'
import Projects from '@/components/Projects'
import Education from '@/components/Education'
import AIChat from '@/components/AIChat'
import Contact from '@/components/Contact'
import CustomCursor from '@/components/ui/CustomCursor'
import ScrollProgress from '@/components/ui/ScrollProgress'
import KonamiEgg from '@/components/ui/KonamiEgg'

export default function Page() {
  const [lang, setLang] = useState<'ko' | 'en'>('ko')

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <KonamiEgg />

      <Navbar
        lang={lang}
        onLangToggle={() => setLang(l => l === 'ko' ? 'en' : 'ko')}
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
    </>
  )
}
