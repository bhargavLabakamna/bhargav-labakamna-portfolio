import * as Icons from 'lucide-react'
import { motion } from 'framer-motion'
import './SkillCard.css'

export default function SkillCard({ skill, index = 0 }) {
  const Icon = Icons[skill.icon] || Icons.Code2

  return (
    <motion.div
      className="skill-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: (index % 4) * 0.06 }}
      data-cursor-hover
    >
      <div className="skill-card__icon">
        <Icon size={22} />
      </div>
      <h4 className="skill-card__name">{skill.name}</h4>
      <p className="skill-card__desc text-muted">{skill.description}</p>
    </motion.div>
  )
}
