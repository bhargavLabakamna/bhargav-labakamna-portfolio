import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import './ExperienceCard.css'

export default function ExperienceCard({ item }) {
  return (
    <div className="exp-card">
      <div className="exp-card__rail">
        <motion.span
          className="exp-card__dot"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
        <span className="exp-card__line" />
      </div>

      <motion.div
        className="exp-card__content"
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="exp-card__meta">
          <span className="mono exp-card__period">{item.period}</span>
          {item.current && <span className="exp-card__badge">Current</span>}
        </div>

        <h3 className="exp-card__role">{item.role}</h3>
        <p className="exp-card__company text-muted">{item.company}</p>

        <ul className="exp-card__list">
          {item.responsibilities.map((r) => (
            <li key={r}>
              <Check size={15} />
              <span>{r}</span>
            </li>
          ))}
        </ul>

        <div className="exp-card__tags">
          {item.integrations.map((tag) => (
            <span key={tag} className="mono exp-card__tag">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
