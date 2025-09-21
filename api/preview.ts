// Placeholder for preview API
// This file is imported by useScheduledPosts hook

export const previewEndpoint = '/api/preview'

export function getPreviewToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('preview-token')
  }
  return null
}

export function setPreviewToken(token: string | null) {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('preview-token', token)
    } else {
      localStorage.removeItem('preview-token')
    }
  }
}

export function isPreviewMode() {
  if (typeof window !== 'undefined') {
    return !!getPreviewToken()
  }
  return false
}