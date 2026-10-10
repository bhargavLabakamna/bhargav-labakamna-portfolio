import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useIsFinePointer } from '../../hooks/usePointerType'

// Wraps any element (typically a Link or button) with a subtle
// magnetic pull toward the cursor on desktop pointers only.
export default function MagneticButton({ children, className = '', strength = 0.35, as: Component = 'div', ...props }) {
  const ref = useRef(null)
  const isFine = useIsFinePointer()

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 })

  const handleMouseMove = (e) => {
    if (!isFine || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const relX = e.clientX - rect.left - rect.width / 2
    const relY = e.clientY - rect.top - rect.height / 2
    x.set(relX * strength)
    y.set(relY * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      className={`magnetic ${className}`}
      style={{ x: springX, y: springY, display: 'inline-flex' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </motion.div>
  )
}
