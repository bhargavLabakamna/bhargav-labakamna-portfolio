import { push, ref, serverTimestamp, set } from 'firebase/database'
import { getFirebaseDatabase } from './firebase'

const TURNSTILE_VERIFICATION_URL = '/.netlify/functions/verify-turnstile'

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
