import { useEffect, useMemo, useRef, useState } from 'react'
import { onValue, ref } from 'firebase/database'
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  ImagePlus,
  Inbox,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Mail,
  Search,
  UserRound,
} from 'lucide-react'
import { Link, NavLink, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import { saveAdminProfile, subscribeAdminProfile, uploadAdminProfilePhoto } from '../../services/adminProfile'
import { getFirebaseDatabase } from '../../services/firebase'
import { profile as defaultProfile } from '../../data/profile'
import profilePlaceholder from '../../assets/images/profile-placeholder.svg'
import './Admin.css'

const ADMIN_EMAIL = 'bhargav@gmail.com'
const DEMO_OTP = '1111'
const ADMIN_SESSION_KEY = 'portfolio-admin-demo-session'

function useAdminInquiries(enabled) {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!enabled) return undefined

    let unsubscribe
    try {
      unsubscribe = onValue(
        ref(getFirebaseDatabase(), 'contactInquiries'),
        (snapshot) => {
          const records = snapshot.val() || {}
          const result = Object.entries(records).map(([id, inquiry]) => ({
            id,
            ...inquiry,
          }))
          result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
          setInquiries(result)
          setLoading(false)
          setError('')
        },
        (subscriptionError) => {
          console.error('Could not load contact inquiries:', subscriptionError)
          const isPermissionDenied =
            subscriptionError.code === 'PERMISSION_DENIED' ||
            subscriptionError.message?.toLowerCase().includes('permission_denied')

          setError(
            isPermissionDenied
              ? 'Firebase is denying reads. In Firebase Console → Realtime Database → Rules, allow read access under "contactInquiries" and click Publish.'
              : 'Could not connect to Firebase Realtime Database. Check your database URL and network connection.'
          )
          setLoading(false)
        }
      )
    } catch (subscriptionError) {
      console.error('Could not connect to Firebase Realtime Database:', subscriptionError)
      setError('Could not connect to the Firebase Realtime Database.')
      setLoading(false)
    }

    return () => unsubscribe?.()
  }, [enabled])

  return { inquiries, loading, error }
}

function formatDate(timestamp) {
  if (!timestamp) return 'Just now'
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(timestamp))
}

function AdminLogin({ onAuthenticated }) {
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const otpInputRefs = useRef([])

  const updateOtpDigit = (index, value) => {
    const digits = value.replace(/\D/g, '')

    if (digits.length > 1) {
      const pastedDigits = digits.slice(0, 4).split('')
      setOtp(pastedDigits.join(''))
      setError('')
      otpInputRefs.current[Math.min(pastedDigits.length, 3)]?.focus()
      return
    }

    const nextOtp = otp.split('')
    nextOtp[index] = digits
    setOtp(nextOtp.join('').slice(0, 4))
    setError('')

    if (digits && index < 3) otpInputRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (event) => {
    const pastedDigits = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (!pastedDigits) return

    event.preventDefault()
    setOtp(pastedDigits)
    setError('')
    otpInputRefs.current[Math.min(pastedDigits.length, 3)]?.focus()
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (step === 'email') {
      if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
        setError('Email not recognized. Please check your details and try again.')
        return
      }
      setStep('otp')
      return
    }

    if (otp !== DEMO_OTP) {
      setError('Invalid verification code. Please try again.')
      return
    }

    window.localStorage.setItem(ADMIN_SESSION_KEY, 'true')
    onAuthenticated({ email: ADMIN_EMAIL })
    navigate('/admin', { replace: true })
  }

  return (
    <main className="admin-login">
      <section className="admin-login__card">
        <Link className="admin-login__back" to="/">Back to portfolio</Link>
        <span className="admin-login__icon"><LockKeyhole size={22} /></span>
        <p className="admin-eyebrow">Private workspace</p>
        <h1>{step === 'otp' ? 'Verify your email' : 'Admin sign in'}</h1>
        <p className="admin-login__description">
          {step === 'otp'
            ? 'Enter the verification code to continue to your dashboard.'
            : 'Enter your email to continue to the admin dashboard.'}
        </p>
        <form className="admin-login__form" onSubmit={handleSubmit}>
          {step === 'email' ? (
            <>
              <label htmlFor="admin-email">Email</label>
              <input
                autoComplete="email"
                id="admin-email"
                onChange={(event) => {
                  setEmail(event.target.value)
                  setError('')
                }}
                placeholder="Enter your email"
                required
                type="email"
                value={email}
              />
            </>
          ) : (
            <>
              <span className="admin-login__otp-label" id="admin-otp-label">Verification code</span>
              <div
                className="admin-login__otp"
                role="group"
                aria-labelledby="admin-otp-label"
                onPaste={handleOtpPaste}
              >
                {Array.from({ length: 4 }, (_, index) => (
                  <input
                    key={index}
                    aria-label={`Verification code digit ${index + 1}`}
                    autoComplete={index === 0 ? 'one-time-code' : 'off'}
                    autoFocus={index === 0}
                    inputMode="numeric"
                    maxLength={1}
                    onChange={(event) => updateOtpDigit(index, event.target.value)}
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    ref={(element) => { otpInputRefs.current[index] = element }}
                    required
                    type="text"
                    value={otp[index] || ''}
                  />
                ))}
              </div>
              <button
                className="admin-login__change-email"
                onClick={() => {
                  setStep('email')
                  setOtp('')
                  setError('')
                }}
                type="button"
              >
                Change email
              </button>
              <p className="admin-login__success" role="status">
                <CheckCircle2 size={17} />
                Verification step ready.
              </p>
            </>
          )}
          {error && <p className="admin-alert" role="alert">{error}</p>}
          <button className="admin-button admin-button--primary" type="submit">
            {step === 'otp' ? 'Verify code' : 'Continue'}
          </button>
        </form>
        <p className="admin-login__note">
          {step === 'otp'
            ? 'Demo code: 1111. This client-side check does not send an email.'
            : 'Admin dashboard sign in.'}
        </p>
      </section>
    </main>
  )
}

function AdminLayout({ user, onSignOut }) {
  const [signOutError, setSignOutError] = useState('')

  const handleSignOut = async () => {
    try {
      await onSignOut()
    } catch (error) {
      console.error('Admin sign-out failed:', error)
      setSignOutError('Could not sign out. Please try again.')
    }
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-brand" to="/admin">
          <span className="admin-brand__mark">BL</span>
          <span>Portfolio admin</span>
        </Link>
        <span className="admin-sidebar__label">Workspace</span>
        <nav className="admin-nav" aria-label="Admin navigation">
          <NavLink end to="/admin"><LayoutDashboard size={18} /> Dashboard</NavLink>
          <NavLink to="/admin/inquiries"><Inbox size={18} /> Contact inquiries</NavLink>
          <NavLink to="/admin/profile"><UserRound size={18} /> Profile update</NavLink>
        </nav>
        <div className="admin-sidebar__bottom">
          <span className="admin-user"><UserRound size={17} /> {user.email}</span>
          <button className="admin-signout" onClick={handleSignOut} type="button">
            <LogOut size={17} /> Sign out
          </button>
          {signOutError && <p className="admin-alert" role="alert">{signOutError}</p>}
          <Link className="admin-back-link" to="/">View portfolio <ArrowUpRight size={15} /></Link>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  )
}

function InquiryTrendChart({ inquiries, loading }) {
  const days = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const firstDay = new Date(today)
    firstDay.setDate(today.getDate() - 6)
    const dailyCounts = Array(7).fill(0)

    inquiries.forEach(({ createdAt }) => {
      const timestamp = Number(createdAt)
      if (!Number.isFinite(timestamp) || timestamp <= 0) return

      const inquiryDay = new Date(timestamp)
      inquiryDay.setHours(0, 0, 0, 0)
      const index = Math.round((inquiryDay - firstDay) / 86400000)
      if (index >= 0 && index < dailyCounts.length) dailyCounts[index] += 1
    })

    return dailyCounts.map((count, index) => {
      const date = new Date(firstDay)
      date.setDate(firstDay.getDate() + index)
      return { count, date }
    })
  }, [inquiries])

  const chart = { width: 720, height: 260, left: 48, right: 16, top: 18, bottom: 42 }
  const plotWidth = chart.width - chart.left - chart.right
  const plotHeight = chart.height - chart.top - chart.bottom
  const maxCount = Math.max(...days.map(({ count }) => count), 1)
  const axisMax = Math.ceil(maxCount / 4) * 4
  const points = days.map(({ count }, index) => ({
    x: chart.left + (plotWidth * index) / (days.length - 1),
    y: chart.top + plotHeight - (count / axisMax) * plotHeight,
  }))
  const linePath = points.map(({ x, y }, index) => `${index ? 'L' : 'M'} ${x} ${y}`).join(' ')
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chart.top + plotHeight} L ${points[0].x} ${chart.top + plotHeight} Z`
  const numberFormat = new Intl.NumberFormat()
  const dateFormat = new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric' })
  const weekdayFormat = new Intl.DateTimeFormat(undefined, { weekday: 'short' })

  return (
    <section className="admin-chart" aria-labelledby="inquiry-chart-title">
      <div className="admin-chart__heading">
        <div>
          <h2 id="inquiry-chart-title">Inquiry activity</h2>
          <p>Daily contact form submissions over the last 7 days.</p>
        </div>
        <span className="admin-chart__range">Last 7 days</span>
      </div>
      <div className="admin-chart__canvas">
        <svg
          className="admin-chart__svg"
          viewBox={`0 0 ${chart.width} ${chart.height}`}
          role="img"
          aria-label={`Contact inquiries per day for the last 7 days: ${days.map(({ date, count }) => `${dateFormat.format(date)}: ${count}`).join(', ')}`}
        >
          <defs>
            <linearGradient id="inquiry-chart-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#5368d8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#5368d8" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          {Array.from({ length: 5 }, (_, index) => {
            const value = (axisMax * index) / 4
            const y = chart.top + plotHeight - (plotHeight * index) / 4
            return (
              <g key={value}>
                <line className="admin-chart__grid" x1={chart.left} x2={chart.width - chart.right} y1={y} y2={y} />
                <text className="admin-chart__axis-label" x={chart.left - 12} y={y + 4} textAnchor="end">
                  {numberFormat.format(value)}
                </text>
              </g>
            )
          })}
          <path className="admin-chart__area" d={areaPath} />
          <path className="admin-chart__line" d={linePath} />
          {days.map(({ count, date }, index) => (
            <g key={date.toISOString()}>
              <circle className="admin-chart__point" cx={points[index].x} cy={points[index].y} r="4">
                <title>{`${dateFormat.format(date)}: ${count} ${count === 1 ? 'inquiry' : 'inquiries'}`}</title>
              </circle>
              <text
                className="admin-chart__date-label"
                x={points[index].x}
                y={chart.height - 12}
                textAnchor="middle"
              >
                {weekdayFormat.format(date)}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <p className="admin-chart__status" aria-live="polite">
        {loading ? 'Loading inquiry activity…' : `Total inquiries in this period: ${days.reduce((total, day) => total + day.count, 0)}`}
      </p>
    </section>
  )
}

function AdminDashboard({ inquiries, loading, error }) {

  return (
    <section className="admin-page">
      <div className="admin-page__heading">
        <div>
          <p className="admin-eyebrow">Overview</p>
          <h1>Dashboard</h1>
          <p className="admin-page__description">A live overview of your portfolio contact activity.</p>
        </div>
        <Link className="admin-button admin-button--primary" to="/admin/inquiries">
          View inquiries <ArrowUpRight size={17} />
        </Link>
      </div>

      {error && <p className="admin-alert" role="alert">{error}</p>}
      <div className="admin-stats">
        <article className="admin-stat">
          <span className="admin-stat__icon"><Inbox size={20} /></span>
          <span className="admin-stat__label">Total inquiries</span>
          <strong>{loading ? '—' : inquiries.length}</strong>
          <span className="admin-stat__hint">Live from Realtime Database</span>
        </article>
        <article className="admin-stat">
          <span className="admin-stat__icon"><Mail size={20} /></span>
          <span className="admin-stat__label">Latest inquiry</span>
          <strong className="admin-stat__latest">
            {loading ? 'Loading…' : inquiries[0] ? formatDate(inquiries[0].createdAt) : 'No inquiries yet'}
          </strong>
          <span className="admin-stat__hint">Updates automatically</span>
        </article>
      </div>

      <InquiryTrendChart inquiries={inquiries} loading={loading} />
    </section>
  )
}

function AdminProfileEditor() {
  const [profile, setProfile] = useState({
    firstName: defaultProfile.firstName,
    lastName: defaultProfile.lastName,
    email: defaultProfile.email,
    mobile: defaultProfile.phone,
    imageName: '',
    photoURL: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    let unsubscribe

    try {
      unsubscribe = subscribeAdminProfile(
        (savedProfile) => {
          if (!active) return
          setProfile(savedProfile)
          setLoading(false)
        },
        (subscriptionError) => {
          console.error('Could not load admin profile:', subscriptionError)
          if (!active) return
          setError('Could not load the profile from Firebase. Check your database rules.')
          setLoading(false)
        }
      )
    } catch (subscriptionError) {
      console.error('Could not connect to admin profile:', subscriptionError)
      setError('Could not connect to Firebase Realtime Database.')
      setLoading(false)
    }

    return () => {
      active = false
      unsubscribe?.()
    }
  }, [])

  const handleProfileChange = (event) => {
    const { name, value } = event.target
    setProfile((current) => ({ ...current, [name]: value }))
    setMessage('')
    setError('')
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      await saveAdminProfile(profile)
      setMessage('Profile saved to Firebase.')
    } catch (saveError) {
      console.error('Could not save admin profile:', saveError)
      setError('Could not save the profile. Check your Firebase Realtime Database rules.')
    } finally {
      setSaving(false)
    }
  }

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploading(true)
    setMessage('')
    setError('')

    try {
      const uploadedPhoto = await uploadAdminProfilePhoto(file)
      setProfile((current) => ({
        ...current,
        imageName: uploadedPhoto.filename,
        photoURL: uploadedPhoto.photoURL,
      }))
      setMessage('Profile photo uploaded to Netlify Blobs.')
    } catch (uploadError) {
      console.error('Could not upload admin profile photo:', uploadError)
      setError(uploadError.message || 'Could not upload the profile photo.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-page__heading">
        <div>
          <p className="admin-eyebrow">Settings</p>
          <h1>Profile update</h1>
          <p className="admin-page__description">Update your profile details and photo.</p>
        </div>
      </div>

      {loading && <p className="admin-page__description">Loading profile…</p>}
      <form className="admin-profile__form" onSubmit={handleSave}>
        <div className="admin-profile__photo">
          <img src={profile.photoURL || profilePlaceholder} alt="Admin profile" />
          <label className="admin-button" htmlFor="admin-profile-photo">
            <ImagePlus size={16} />
            {uploading ? 'Uploading…' : 'Upload photo'}
          </label>
          <input
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading || loading}
            id="admin-profile-photo"
            onChange={handlePhotoChange}
            type="file"
          />
          <span>Image up to 5 MB</span>
        </div>

        <div className="admin-profile__fields">
          <label>
            First name
            <input
              autoComplete="given-name"
              name="firstName"
              onChange={handleProfileChange}
              required
              value={profile.firstName}
            />
          </label>
          <label>
            Last name
            <input
              autoComplete="family-name"
              name="lastName"
              onChange={handleProfileChange}
              required
              value={profile.lastName}
            />
          </label>
          <label>
            Email
            <input
              autoComplete="email"
              name="email"
              onChange={handleProfileChange}
              required
              type="email"
              value={profile.email}
            />
          </label>
          <label>
            Mobile
            <input
              autoComplete="tel"
              name="mobile"
              onChange={handleProfileChange}
              required
              type="tel"
              value={profile.mobile}
            />
          </label>
          {error && <p className="admin-alert" role="alert">{error}</p>}
          {message && <p className="admin-login__success" role="status">{message}</p>}
          <button className="admin-button admin-button--primary" disabled={saving || loading} type="submit">
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </form>
    </section>
  )
}

function InquiryList({ inquiries, loading, error }) {
  if (loading) return <div className="admin-empty">Loading inquiries…</div>
  if (error) return <div className="admin-empty">Inquiry data could not be loaded.</div>
  if (inquiries.length === 0) {
    return (
      <div className="admin-empty">
        <Inbox size={26} />
        <strong>No contact inquiries yet</strong>
        <span>New messages will appear here automatically.</span>
      </div>
    )
  }

  return (
    <div className="admin-inquiry-list">
      {inquiries.map((inquiry) => (
        <article className="admin-inquiry" key={inquiry.id}>
          <div className="admin-inquiry__top">
            <div className="admin-inquiry__identity">
              <span className="admin-inquiry__avatar">{inquiry.name?.slice(0, 1).toUpperCase() || '?'}</span>
              <div>
                <h3>{inquiry.name || 'Unknown sender'}</h3>
                <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
              </div>
            </div>
            <time dateTime={inquiry.createdAt ? new Date(inquiry.createdAt).toISOString() : undefined}>
              {formatDate(inquiry.createdAt)}
            </time>
          </div>
          <h4>{inquiry.subject || 'No subject'}</h4>
          <p className="admin-inquiry__message">{inquiry.message}</p>
        </article>
      ))}
    </div>
  )
}

function ContactInquiries({ inquiries, loading, error }) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return inquiries
    return inquiries.filter((inquiry) =>
      [inquiry.name, inquiry.email, inquiry.subject, inquiry.message]
        .some((value) => value?.toLowerCase().includes(normalizedQuery))
    )
  }, [inquiries, query])

  return (
    <section className="admin-page">
      <div className="admin-page__heading">
        <div>
          <p className="admin-eyebrow">Inbox</p>
          <h1>Contact inquiries</h1>
          <p className="admin-page__description">Messages update live as visitors submit the contact form.</p>
        </div>
        <span className="admin-live"><i /> Live updates</span>
      </div>
      <label className="admin-search">
        <Search size={18} />
        <input
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name, email, subject or message"
          type="search"
          value={query}
        />
      </label>
      <div className="admin-inquiry-count">
        Showing {filtered.length} of {inquiries.length} {inquiries.length === 1 ? 'inquiry' : 'inquiries'}
        <ArrowDownRight size={16} />
      </div>
      <InquiryList inquiries={filtered} loading={loading} error={error} />
    </section>
  )
}

function AdminContent({ user, onSignOut, onAuthenticated }) {
  const { inquiries, loading, error } = useAdminInquiries(Boolean(user))

  return (
    <Routes>
      <Route
        path="/admin/login"
        element={user ? <Navigate replace to="/admin" /> : <AdminLogin onAuthenticated={onAuthenticated} />}
      />
      <Route
        path="/admin"
        element={user ? <AdminLayout onSignOut={onSignOut} user={user} /> : <Navigate replace to="/admin/login" />}
      >
        <Route index element={<AdminDashboard error={error} inquiries={inquiries} loading={loading} />} />
        <Route path="inquiries" element={<ContactInquiries error={error} inquiries={inquiries} loading={loading} />} />
        <Route path="profile" element={<AdminProfileEditor />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/admin" />} />
    </Routes>
  )
}

export default function Admin() {
  const [user, setUser] = useState(() =>
    window.localStorage.getItem(ADMIN_SESSION_KEY) === 'true'
      ? { email: ADMIN_EMAIL }
      : null
  )
  const handleSignOut = () => {
    window.localStorage.removeItem(ADMIN_SESSION_KEY)
    setUser(null)
  }

  return (
    <AdminContent
      onAuthenticated={setUser}
      onSignOut={handleSignOut}
      user={user}
    />
  )
}
