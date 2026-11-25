import { useState } from 'react'
import { LoaderCircle, Mail, Send } from 'lucide-react'
import { useContent } from '../lib/content'
import { API_ENABLED, sendContact } from '../lib/api'
import { SectionHeader } from '../components/ui'

const EMPTY = { name: '', email: '', company: '', message: '', website: '' }

function validate(v) {
  const e = {}
  if (v.name.trim().length < 2) e.name = 'Indiquez votre nom.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Indiquez une adresse email valide, par exemple nom@entreprise.com.'
  if (v.message.trim().length < 10) e.message = 'Votre message doit contenir au moins 10 caractères.'
  if (v.message.length > 3000) e.message = 'Votre message dépasse 3 000 caractères.'
  return e
}

function Field({ id, label, error, optional, children }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between text-[0.95rem] font-semibold">
        {label}
        {optional && <span className="text-sm font-normal text-slate">Facultatif</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-[#b3261e]">
          {error}
        </p>
      )}
    </div>
  )
}

const inputCls = (error) =>
  `mt-1.5 w-full rounded-lg border bg-white px-3.5 py-2.5 text-ink outline-none transition-colors placeholder:text-slate/60 focus:border-emerald focus:ring-2 focus:ring-emerald/20 ${
    error ? 'border-[#b3261e]' : 'border-line'
  }`

export default function Contact() {
  const { profile } = useContent()
  const { contact } = profile
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle') // idle | sending | sent | unavailable | throttled | mailto

  const update = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(
    values.company ? `Contact portfolio, ${values.company}` : 'Contact depuis votre portfolio',
  )}&body=${encodeURIComponent(values.message)}`

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus()
      return
    }
    // Site publié sans API : on ouvre la messagerie du visiteur avec le message prérempli
    if (!API_ENABLED) {
      window.location.href = mailto
      setState('mailto')
      return
    }
    setState('sending')
    const result = await sendContact(values)
    if (result.status === 'sent') {
      setValues(EMPTY)
      setState('sent')
    } else if (result.status === 'invalid') {
      const apiErrors = Object.fromEntries(Object.entries(result.errors).map(([k, msgs]) => [k, msgs[0]]))
      setErrors(apiErrors)
      setState('idle')
    } else {
      setState(result.status)
    }
  }

  return (
    <section aria-labelledby="contact" className="border-t border-line bg-surface py-20 lg:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <SectionHeader id="contact" title="Contact" lead="Un stage, un poste ou une question sur un projet : écrivez-moi, je réponds rapidement." />

          <ul className="mt-10 space-y-5">
            {contact.email && (
              <li>
                <p className="text-sm text-slate">Email</p>
                <a href={`mailto:${contact.email}`} className="break-all text-xl font-bold underline decoration-line decoration-2 underline-offset-4 hover:decoration-emerald">
                  {contact.email}
                </a>
              </li>
            )}
            {contact.showPhone && contact.phone && (
              <li>
                <p className="text-sm text-slate">Téléphone</p>
                <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="text-xl font-bold">
                  {contact.phone}
                </a>
              </li>
            )}
            <li className="flex flex-wrap gap-x-8 gap-y-3 pt-2">
              {contact.linkedin && (
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="font-semibold underline decoration-line decoration-2 underline-offset-4 hover:decoration-emerald">
                  LinkedIn
                </a>
              )}
              {contact.github && (
                <a href={contact.github} target="_blank" rel="noopener noreferrer" className="font-semibold underline decoration-line decoration-2 underline-offset-4 hover:decoration-emerald">
                  GitHub
                </a>
              )}
            </li>
            <li className="text-slate">{profile.location}</li>
          </ul>
        </div>

        <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-line bg-paper p-6 sm:p-8" aria-describedby="contact-status">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="contact-name" label="Nom" error={errors.name}>
              <input id="contact-name" name="name" autoComplete="name" value={values.name} onChange={update('name')} className={inputCls(errors.name)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'contact-name-error' : undefined} />
            </Field>
            <Field id="contact-email" label="Email" error={errors.email}>
              <input id="contact-email" name="email" type="email" autoComplete="email" value={values.email} onChange={update('email')} className={inputCls(errors.email)} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'contact-email-error' : undefined} />
            </Field>
          </div>
          <div className="mt-5">
            <Field id="contact-company" label="Entreprise" optional error={errors.company}>
              <input id="contact-company" name="company" autoComplete="organization" value={values.company} onChange={update('company')} className={inputCls(errors.company)} />
            </Field>
          </div>
          <div className="mt-5">
            <Field id="contact-message" label="Message" error={errors.message}>
              <textarea id="contact-message" name="message" rows={6} value={values.message} onChange={update('message')} className={`${inputCls(errors.message)} resize-y`} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'contact-message-error' : undefined} />
            </Field>
          </div>

          {/* Champ piège anti-robots : invisible pour les humains */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
            <label htmlFor="contact-website">Ne pas remplir</label>
            <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={update('website')} />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={state === 'sending'}
              className="inline-flex items-center gap-2 rounded-full bg-emerald px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-deep disabled:opacity-60"
            >
              {state === 'sending' ? <LoaderCircle aria-hidden="true" size={18} className="animate-spin" /> : <Send aria-hidden="true" size={17} />}
              {state === 'sending' ? 'Envoi en cours' : API_ENABLED ? 'Envoyer le message' : 'Envoyer par email'}
            </button>
          </div>

          <div id="contact-status" aria-live="polite" className="mt-5">
            {state === 'mailto' && (
              <p className="rounded-lg border border-line bg-white px-4 py-3">
                Votre messagerie s’est ouverte avec votre message. Si rien ne s’est passé, écrivez à{' '}
                <a href={`mailto:${contact.email}`} className="font-semibold text-emerald underline underline-offset-4">
                  {contact.email}
                </a>
                .
              </p>
            )}
            {state === 'sent' && (
              <p className="rounded-lg bg-emerald/10 px-4 py-3 font-medium text-emerald-deep">Message envoyé. Je vous réponds par email dès que possible.</p>
            )}
            {(state === 'unavailable' || state === 'throttled') && (
              <div className="rounded-lg border border-line bg-white px-4 py-3">
                <p className="font-medium">
                  {state === 'throttled'
                    ? 'Trop d’envois en peu de temps. Réessayez dans une minute, ou écrivez-moi directement.'
                    : 'Le formulaire n’a pas pu envoyer votre message. Écrivez-moi directement, votre texte est déjà repris dans l’email.'}
                </p>
                <a href={mailto} className="mt-2 inline-flex items-center gap-2 font-semibold text-emerald underline underline-offset-4">
                  <Mail aria-hidden="true" size={16} />
                  Écrire à {contact.email}
                </a>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
