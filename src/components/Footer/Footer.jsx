import { Link } from 'react-router-dom'
import { Github, Linkedin, Instagram, ArrowUpRight } from 'lucide-react'
import { navLinks } from '../../data/navigation'
import { profile } from '../../data/profile'
import { socialLinks } from '../../data/social'
import './Footer.css'

const icons = { Github, Linkedin, Instagram }

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <h3>{profile.name}</h3>
          <p className="mono footer__role">{profile.title}</p>
        </div>

        <Link to="/contact" className="footer__cta link-underline">
          Start a conversation
          <ArrowUpRight size={18} />
        </Link>
      </div>

      <div className="container footer__grid">
        <nav className="footer__nav" aria-label="Footer">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} className="footer__nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="footer__contact">
          <a href={`mailto:${profile.email}`} className="link-underline">
            {profile.email}
          </a>
          <a href={`tel:${profile.phoneHref}`} className="link-underline">
            {profile.phone}
          </a>
          <span className="text-muted">{profile.location}</span>
        </div>

        <div className="footer__social">
          {socialLinks.map((social) => {
            const Icon = icons[social.icon]
            return (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noreferrer"
                className="footer__social-link"
              >
                {Icon && <Icon size={18} />}
              </a>
            )
          })}
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© 2026 {profile.name}. All rights reserved.</span>
      </div>
    </footer>
  )
}
