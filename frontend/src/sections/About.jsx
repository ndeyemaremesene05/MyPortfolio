import { useContent } from '../lib/content'

export default function About() {
  const { profile } = useContent()

  return (
    <section aria-labelledby="a-propos" className="container-page py-20 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
        <div>
          <h2 id="a-propos" className="section-title">
            À propos
          </h2>
          <div className="prose-col mt-6 max-w-[64ch] text-[1.08rem] leading-[1.7] text-ink/85">
            {profile.about.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        <dl className="self-start border-t border-ink lg:mt-[4.6rem]">
          {profile.facts.map((fact) => (
            <div key={fact.label} className="border-b border-line py-4">
              <dt className="text-sm text-slate">{fact.label}</dt>
              <dd className="mt-0.5 font-semibold">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
