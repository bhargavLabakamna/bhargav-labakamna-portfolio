import { push, ref, serverTimestamp, set } from 'firebase/database'
import { getFirebaseDatabase } from './firebase'

export async function submitContactInquiry(values) {
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
