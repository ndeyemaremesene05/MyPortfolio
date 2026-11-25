import { useContent } from '../lib/content'
import { SectionHeader } from '../components/ui'

export default function Versatility() {
  const { versatility, erp } = useContent()

  return (
    <>
      <section aria-labelledby="polyvalence" className="py-20 lg:py-28">
        <div className="container-page">
          <SectionHeader
            id="polyvalence"
            title="D’un besoin à une solution en ligne"
            lead="Je ne fais pas que du code. Sur un projet numérique, je peux intervenir à chaque étape, ce qui m’aide à comprendre le besoin global d’une entreprise."
          />

          <ol className="relative mt-14 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-6 lg:gap-6">
            <span aria-hidden="true" className="absolute left-0 right-0 top-[1.1rem] hidden h-px bg-line lg:block" />
            {versatility.map((step, i) => (
              <li key={step.step} className="relative">
                <span className="relative grid size-9 place-items-center rounded-full border border-ink bg-paper text-sm font-bold">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold leading-snug">{step.step}</h3>
                <ul className="mt-2 space-y-1 text-[0.95rem] text-slate">
                  {step.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {erp && (
        <section aria-labelledby="erp" className="on-dark bg-ink-2 py-20 text-white lg:py-24">
          <div className="container-page grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div>
              <h2 id="erp" className="section-title">
                {erp.title}
              </h2>
              <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-white/80">{erp.text}</p>
              {erp.note && <p className="mt-5 text-[0.95rem] text-mist">{erp.note}</p>}
            </div>
            <div>
              <h3 className="font-semibold text-mint">Ce que cet apprentissage m’a apporté</h3>
              <ul className="mt-4 border-t border-white/15">
                {erp.points.map((point) => (
                  <li key={point} className="border-b border-white/15 py-3.5 text-white/90">
                    {point}
                  </li>
                ))}
              </ul>
              {erp.modules?.length > 0 && (
                <>
                  <h3 className="mt-8 font-semibold text-mint">Modules explorés</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {erp.modules.map((m) => (
                      <li key={m} className="rounded-md bg-white/8 px-2.5 py-1 text-sm text-white/85">
                        {m}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
