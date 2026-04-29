const RESUME_PDF_URL =
  'https://docs.google.com/document/d/1YC1BZNSYgYGjadMim9jI8JRC9kDSY8ImMsy3o3MVBD4/export?format=pdf'

export function downloadResumePDF() {
  if (typeof window === 'undefined') return
  window.open(RESUME_PDF_URL, '_blank', 'noopener,noreferrer')
}

/**
 * Opens the browser print dialog so the user can Save as PDF.
 * The @media print CSS in globals.css handles layout/hiding.
 * NOTE: caller should show a "Background graphics" tip for ~1.5s first.
 */
export function printPortfolioAsPDF() {
  if (typeof window === 'undefined') return
  window.print()
}
