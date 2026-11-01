import { push, ref, serverTimestamp, set } from 'firebase/database'
import { getFirebaseDatabase } from './firebase'

const CONTACT_EMAIL_URL = '/.netlify/functions/send-contact-inquiry'

export async function submitContactInquiry(values, captchaToken) {
  if (!captchaToken) {
    throw new Error('Please complete the captcha before sending your message.')
  }

  const emailResponse = await fetch(CONTACT_EMAIL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...values,
      token: captchaToken,
    }),
  })

  const emailData = await emailResponse.json().catch(() => ({}))

  if (!emailResponse.ok || !emailData.success) {
    throw new Error(emailData.error || 'Your inquiry could not be sent.')
  }

  const db = getFirebaseDatabase()
  const inquiryRef = push(ref(db, 'contactInquiries'))

  await set(inquiryRef, {
    name: values.name.trim(),
    email: values.email.trim(),
    subject: values.subject.trim(),
    message: values.message.trim(),
    createdAt: serverTimestamp(),
  })
}
