import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { ButtonLink } from '../components/ui'

export default function NotFound() {
  useDocumentMeta({ title: 'Page introuvable', description: 'Cette page n’existe pas.', path: '/404' })

  return (
    <section className="container-page flex min-h-[70vh] flex-col justify-center py-32">
      <p className="font-mono text-sm text-slate">SELECT * FROM pages WHERE url = …  →  0 ligne</p>
      <h1 className="mt-4 text-5xl font-bold">Cette page n’existe pas.</h1>
      <p className="mt-4 max-w-lg text-lg text-slate">L’adresse est peut-être mal saisie, ou la page a été déplacée.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink to="/">Revenir à l’accueil</ButtonLink>
        <ButtonLink to="/#projets" variant="outline">
          Voir les projets
        </ButtonLink>
      </div>
    </section>
  )
}
