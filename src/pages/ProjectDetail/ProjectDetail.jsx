import { useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import ProjectPreview from '../../components/ProjectPreview/ProjectPreview'
import { getProjectBySlug, projects } from '../../data/projects'
import './ProjectDetail.css'

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProjectBySlug(slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  if (!project) return <Navigate to="/projects" replace />

  const currentIndex = projects.findIndex((p) => p.slug === slug)
  const next = projects[(currentIndex + 1) % projects.length]

  return (
    <div className="project-detail">
      <section className="section project-detail__hero">
        <div className="container">
          <Link to="/projects" className="project-detail__back link-underline">
            <ArrowLeft size={16} />
            Back to projects
          </Link>

          <div className="project-detail__head">
            <span className="mono project-detail__number">{project.number}</span>
            <span className="project-detail__category">{project.category}</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {project.title}
          </motion.h1>

          <p className="project-detail__desc text-muted">{project.description}</p>

          <div className="project-detail__tech">
            {project.technologies.map((t) => (
              <span key={t} className="mono project-detail__tech-tag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="project-detail__media-wrap">
        <div className="container">
          <div className="project-detail__media">
            <ProjectPreview variant={project.preview} />
          </div>
        </div>
      </section>

      <section className="section project-detail__body">
        <div className="container project-detail__grid">
          <div className="project-detail__main">
            <div className="project-detail__block">
              <h3>Overview</h3>
              <p className="text-muted">{project.overview}</p>
            </div>
            <div className="project-detail__block">
              <h3>Challenge</h3>
              <p className="text-muted">{project.challenge}</p>
            </div>
            <div className="project-detail__block">
              <h3>Solution</h3>
              <p className="text-muted">{project.solution}</p>
            </div>
            <div className="project-detail__block">
              <h3>Features</h3>
              <ul className="project-detail__list">
                {project.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="project-detail__aside">
            <div className="project-detail__aside-block">
              <span className="mono project-detail__aside-label text-muted">Integrations</span>
              <div className="project-detail__tags">
                {project.integrations.map((tag) => (
                  <span key={tag} className="project-detail__tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="project-detail__aside-block">
              <span className="mono project-detail__aside-label text-muted">Technologies</span>
              <div className="project-detail__tags">
                {project.technologies.map((tag) => (
                  <span key={tag} className="project-detail__tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="section project-detail__next">
        <div className="container">
          <Link to={`/projects/${next.slug}`} className="project-detail__next-link" data-cursor-hover>
            <span className="text-muted mono">Next Project</span>
            <span className="project-detail__next-title">
              {next.title}
              <ArrowUpRight size={22} />
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}
