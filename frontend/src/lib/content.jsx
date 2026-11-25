import { createContext, useContext, useEffect, useState } from 'react'
import bundled from '@content/portfolio.json'
import { fetchPortfolio } from './api'

const ContentContext = createContext(bundled)

// Affiche immédiatement le contenu intégré, puis le remplace par celui de l'API s'il répond.
export function ContentProvider({ children }) {
  const [content, setContent] = useState(bundled)

  useEffect(() => {
    let alive = true
    fetchPortfolio().then((remote) => {
      if (alive && remote) setContent({ ...bundled, ...remote })
    })
    return () => {
      alive = false
    }
  }, [])

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
}

export function useContent() {
  return useContext(ContentContext)
}

export const STATUS = {
  realise: { label: 'Réalisé', color: 'var(--color-done)' },
  en_cours: { label: 'En cours', color: 'var(--color-progress)' },
  prototype: { label: 'Prototype', color: 'var(--color-proto)' },
  prevu: { label: 'Prévu', color: 'var(--color-planned)' },
}
