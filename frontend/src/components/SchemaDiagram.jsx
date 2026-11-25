import { TABLES, EDGES, TABLE_W, HEAD_H, ROW_H, VIEWBOX } from '../data/schema'

const byName = Object.fromEntries(TABLES.map((t) => [t.name, t]))

function anchor([tableName, colName, side]) {
  const t = byName[tableName]
  const i = t.cols.findIndex((c) => c.name === colName)
  return {
    x: side === 'left' ? t.x : t.x + TABLE_W,
    y: t.y + HEAD_H + i * ROW_H + ROW_H / 2,
    side,
  }
}

function edgePath(edge) {
  const a = anchor(edge.from)
  const b = anchor(edge.to)
  if (edge.loop) {
    const cx = Math.max(a.x, b.x) + edge.loop
    return `M ${a.x} ${a.y} C ${cx} ${a.y}, ${cx} ${b.y}, ${b.x} ${b.y}`
  }
  const dx = Math.max(40, Math.abs(b.x - a.x) / 2)
  const c1 = a.side === 'left' ? a.x - dx : a.x + dx
  const c2 = b.side === 'left' ? b.x - dx : b.x + dx
  return `M ${a.x} ${a.y} C ${c1} ${a.y}, ${c2} ${b.y}, ${b.x} ${b.y}`
}

const THEMES = {
  dark: {
    tableBg: 'var(--color-ink-2)', border: 'var(--color-ink-3)', head: '#ffffff', headBg: 'var(--color-ink-3)',
    col: 'var(--color-mist)', type: '#6d7f96', pk: 'var(--color-mint)', fk: '#f3c97a',
    edge: 'var(--color-mint)', edgeOpacity: 0.5, activeBorder: 'var(--color-mint)',
  },
  light: {
    tableBg: 'var(--color-surface)', border: 'var(--color-line)', head: 'var(--color-ink)', headBg: '#e7ebe5',
    col: 'var(--color-ink)', type: '#8a94a1', pk: 'var(--color-emerald)', fk: '#9a5b06',
    edge: 'var(--color-emerald)', edgeOpacity: 0.55, activeBorder: 'var(--color-emerald)',
  },
}

/**
 * Schéma relationnel d'Eventia.
 * theme: 'dark' (hero, décoratif) | 'light' (section bases de données, interactif)
 */
export default function SchemaDiagram({
  theme = 'light',
  animate = false,
  activeTables = [],
  activeEdges = [],
  onTableSelect,
  title = 'Schéma de la base de données d’Eventia',
  className = '',
}) {
  const t = THEMES[theme]
  const focus = activeTables.length > 0
  const interactive = typeof onTableSelect === 'function'

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
      className={className}
      role={interactive ? 'group' : 'img'}
      aria-label={title}
    >
      <defs>
        <marker id={`pk-${theme}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7">
          <circle cx="5" cy="5" r="3.2" fill={t.tableBg} stroke={t.edge} strokeWidth="1.6" />
        </marker>
      </defs>

      <g fill="none">
        {EDGES.map((edge, i) => {
          const on = activeEdges.includes(edge.id)
          return (
            <path
              key={edge.id}
              d={edgePath(edge)}
              pathLength="1"
              stroke={t.edge}
              strokeWidth={on ? 2.4 : 1.4}
              strokeOpacity={focus ? (on ? 1 : 0.12) : t.edgeOpacity}
              markerEnd={`url(#pk-${theme})`}
              className={animate ? 'schema-edge-draw' : undefined}
              style={animate ? { '--len': 1, '--delay': `${0.5 + i * 0.12}s`, transition: 'stroke-opacity .25s' } : { transition: 'stroke-opacity .25s, stroke-width .25s' }}
            />
          )
        })}
      </g>

      {TABLES.map((table, ti) => {
        const h = HEAD_H + table.cols.length * ROW_H
        const on = activeTables.includes(table.name)
        const dim = focus && !on
        const select = () => onTableSelect?.(table.name)
        return (
          <g key={table.name} transform={`translate(${table.x} ${table.y})`}>
          <g
            className={animate ? 'schema-table-in' : undefined}
            style={{ '--delay': `${ti * 0.06}s`, ...(animate ? {} : { opacity: dim ? 0.35 : 1, transition: 'opacity .25s' }) }}
            {...(interactive && {
              role: 'button',
              tabIndex: 0,
              'aria-pressed': on,
              'aria-label': `Table ${table.name}`,
              onClick: select,
              onKeyDown: (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  select()
                }
              },
              cursor: 'pointer',
            })}
          >
            <rect width={TABLE_W} height={h} rx="8" fill={t.tableBg} stroke={on ? t.activeBorder : t.border} strokeWidth={on ? 2 : 1} />
            <path d={`M0 8 a8 8 0 0 1 8 -8 h${TABLE_W - 16} a8 8 0 0 1 8 8 v${HEAD_H - 8} h-${TABLE_W} z`} fill={t.headBg} />
            <text x="12" y="20" fill={t.head} fontSize="13" fontWeight="700" fontFamily="var(--font-mono)">
              {table.name}
            </text>
            {table.cols.map((col, i) => {
              const y = HEAD_H + i * ROW_H + 15
              const keyColor = col.key === 'pk' ? t.pk : col.key === 'fk' ? t.fk : null
              return (
                <g key={col.name}>
                  {keyColor && (
                    <text x="12" y={y} fill={keyColor} fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">
                      {col.key.toUpperCase()}
                    </text>
                  )}
                  <text x="34" y={y} fill={keyColor || t.col} fontSize="11.5" fontFamily="var(--font-mono)">
                    {col.name}
                  </text>
                  <text x={TABLE_W - 10} y={y} fill={t.type} fontSize="10" textAnchor="end" fontFamily="var(--font-mono)">
                    {col.type}
                  </text>
                </g>
              )
            })}
          </g>
          </g>
        )
      })}
    </svg>
  )
}
