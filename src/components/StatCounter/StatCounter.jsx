import { motion } from 'framer-motion'
import './StatCounter.css'

export default function StatCounter({ value, label, index = 0 }) {
  return (
    <motion.div
      className="stat-counter"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 }}
    >
      <span className="stat-counter__value">{value}</span>
      <span className="stat-counter__label text-muted">{label}</span>
    </motion.div>
  )
}
