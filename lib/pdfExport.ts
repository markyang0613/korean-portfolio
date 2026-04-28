const RESUME_PDF_URL =
  'https://docs.google.com/document/d/1YC1BZNSYgYGjadMim9jI8JRC9kDSY8ImMsy3o3MVBD4/export?format=pdf'

export function downloadResumePDF() {
  if (typeof window === 'undefined') return
  window.open(RESUME_PDF_URL, '_blank', 'noopener,noreferrer')
}
