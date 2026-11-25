import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { STATUS, useContent } from '../lib/content'

const VARIANTS = {
  primary: 'bg-emerald text-white hover:bg-emerald-deep',
  mint: 'bg-mint text-ink hover:bg-white',
  outline: 'border border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper',
  ghostDark: 'border border-white/25 text-white hover:border-mint hover:text-mint',
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[0.95rem] font-semibold transition-colors duration-200 whitespace-nowrap'

/** Bouton-lien : interne (to), externe (href) ou ancre. */
export function ButtonLink({ to, href, variant = 'primary', external = false, download, children, className = '', ...rest }) {
  const cls = `${BASE} ${VARIANTS[variant]} ${className}`
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <a
      href={href}
      className={cls}
      download={download}
      {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
      {...rest}
    >
      {children}
      {external && <ArrowUpRight aria-hidden="true" size={16} />}
    </a>
  )
}

export function StatusBadge({ status, className = '' }) {
  const s = STATUS[status] ?? STATUS.prevu
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.8rem] font-semibold ${className}`}
      style={{ color: s.color, borderColor: `color-mix(in srgb, ${s.color} 35%, transparent)` }}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  )
}

/** Niveau de compétence : 4 crans, sans pourcentage. */
export function LevelMark({ level }) {
  const { levels } = useContent()
  const l = levels.find((x) => x.key === level) ?? levels[levels.length - 1]
  return (
    <span className="inline-flex items-center gap-2.5" title={l.hint}>
      <span aria-hidden="true" className="flex gap-[3px]">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={`h-3 w-1.5 rounded-[2px] ${n <= l.rank ? 'bg-emerald' : 'bg-line'}`} />
        ))}
      </span>
      <span className="text-sm text-slate">{l.label}</span>
    </span>
  )
}

export function StackList({ items, dark = false, className = '' }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`} aria-label="Technologies">
      {items.map((item) => (
        <li
          key={item}
          className={`rounded-md px-2 py-0.5 text-[0.82rem] font-medium ${
            dark ? 'bg-white/8 text-mist' : 'bg-ink/[0.06] text-ink/80'
          }`}
        >
          {item}
        </li>
      ))}
    </ul>
  )
}

export function SectionHeader({ id, title, lead, children }) {
  return (
    <div className="max-w-3xl">
      <h2 id={id} className="section-title">
        {title}
      </h2>
      {lead && <p className="section-lead">{lead}</p>}
      {children}
    </div>
  )
}
