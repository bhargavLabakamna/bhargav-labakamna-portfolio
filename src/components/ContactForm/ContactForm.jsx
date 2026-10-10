import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle2 } from 'lucide-react'
import './ContactForm.css'

const initialState = { name: '', email: '', subject: '', message: '' }

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Please enter your name.'
  if (!values.email.trim()) {
    errors.email = 'Please enter your email.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Enter a valid email address.'
  }
  if (!values.subject.trim()) errors.subject = 'Please add a subject.'
  if (!values.message.trim()) {
    errors.message = 'Please write a message.'
  } else if (values.message.trim().length < 10) {
    errors.message = 'Message should be at least 10 characters.'
  }
  return errors
}

// Submission is currently a demo state — no backend is wired up.
// Swap `handleSubmit`'s success branch for a real API call when ready.
export default function ContactForm() {
  const [values, setValues] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate(values)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setSubmitting(true)
    // Demo delay to simulate a network request — replace with a real API call.
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      setValues(initialState)
    }, 900)
  }

  if (submitted) {
    return (
      <motion.div
        className="contact-form__success"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <CheckCircle2 size={32} />
        <h3>Message sent</h3>
        <p className="text-muted">
          Thanks for reaching out — I'll get back to you as soon as possible.
        </p>
        <button className="btn btn-ghost" onClick={() => setSubmitted(false)}>
          Send another message
        </button>
      </motion.div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form__row">
        <div className="contact-form__field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            placeholder="Your name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
          />
          <AnimatePresence>
            {errors.name && (
              <motion.span
                id="name-error"
                className="contact-form__error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {errors.name}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="contact-form__field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          <AnimatePresence>
            {errors.email && (
              <motion.span
                id="email-error"
                className="contact-form__error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {errors.email}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="contact-form__field">
        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={values.subject}
          onChange={handleChange}
          placeholder="What's this about?"
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
        />
        <AnimatePresence>
          {errors.subject && (
            <motion.span
              id="subject-error"
              className="contact-form__error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {errors.subject}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="contact-form__field">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={values.message}
          onChange={handleChange}
          placeholder="Tell me about your project or opportunity..."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        <AnimatePresence>
          {errors.message && (
            <motion.span
              id="message-error"
              className="contact-form__error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {errors.message}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <button type="submit" className="btn btn-primary contact-form__submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send Message'}
        {!submitting && <Send size={17} />}
      </button>
    </form>
  )
}
