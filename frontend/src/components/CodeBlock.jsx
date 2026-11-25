// Coloration minimale (mots-clés, chaînes, paramètres) sans dépendance.
function tokenize(code, language) {
  const parts = []
  const pattern =
    language === 'sql'
      ? /('(?:[^']*)')|(:\w+)|\b(SELECT|FROM|JOIN|LEFT|ON|AND|OR|WHERE|ORDER|GROUP|BY|AS|COUNT|SUM|DESC|ASC|HAVING|LIMIT)\b/g
      : /('(?:[^']*)')|(\$\w+)|\b(function|Schema|Blueprint)\b/g
  let last = 0
  for (const m of code.matchAll(pattern)) {
    if (m.index > last) parts.push({ t: code.slice(last, m.index) })
    parts.push({ t: m[0], k: m[1] ? 'str' : m[2] ? 'var' : 'kw' })
    last = m.index + m[0].length
  }
  if (last < code.length) parts.push({ t: code.slice(last) })
  return parts
}

const COLORS = { kw: 'text-mint', str: 'text-[#f3c97a]', var: 'text-[#b9a8ff]' }

export default function CodeBlock({ code, language = 'sql', label }) {
  return (
    <pre
      className="overflow-x-auto rounded-xl bg-ink p-5 font-mono text-[0.84rem] leading-relaxed text-white/85"
      aria-label={label}
      tabIndex={0}
    >
      <code>
        {tokenize(code, language).map((p, i) =>
          p.k ? (
            <span key={i} className={COLORS[p.k]}>
              {p.t}
            </span>
          ) : (
            p.t
          ),
        )}
      </code>
    </pre>
  )
}
