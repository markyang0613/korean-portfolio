export default function PDFResume() {
  return (
    <div id="resume-pdf">
      <style>{`
        #resume-pdf * { box-sizing: border-box; }
        #resume-pdf h1 { font-size: 28px; font-weight: 800; color: #111; margin-bottom: 4px; }
        #resume-pdf h2 { font-size: 13px; font-weight: 600; color: #003262; border-bottom: 2px solid #003262; padding-bottom: 4px; margin: 18px 0 8px; text-transform: uppercase; letter-spacing: 1px; }
        #resume-pdf h3 { font-size: 13px; font-weight: 700; color: #111; margin: 0; }
        #resume-pdf p { margin: 0; }
        #resume-pdf .sub { font-size: 12px; color: #555; }
        #resume-pdf .tag { display: inline-block; padding: 1px 8px; border-radius: 4px; background: #e8f4ff; color: #003262; font-size: 11px; margin: 2px; font-family: monospace; }
        #resume-pdf .row { display: flex; justify-content: space-between; align-items: flex-start; }
        #resume-pdf .contact-line { font-size: 12px; color: #444; margin-top: 4px; }
        #resume-pdf ul { margin: 6px 0 0 16px; padding: 0; }
        #resume-pdf li { font-size: 12px; color: #333; margin-bottom: 3px; }
        #resume-pdf .section { margin-bottom: 4px; }
        #resume-pdf .skill-cat { font-weight: 600; color: #003262; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: '3px solid #003262', paddingBottom: 14, marginBottom: 4 }}>
        <h1>양준서 (Mark Yang)</h1>
        <div className="sub" style={{ fontSize: 14, color: '#003262', fontWeight: 600 }}>
          데이터 엔지니어 · AI 네이티브 · UC Berkeley 데이터사이언스
        </div>
        <div className="contact-line" style={{ marginTop: 6 }}>
          📧 myang7736@gmail.com &nbsp;|&nbsp;
          🐙 github.com/markyang0613 &nbsp;|&nbsp;
          📍 Seoul, Korea / Oakland, CA
        </div>
      </div>

      {/* Summary */}
      <h2>요약</h2>
      <p style={{ fontSize: 12, color: '#333', lineHeight: 1.6 }}>
        UC Berkeley 데이터사이언스 학사 졸업생으로, 클라우드 데이터 파이프라인 설계 및 구축에 전문성을 보유하고 있습니다.
        AWS(S3, Glue, Redshift, EC2), Snowflake를 활용한 ETL 시스템 구현 경험이 있으며,
        Google Gemma API를 활용한 AI 기반 데이터 처리 파이프라인을 실무에서 구축했습니다.
        Claude, ChatGPT, Cursor 등 AI 도구를 핵심 개발 워크플로우에 통합하는 AI 네이티브 엔지니어입니다.
      </p>

      {/* Experience */}
      <h2>경력</h2>

      <div className="section">
        <div className="row">
          <h3>LSP USA, LLC</h3>
          <span className="sub">2023 – 2024</span>
        </div>
        <div className="sub">품질 검사 엔지니어 (Quality Inspection Engineer) · Oakland, CA</div>
        <ul>
          <li>배터리 제조 공정 QA 데이터를 위한 엔드투엔드 클라우드 데이터 파이프라인 설계 및 구축</li>
          <li>Amazon EC2에서 Google Gemma API를 활용한 AI 기반 자동화 품질 검사 시스템 개발</li>
          <li>Amazon S3 → AWS Glue → Snowflake 실시간 데이터 흐름 구현 및 최적화</li>
          <li>배치 처리 ETL 파이프라인으로 데이터 처리 효율성 향상</li>
        </ul>
        <div style={{ marginTop: 5 }}>
          <span className="tag">AWS EC2</span>
          <span className="tag">Amazon S3</span>
          <span className="tag">Snowflake</span>
          <span className="tag">Google Gemma API</span>
          <span className="tag">Python</span>
          <span className="tag">ETL</span>
        </div>
      </div>

      <div className="section" style={{ marginTop: 12 }}>
        <div className="row">
          <h3>Oakland Natives Give Back</h3>
          <span className="sub">2022 – 2023</span>
        </div>
        <div className="sub">데이터 분석 인턴 (Data Analyst Intern) · Oakland, CA</div>
        <ul>
          <li>학생 성과 데이터 수집, 정제, 분석 파이프라인 구축 (Python, Pandas)</li>
          <li>Tableau 기반 학생 성과 대시보드 설계 및 구현으로 프로그램 개선 지원</li>
          <li>SQL 쿼리를 활용한 데이터베이스 분석 및 핵심 KPI 도출</li>
        </ul>
        <div style={{ marginTop: 5 }}>
          <span className="tag">Python</span>
          <span className="tag">SQL</span>
          <span className="tag">Tableau</span>
          <span className="tag">Pandas</span>
        </div>
      </div>

      <div className="section" style={{ marginTop: 12 }}>
        <div className="row">
          <h3>Avellino Lab</h3>
          <span className="sub">Sep. 2021 – Dec. 2021</span>
        </div>
        <div className="sub">데이터사이언스 인턴 (Data Science Intern) · Menlo Park, CA</div>
        <ul>
          <li>CNN과 Vision Transformer를 개발하여 X-ray 이미지·유전자 특성 기반 안암 발생 예측 모델 구현, Confusion Matrix 기반 88% 정확도 달성</li>
          <li>AWS에 약 2GB의 환자 유전자 및 방사선 영상 데이터를 중앙화된 데이터베이스로 구축, 4명의 연구원에게 데이터 거버넌스 환경 제공</li>
          <li>유전학자·방사선 전문의·소프트웨어 엔지니어 간 협업 조율로 200명 이상의 환자 안암 위험 예측 효율성 향상</li>
        </ul>
        <div style={{ marginTop: 5 }}>
          <span className="tag">Python</span>
          <span className="tag">CNN</span>
          <span className="tag">Vision Transformer</span>
          <span className="tag">AWS</span>
          <span className="tag">PyTorch</span>
          <span className="tag">Medical Imaging</span>
        </div>
      </div>

      {/* Education */}
      <h2>학력</h2>
      <div className="row">
        <div>
          <h3>University of California, Berkeley</h3>
          <div className="sub">데이터사이언스 학사 (B.S. Data Science)</div>
          <div style={{ fontSize: 11, color: '#666', marginTop: 3 }}>
            관련 과목: 머신러닝, 통계학, 데이터베이스, 알고리즘, 확률론
          </div>
        </div>
        <span className="sub">2020 – 2024</span>
      </div>
      <div style={{ marginTop: 6 }}>
        <strong style={{ fontSize: 12 }}>자격증 준비 중:</strong>
        <span className="sub"> AWS Certified Data Engineer Associate (진행 중)</span>
      </div>

      {/* Skills */}
      <h2>기술 스택</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <tbody>
          {[
            { cat: '클라우드 & 데이터', skills: 'AWS S3, AWS Glue, AWS Redshift, AWS EC2, Snowflake' },
            { cat: '언어', skills: 'Python, SQL, JavaScript' },
            { cat: 'AI/ML', skills: 'Google Gemma API, LLM Integration, Prompt Engineering' },
            { cat: '데이터 엔지니어링', skills: 'ETL Pipelines, Apache Spark, dbt, 데이터 웨어하우징' },
            { cat: '도구 & 기타', skills: 'Git, Docker, Tableau, Claude AI, ChatGPT, Cursor' },
          ].map(row => (
            <tr key={row.cat}>
              <td style={{ padding: '3px 8px 3px 0', color: '#003262', fontWeight: 600, width: '35%', verticalAlign: 'top' }}>
                {row.cat}
              </td>
              <td style={{ padding: '3px 0', color: '#333', verticalAlign: 'top' }}>{row.skills}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
