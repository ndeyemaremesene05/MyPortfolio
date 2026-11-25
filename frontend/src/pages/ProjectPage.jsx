import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useContent, STATUS } from '../lib/content'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { ButtonLink, StackList, StatusBadge } from '../components/ui'
import ProjectVisual from '../components/ProjectVisual'
import SchemaDiagram from '../components/SchemaDiagram'
import NotFound from './NotFound'

function Block({ title, children }) {
  return (
    <section className="grid gap-3 border-t border-line py-8 md:grid-cols-[220px_1fr] md:gap-10">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="max-w-[68ch] text-ink/85">{children}</div>
    </section>
  )
}

export default function ProjectPage() {
  const { slug } = useParams()
  const { projects, profile } = useContent()
  const index = projects.findIndex((p) => p.slug === slug)
  const project = projects[index]

  useDocumentMeta({
    title: project ? `${project.name}, projet de ${profile.name}` : 'Page introuvable',
    description: project?.tagline,
    path: `/projets/${slug}`,
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!project) return <NotFound />

  const next = projects[(index + 1) % projects.length]
  const grouped = Object.keys(STATUS)
    .map((status) => ({ status, items: project.features.filter((f) => f.status === status) }))
    .filter((g) => g.items.length)

  return (
    <article className="pb-20 pt-24">
      <div className="container-page">
        <Link to="/#projets" className="inline-flex items-center gap-2 py-4 text-[0.95rem] font-semibold text-slate hover:text-ink">
          <ArrowLeft aria-hidden="true" size={17} />
          Tous les projets
        </Link>

        <header className="mt-4 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={project.status} />
              <span className="text-sm text-slate">
                {project.type}, {project.period}
              </span>
            </div>
            <h1 className="mt-5 text-[clamp(2.4rem,6vw,4rem)] font-bold leading-[1.02] tracking-[-0.03em]">
              {project.name}
              {project.subtitle && <span className="mt-2 block text-[0.45em] font-medium tracking-normal text-slate">{project.subtitle}</span>}
            </h1>
            <p className="mt-5 max-w-xl text-xl text-ink/85">{project.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {project.links.demo && (
                <ButtonLink href={project.links.demo} external>
                  Voir le projet
                </ButtonLink>
              )}
              {project.links.github && (
                <ButtonLink href={project.links.github} variant="outline" external>
                  Code source sur GitHub
                </ButtonLink>
              )}
            </div>
          </div>
          <div className="relative h-[320px] overflow-hidden rounded-2xl border border-line sm:h-[400px]">
            <ProjectVisual project={project} className="absolute inset-0" />
          </div>
        </header>

        <div className="mt-16">
          <Block title="Contexte">
            <p>{project.context}</p>
          </Block>
          <Block title="Objectif">
            <p>{project.objective}</p>
          </Block>
          <Block title="Ma contribution">
            <p>{project.contribution}</p>
          </Block>

          {project.architecture?.length > 0 && (
            <Block title="Architecture">
              <dl className="divide-y divide-line border-y border-line">
                {project.architecture.map((part) => (
                  <div key={part.name} className="grid gap-1 py-3 sm:grid-cols-[200px_1fr] sm:gap-6">
                    <dt className="font-semibold">{part.name}</dt>
                    <dd className="text-slate">{part.role}</dd>
                  </div>
                ))}
              </dl>
            </Block>
          )}

          <Block title="Fonctionnalités">
            <div className="space-y-6">
              {grouped.map((g) => (
                <div key={g.status}>
                  <StatusBadge status={g.status} />
                  <ul className="mt-3 space-y-2">
                    {g.items.map((f) => (
                      <li key={f.name} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full" style={{ background: STATUS[g.status].color }} />
                        {f.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Block>

          {project.slug === 'eventia' && (
            <Block title="Modèle de données">
              <div className="overflow-x-auto rounded-xl border border-line bg-white p-3">
                <SchemaDiagram theme="light" className="h-auto w-full min-w-[560px]" />
              </div>
              <p className="mt-3 text-[0.95rem] text-slate">
                Version simplifiée.{' '}
                <Link to="/#bases-de-donnees" className="font-semibold text-emerald underline underline-offset-4">
                  Voir les requêtes SQL sur ce schéma
                </Link>
              </p>
            </Block>
          )}

          {project.challenges?.length > 0 && (
            <Block title="Difficultés techniques">
              <div className="space-y-5">
                {project.challenges.map((c) => (
                  <div key={c.title}>
                    <h3 className="font-semibold text-ink">{c.title}</h3>
                    <p className="mt-1">{c.text}</p>
                  </div>
                ))}
              </div>
            </Block>
          )}

          <Block title="Technologies">
            <StackList items={project.stack} />
          </Block>
        </div>

        {next && next.slug !== project.slug && (
          <nav aria-label="Projet suivant" className="mt-8 border-t border-ink pt-8">
            <p className="text-sm text-slate">Projet suivant</p>
            <Link to={`/projets/${next.slug}`} className="mt-1 inline-block text-2xl font-bold underline decoration-line decoration-2 underline-offset-[6px] hover:decoration-emerald">
              {next.name}
            </Link>
          </nav>
        )}
      </div>
    </article>
  )
}
