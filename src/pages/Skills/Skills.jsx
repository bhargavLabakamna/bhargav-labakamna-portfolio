import { motion } from 'framer-motion'
import SectionTitle from '../../components/SectionTitle/SectionTitle'
import SkillCard from '../../components/SkillCard/SkillCard'
import { skillCategories } from '../../data/skills'
import './Skills.css'

export default function Skills() {
  return (
    <div className="skills-page">
      <section className="section skills-hero">
        <div className="container">
          <SectionTitle
            eyebrow="Skills"
            title="What I work with"
            description="Technologies and capabilities I use to build backend systems, admin tools and integrations."
          />
        </div>
      </section>

      {skillCategories.map((category, catIndex) => (
        <section className="section skills-category" key={category.id}>
          <div className="container">
            <motion.h3
              className="skills-category__title"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="mono skills-category__number">0{catIndex + 1}</span>
              {category.title}
            </motion.h3>

            <div className="skills-category__grid">
              {category.skills.map((skill, i) => (
                <SkillCard skill={skill} key={skill.name} index={i} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}
