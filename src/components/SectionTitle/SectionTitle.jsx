import { motion } from 'framer-motion'
import './SectionTitle.css'

export default function SectionTitle({ eyebrow, title, description, align = 'left' }) {
  return (
    <div className={`section-title section-title--${align}`}>
      {eyebrow && (
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          className="section-title__desc text-muted"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.16 }}
        >
          {description}
        </motion.p>
      )}
    </div>
  )
}
