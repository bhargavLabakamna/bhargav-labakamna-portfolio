import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Activity } from 'lucide-react'
import GridBackground from '../../components/GridBackground/GridBackground'
import Marquee from '../../components/Marquee/Marquee'
import SectionTitle from '../../components/SectionTitle/SectionTitle'
import ProjectCard from '../../components/ProjectCard/ProjectCard'
import StatCounter from '../../components/StatCounter/StatCounter'
import MagneticButton from '../../components/MagneticButton/MagneticButton'
import { profile, stats } from '../../data/profile'
import { projects } from '../../data/projects'
import { processSteps } from '../../data/process'
import './Home.css'

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
}

export default function Home() {
  const featured = projects.slice(0, 3)

  return (
    <div className="home">
      {/* ===================== HERO ===================== */}
      <section className="hero">
        <GridBackground />
        <div className="container hero__inner">
          <div className="hero__text">
            <motion.span
              className="eyebrow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="hero__status-dot" />
              Available for work
            </motion.span>

            <p className="hero__greeting">Hello, I&apos;m</p>
            <motion.h1
              className="hero__heading"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              {profile.name}
            </motion.h1>

            <motion.p
              className="hero__role"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32 }}
            >
              {profile.title}<span className="hero__caret" aria-hidden="true" />
            </motion.p>

            <motion.p
              className="hero__desc"
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              I design and build fast, secure and beautiful web applications — from clean APIs to pixel-perfect interfaces that feel alive.
            </motion.p>

            <motion.div
              className="hero__actions"
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.68, ease: [0.16, 1, 0.3, 1] }}
            >
              <MagneticButton>
                <Link to="/projects" className="btn btn-primary" data-cursor-hover>
                  View my work
                  <ArrowRight />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link to="/contact" className="btn btn-ghost" data-cursor-hover>
                  Let&apos;s talk
                  <ArrowUpRight />
                </Link>
              </MagneticButton>
            </motion.div>

            <motion.div
              className="hero__socials"
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={`mailto:${profile.email}`}>Email</a>
            </motion.div>
          </div>

          <motion.div
            className="hero__visual"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-code-window">
              <div className="hero-code-window__top">
                <span className="hero-code-window__dots"><i /><i /><i /></span>
                <span>Portfolio.php</span>
                <span className="hero-code-window__live" />
              </div>
              <div className="hero-code-window__code mono" aria-label="Example PHP code">
                <p><span>01</span><code><b>&lt;?php</b></code></p>
                <p><span>02</span><code /></p>
                <p><span>03</span><code><em>namespace</em> App\Developer;</code></p>
                <p><span>04</span><code /></p>
                <p><span>05</span><code><em>class</em> <strong>Portfolio</strong></code></p>
                <p><span>06</span><code>{'{'}</code></p>
                <p><span>07</span><code>&nbsp;&nbsp;public string <i>$name</i> = <u>&apos;{profile.name}&apos;</u>;</code></p>
                <p><span>08</span><code>&nbsp;&nbsp;public array <i>$stack</i> = [</code></p>
                <p><span>09</span><code>&nbsp;&nbsp;&nbsp;&nbsp;<u>&apos;Laravel&apos;</u>, <u>&apos;PHP&apos;</u>,</code></p>
                <p><span>10</span><code>&nbsp;&nbsp;&nbsp;&nbsp;<u>&apos;MySQL&apos;</u>, <u>&apos;JavaScript&apos;</u></code></p>
                <p><span>11</span><code>&nbsp;&nbsp;];</code></p>
                <p><span>12</span><code /></p>
                <p><span>13</span><code>&nbsp;&nbsp;<em>public function</em> <strong>build</strong>(): <b>Magic</b></code></p>
                <p><span>14</span><code>&nbsp;&nbsp;{'{'}</code></p>
                <p><span>15</span><code>&nbsp;&nbsp;&nbsp;&nbsp;<em>return</em> <i>$ideas</i>-&gt;<strong>ship</strong>();</code></p>
                <p><span>16</span><code>&nbsp;&nbsp;{'}'}</code></p>
                <p><span>17</span><code>{'}'}<span className="hero__caret" /></code></p>
              </div>
            </div>
            <div className="hero-float hero-float--php"><span /> PHP 8</div>
            <div className="hero-float hero-float--mysql"><span /> MySQL</div>
            <div className="hero-float hero-float--api"><span /> REST API</div>
            <motion.div className="hero-speed" animate={{ y: [0, -7, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
              <span>Page speed</span>
              <strong>99<small>/100</small></strong>
              <Activity size={34} />
            </motion.div>
          </motion.div>
        </div>
        <a href="#home-about" className="hero__scroll" aria-label="Scroll to about section">
          <span />
          SCROLL
        </a>
      </section>

      <Marquee />

      {/* ===================== ABOUT PREVIEW ===================== */}
      <section className="section about-preview" id="home-about">
        <div className="container about-preview__inner">
          <SectionTitle eyebrow="About" title="A developer who builds for real workflows" />

          <div className="about-preview__grid">
            <p className="about-preview__text">{profile.about}</p>

            <div className="about-preview__stats">
              {stats.map((stat, i) => (
                <StatCounter key={stat.label} value={stat.value} label={stat.label} index={i} />
              ))}
            </div>
          </div>

          <Link to="/about" className="link-underline about-preview__link">
            More about my background
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ===================== FEATURED PROJECTS ===================== */}
      <section className="section featured">
        <div className="container">
          <div className="featured__head">
            <SectionTitle eyebrow="Selected Work" title="A few things I've built" />
            <Link to="/projects" className="link-underline featured__all">
              View all projects
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="featured__grid">
            {featured.map((project, i) => (
              <ProjectCard project={project} key={project.id} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== PROCESS ===================== */}
      <section className="section process">
        <div className="container">
          <SectionTitle eyebrow="How I Work" title="A straightforward process" />

          <div className="process__list">
            {processSteps.map((step, i) => (
              <motion.div
                className="process__item"
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
              >
                <span className="mono process__number">{step.number}</span>
                <h4>{step.title}</h4>
                <p className="text-muted">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FINAL CTA ===================== */}
      <section className="section final-cta">
        <div className="container final-cta__inner">
          <SectionTitle
            align="center"
            title="Let's create something useful."
            description="Have a project, opportunity or idea in mind? I'd like to hear about it."
          />
          <MagneticButton>
            <Link to="/contact" className="btn btn-primary final-cta__btn" data-cursor-hover>
              Start a Conversation
              <ArrowUpRight />
            </Link>
          </MagneticButton>
        </div>
      </section>
    </div>
  )
}
