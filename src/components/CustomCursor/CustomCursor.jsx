import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useIsFinePointer } from '../../hooks/usePointerType'
import './CustomCursor.css'

export default function CustomCursor() {
  const isFine = useIsFinePointer()
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })

  useEffect(() => {
    if (!isFine) return

    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const isInteractive = (el) =>
      el.closest('a, button, input, textarea, [data-cursor-hover]') !== null

    const over = (e) => setHovering(isInteractive(e.target))

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [isFine, x, y, visible])

  if (!isFine) return null

  return (
    <motion.div
      className={`custom-cursor ${hovering ? 'custom-cursor--hover' : ''} ${visible ? 'is-visible' : ''}`}
      style={{ left: springX, top: springY }}
      aria-hidden="true"
    />
  )
}
