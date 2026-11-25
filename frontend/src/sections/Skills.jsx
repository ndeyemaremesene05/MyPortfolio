import { useRef, useState } from 'react'
import { useContent } from '../lib/content'
import { LevelMark, SectionHeader } from '../components/ui'

export default function Skills() {
  const { skillCategories, levels } = useContent()
  const [active, setActive] = useState(0)
  const tabs = useRef([])
  const category = skillCategories[active]

  // Navigation clavier du motif "onglets" (flèches, Début, Fin)
  const onKeyDown = (e) => {
    const last = skillCategories.length - 1
    const next =
      e.key === 'ArrowDown' || e.key === 'ArrowRight' ? (active === last ? 0 : active + 1)
      : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? (active === 0 ? last : active - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null
    if (next === null) return
    e.preventDefault()
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <section aria-labelledby="competences" className="border-t border-line bg-surface py-20 lg:py-28">
      <div className="container-page">
        <SectionHeader
          id="competences"
          title="Compétences techniques"
          lead="Classées par domaine, avec un niveau honnête : ce que j’ai utilisé dans un projet, ce que je pratique, et ce que je continue à apprendre."
        />

        <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-3" aria-label="Légende des niveaux">
          {levels.map((l) => (
            <li key={l.key}>
              <LevelMark level={l.key} />
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-14">
          <div
            role="tablist"
            aria-label="Domaines de compétences"
            aria-orientation="vertical"
            className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0"
          >
            {skillCategories.map((cat, i) => {
              const selected = i === active
              return (
                <button
                  key={cat.slug}
                  ref={(el) => {
                    tabs.current[i] = el
                  }}
                  role="tab"
                  id={`tab-${cat.slug}`}
                  aria-selected={selected}
                  aria-controls={`panel-${cat.slug}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={onKeyDown}
                  className={`flex shrink-0 items-center justify-between gap-4 rounded-full px-4 py-2 text-left text-[0.95rem] font-semibold transition-colors lg:rounded-lg lg:py-2.5 ${
                    selected ? 'bg-ink text-white' : 'bg-paper text-ink/75 hover:text-ink lg:bg-transparent lg:hover:bg-paper'
                  }`}
                >
                  {cat.name}
                  <span className={`hidden text-sm font-normal lg:inline ${selected ? 'text-mint' : 'text-slate'}`}>
                    {cat.skills.length}
                  </span>
                </button>
              )
            })}
          </div>

          <div role="tabpanel" id={`panel-${category.slug}`} aria-labelledby={`tab-${category.slug}`} tabIndex={0} className="min-h-[420px]">
            <h3 className="text-2xl font-bold">{category.name}</h3>
            <p className="mt-2 max-w-2xl text-slate">{category.summary}</p>
            <ul className="mt-6 border-t border-ink">
              {category.skills.map((skill) => (
                <li key={skill.name} className="flex flex-col gap-1.5 border-b border-line py-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-medium">{skill.name}</span>
                  <LevelMark level={skill.level} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
