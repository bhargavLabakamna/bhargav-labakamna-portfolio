import { useMemo, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import SectionTitle from '../../components/SectionTitle/SectionTitle'
import ProjectCard from '../../components/ProjectCard/ProjectCard'
import { projects, projectFilters } from '../../data/projects'
import './Projects.css'

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return projects
    return projects.filter((p) => p.tags.includes(activeFilter))
  }, [activeFilter])

  return (
    <div className="projects-page">
      <section className="section projects-hero">
        <div className="container">
          <SectionTitle
            eyebrow="Projects"
            title="Selected work"
          />

          <LayoutGroup>
            <div className="projects-filter" role="tablist" aria-label="Filter projects by category">
              {projectFilters.map((filter) => (
                <button
                  key={filter}
                  role="tab"
                  aria-selected={activeFilter === filter}
                  className={`projects-filter__btn ${activeFilter === filter ? 'is-active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {activeFilter === filter && (
                    <motion.span
                      layoutId="filter-pill"
                      className="projects-filter__pill"
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <span className="projects-filter__label">{filter}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </div>
      </section>

      <section className="section projects-grid-section">
        <div className="container">
          <motion.div layout className="projects-grid">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ProjectCard project={project} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <p className="projects-empty text-muted">No projects in this category yet.</p>
          )}
        </div>
      </section>
    </div>
  )
}
