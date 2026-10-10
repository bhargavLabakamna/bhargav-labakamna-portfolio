import './Marquee.css'

const items = [
  'PHP',
  'Laravel',
  'REST API',
  'MySQL',
  'JavaScript',
  'AJAX',
  'jQuery',
  'API Integration',
  'Payment Gateway',
  'Google Services',
]

export default function Marquee() {
  return (
    <div className="marquee" role="presentation" aria-hidden="true">
      <div className="marquee__track">
        {[...items, ...items].map((item, i) => (
          <span className="marquee__item" key={i}>
            {item}
            <span className="marquee__dot">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}
