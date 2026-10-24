import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { profile } from '../../data/profile'
import { useIsFinePointer } from '../../hooks/usePointerType'
import profileImage from '../../assets/images/profile-placeholder.svg'
import { subscribeAdminProfile } from '../../services/adminProfile'
import './ProfileFrame.css'

export default function ProfileFrame() {
  const ref = useRef(null)
  const isFine = useIsFinePointer()
  const [adminPhotoURL, setAdminPhotoURL] = useState('')

  useEffect(() => {
    try {
      return subscribeAdminProfile(
        (adminProfile) => setAdminPhotoURL(adminProfile.photoURL),
        (error) => console.error('Could not load admin profile photo:', error)
      )
    } catch (error) {
      console.error('Could not subscribe to the admin profile photo:', error)
    }
  }, [])

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 120, damping: 20 })
  const springY = useSpring(my, { stiffness: 120, damping: 20 })

  const frameX = useTransform(springX, [-1, 1], [-10, 10])
  const frameY = useTransform(springY, [-1, 1], [-10, 10])
  const decorX = useTransform(springX, [-1, 1], [-22, 22])
  const decorY = useTransform(springY, [-1, 1], [-22, 22])

  const handleMouseMove = (e) => {
    if (!isFine || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 2)
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 2)
  }

  const handleMouseLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div
      className="profile-frame"
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="profile-frame__decor profile-frame__decor--grid"
        style={{ x: decorX, y: decorY }}
      />
      <motion.span
        className="profile-frame__decor profile-frame__decor--code mono"
        style={{ x: decorX, y: decorY }}
      >
        {'</>'}
      </motion.span>
      <motion.span
        className="profile-frame__decor profile-frame__decor--brace mono"
        style={{ x: useTransform(decorX, (v) => -v), y: useTransform(decorY, (v) => -v) }}
      >
        {'{ }'}
      </motion.span>

      <motion.div
        className="profile-frame__ring"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="profile-frame__photo-wrap"
        style={{ x: frameX, y: frameY }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <img
          src={adminPhotoURL || profileImage}
          alt={`Portrait of ${profile.name}`}
          className="profile-frame__photo"
          loading="eager"
        />
        <div className="profile-frame__glow" />
      </motion.div>

      <motion.div
        className="profile-frame__badge"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="profile-frame__badge-dot" />
        {profile.availability}
      </motion.div>
    </div>
  )
}
