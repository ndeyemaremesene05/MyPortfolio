// Copie le build React (dist/) dans backend/public/ pour que Laravel serve le site.
// dist/index.html devient public/app.html (lu par routes/web.php), le reste est copié tel quel.
import { cpSync, existsSync, readdirSync, renameSync, rmSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = resolve(root, 'dist')
const target = resolve(root, '../backend/public')

if (!existsSync(dist)) {
  console.error('dist/ introuvable : lancez d’abord "npm run build".')
  process.exit(1)
}
if (!existsSync(resolve(target, 'index.php'))) {
  console.error(`${target} ne ressemble pas au dossier public d’un projet Laravel (index.php absent).`)
  process.exit(1)
}

// Les anciens fichiers du build (noms avec empreinte) sont remplacés
rmSync(resolve(target, 'assets'), { recursive: true, force: true })

for (const entry of readdirSync(dist)) {
  if (entry === 'index.html') continue
  // index.php et .htaccess de Laravel ne sont jamais écrasés
  if (entry === '.htaccess') continue
  cpSync(resolve(dist, entry), resolve(target, entry), { recursive: true, force: true })
}
cpSync(resolve(dist, 'index.html'), resolve(target, 'app.html.tmp'))
renameSync(resolve(target, 'app.html.tmp'), resolve(target, 'app.html'))

console.log(`Site React copié dans ${target} (page : app.html)`)
