import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react'
import { navLinks } from '../../data/navigation'
import { profile } from '../../data/profile'
import './Header.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [lightTheme, setLightTheme] = useState(
    () => window.localStorage.getItem('portfolio-theme') === 'light'
  )
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    document.documentElement.dataset.theme = lightTheme ? 'light' : 'dark'
    window.localStorage.setItem('portfolio-theme', lightTheme ? 'light' : 'dark')
  }, [lightTheme])

  return (
    <>
      <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
        <div className="container header__inner">
          <Link to="/" className="header__logo" aria-label={`${profile.name} — home`}>
            <span className="header__logo-mark">{profile.initials}</span>
            <span className="header__logo-name">{profile.name}</span>
          </Link>

          <nav className="header__nav" aria-label="Primary">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `header__nav-link ${isActive ? 'is-active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="header__actions">
            <button
              className="header__theme-btn"
              onClick={() => setLightTheme((current) => !current)}
              aria-label={`Switch to ${lightTheme ? 'dark' : 'light'} theme`}
              title={`Switch to ${lightTheme ? 'dark' : 'light'} theme`}
            >
              {lightTheme ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <Link to="/contact" className="btn btn-ghost header__cta">
              Let's Talk <ArrowUpRight />
            </Link>
            <button
              className="header__menu-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-nav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mobile-nav__top">
              <span className="header__logo-mark">{profile.initials}</span>
              <button
                className="header__menu-btn"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="mobile-nav__links" aria-label="Mobile primary">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 + i * 0.05 }}
                >
                  <NavLink
                    to={link.path}
                    className={({ isActive }) => `mobile-nav__link ${isActive ? 'is-active' : ''}`}
                  >
                    <span className="mono mobile-nav__index">0{i + 1}</span>
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className="mobile-nav__footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a href={`mailto:${profile.email}`} className="mobile-nav__contact-link">
                {profile.email}
              </a>
              <a href={`tel:${profile.phoneHref}`} className="mobile-nav__contact-link">
                {profile.phone}
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
