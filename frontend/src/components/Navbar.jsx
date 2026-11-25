import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Download, Menu, X } from 'lucide-react'
import { useContent } from '../lib/content'
import { NAV } from '../data/nav'


export default function Navbar() {
  const { profile } = useContent()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const onHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Sur l'accueil, en haut de page, la barre est posée sur le hero sombre.
  const dark = onHome && !scrolled && !open
  const linkCls = dark ? 'text-white/80 hover:text-white' : 'text-ink/75 hover:text-ink'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        dark ? 'on-dark bg-transparent' : 'border-b border-line bg-paper/90 backdrop-blur-md'
      }`}
    >
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-md focus:bg-mint focus:px-3 focus:py-2 focus:text-ink"
      >
        Aller au contenu
      </a>
      <nav className="container-page flex h-16 items-center justify-between" aria-label="Navigation principale">
        <Link to="/" onClick={() => setOpen(false)} className={`flex items-center gap-2.5 font-bold ${dark ? 'text-white' : 'text-ink'}`}>
          <span
            aria-hidden="true"
            className={`grid size-9 place-items-center rounded-lg text-[0.8rem] tracking-tight ${
              dark ? 'bg-mint text-ink' : 'bg-ink text-mint'
            }`}
          >
            {profile.initials}
          </span>
          <span className="hidden sm:inline">{profile.name}</span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <li key={item.id}>
              <Link to={`/#${item.id}`} className={`text-[0.95rem] font-medium transition-colors ${linkCls}`}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {profile.cvUrl && (
            <a
              href={profile.cvUrl}
              download
              className={`hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors sm:inline-flex ${
                dark ? 'bg-mint text-ink hover:bg-white' : 'bg-ink text-paper hover:bg-emerald'
              }`}
            >
              <Download aria-hidden="true" size={16} />
              CV
            </a>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`grid size-10 place-items-center rounded-lg md:hidden ${dark ? 'text-white' : 'text-ink'}`}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="menu-mobile" className="border-t border-line bg-paper md:hidden">
          <ul className="container-page flex flex-col py-3">
            {NAV.map((item) => (
              <li key={item.id}>
                <Link
                  to={`/#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line/70 py-3.5 text-lg font-semibold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {profile.cvUrl && (
              <li className="pt-4">
                <a href={profile.cvUrl} download className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 font-semibold text-paper">
                  <Download aria-hidden="true" size={16} />
                  Télécharger mon CV
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  )
}
