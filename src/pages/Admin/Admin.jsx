import { useEffect, useMemo, useState } from 'react'
import { onValue, ref } from 'firebase/database'
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Inbox,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Mail,
  Search,
  UserRound,
} from 'lucide-react'
import { Link, NavLink, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import { getFirebaseDatabase } from '../../services/firebase'
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
              <label htmlFor="admin-otp">Verification code</label>
              <input
                autoComplete="one-time-code"
                id="admin-otp"
                inputMode="numeric"
                maxLength={4}
                onChange={(event) => {
                  setOtp(event.target.value.replace(/\D/g, '').slice(0, 4))
                  setError('')
                }}
                placeholder="Enter 4-digit code"
                required
                type="text"
                value={otp}
              />
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

function AdminDashboard({ inquiries, loading, error }) {
  const latestInquiries = inquiries.slice(0, 5)

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

      <div className="admin-section-heading">
        <div>
          <h2>Recent inquiries</h2>
          <p>Newest messages submitted through your contact form.</p>
        </div>
        <Link className="admin-text-link" to="/admin/inquiries">All inquiries <ArrowUpRight size={15} /></Link>
      </div>
      <InquiryList inquiries={latestInquiries} loading={loading} error={error} compact />
    </section>
  )
}

function InquiryList({ inquiries, loading, error, compact = false }) {
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
          <p className={`admin-inquiry__message ${compact ? 'admin-inquiry__message--compact' : ''}`}>
            {inquiry.message}
          </p>
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
