import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { profile } from '../../data/profile'
import './PageLoader.css'

export default function PageLoader({ onFinish }) {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDone(true)
      const finishTimer = setTimeout(onFinish, 500)
      return () => clearTimeout(finishTimer)
    }, 1200)
    return () => clearTimeout(timer)
  }, [onFinish])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="page-loader"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="page-loader__bar-wrap"
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
          >
            <div className="page-loader__text">
              <motion.span
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                {profile.name.toUpperCase()}
              </motion.span>
            </div>
            <motion.div
              className="page-loader__sub mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {profile.title.toUpperCase()}
            </motion.div>
            <div className="page-loader__track">
              <motion.div
                className="page-loader__fill"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
