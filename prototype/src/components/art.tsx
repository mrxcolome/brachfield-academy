import { CSSProperties } from 'react'

/* ============================================================
   Sistema de imágenes de marca — arte generativo SVG
   Portadas deterministas (mismo título → misma portada), paleta
   del design system: papel, navy, ámbar. Sin assets externos.
   ============================================================ */

const PAPER = 'oklch(96.5% 0.008 90)'
const PAPER_2 = 'oklch(93% 0.012 90)'
const NAVY = 'oklch(29% 0.06 258)'
const NAVY_SOFT = 'oklch(38% 0.07 258)'
const NAVY_FAINT = 'oklch(88% 0.025 258)'
const AMBER = 'oklch(72% 0.13 75)'
const AMBER_SOFT = 'oklch(85% 0.07 80)'
const INK_DARK = 'oklch(20% 0.02 260)'

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** PRNG determinista (mulberry32) sembrado por el título. */
function rng(seed: number) {
  let a = seed
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type CoverKind = 'curso' | 'video' | 'podcast' | 'guia' | 'checklist' | 'plantilla' | 'webinar' | 'caso' | 'articulo'

const KIND_GLYPH: Record<CoverKind, string> = {
  curso: '▶', video: '▶', podcast: '◑', guia: '▤', checklist: '✓',
  plantilla: '▦', webinar: '◉', caso: '▣', articulo: '▤',
}

/* --- composiciones (240×150 viewBox) --- */

function compArcs(r: () => number) {
  const cx = 40 + r() * 160
  const cy = r() > 0.5 ? -10 : 160
  const n = 4 + Math.floor(r() * 3)
  const rings = []
  for (let i = 0; i < n; i++) {
    const rad = 26 + i * (16 + r() * 10)
    rings.push(
      <circle key={i} cx={cx} cy={cy} r={rad} fill="none"
        stroke={i === Math.floor(n / 2) ? AMBER : NAVY} strokeOpacity={i === Math.floor(n / 2) ? 0.9 : 0.16 + r() * 0.12}
        strokeWidth={i === Math.floor(n / 2) ? 3 : 1.5} />,
    )
  }
  return rings
}

function compBars(r: () => number) {
  const n = 5 + Math.floor(r() * 4)
  const bars = []
  const accent = Math.floor(r() * n)
  for (let i = 0; i < n; i++) {
    const w = 240 / n
    const h = 30 + r() * 110
    bars.push(
      <rect key={i} x={i * w + w * 0.18} y={150 - h} width={w * 0.64} height={h} rx={3}
        fill={i === accent ? AMBER : NAVY} opacity={i === accent ? 0.95 : 0.1 + r() * 0.14} />,
    )
  }
  return bars
}

function compGrid(r: () => number) {
  const dots = []
  const cols = 10, rows = 6
  const ax = Math.floor(r() * cols), ay = Math.floor(r() * rows)
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const isA = x === ax && y === ay
      const rr = isA ? 9 : 1.6 + r() * 2.4
      dots.push(
        <circle key={`${x}-${y}`} cx={16 + x * 23} cy={16 + y * 24} r={rr}
          fill={isA ? AMBER : NAVY} opacity={isA ? 0.95 : 0.16 + r() * 0.18} />,
      )
    }
  }
  return dots
}

function compWedge(r: () => number) {
  const x = 60 + r() * 120
  const flip = r() > 0.5
  return [
    <polygon key="w" points={flip ? `0,150 ${x},0 240,150` : `0,0 ${x},150 240,0`} fill={NAVY} opacity={0.1} />,
    <polygon key="w2" points={flip ? `0,150 ${x * 0.6},${150 - x * 0.55} ${x},150` : `60,0 ${x},${x * 0.5} ${Math.min(x + 60, 240)},0`} fill={NAVY} opacity={0.16} />,
    <line key="l" x1={flip ? 0 : 240} y1={flip ? 150 : 0} x2={x} y2={flip ? 0 : 150} stroke={AMBER} strokeWidth={3} />,
  ]
}

function compSteps(r: () => number) {
  const n = 5
  const parts = []
  const accent = Math.floor(r() * n)
  for (let i = 0; i < n; i++) {
    const h = 20 + (i + 1) * 22
    parts.push(
      <rect key={i} x={12 + i * 45} y={150 - h} width={34} height={h} rx={3}
        fill={i === accent ? AMBER : 'none'} stroke={NAVY}
        strokeOpacity={i === accent ? 0 : 0.35} strokeWidth={1.5}
        opacity={i === accent ? 0.95 : 1} />,
    )
  }
  return parts
}

const COMPS = [compArcs, compBars, compGrid, compWedge, compSteps]

export function Cover({ title, kind = 'curso', style, radius = 0, glyph = true }: {
  title: string
  kind?: CoverKind
  style?: CSSProperties
  radius?: number
  glyph?: boolean
}) {
  const seed = hash(title)
  const r = rng(seed)
  const comp = COMPS[seed % COMPS.length]
  const bg = seed % 3 === 0 ? PAPER_2 : PAPER
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: radius, display: 'grid', ...style }} role="img" aria-label={title}>
      <svg viewBox="0 0 240 150" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block', background: bg }}>
        {comp(r)}
      </svg>
      {glyph && (
        <span aria-hidden style={{
          position: 'absolute', left: 8, bottom: 8, width: 22, height: 22, borderRadius: 6,
          background: 'rgba(255,255,255,.92)', color: NAVY, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 11, fontFamily: 'var(--font-mono)',
        }}>{KIND_GLYPH[kind]}</span>
      )}
    </div>
  )
}

/** Portada cuadrada de podcast: número de episodio grande, estilo editorial. */
export function PodcastCover({ title, style, radius = 0 }: { title: string; style?: CSSProperties; radius?: number }) {
  const ep = /Ep\.\s*(\d+)/.exec(title)?.[1] ?? '•'
  const seed = hash(title)
  const dark = seed % 2 === 0
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: radius, background: dark ? INK_DARK : NAVY, ...style }} role="img" aria-label={title}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
        <circle cx={78} cy={26} r={30} fill="none" stroke={AMBER} strokeOpacity={0.75} strokeWidth={1.4} />
        <circle cx={78} cy={26} r={20} fill="none" stroke={AMBER_SOFT} strokeOpacity={0.4} strokeWidth={1} />
        <circle cx={78} cy={26} r={10} fill="none" stroke={AMBER_SOFT} strokeOpacity={0.3} strokeWidth={1} />
        <text x={9} y={58} fill="#fff" fontSize={30} fontWeight={700} fontFamily="IBM Plex Mono, monospace">{ep}</text>
        <text x={9} y={73} fill={NAVY_FAINT} fontSize={6.5} letterSpacing={1} fontFamily="IBM Plex Mono, monospace">EL PODCAST DE</text>
        <text x={9} y={83} fill="#fff" fontSize={7} letterSpacing={1} fontWeight={600} fontFamily="IBM Plex Mono, monospace">BRACHFIELD</text>
        <text x={9} y={92} fill="#fff" fontSize={7} letterSpacing={1} fontWeight={600} fontFamily="IBM Plex Mono, monospace">ACADEMY</text>
      </svg>
    </div>
  )
}

/** Avatar monograma de Pere Brachfield (a sustituir por foto real cuando exista). */
export function Avatar({ size = 36, style }: { size?: number; style?: CSSProperties }) {
  return (
    <div aria-label="Pere Brachfield" role="img" style={{
      width: size, height: size, borderRadius: '100%', flex: 'none',
      background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_SOFT} 100%)`,
      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 600, fontSize: size * 0.38, letterSpacing: '0.02em', ...style,
    }}>PB</div>
  )
}

/** Retrato editorial para la landing y "Sobre Pere": composición tipográfica sobria. */
export function Portrait({ style, radius = 14, label = 'Pere Brachfield' }: { style?: CSSProperties; radius?: number; label?: string }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: radius, background: NAVY, ...style }} role="img" aria-label={label}>
      <svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
        <circle cx={100} cy={190} r={110} fill={NAVY_SOFT} opacity={0.5} />
        <circle cx={100} cy={58} r={26} fill={NAVY_FAINT} opacity={0.9} />
        <path d="M 48 150 Q 48 96 100 96 Q 152 96 152 150 Z" fill={NAVY_FAINT} opacity={0.9} />
        <circle cx={100} cy={58} r={34} fill="none" stroke={AMBER} strokeWidth={1.6} strokeDasharray="3 5" opacity={0.8} />
        <text x={100} y={64} textAnchor="middle" fill={NAVY} fontSize={17} fontWeight={700} fontFamily="IBM Plex Sans, sans-serif">PB</text>
      </svg>
      <span className="mono" style={{
        position: 'absolute', left: 10, bottom: 8, fontSize: 10, color: 'rgba(255,255,255,.85)', letterSpacing: '0.06em',
      }}>{label.toUpperCase()}</span>
    </div>
  )
}

/** Vista previa de un documento PDF: página con título y renglones. */
export function PdfPreview({ title, checklist = false, style, radius = 10 }: {
  title: string
  checklist?: boolean
  style?: CSSProperties
  radius?: number
}) {
  const lines = [92, 78, 86, 64, 88, 72, 82, 58]
  return (
    <div style={{ overflow: 'hidden', borderRadius: radius, border: '1px solid var(--border)', background: PAPER, padding: '9% 9% 6%', ...style }} role="img" aria-label={`Vista previa: ${title}`}>
      <div style={{ background: '#fff', borderRadius: 4, boxShadow: '0 2px 10px rgba(0,0,0,.07)', padding: '10% 9%', height: '100%', boxSizing: 'border-box' }}>
        <div className="mono" style={{ fontSize: 8, color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: 6 }}>BRACHFIELD ACADEMY</div>
        <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.25, marginBottom: 10, color: 'var(--ink)' }}>{title}</div>
        <div style={{ height: 2.5, width: 34, background: AMBER, borderRadius: 2, marginBottom: 12 }} />
        {lines.map((w, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
            {checklist && <span style={{ width: 7, height: 7, border: `1.3px solid ${NAVY}`, borderRadius: 2, opacity: 0.55, flex: 'none' }} />}
            <div style={{ height: 4, borderRadius: 2, background: 'var(--skeleton)', width: `${w}%` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

/** Mini-mockup no interactivo de la Home privada, para la landing. */
export function DashboardMock({ style }: { style?: CSSProperties }) {
  const card = (w: string): CSSProperties => ({ background: '#fff', border: '1px solid var(--border)', borderRadius: 6, width: w })
  return (
    <div aria-label="Vista del panel del miembro" role="img" style={{
      display: 'flex', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)',
      background: 'var(--bg)', pointerEvents: 'none', userSelect: 'none', ...style,
    }}>
      <div style={{ width: '18%', background: '#fff', borderRight: '1px solid var(--border-soft)', padding: '3% 2%' }}>
        <div style={{ fontWeight: 700, fontSize: 'clamp(7px, 1.1vw, 11px)', marginBottom: '14%' }}>Brachfield <span style={{ color: 'var(--brand-link)' }}>Academy</span></div>
        {['Inicio', 'Mi formación', 'Explorar', 'Biblioteca', 'Herramientas', 'Actualidad', 'Eventos'].map((l, i) => (
          <div key={l} style={{
            fontSize: 'clamp(6px, 0.9vw, 10px)', padding: '5% 7%', borderRadius: 4, marginBottom: 2,
            background: i === 0 ? 'var(--brand-soft)' : 'transparent',
            color: i === 0 ? 'var(--brand)' : 'var(--ink-2)', fontWeight: i === 0 ? 600 : 500,
          }}>{l}</div>
        ))}
      </div>
      <div style={{ flex: 1, padding: '2.5% 3%' }}>
        <div style={{ fontSize: 'clamp(8px, 1.3vw, 13px)', fontWeight: 700, marginBottom: '0.6%' }}>Hola, Javier</div>
        <div style={{ fontSize: 'clamp(6px, 0.9vw, 10px)', color: 'var(--muted)', marginBottom: '2.5%' }}>¿Qué quieres aprender hoy?</div>
        <div style={{ ...card('100%'), display: 'flex', gap: '3%', padding: '2.5%', alignItems: 'center', marginBottom: '2.5%' }}>
          <Cover title="Cómo negociar con un cliente moroso" kind="curso" glyph={false} radius={4} style={{ width: '26%', aspectRatio: '16/9', flex: 'none' }} />
          <div style={{ flex: 1 }}>
            <div className="mono" style={{ fontSize: 'clamp(5px, 0.7vw, 8px)', color: 'var(--muted)' }}>CURSO · 67%</div>
            <div style={{ fontSize: 'clamp(7px, 1vw, 11px)', fontWeight: 600, margin: '2% 0' }}>Cómo negociar con un cliente moroso</div>
            <div style={{ height: 3, borderRadius: 2, background: 'var(--track)', overflow: 'hidden', width: '70%' }}><div style={{ width: '67%', height: '100%', background: 'var(--brand)' }} /></div>
          </div>
          <div style={{ background: 'var(--brand)', color: '#fff', borderRadius: 4, padding: '1.5% 3%', fontSize: 'clamp(6px, 0.8vw, 9px)', fontWeight: 600 }}>Continuar</div>
        </div>
        <div style={{ display: 'flex', gap: '2.5%' }}>
          {['Cuándo enviar un burofax', 'Cómo calcular intereses de demora', 'Objeciones habituales en la negociación'].map(t => (
            <div key={t} style={{ ...card('32%'), overflow: 'hidden' }}>
              <Cover title={t} kind="video" glyph={false} style={{ aspectRatio: '16/9' }} />
              <div style={{ padding: '4% 6%', fontSize: 'clamp(6px, 0.8vw, 9px)', fontWeight: 600 }}>{t}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
