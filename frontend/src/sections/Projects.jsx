import { useContent, STATUS } from '../lib/content'
import { ButtonLink, SectionHeader, StackList, StatusBadge } from '../components/ui'
import ProjectVisual from '../components/ProjectVisual'

// Accord avec « fonctionnalité » (féminin)
const FEMININE = { realise: ['réalisée', 'réalisées'], en_cours: ['en cours', 'en cours'], prototype: ['en prototype', 'en prototype'], prevu: ['prévue', 'prévues'] }

function featureSummary(features) {
  const counts = features.reduce((acc, f) => ({ ...acc, [f.status]: (acc[f.status] ?? 0) + 1 }), {})
  return Object.keys(STATUS)
    .filter((k) => counts[k])
    .map((k) => `${counts[k]} ${FEMININE[k][counts[k] > 1 ? 1 : 0]}`)
    .join(', ')
}

function Featured({ project }) {
  return (
    <article className="grid overflow-hidden rounded-3xl border border-line bg-white lg:grid-cols-[1.25fr_1fr]">
      <div className="relative min-h-[320px] lg:min-h-[460px]">
        <ProjectVisual project={project} className="absolute inset-0" />
      </div>
      <div className="flex flex-col p-7 sm:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={project.status} />
          <span className="text-sm text-slate">
            {project.type}, {project.period}
          </span>
        </div>
        <h3 className="mt-5 text-4xl font-bold">
          {project.name}
          {project.subtitle && <span className="mt-1 block text-xl font-medium text-slate">{project.subtitle}</span>}
        </h3>
        <p className="mt-4 text-lg text-ink/85">{project.tagline}</p>
        <p className="mt-4 text-[0.95rem] text-slate">
          {project.features.length} fonctionnalités suivies : {featureSummary(project.features)}.
        </p>
        <StackList items={project.stack} className="mt-6" />
        <div className="mt-auto flex flex-wrap gap-3 pt-8">
          <ButtonLink to={`/projets/${project.slug}`} aria-label={`Détails du projet ${project.name}`}>
            Voir le projet en détail
          </ButtonLink>
          {project.links.demo && (
            <ButtonLink href={project.links.demo} variant="outline" external>
              Voir le projet
            </ButtonLink>
          )}
          {project.links.github && (
            <ButtonLink href={project.links.github} variant="outline" external aria-label={`Code source de ${project.name} sur GitHub`}>
              GitHub
            </ButtonLink>
          )}
        </div>
      </div>
    </article>
  )
}

function Row({ project }) {
  return (
    <article className="grid gap-6 border-t border-line py-8 md:grid-cols-[260px_1fr] md:gap-10">
      <div className="relative h-44 overflow-hidden rounded-xl border border-line md:h-full md:min-h-[170px]">
        <ProjectVisual project={project} className="absolute inset-0" />
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={project.status} />
          <span className="text-sm text-slate">
            {project.type}, {project.period}
          </span>
        </div>
        <h3 className="mt-3 text-2xl font-bold">{project.name}</h3>
        <p className="mt-2 max-w-2xl text-ink/80">{project.tagline}</p>
        <StackList items={project.stack} className="mt-4" />
        <div className="mt-5 flex flex-wrap gap-2.5">
          <ButtonLink to={`/projets/${project.slug}`} variant="outline" className="py-2 text-sm" aria-label={`Détails du projet ${project.name}`}>
            Détails
          </ButtonLink>
          {project.links.demo && (
            <ButtonLink href={project.links.demo} variant="outline" external className="py-2 text-sm">
              Voir le projet
            </ButtonLink>
          )}
          {project.links.github && (
            <ButtonLink href={project.links.github} variant="outline" external className="py-2 text-sm">
              GitHub
            </ButtonLink>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const { projects } = useContent()
  const featured = projects.filter((p) => p.featured)
  const others = projects.filter((p) => !p.featured)

  return (
    <section aria-labelledby="projets" className="border-t border-line bg-surface py-20 lg:py-28">
      <div className="container-page">
        <SectionHeader
          id="projets"
          title="Projets"
          lead="Des projets réels, avec leur état d’avancement : ce qui est terminé, ce qui est en cours et ce qui est prévu."
        />
        <div className="mt-12 space-y-12">
          {featured.map((p) => (
            <Featured key={p.slug} project={p} />
          ))}
          {others.length > 0 && (
            <div>
              {others.map((p) => (
                <Row key={p.slug} project={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
