import { Link } from 'react-router-dom'
import { Download } from 'lucide-react'
import { useContent } from '../lib/content'
import { ButtonLink } from '../components/ui'
import SchemaDiagram from '../components/SchemaDiagram'

export default function Hero() {
  const { profile } = useContent()

  return (
    <section id="accueil" aria-labelledby="hero-title" className="on-dark relative overflow-hidden bg-ink text-white">
      {/* Trame de fond très légère, rappel d'une grille de schéma */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(var(--color-mist) 1px, transparent 1px), linear-gradient(90deg, var(--color-mist) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 70% 40%, black, transparent)',
        }}
      />

      <div className="container-page relative grid items-center gap-12 pb-16 pt-28 lg:grid-cols-[1fr_1.15fr] lg:gap-10 lg:pb-24 lg:pt-36">
        <div>
          <h1 id="hero-title" className="font-bold leading-[0.95]">
            <span className="block text-[clamp(2.7rem,7vw,5rem)] tracking-[-0.035em]">{profile.name}</span>
            <span className="mt-4 block text-[clamp(1.35rem,2.6vw,1.9rem)] font-medium leading-snug tracking-[-0.01em] text-mint">
              {profile.role}
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-xl leading-relaxed text-white">{profile.headline}</p>
          <p className="mt-3 max-w-xl text-white/70">{profile.intro}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink to="/#projets" variant="mint">
              Découvrir mes projets
            </ButtonLink>
            {profile.cvUrl && (
              <ButtonLink href={profile.cvUrl} download variant="ghostDark">
                <Download aria-hidden="true" size={17} />
                Télécharger mon CV
              </ButtonLink>
            )}
            <Link to="/#contact" className="px-3 py-2.5 font-semibold text-white underline decoration-white/35 underline-offset-[6px] transition-colors hover:text-mint hover:decoration-mint">
              Me contacter
            </Link>
          </div>

          <p className="mt-9 text-[0.95rem] text-white/60">
            {profile.location}. {profile.availability}
          </p>
        </div>

        <figure className="relative -mx-2 sm:mx-0">
          <SchemaDiagram theme="dark" animate className="h-auto w-full" />
          <figcaption className="mt-3 text-sm text-white/50">
            Le modèle de données d’Eventia, mon projet de fin d’études, en version simplifiée.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
