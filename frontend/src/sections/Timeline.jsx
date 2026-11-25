import { Link } from 'react-router-dom'
import { useContent } from '../lib/content'
import { SectionHeader } from '../components/ui'

const KIND = {
  formation: { label: 'Formation', dot: 'bg-ink' },
  projet: { label: 'Projet', dot: 'bg-emerald' },
  experience: { label: 'Expérience', dot: 'bg-[#9a5b06]' },
}

function Entry({ item }) {
  const kind = KIND[item.kind] ?? KIND.formation
  const title = item.projectSlug ? (
    <Link to={`/projets/${item.projectSlug}`} className="underline decoration-line decoration-2 underline-offset-4 hover:decoration-emerald">
      {item.title}
    </Link>
  ) : (
    item.title
  )

  return (
    <li className="relative grid gap-1 pb-9 pl-8 sm:grid-cols-[170px_1fr] sm:gap-8 sm:pl-0">
      <p className="text-[0.95rem] font-semibold text-slate sm:pt-0.5 sm:text-right">{item.period}</p>
      <div className="relative sm:pl-8">
        <span aria-hidden="true" className={`absolute -left-8 top-2 size-3 rounded-full ring-4 ring-paper sm:-left-[6px] ${kind.dot}`} />
        <p className="text-sm text-slate">{kind.label}</p>
        <h3 className="text-lg font-bold leading-snug">{title}</h3>
        {item.place && <p className="text-ink/80">{item.place}</p>}
        {item.detail && <p className="mt-1 max-w-2xl text-[0.95rem] text-slate">{item.detail}</p>}
      </div>
    </li>
  )
}

export default function Timeline() {
  const { timeline, timelineExtra = [] } = useContent()

  return (
    <section aria-labelledby="parcours" className="py-20 lg:py-28">
      <div className="container-page">
        <SectionHeader id="parcours" title="Parcours" lead="Formations, projets et expérience, du plus récent au plus ancien." />

        <ol className="relative mt-12 before:absolute before:bottom-6 before:left-[5px] before:top-2 before:w-px before:bg-line sm:before:left-[202px]">
          {timeline.map((item, i) => (
            <Entry key={`${item.title}-${i}`} item={item} />
          ))}
        </ol>

        {timelineExtra.length > 0 && (
          <div className="mt-6 border-t border-line pt-10">
            <h3 className="text-xl font-bold">Également</h3>
            <ul className="mt-6 grid gap-8 md:grid-cols-3">
              {timelineExtra.map((item) => {
                const kind = KIND[item.kind] ?? KIND.formation
                return (
                  <li key={item.title}>
                    <p className="text-sm text-slate">
                      {kind.label}
                      {item.period && `, ${item.period.toLowerCase()}`}
                    </p>
                    <p className="mt-0.5 text-lg font-bold leading-snug">
                      {item.projectSlug ? (
                        <Link to={`/projets/${item.projectSlug}`} className="underline decoration-line decoration-2 underline-offset-4 hover:decoration-emerald">
                          {item.title}
                        </Link>
                      ) : (
                        item.title
                      )}
                    </p>
                    {item.place && <p className="text-ink/80">{item.place}</p>}
                    {item.detail && <p className="mt-1 text-[0.95rem] text-slate">{item.detail}</p>}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
