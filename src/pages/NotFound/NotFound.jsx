import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import MagneticButton from '../../components/MagneticButton/MagneticButton'
import './NotFound.css'

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="container not-found__inner">
        <motion.span
          className="not-found__code"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          404
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          Page not found
        </motion.h1>
        <motion.p
          className="text-muted"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <MagneticButton>
            <Link to="/" className="btn btn-primary" data-cursor-hover>
              <ArrowLeft size={17} />
              Back Home
            </Link>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}
