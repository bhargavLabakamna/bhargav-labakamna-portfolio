import { motion } from 'framer-motion'
import './GridBackground.css'

// Subtle animated backdrop: static grid, two slow-drifting gradient blobs,
// and a handful of soft particles. Kept quiet and out of the way of content.
export default function GridBackground() {
  return (
    <div className="grid-bg" aria-hidden="true">
      <div className="grid-bg__grid" />
      <motion.div
        className="grid-bg__blob grid-bg__blob--a"
        animate={{ x: [0, 40, 0], y: [0, 24, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="grid-bg__blob grid-bg__blob--b"
        animate={{ x: [0, -36, 0], y: [0, -20, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="grid-bg__noise" />
    </div>
  )
}
