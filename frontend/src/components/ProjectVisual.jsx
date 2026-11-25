// Illustrations d'interface (pas des captures). Pour utiliser une vraie capture,
// renseignez "cover" dans content/portfolio.json (ex. "/projets/eventia.webp").

function Bar({ w = '60%', className = 'bg-white/15' }) {
  return <span className={`block h-2 rounded-full ${className}`} style={{ width: w }} />
}

function Browser({ children, className = '', dark = false }) {
  return (
    <div className={`overflow-hidden rounded-xl border shadow-[0_20px_50px_-20px_rgba(14,26,43,.45)] ${dark ? 'border-white/10 bg-ink-2' : 'border-line bg-white'} ${className}`}>
      <div className={`flex items-center gap-1.5 px-3 py-2 ${dark ? 'bg-ink-3' : 'bg-paper'}`}>
        {[0, 1, 2].map((i) => (
          <span key={i} className={`size-2 rounded-full ${dark ? 'bg-white/20' : 'bg-ink/15'}`} />
        ))}
      </div>
      {children}
    </div>
  )
}

function Phone({ children, className = '' }) {
  return (
    <div className={`overflow-hidden rounded-[26px] border-[5px] border-ink bg-paper shadow-[0_24px_60px_-18px_rgba(0,0,0,.55)] ${className}`}>
      <div className="mx-auto mt-1.5 h-1.5 w-12 rounded-full bg-ink/80" />
      {children}
    </div>
  )
}

function Eventia() {
  return (
    <div className="relative h-full min-h-[300px] w-full overflow-hidden bg-ink p-6 sm:p-8">
      <Browser dark className="absolute left-6 top-8 w-[78%] sm:left-8">
        <div className="flex">
          <div className="hidden w-24 shrink-0 space-y-2.5 border-r border-white/10 p-3 sm:block">
            <span className="block text-[10px] font-semibold text-mint">Admin</span>
            <Bar w="80%" /><Bar w="65%" /><Bar w="72%" />
          </div>
          <div className="flex-1 p-3">
            <span className="text-[11px] font-semibold text-white">Prestataires à valider</span>
            <div className="mt-2.5 space-y-2">
              {['En attente', 'Validé', 'En attente', 'Validé'].map((s, i) => (
                <div key={i} className="flex items-center justify-between gap-2 rounded-md bg-white/5 px-2 py-1.5">
                  <Bar w="45%" />
                  <span className={`rounded-full px-1.5 text-[9px] font-semibold ${s === 'Validé' ? 'bg-mint/20 text-mint' : 'bg-amber-300/15 text-amber-200'}`}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Browser>

      <Phone className="absolute bottom-[-40px] right-6 w-[46%] max-w-[210px] sm:right-10">
        <div className="space-y-2.5 p-3 pt-2.5">
          <span className="block text-[11px] font-bold text-ink">Mon mariage</span>
          <div className="space-y-1.5 rounded-lg bg-white p-2.5 text-[9px] text-slate">
            {['Date', 'Lieu', 'Invités', 'Budget'].map((k) => (
              <div key={k} className="flex items-center justify-between gap-2">
                <span>{k}</span>
                <Bar w="45%" className="bg-ink/10" />
              </div>
            ))}
          </div>
          <span className="block text-[10px] font-semibold text-emerald">Suggestions pour vous</span>
          {['Traiteur', 'Décoration', 'Photographe'].map((c) => (
            <div key={c} className="flex items-center gap-2 rounded-lg bg-white p-2">
              <span className="size-5 shrink-0 rounded-full bg-emerald/20" />
              <div className="flex-1">
                <span className="block text-[9px] font-semibold text-ink">{c}</span>
                <Bar w="70%" className="mt-1 bg-ink/10" />
              </div>
            </div>
          ))}
          <span className="block rounded-full bg-emerald py-1.5 text-center text-[9px] font-semibold text-white">Demander un devis</span>
        </div>
      </Phone>
    </div>
  )
}

function Aromapedia() {
  return (
    <div className="relative h-full min-h-[260px] w-full overflow-hidden bg-[#e9efe9] p-6">
      <Browser className="w-full">
        <div className="flex items-center justify-between border-b border-line px-3 py-2">
          <span className="text-[11px] font-bold text-ink">AromaPedia Lab</span>
          <div className="flex gap-2"><Bar w="28px" className="bg-ink/10" /><Bar w="28px" className="bg-ink/10" /><Bar w="28px" className="bg-ink/10" /></div>
        </div>
        <div className="grid grid-cols-[1.1fr_1fr] gap-3 p-3">
          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-md border border-line p-1.5">
                <div className="h-10 rounded bg-gradient-to-br from-[#dfe9df] to-[#c9dcd2]" />
                <Bar w="80%" className="mt-1.5 bg-ink/12" />
                <span className="mt-1 inline-block rounded bg-emerald/10 px-1 text-[8px] font-semibold text-emerald">INCI</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 rounded-md bg-paper p-2.5 text-[9px]">
            <span className="block text-[10px] font-bold text-ink">Fiche technique</span>
            {['Dénomination INCI', 'Variantes', 'Conditionnement'].map((k) => (
              <div key={k}>
                <span className="text-slate">{k}</span>
                <Bar w="85%" className="mt-1 bg-ink/10" />
              </div>
            ))}
            <span className="mt-1 block rounded border border-emerald/40 py-1 text-center font-semibold text-emerald">Documentation PDF</span>
          </div>
        </div>
      </Browser>
    </div>
  )
}

function Cosmetik() {
  return (
    <div className="relative flex h-full min-h-[240px] w-full items-center overflow-hidden bg-[#ece6e8] p-6">
      <Browser className="w-full">
        <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-2">
          <span className="whitespace-nowrap text-[11px] font-bold text-ink">Luxury Cosmetik</span>
          <div className="flex gap-2 overflow-hidden whitespace-nowrap text-[8px] text-slate">
            {['Visage', 'Corps', 'Parfums'].map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </div>
        <div className="space-y-2.5 p-3">
          <div className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
            <span className="text-[9px] font-semibold text-ink">Soins ciblés</span>
            {['Acné', 'Anti-âge'].map((c) => (
              <span key={c} className="rounded-full border border-line px-1.5 text-[8px] text-slate">{c}</span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['from-[#f3e3e6] to-[#e6c9cf]', 'from-[#efe6da] to-[#dcc9b1]', 'from-[#e5ece9] to-[#c6d8d1]'].map((g, i) => (
              <div key={i} className="rounded-md border border-line p-1.5">
                <div className={`h-10 rounded bg-gradient-to-br ${g}`} />
                <Bar w="85%" className="mt-1.5 bg-ink/12" />
                <span className="mt-1.5 block rounded bg-ink py-0.5 text-center text-[8px] font-semibold text-white">Ajouter</span>
              </div>
            ))}
          </div>
        </div>
      </Browser>
    </div>
  )
}

function Devis() {
  return (
    <div className="relative flex h-full min-h-[240px] w-full items-center overflow-hidden bg-[#e3e7ec] p-6">
      <Browser className="w-full">
        <div className="flex items-center justify-between gap-3 border-b border-line px-3 py-2">
          <span className="whitespace-nowrap text-[11px] font-bold text-ink">MApple Supply</span>
          <span className="rounded-full bg-ink px-2 py-0.5 text-[8px] font-semibold text-white">Demander un devis</span>
        </div>
        <div className="grid grid-cols-[1.4fr_1fr] gap-3 p-3">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((n) => (
                <span key={n} className={`grid size-4 place-items-center rounded-full text-[8px] font-bold ${n <= 2 ? 'bg-emerald text-white' : 'bg-ink/10 text-slate'}`}>{n}</span>
              ))}
            </div>
            {['Produit', 'Capacité', 'Couleur'].map((k) => (
              <div key={k}>
                <span className="text-[8px] text-slate">{k}</span>
                <div className="mt-0.5 h-4 rounded border border-line" />
              </div>
            ))}
          </div>
          <div className="space-y-1.5 rounded-md bg-paper p-2 text-[8px]">
            <span className="block text-[9px] font-bold text-ink">Votre sélection</span>
            <Bar w="90%" className="bg-ink/10" />
            <Bar w="70%" className="bg-ink/10" />
            <div className="flex gap-1 pt-1">
              <span className="rounded bg-ink px-1 font-semibold text-white">MAD</span>
              <span className="rounded border border-line px-1 text-slate">FCFA</span>
            </div>
          </div>
        </div>
      </Browser>
    </div>
  )
}

function WebMobile() {
  return (
    <div className="relative h-full min-h-[240px] w-full overflow-hidden bg-ink-2 p-6">
      <Browser dark className="w-[80%]">
        <div className="space-y-2 p-3">
          <Bar w="40%" className="bg-mint/50" />
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[0, 1, 2].map((i) => <div key={i} className="h-12 rounded-md bg-white/8" />)}
          </div>
          <Bar w="90%" /><Bar w="70%" />
        </div>
      </Browser>
      <Phone className="absolute bottom-[-30px] right-6 w-[32%] max-w-[130px]">
        <div className="space-y-1.5 p-2">
          <Bar w="60%" className="bg-emerald/60" />
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-5 rounded bg-white" />)}
        </div>
      </Phone>
    </div>
  )
}

function Website() {
  return (
    <div className="relative h-full min-h-[240px] w-full overflow-hidden bg-[#e4e9e2] p-6">
      <Browser className="w-full">
        <div className="space-y-2 p-3">
          <div className="h-14 rounded-md bg-gradient-to-r from-ink to-ink-3" />
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-1 rounded-md border border-line p-1.5">
                <div className="h-6 rounded bg-paper" />
                <Bar w="80%" className="bg-ink/10" />
              </div>
            ))}
          </div>
        </div>
      </Browser>
    </div>
  )
}

const VISUALS = { eventia: Eventia, aromapedia: Aromapedia, cosmetik: Cosmetik, devis: Devis, webmobile: WebMobile, website: Website }

export default function ProjectVisual({ project, className = '' }) {
  if (project.cover) {
    return (
      <img
        src={project.cover}
        alt={`Aperçu du projet ${project.name}`}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }
  const Visual = VISUALS[project.visual] ?? Website
  return (
    <div className={`h-full w-full ${className}`} role="img" aria-label={`Illustration de l’interface du projet ${project.name}`}>
      <Visual />
    </div>
  )
}
