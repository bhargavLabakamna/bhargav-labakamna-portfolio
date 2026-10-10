import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import ProjectPreview from '../ProjectPreview/ProjectPreview'
import './ProjectCard.css'

export default function ProjectCard({ project, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.08 }}
    >
      <Link to={`/projects/${project.slug}`} className="project-card" data-cursor-hover>
        <div className="project-card__media">
          <ProjectPreview variant={project.preview} />
        </div>

        <div className="project-card__body">
          <div className="project-card__head">
            <span className="mono project-card__number">{project.number}</span>
            <span className="project-card__category">{project.category}</span>
          </div>

          <h3 className="project-card__title">
            {project.title}
            <ArrowUpRight className="project-card__arrow" size={20} />
          </h3>

          <p className="project-card__desc text-muted">{project.description}</p>

          <div className="project-card__tech">
            {project.technologies.map((t) => (
              <span key={t} className="mono project-card__tech-tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
