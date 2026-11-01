import emailjs from '@emailjs/browser'
import { push, ref, serverTimestamp, set } from 'firebase/database'
import { getFirebaseDatabase } from './firebase'

const TURNSTILE_VERIFICATION_URL = '/.netlify/functions/verify-turnstile'
const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_38x27og'
const adminTemplateId = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID || 'tfs2o2h'
const userTemplateId = import.meta.env.VITE_EMAILJS_USER_TEMPLATE_ID || 'template_wnrbjwl'
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export async function submitContactInquiry(values, captchaToken) {
  if (!captchaToken) {
    throw new Error('Please complete the captcha before sending your message.')
  }

  const verificationResponse = await fetch(TURNSTILE_VERIFICATION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: captchaToken }),
  })

  const verificationData = await verificationResponse.json().catch(() => ({}))

  if (!verificationResponse.ok || !verificationData.success) {
    throw new Error(verificationData.error || 'Captcha verification failed.')
  }

  if (!publicKey) {
    throw new Error('EmailJS public key is missing. Add VITE_EMAILJS_PUBLIC_KEY in Netlify or your .env file.')
  }

  const sanitizedValues = {
    name: values.name.trim(),
    email: values.email.trim(),
    subject: values.subject.trim(),
    message: values.message.trim(),
  }

  try {
    await emailjs.send(
      serviceId,
      adminTemplateId,
      {
        from_name: sanitizedValues.name,
        from_email: sanitizedValues.email,
        subject: sanitizedValues.subject,
        message: sanitizedValues.message,
        to_email: 'bhargavlabakamna@gmail.com',
      },
      publicKey
    )

    await emailjs.send(
      serviceId,
      userTemplateId,
      {
        from_name: 'Bhargav Labakamna',
        from_email: 'bhargavlabakamna@gmail.com',
        to_email: sanitizedValues.email,
        subject: 'Thanks for contacting me',
        message: 'Your message has been received and I will get back to you soon.',
      },
      publicKey
    )
  } catch (error) {
    console.error('EmailJS send failed:', error)
    throw new Error('Your message could not be sent. Please try again.')
  }

  const db = getFirebaseDatabase()
  const inquiryRef = push(ref(db, 'contactInquiries'))

  await set(inquiryRef, {
    name: sanitizedValues.name,
    email: sanitizedValues.email,
    subject: sanitizedValues.subject,
    message: sanitizedValues.message,
    createdAt: serverTimestamp(),
  })
}
