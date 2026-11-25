import { useMemo, useState } from 'react'
import SchemaDiagram from '../components/SchemaDiagram'
import CodeBlock from '../components/CodeBlock'
import { SectionHeader } from '../components/ui'
import { EDGES, MIGRATION_EXAMPLE, QUERIES, TABLES } from '../data/schema'

const CONCEPTS = [
  'Clés primaires et étrangères',
  'Contraintes d’unicité et règles de suppression',
  'Jointures internes et externes',
  'Agrégations et regroupements',
  'Normalisation',
  'Migrations Laravel et relations Eloquent',
]

export default function Database() {
  const [queryId, setQueryId] = useState(QUERIES[0].id)
  const [table, setTable] = useState(null)
  const [view, setView] = useState('sql')

  const query = QUERIES.find((q) => q.id === queryId)

  // Une table sélectionnée met en avant ses relations directes.
  const focus = useMemo(() => {
    if (table) {
      const edges = EDGES.filter((e) => e.from[0] === table || e.to[0] === table)
      const tables = new Set([table])
      edges.forEach((e) => {
        tables.add(e.from[0])
        tables.add(e.to[0])
      })
      return { tables: [...tables], edges: edges.map((e) => e.id) }
    }
    return { tables: query?.tables ?? [], edges: query?.edges ?? [] }
  }, [table, query])

  const selectedTable = table ? TABLES.find((t) => t.name === table) : null

  const pickQuery = (id) => {
    setQueryId(id)
    setTable(null)
    setView('sql')
  }
  const pickTable = (name) => {
    setTable((current) => (current === name ? null : name))
    setQueryId(null)
  }

  return (
    <section aria-labelledby="bases-de-donnees" className="py-20 lg:py-28">
      <div className="container-page">
        <SectionHeader
          id="bases-de-donnees"
          title="Bases de données"
          lead="Je conçois le schéma avant d’écrire l’application. Voici le modèle de données d’Eventia : choisissez une requête pour voir les tables qu’elle relie, ou cliquez sur une table pour afficher ses relations."
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-10">
          <figure className="min-w-0">
            <div className="overflow-x-auto rounded-2xl border border-line bg-white p-3 sm:p-5">
              <SchemaDiagram
                theme="light"
                activeTables={focus.tables}
                activeEdges={focus.edges}
                onTableSelect={pickTable}
                className="h-auto w-full min-w-[620px]"
              />
            </div>
            <figcaption className="mt-3 min-h-[3rem] text-[0.95rem] text-slate" aria-live="polite">
              {selectedTable ? (
                <>
                  <span className="font-mono font-semibold text-ink">{selectedTable.name}</span> : {selectedTable.note}
                </>
              ) : (
                'Schéma simplifié. PK : clé primaire, FK : clé étrangère. Chaque trait relie une clé étrangère à la clé primaire qu’elle référence.'
              )}
            </figcaption>
          </figure>

          <div className="min-w-0">
            <fieldset>
              <legend className="font-semibold">Requêtes sur ce schéma</legend>
              <div className="mt-3 space-y-1.5">
                {QUERIES.map((q) => {
                  const on = q.id === queryId
                  return (
                    <label
                      key={q.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3.5 py-2.5 transition-colors ${
                        on ? 'border-emerald bg-emerald/[0.07]' : 'border-line hover:border-ink/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="requete"
                        value={q.id}
                        checked={on}
                        onChange={() => pickQuery(q.id)}
                        className="mt-1 accent-[var(--color-emerald)]"
                      />
                      <span className="font-medium">{q.title}</span>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            {query && (
              <div className="mt-6">
                <div className="flex gap-1 rounded-full bg-ink/[0.06] p-1 text-sm font-semibold" role="group" aria-label="Affichage">
                  {[
                    ['sql', 'Requête SQL'],
                    ['migration', 'Migration Laravel'],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={view === key}
                      onClick={() => setView(key)}
                      className={`flex-1 rounded-full px-3 py-1.5 transition-colors ${view === key ? 'bg-white text-ink shadow-sm' : 'text-slate hover:text-ink'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-[0.95rem] text-ink/80">
                  {view === 'sql'
                    ? query.explain
                    : 'La table bookings côté Laravel : clés étrangères contraintes, règles de suppression et une réservation unique par couple événement / prestataire.'}
                </p>
                <div className="mt-3">
                  {view === 'sql' ? (
                    <CodeBlock code={query.sql} language="sql" label={`Requête SQL : ${query.title}`} />
                  ) : (
                    <CodeBlock code={MIGRATION_EXAMPLE} language="php" label="Migration Laravel de la table bookings" />
                  )}
                </div>
              </div>
            )}

            {!query && selectedTable && (
              <p className="mt-6 rounded-lg border border-dashed border-line p-4 text-[0.95rem] text-slate">
                Cliquez à nouveau sur la table pour la désélectionner, ou choisissez une requête.
              </p>
            )}
          </div>
        </div>

        <div className="mt-14 border-t border-line pt-8">
          <h3 className="font-semibold">Ce que je pratique</h3>
          <ul className="mt-4 grid gap-x-8 gap-y-2.5 text-ink/85 sm:grid-cols-2 lg:grid-cols-3">
            {CONCEPTS.map((c) => (
              <li key={c} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-emerald" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
