// Génère robots.txt et sitemap.xml dans public/ à partir de VITE_SITE_URL et du contenu.
// Lancé automatiquement avant "npm run build".
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const mode = process.argv[2] || 'production'

function readEnv(file) {
  const path = resolve(root, file)
  if (!existsSync(path)) return {}
  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split(/\r?\n/)
      .filter((l) => l && !l.startsWith('#') && l.includes('='))
      .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]),
  )
}

const env = { ...readEnv('.env'), ...readEnv(`.env.${mode}`), ...process.env }
const site = (env.VITE_SITE_URL || 'http://localhost:5173').replace(/\/$/, '')
const content = JSON.parse(readFileSync(resolve(root, '../content/portfolio.json'), 'utf8'))
const today = new Date().toISOString().slice(0, 10)

const urls = ['/', ...content.projects.map((p) => `/projets/${p.slug}`)]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${site}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`
writeFileSync(resolve(root, 'public/sitemap.xml'), sitemap)
writeFileSync(resolve(root, 'public/robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`)
console.log(`SEO : sitemap.xml (${urls.length} pages) et robots.txt générés pour ${site}`)
