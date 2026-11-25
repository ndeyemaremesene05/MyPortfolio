import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useContent } from '../lib/content'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Skills from '../sections/Skills'
import Database from '../sections/Database'
import Projects from '../sections/Projects'
import Versatility from '../sections/Versatility'
import Timeline from '../sections/Timeline'
import Contact from '../sections/Contact'

export default function Home() {
  const { profile } = useContent()
  const { hash } = useLocation()

  useDocumentMeta({
    title: `${profile.name}, ${profile.role.charAt(0).toLowerCase()}${profile.role.slice(1)}`,
    description: `${profile.headline} ${profile.intro}`,
    path: '/',
  })

  // Liens du type /#projets depuis une autre page
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (el) requestAnimationFrame(() => el.scrollIntoView())
  }, [hash])

  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Database />
      <Projects />
      <Versatility />
      <Timeline />
      <Contact />
    </>
  )
}
