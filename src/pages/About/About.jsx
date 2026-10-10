import { motion } from 'framer-motion'
import { GraduationCap, MapPin, Calendar } from 'lucide-react'
import SectionTitle from '../../components/SectionTitle/SectionTitle'
import StatCounter from '../../components/StatCounter/StatCounter'
import ProfileFrame from '../../components/ProfileFrame/ProfileFrame'
import { profile, stats, education } from '../../data/profile'
import './About.css'

export default function About() {
  return (
    <div className="about-page">
      <section className="section about-hero">
        <div className="container about-hero__inner">
          <div>
            <SectionTitle
              eyebrow="About Me"
              title="Focused on clean, working software"
              description={profile.about}
            />

            <div className="about-hero__meta">
              <div className="about-hero__meta-item">
                <Calendar size={17} />
                <div>
                  <span className="about-hero__meta-label text-muted">Experience</span>
                  <span>08/2023 — Present</span>
                </div>
              </div>
              <div className="about-hero__meta-item">
                <MapPin size={17} />
                <div>
                  <span className="about-hero__meta-label text-muted">Location</span>
                  <span>Ahmedabad, Gujarat</span>
                </div>
              </div>
            </div>
          </div>

          <div className="about-hero__visual">
            <ProfileFrame />
          </div>
        </div>
      </section>

      <section className="section about-stats">
        <div className="container about-stats__grid">
          {stats.map((stat, i) => (
            <StatCounter key={stat.label} value={stat.value} label={stat.label} index={i} />
          ))}
        </div>
      </section>

      <section className="section about-education">
        <div className="container">
          <SectionTitle eyebrow="Background" title="Education" />

          <div className="about-education__list">
            {education.map((item, i) => (
              <motion.div
                className="about-education__item"
                key={item.degree}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
              >
                <div className="about-education__icon">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h4>{item.degree}</h4>
                  <p className="text-muted">{item.school}</p>
                </div>
                <span className="mono about-education__period">{item.period}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
