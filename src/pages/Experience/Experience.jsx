import SectionTitle from '../../components/SectionTitle/SectionTitle'
import ExperienceCard from '../../components/ExperienceCard/ExperienceCard'
import { experience } from '../../data/experience'
import { education } from '../../data/profile'
import { GraduationCap } from 'lucide-react'
import './Experience.css'

export default function Experience() {
  return (
    <div className="experience-page">
      <section className="section experience-hero">
        <div className="container">
          <SectionTitle
            eyebrow="Experience"
            title="Where I've worked"
            description="A timeline of my professional development experience and the systems I've built."
          />
        </div>
      </section>

      <section className="section experience-timeline">
        <div className="container">
          {experience.map((item) => (
            <ExperienceCard item={item} key={item.id} />
          ))}
        </div>
      </section>

      <section className="section experience-education">
        <div className="container">
          <SectionTitle eyebrow="Education" title="Academic background" />
          <div className="experience-education__list">
            {education.map((item) => (
              <div className="experience-education__item" key={item.degree}>
                <GraduationCap size={18} />
                <div>
                  <h4>{item.degree}</h4>
                  <p className="text-muted">{item.school}</p>
                </div>
                <span className="mono">{item.period}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
