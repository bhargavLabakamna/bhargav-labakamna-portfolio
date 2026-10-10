import './ProjectPreview.css'

// Generates an abstract, UI-mockup-style graphic per project so every
// card has a distinct visual without relying on external stock photography.
// `variant` maps to a project's `preview` field in src/data/projects.js.
const variants = {
  dashboard: (
    <>
      <rect x="16" y="16" width="70" height="14" rx="4" className="pp-block" />
      <rect x="16" y="38" width="40" height="60" rx="6" className="pp-panel" />
      <rect x="60" y="38" width="112" height="28" rx="6" className="pp-panel" />
      <rect x="60" y="70" width="52" height="28" rx="6" className="pp-panel" />
      <rect x="116" y="70" width="56" height="28" rx="6" className="pp-panel" />
      <rect x="16" y="106" width="156" height="30" rx="6" className="pp-panel" />
    </>
  ),
  stock: (
    <>
      <rect x="16" y="16" width="156" height="24" rx="6" className="pp-panel" />
      {[70, 84, 56, 66].map((h, i) => (
        <rect key={i} x={16 + i * 40} y={136 - h} width="30" height={h} rx="4" className="pp-bar" />
      ))}
      <line x1="16" y1="136" x2="172" y2="136" className="pp-line" />
    </>
  ),
  products: (
    <>
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={16 + col * 54}
            y={16 + row * 44}
            width="42"
            height="32"
            rx="6"
            className="pp-panel"
          />
        ))
      )}
    </>
  ),
  api: (
    <>
      <rect x="16" y="20" width="60" height="20" rx="10" className="pp-panel" />
      <rect x="104" y="20" width="60" height="20" rx="10" className="pp-panel" />
      <path d="M76 30 H104" className="pp-line" />
      <rect x="60" y="70" width="68" height="20" rx="10" className="pp-block" />
      <path d="M46 40 V70 H60 M138 40 V70 H128" className="pp-line" />
      <rect x="16" y="110" width="156" height="26" rx="6" className="pp-panel" />
    </>
  ),
  payment: (
    <>
      <rect x="16" y="24" width="156" height="90" rx="10" className="pp-panel" />
      <rect x="30" y="40" width="60" height="10" rx="3" className="pp-block" />
      <rect x="30" y="60" width="128" height="10" rx="3" className="pp-line-block" />
      <rect x="30" y="90" width="46" height="14" rx="7" className="pp-block" />
    </>
  ),
  integration: (
    <>
      <circle cx="46" cy="70" r="22" className="pp-panel" />
      <circle cx="142" cy="70" r="22" className="pp-panel" />
      <circle cx="94" cy="30" r="16" className="pp-block" />
      <path d="M60 60 L82 40 M128 60 L106 40" className="pp-line" />
    </>
  ),
  google: (
    <>
      <rect x="16" y="16" width="156" height="70" rx="8" className="pp-panel" />
      <circle cx="46" cy="51" r="14" className="pp-block" />
      <rect x="70" y="42" width="86" height="8" rx="4" className="pp-line-block" />
      <rect x="70" y="56" width="60" height="8" rx="4" className="pp-line-block" />
      <rect x="16" y="98" width="156" height="38" rx="8" className="pp-panel" />
    </>
  ),
  business: (
    <>
      <rect x="16" y="16" width="70" height="120" rx="8" className="pp-panel" />
      <rect x="94" y="16" width="78" height="54" rx="8" className="pp-panel" />
      <rect x="94" y="78" width="78" height="58" rx="8" className="pp-panel" />
      <rect x="28" y="30" width="46" height="8" rx="4" className="pp-line-block" />
      <rect x="28" y="46" width="30" height="8" rx="4" className="pp-line-block" />
    </>
  ),
}

export default function ProjectPreview({ variant = 'dashboard' }) {
  const content = variants[variant] || variants.dashboard

  return (
    <svg viewBox="0 0 188 152" className="project-preview" aria-hidden="true">
      <rect width="188" height="152" rx="14" className="pp-bg" />
      {content}
    </svg>
  )
}
