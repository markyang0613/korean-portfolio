export async function downloadResumePDF() {
  if (typeof window === 'undefined') return

  const el = document.getElementById('resume-pdf')
  if (!el) return

  // Temporarily make the element visible for html2pdf
  const original = {
    position: el.style.position,
    left: el.style.left,
    top: el.style.top,
    zIndex: el.style.zIndex,
  }
  el.style.position = 'fixed'
  el.style.left = '0'
  el.style.top = '0'
  el.style.zIndex = '-999'

  try {
    // Dynamic import to avoid SSR issues
    const html2pdf = (await import('html2pdf.js')).default

    await html2pdf()
      .set({
        margin: 0,
        filename: '양준서_이력서.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait',
        },
      })
      .from(el)
      .save()
  } finally {
    el.style.position = original.position
    el.style.left = original.left
    el.style.top = original.top
    el.style.zIndex = original.zIndex
  }
}
