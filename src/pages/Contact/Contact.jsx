import { motion } from 'framer-motion'
import { Mail, Phone, MapPin } from 'lucide-react'
import SectionTitle from '../../components/SectionTitle/SectionTitle'
import ContactForm from '../../components/ContactForm/ContactForm'
import { profile } from '../../data/profile'
import './Contact.css'

export default function Contact() {
  return (
    <div className="contact-page">
      <section className="section contact-hero">
        <div className="container">
          <SectionTitle
            eyebrow="Contact"
            title="Let's build something great."
            description="Have a project, opportunity or idea? Let's discuss how I can help."
          />
        </div>
      </section>

      <section className="section contact-body">
        <div className="container contact-body__grid">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href={`mailto:${profile.email}`} className="contact-info__item" data-cursor-hover>
              <span className="contact-info__icon">
                <Mail size={19} />
              </span>
              <div>
                <span className="contact-info__label text-muted">Email</span>
                <span className="contact-info__value">{profile.email}</span>
              </div>
            </a>

            <a href={`tel:${profile.phoneHref}`} className="contact-info__item" data-cursor-hover>
              <span className="contact-info__icon">
                <Phone size={19} />
              </span>
              <div>
                <span className="contact-info__label text-muted">Phone</span>
                <span className="contact-info__value">{profile.phone}</span>
              </div>
            </a>

            <div className="contact-info__item">
              <span className="contact-info__icon">
                <MapPin size={19} />
              </span>
              <div>
                <span className="contact-info__label text-muted">Location</span>
                <span className="contact-info__value">{profile.location}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="contact-form-wrap"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>
    </div>
  )
}
