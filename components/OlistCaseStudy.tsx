'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Static data ──────────────────────────────────────────────────────────── */

const AARRR = [
  { stage: 'Acquisition', ko: '획득',   value: '96,096',  labelKo: '총 주문 수',      labelEn: 'Total Orders',       color: '#00f5ff', problem: false },
  { stage: 'Activation',  ko: '활성화', value: '78%',     labelKo: '첫 구매 완료율',  labelEn: '1st Purchase Rate',  color: '#7c3aed', problem: false },
  { stage: 'Retention',   ko: '리텐션', value: '3.12%',   labelKo: '90일 재구매율',   labelEn: '90-day Re-purchase', color: '#ef4444', problem: true  },
  { stage: 'Revenue',     ko: '매출',   value: 'R$13.6M', labelKo: '총 거래액(GMV)',  labelEn: 'Total GMV',          color: '#39ff14', problem: false },
  { stage: 'Referral',    ko: '추천',   value: '4.1★',    labelKo: '평균 리뷰 점수',  labelEn: 'Avg Review Score',   color: '#f59e0b', problem: false },
]

const RESULT_STATS = [
  { labelKo: '시뮬레이션 전', labelEn: 'Before',          value: '3.91',    subKo: '평균 감성 점수',  subEn: 'Avg sentiment',      color: '#ef4444' },
  { labelKo: '시뮬레이션 후', labelEn: 'After',           value: '4.54',    subKo: '최적화 예측치',   subEn: 'Optimized est.',     color: '#22c55e' },
  { labelKo: '감성 향상',     labelEn: 'Sentiment Lift',  value: '+16%',    subKo: 'p = 0.0003',      subEn: 'p = 0.0003',         color: '#f59e0b' },
  { labelKo: '통계 유의성',   labelEn: 'Significance',    value: 'p<0.001', subKo: 'H₀ 기각 ✅',       subEn: 'Reject H₀ ✅',       color: '#00f5ff' },
]

const ACTION_ITEMS = [
  {
    no: '01', color: '#00f5ff',
    titleKo: '빠른 배송 셀러 검색 우선 노출',
    titleEn: 'Surface Fast-Shipping Sellers in Search',
    descKo:  '배송 12일 이하 셀러를 검색 결과 상위 노출하여 플랫폼 전반의 배송 품질과 고객 만족도를 개선합니다.',
    descEn:  'Rank <12-day delivery sellers higher in search to lift platform-wide delivery quality and customer satisfaction.',
    impactKo: '리텐션 +2~3%p 예상', impactEn: '+2–3%p Retention',
    diffKo:   '구현 용이 (Quick Win)', diffEn: 'Quick Win',
  },
  {
    no: '02', color: '#f59e0b',
    titleKo: '고지연 물류사 대상 실제 A/B 실험 설계',
    titleEn: 'Design Live A/B Test: Carrier Replacement',
    descKo:  'SP 주 배송 20일+ 발생 물류사를 교체하는 실제 A/B 실험을 설계합니다. 시뮬레이션 결과를 실제 운영에서 검증하여 확신을 높입니다.',
    descEn:  'Design a live experiment replacing carriers causing >20-day delays in SP state. Validate the simulation hypothesis in production before full rollout.',
    impactKo: '감성 +16%, 부정 리뷰 -23%p', impactEn: '+16% Sentiment, -23%p Neg Reviews',
    diffKo:   '중기 실험 (4~8주)',             diffEn:   'Mid-term (4–8 weeks)',
  },
  {
    no: '03', color: '#a855f7',
    titleKo: '배송 지연 예측 기반 선제적 커뮤니케이션',
    titleEn: 'Proactive ETA Alerts via Delay Prediction',
    descKo:  '지연 예측 ML 모델로 20일+ 예상 주문에 사전 알림을 발송, 고객 이탈 및 1-star 리뷰를 선제적으로 방지합니다.',
    descEn:  'Deploy a delay prediction model to proactively alert customers when >20-day delivery is predicted, preventing churn before it happens.',
    impactKo: '1-star 리뷰 -15%p',  impactEn: '-15%p 1-star Rate',
    diffKo:   'ML 파이프라인 구축', diffEn:   'ML Pipeline',
  },
]

const SQL_CODE = `-- ================================================================
-- Medallion Architecture: Silver → Gold Layer
-- 물류 퍼널 분석 | Logistics Funnel & Retention KPI Analysis
-- KPI: 배송 지연 구간 × 리뷰 점수 × 리텐션 정량화
-- ================================================================
WITH order_funnel AS (
  SELECT
    o.order_id,
    o.customer_id,
    c.customer_state,
    -- 핵심 KPI: 실제 배송 소요일
    DATE_DIFF('day',
      o.order_purchase_timestamp,
      o.order_delivered_customer_date
    )::INTEGER                           AS delivery_days,
    r.review_score,
    -- AARRR Retention proxy: 90일 내 재구매 여부
    CASE WHEN EXISTS (
      SELECT 1 FROM silver.orders o2
      WHERE  o2.customer_id  =  o.customer_id
        AND  o2.order_id    !=  o.order_id
        AND  o2.order_purchase_timestamp
               BETWEEN o.order_purchase_timestamp
                   AND o.order_purchase_timestamp
                         + INTERVAL 90 DAY
    ) THEN 1 ELSE 0 END                  AS is_retained
  FROM   silver.orders          o
  JOIN   silver.customers       c USING (customer_id)
  LEFT JOIN silver.order_reviews r USING (order_id)
  WHERE  o.order_status = 'delivered'
    AND  o.order_delivered_customer_date IS NOT NULL
),
tiered AS (
  SELECT *,
    CASE
      WHEN delivery_days <  12 THEN 'fast'    -- 🟢 < 12d
      WHEN delivery_days <= 20 THEN 'normal'  -- 🟡 12–20d
      ELSE                          'slow'    -- 🔴 > 20d
    END AS delivery_tier
  FROM order_funnel
)
-- Gold Layer: KPI 집계 테이블
SELECT
  delivery_tier,
  COUNT(*)                                               AS order_count,
  ROUND(AVG(delivery_days),  1)                         AS avg_delivery_days,
  ROUND(AVG(review_score),   2)                         AS avg_review_score,
  ROUND(100.0 * SUM(is_retained)     / COUNT(*), 2)    AS retention_rate_pct,
  ROUND(100.0 * SUM(review_score<=2) / COUNT(*), 1)    AS neg_review_pct
FROM  tiered
GROUP BY delivery_tier
ORDER BY
  CASE delivery_tier
    WHEN 'fast' THEN 1 WHEN 'normal' THEN 2 ELSE 3
  END;`

const PYTHON_CODE = `import numpy as np
import pandas as pd
from scipy import stats

np.random.seed(42)

def run_logistics_ab_simulation(
    df: pd.DataFrame,
    state: str = 'SP',
    slow_threshold: int = 20,
    opt_factor: float = 0.55,
) -> dict:
    """
    반사실적(Counterfactual) A/B 시뮬레이션
    Counterfactual A/B Simulation

    가설 검증 | Hypothesis Testing:
      H₀: 배송 최적화는 고지연 지역 리뷰 점수에 영향 없음
      H₁: 배송일 단축 → 감성 점수 유의미 상승  (α = 0.05)

    방법론 | Methodology:
      - 실증 선형 모델: score ≈ 5.2 − 0.08 × delivery_days  (R² = 0.71)
      - 시나리오: 배송일 45% 단축, 상한 12일 클리핑
      - 통계 검정: Welch's t-test (등분산 가정 없음)
    """
    # Control: 고지연 지역 현재 상태
    ctrl = df[
        (df['customer_state'] == state) &
        (df['delivery_days']  >  slow_threshold)
    ].copy()

    # Treatment: 물류 최적화 반사실 시나리오
    trt = ctrl.copy()
    trt['delivery_days_opt'] = (
        ctrl['delivery_days'] * (1 - opt_factor)
    ).clip(upper=12)

    # Silver 레이어에서 피팅된 선형 계수 적용
    trt['review_score_sim'] = (
        5.2 - 0.08 * trt['delivery_days_opt']
    ).clip(lower=1.0, upper=5.0)

    # Welch's t-test (등분산 가정 없음)
    _, p_value = stats.ttest_ind(
        ctrl['review_score'],
        trt['review_score_sim'],
        equal_var=False,
    )
    before = ctrl['review_score'].mean()
    after  = trt['review_score_sim'].mean()

    return {
        'n_orders' : len(ctrl),
        'before'   : round(before, 2),                            # 3.91
        'after'    : round(after,  2),                            # 4.54
        'lift_pct' : round((after - before) / before * 100, 1),  # +16.1%
        'p_value'  : round(p_value, 4),                          # 0.0003
        'reject_h0': p_value < 0.05,                             # True ✅
    }

result = run_logistics_ab_simulation(df_silver)
# → {'n_orders': 12847, 'before': 3.91, 'after': 4.54,
#    'lift_pct': 16.1,  'p_value': 0.0003, 'reject_h0': True}`

/* ─── Sub-components ───────────────────────────────────────────────────────── */

function ChartSection({
  src, label, hint, onImgError, hasError,
}: {
  src: string
  label: string
  hint: string
  onImgError: () => void
  hasError: boolean
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="px-4 py-2 flex items-center gap-2"
           style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <span className="text-xs font-mono text-gray-500">📊 {label}</span>
      </div>

      {hasError ? (
        <div className="flex flex-col items-center justify-center py-14 px-6 text-center"
             style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="text-5xl mb-3 opacity-20">📈</div>
          <div className="text-sm font-mono text-gray-600 mb-1">{hint}</div>
          <div className="text-xs text-gray-700 font-mono">
            Place chart at: /public/images/olist/{hint}
          </div>
        </div>
      ) : (
        <div className="relative" style={{ minHeight: '200px' }}>
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center"
                 style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="flex flex-col items-center gap-2 opacity-30">
                <div className="text-4xl">📈</div>
                <div className="text-xs font-mono text-gray-600">{hint}</div>
              </div>
            </div>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={label}
            onError={onImgError}
            onLoad={() => setLoaded(true)}
            className={`w-full transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ display: 'block' }}
          />
        </div>
      )}
    </div>
  )
}

function CollapsibleCode({
  label, codeLang, code, isOpen, onToggle, onCopy, isCopied, isKo,
}: {
  label: string
  codeLang: string
  code: string
  isOpen: boolean
  onToggle: () => void
  onCopy: () => void
  isCopied: boolean
  isKo: boolean
}) {
  const accentColor = codeLang === 'sql' ? '#00f5ff' : '#a855f7'

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-all hover:bg-white/5"
        style={{ background: 'rgba(255,255,255,0.03)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded font-medium"
                style={{ background: `${accentColor}20`, color: accentColor }}>
            {codeLang.toUpperCase()}
          </span>
          <span className="text-sm text-gray-300">{label}</span>
        </div>
        <span className="text-xs text-gray-600">
          {isOpen
            ? (isKo ? '▲ 접기' : '▲ Collapse')
            : (isKo ? '▼ 펼치기' : '▼ Expand')}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="relative">
              <button
                onClick={onCopy}
                className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded text-xs font-mono transition-all"
                style={{
                  background: isCopied ? '#39ff1420' : 'rgba(255,255,255,0.08)',
                  color: isCopied ? '#39ff14' : '#a1a1aa',
                }}
              >
                {isCopied ? '✓ 복사됨' : '복사'}
              </button>
              <pre
                className="p-4 pr-16 overflow-x-auto text-xs font-mono text-gray-300 leading-relaxed"
                style={{ background: '#060a0f', maxHeight: '440px' }}
              >
                <code>{code}</code>
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Main component ───────────────────────────────────────────────────────── */

interface OlistCaseStudyProps {
  onClose: () => void
  lang: 'ko' | 'en'
}

export default function OlistCaseStudy({ onClose, lang: initLang }: OlistCaseStudyProps) {
  const [lang, setLang] = useState<'ko' | 'en'>(initLang)
  const [showSql, setShowSql] = useState(false)
  const [showPy, setShowPy] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  const isKo = lang === 'ko'

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Escape key to close
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const basePath = process.env.NODE_ENV === 'production' ? '/korean-portfolio' : ''

  const handleCopy = async (code: string, key: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      // clipboard not available in some envs
    }
  }

  return (
    <AnimatePresence>
      {/* Backdrop — click to close */}
      <motion.div
        key="olist-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
        style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)' }}
        onClick={onClose}
      >
        {/* Modal panel — stop propagation */}
        <motion.div
          key="olist-panel"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl"
          style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 120px rgba(0,0,0,0.8)' }}
        >

          {/* ── Sticky header ──────────────────────────────────────── */}
          <div
            className="sticky top-0 z-10 flex items-center justify-between px-5 sm:px-7 py-4"
            style={{
              background: 'rgba(13,17,23,0.96)',
              backdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl flex-shrink-0">📦</span>
              <div className="min-w-0">
                <span
                  className="inline-block text-xs px-2 py-0.5 rounded-full font-mono font-semibold mb-0.5"
                  style={{ background: '#f59e0b20', color: '#f59e0b' }}
                >
                  🎯 {isKo ? '당근 DA 케이스 스터디' : 'Daangn DA Case Study'}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white leading-tight truncate">
                  {isKo
                    ? 'Olist 마켓플레이스: 물류 퍼널 & 리텐션 분석'
                    : 'Olist Marketplace: Logistics Funnel & Retention Analysis'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
              {/* KO / EN toggle */}
              <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                {(['ko', 'en'] as const).map(lng => (
                  <button
                    key={lng}
                    onClick={() => setLang(lng)}
                    className="px-3 py-1 text-xs font-bold transition-all"
                    style={{
                      background: lang === lng ? '#f59e0b' : 'transparent',
                      color: lang === lng ? '#000' : '#6b7280',
                    }}
                  >
                    {lng.toUpperCase()}
                  </button>
                ))}
              </div>
              {/* Close */}
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all text-lg"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* ── Scrollable content ─────────────────────────────────── */}
          <div className="px-5 sm:px-7 pb-12 space-y-10 mt-6">

            {/* ── § Why ──────────────────────────────────────────────── */}
            <section>
              <div className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: '#f59e0b' }}>
                {isKo ? '왜 이 분석인가' : 'Why This Analysis'}
              </div>
              <div
                className="p-5 rounded-xl"
                style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)' }}
              >
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                  {isKo
                    ? '운영 효율화를 통한 유저 경험 개선'
                    : 'Improving User Experience through Operational Efficiency'}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {isKo
                    ? '단순한 배송 지연 문제를 넘어, 리텐션을 저해하는 운영 병목을 데이터로 정량화했습니다. 마켓플레이스의 핵심 성장 지표인 재구매율(Retention)이 3.12%에 불과한 원인을 AARRR 프레임워크로 체계화하고, 반사실적 A/B 시뮬레이션으로 개선 방향을 통계적으로 검증했습니다.'
                    : "Rather than treating delivery delays as a logistics problem, I reframed it as a retention problem — quantifying the exact operational bottleneck suppressing re-purchase rates to just 3.12%. I structured KPIs using the AARRR framework and validated an improvement path through counterfactual A/B simulation."}
                </p>
              </div>
            </section>

            {/* ── § Problem ──────────────────────────────────────────── */}
            <section>
              <div className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: '#ef4444' }}>
                {isKo ? '📌 문제 정의 (Problem)' : '📌 Problem Definition'}
              </div>

              {/* AARRR framework cards */}
              <div className="mb-5">
                <div className="text-sm font-semibold text-gray-300 mb-3">
                  {isKo ? 'KPI 구조화 — AARRR 프레임워크' : 'KPI Structuring — AARRR Framework'}
                </div>
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {AARRR.map(item => (
                    <motion.div
                      key={item.stage}
                      whileHover={{ y: -3 }}
                      className="relative rounded-xl p-2.5 sm:p-3 text-center"
                      style={{
                        background: item.problem ? `${item.color}12` : 'rgba(255,255,255,0.025)',
                        border: `1px solid ${item.color}${item.problem ? '55' : '18'}`,
                        boxShadow: item.problem ? `0 0 24px ${item.color}18` : 'none',
                      }}
                    >
                      {item.problem && (
                        <div
                          className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] font-mono px-1.5 py-0.5 rounded-full whitespace-nowrap"
                          style={{ background: '#ef4444', color: '#fff' }}
                        >
                          {isKo ? '핵심 문제' : 'Core Issue'}
                        </div>
                      )}
                      <div className="text-[9px] sm:text-[10px] font-mono text-gray-600 mb-1">{item.stage}</div>
                      <div className="text-sm sm:text-base font-bold" style={{ color: item.color }}>{item.value}</div>
                      <div className="text-[9px] sm:text-[10px] text-gray-600 mt-0.5 leading-tight">
                        {isKo ? item.labelKo : item.labelEn}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Key findings */}
              <div className="grid sm:grid-cols-3 gap-2.5 mb-6">
                {[
                  {
                    icon: '🔴',
                    ko: '배송 20일 초과 → 1-star 리뷰 집중 (임계점 확인)',
                    en: 'Delivery >20 days → 1-star review spike (threshold confirmed)',
                  },
                  {
                    icon: '🟢',
                    ko: '배송 12일 이하 → 평균 4.5+ 리뷰 유지',
                    en: 'Delivery <12 days → 4.5+ avg review maintained',
                  },
                  {
                    icon: '⚡',
                    ko: '9.3일 평균 운반사 대기 = 최대 병목 지점',
                    en: '9.3-day avg carrier hold = primary bottleneck',
                  },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span className="text-base flex-shrink-0 mt-0.5">{f.icon}</span>
                    <span className="text-xs text-gray-400 leading-relaxed">{isKo ? f.ko : f.en}</span>
                  </div>
                ))}
              </div>

              {/* Chart 1 */}
              <ChartSection
                src={`${basePath}/images/olist/delivery_correlation.png`}
                label={isKo ? '배송 지연 vs 감성 점수 상관관계' : 'Delivery Latency vs Sentiment Score Correlation'}
                hint="delivery_correlation.png"
                onImgError={() => setImgErrors(prev => ({ ...prev, chart1: true }))}
                hasError={!!imgErrors['chart1']}
              />
            </section>

            {/* ── § Action ───────────────────────────────────────────── */}
            <section>
              <div className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: '#00f5ff' }}>
                {isKo ? '🔧 분석 방법 (Action)' : '🔧 Analysis Method (Action)'}
              </div>

              {/* Medallion Architecture diagram */}
              <div className="mb-5">
                <div className="text-sm font-semibold text-gray-300 mb-3">
                  {isKo
                    ? '메달리온 아키텍처 (Bronze → Silver → Gold)'
                    : 'Medallion Architecture (Bronze → Silver → Gold)'}
                </div>
                <div className="flex items-stretch gap-2 sm:gap-3">
                  {[
                    {
                      name: 'Bronze', color: '#cd7f32',
                      descKo: '원시 CSV 수집\n스키마 정의',
                      descEn: 'Raw CSV ingestion\nSchema definition',
                    },
                    {
                      name: 'Silver', color: '#b0b8c1',
                      descKo: 'DuckDB OLAP 정제\n배송일 계산 · 조인',
                      descEn: 'DuckDB OLAP cleaning\nDelivery days + joins',
                    },
                    {
                      name: 'Gold', color: '#ffd700',
                      descKo: 'KPI 집계 테이블\n리텐션 지표 생성',
                      descEn: 'KPI aggregation\nRetention metrics',
                    },
                  ].map((layer, i) => (
                    <div key={layer.name} className="flex items-center gap-2 sm:gap-3 flex-1">
                      <div
                        className="flex-1 rounded-xl p-3 sm:p-4 text-center"
                        style={{ background: `${layer.color}10`, border: `1px solid ${layer.color}40` }}
                      >
                        <div className="text-sm font-bold mb-1" style={{ color: layer.color }}>{layer.name}</div>
                        <div className="text-[11px] text-gray-500 whitespace-pre-line leading-relaxed">
                          {isKo ? layer.descKo : layer.descEn}
                        </div>
                      </div>
                      {i < 2 && <div className="text-gray-700 text-base sm:text-xl flex-shrink-0">→</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* DuckDB SQL collapsible */}
              <CollapsibleCode
                label={isKo ? 'DuckDB SQL — 물류 퍼널 쿼리' : 'DuckDB SQL — Logistics Funnel Query'}
                codeLang="sql"
                code={SQL_CODE}
                isOpen={showSql}
                onToggle={() => setShowSql(v => !v)}
                onCopy={() => handleCopy(SQL_CODE, 'sql')}
                isCopied={copied === 'sql'}
                isKo={isKo}
              />
            </section>

            {/* ── § Result ───────────────────────────────────────────── */}
            <section>
              <div className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: '#39ff14' }}>
                {isKo ? '📊 실험 결과 (Result)' : '📊 Experiment Results (Result)'}
              </div>

              <div className="mb-4">
                <div className="text-sm font-semibold text-gray-300">
                  {isKo ? '반사실적 A/B 시뮬레이션 결과' : 'Counterfactual A/B Simulation Results'}
                </div>
                <div className="text-xs text-gray-600 mt-0.5">
                  {isKo
                    ? '고지연 지역 (São Paulo 주) 물류 최적화 시나리오'
                    : 'High-latency region (São Paulo state) logistics optimization scenario'}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
                {RESULT_STATS.map(s => (
                  <div
                    key={s.value}
                    className="rounded-xl p-3 sm:p-4 text-center"
                    style={{ background: `${s.color}10`, border: `1px solid ${s.color}28` }}
                  >
                    <div className="text-xs text-gray-600 mb-1.5">{isKo ? s.labelKo : s.labelEn}</div>
                    <div className="text-xl sm:text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-[11px] text-gray-600 mt-1 font-mono">{isKo ? s.subKo : s.subEn}</div>
                  </div>
                ))}
              </div>

              {/* Chart 2 */}
              <div className="mb-4">
                <ChartSection
                  src={`${basePath}/images/olist/simulation_impact.png`}
                  label={isKo ? 'A/B 시뮬레이션 감성 점수 분포' : 'A/B Simulation: Sentiment Score Distribution'}
                  hint="simulation_impact.png"
                  onImgError={() => setImgErrors(prev => ({ ...prev, chart2: true }))}
                  hasError={!!imgErrors['chart2']}
                />
              </div>

              {/* Python collapsible */}
              <CollapsibleCode
                label={isKo ? 'Python — 반사실적 A/B 시뮬레이션' : 'Python — Counterfactual A/B Simulation'}
                codeLang="python"
                code={PYTHON_CODE}
                isOpen={showPy}
                onToggle={() => setShowPy(v => !v)}
                onCopy={() => handleCopy(PYTHON_CODE, 'py')}
                isCopied={copied === 'py'}
                isKo={isKo}
              />
            </section>

            {/* ── § Action Items ─────────────────────────────────────── */}
            <section>
              <div className="text-xs font-mono tracking-widest uppercase mb-4" style={{ color: '#a855f7' }}>
                {isKo ? '💡 액션 아이템 (Actionable Action Items)' : '💡 Actionable Action Items'}
              </div>
              <div className="space-y-3">
                {ACTION_ITEMS.map(item => (
                  <motion.div
                    key={item.no}
                    whileHover={{ x: 4 }}
                    className="flex gap-4 p-4 rounded-xl"
                    style={{ background: `${item.color}08`, border: `1px solid ${item.color}22` }}
                  >
                    <div
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                      style={{ background: item.color, color: '#000' }}
                    >
                      {item.no}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-white mb-1">
                        {isKo ? item.titleKo : item.titleEn}
                      </div>
                      <div className="text-xs text-gray-500 leading-relaxed mb-2.5">
                        {isKo ? item.descKo : item.descEn}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span
                          className="text-xs px-2 py-0.5 rounded-md font-mono"
                          style={{ background: `${item.color}18`, color: item.color }}
                        >
                          📈 {isKo ? item.impactKo : item.impactEn}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-md font-mono bg-white/5 text-gray-500">
                          ⏱ {isKo ? item.diffKo : item.diffEn}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* ── Footer ─────────────────────────────────────────────── */}
            <div
              className="pt-5 flex flex-wrap items-center justify-between gap-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div>
                <div className="text-xs text-gray-700 mb-2 font-mono uppercase tracking-wider">
                  {isKo ? '기술 스택' : 'Tech Stack'}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['DuckDB', 'SQL', 'Python 3.11', 'Pandas', 'Seaborn', 'scipy.stats', 'Medallion Architecture'].map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-md font-mono bg-white/5 text-gray-500">{t}</span>
                  ))}
                </div>
              </div>
              <a
                href="https://github.com/markyang0613/olist-marketplace-funnel-analytics"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold hover:text-white transition-colors flex items-center gap-1"
                style={{ color: '#f59e0b' }}
              >
                GitHub ↗
              </a>
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
