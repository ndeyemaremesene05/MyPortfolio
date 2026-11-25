import { Link } from 'react-router-dom'
import { useContent } from '../lib/content'
import { NAV } from '../data/nav'

const YEAR = new Date().getFullYear()

export default function Footer() {
  const { profile } = useContent()
  const { contact } = profile

  return (
    <footer className="on-dark bg-ink text-mist">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-xl font-bold text-white">{profile.name}</p>
          <p className="mt-1">{profile.role}</p>
          <p className="mt-1">{profile.location}</p>
        </div>

        <nav aria-label="Plan du site">
          <p className="font-semibold text-white">Sections</p>
          <ul className="mt-3 space-y-2">
            {NAV.map((item) => (
              <li key={item.id}>
                <Link to={`/#${item.id}`} className="hover:text-mint">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-semibold text-white">Me trouver</p>
          <ul className="mt-3 space-y-2">
            {contact.email && (
              <li>
                <a href={`mailto:${contact.email}`} className="break-all hover:text-mint">
                  {contact.email}
                </a>
              </li>
            )}
            {contact.linkedin && (
              <li>
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-mint">
                  LinkedIn
                </a>
              </li>
            )}
            {contact.github && (
              <li>
                <a href={contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-mint">
                  GitHub
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-page py-5 text-sm">
          © {YEAR} {profile.name}. Site développé avec React et Laravel.
        </p>
      </div>
    </footer>
  )
}
