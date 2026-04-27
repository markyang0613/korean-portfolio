import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '양준서 | 데이터 엔지니어 포트폴리오',
  description: 'UC Berkeley 데이터사이언스 졸업생, AI 네이티브 데이터 엔지니어 양준서의 포트폴리오입니다. 클라우드 데이터 파이프라인, ETL, AI/ML 도구 전문.',
  keywords: ['데이터 엔지니어', 'Data Engineer', 'UC Berkeley', '양준서', 'Mark Yang', 'AWS', 'Snowflake', 'Python', 'AI'],
  authors: [{ name: '양준서 (Mark Yang)' }],
  openGraph: {
    title: '양준서 | AI 네이티브 데이터 엔지니어',
    description: 'UC Berkeley 데이터사이언스 · 클라우드 파이프라인 · AI 도구 전문가',
    type: 'website',
    locale: 'ko_KR',
    siteName: '양준서 포트폴리오',
  },
  twitter: {
    card: 'summary_large_image',
    title: '양준서 | 데이터 엔지니어',
    description: 'UC Berkeley 데이터사이언스 · 클라우드 파이프라인 · AI 도구 전문가',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
