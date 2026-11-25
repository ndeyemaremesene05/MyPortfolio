import { useEffect } from 'react'

const SITE_URL = (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '')

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector)
  if (el && value) el.setAttribute(attr, value)
}

// Titre, description et URL canonique par page (lus par Google ; LinkedIn lit index.html).
export function useDocumentMeta({ title, description, path = '/' }) {
  useEffect(() => {
    if (title) document.title = title
    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('link[rel="canonical"]', 'href', `${SITE_URL}${path}`)
    setMeta('meta[property="og:url"]', 'content', `${SITE_URL}${path}`)
  }, [title, description, path])
}
