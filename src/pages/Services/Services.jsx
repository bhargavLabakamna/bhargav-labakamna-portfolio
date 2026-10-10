import * as Icons from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SectionTitle from '../../components/SectionTitle/SectionTitle'
import MagneticButton from '../../components/MagneticButton/MagneticButton'
import { services } from '../../data/services'
import { processSteps } from '../../data/process'
import './Services.css'

export default function Services() {
  return (
    <div className="services-page">
      <section className="section services-hero">
        <div className="container">
          <SectionTitle
            eyebrow="Services"
            title="How I can help"
            description="Backend-focused development services covering everything from a single API to a full admin system."
          />
        </div>
      </section>

      <section className="section services-grid-section">
        <div className="container services-grid">
          {services.map((service, i) => {
            const Icon = Icons[service.icon] || Icons.Code2
            return (
              <motion.div
                className="service-card"
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: (i % 4) * 0.06 }}
                data-cursor-hover
              >
                <div className="service-card__top">
                  <span className="mono service-card__number">{service.number}</span>
                  <div className="service-card__icon">
                    <Icon size={20} />
                  </div>
                </div>
                <h3>{service.title}</h3>
                <p className="text-muted">{service.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="section services-process">
        <div className="container">
          <SectionTitle eyebrow="Process" title="From idea to delivery" />
          <div className="services-process__list">
            {processSteps.map((step, i) => (
              <motion.div
                className="services-process__item"
                key={step.number}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
              >
                <span className="mono services-process__number">{step.number}</span>
                <div>
                  <h4>{step.title}</h4>
                  <p className="text-muted">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section services-cta">
        <div className="container services-cta__inner">
          <h2>Need one of these for your project?</h2>
          <MagneticButton>
            <Link to="/contact" className="btn btn-primary" data-cursor-hover>
              Let's Talk
              <ArrowUpRight />
            </Link>
          </MagneticButton>
        </div>
      </section>
    </div>
  )
}
