import { onValue, ref, update } from 'firebase/database'
import { profile } from '../data/profile'
import { getFirebaseDatabase } from './firebase'

const adminProfileRef = () => ref(getFirebaseDatabase(), 'admin/1')
export const adminProfileImageUrl = (filename) =>
  `/.netlify/functions/admin-profile-image?filename=${encodeURIComponent(filename)}`

export function subscribeAdminProfile(onProfile, onError) {
  return onValue(
    adminProfileRef(),
    (snapshot) => {
      const savedProfile = snapshot.val() || {}
      const image = typeof savedProfile.image === 'string' ? savedProfile.image : ''

      onProfile({
        id: 1,
        firstName: savedProfile.first_name || profile.firstName,
        lastName: savedProfile.last_name || profile.lastName,
        email: savedProfile.email || profile.email,
        mobile: String(savedProfile.mobile || profile.phoneHref),
        imageName: image,
        photoURL: image ? adminProfileImageUrl(image) : '',
      })
    },
    onError
  )
}

export async function saveAdminProfile({ firstName, lastName, email, mobile, imageName }) {
  await update(adminProfileRef(), {
    id: 1,
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    email: email.trim(),
    mobile: Number(mobile.replace(/\D/g, '')),
    image: imageName || '',
  })
}

export async function uploadAdminProfilePhoto(file) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Choose a JPG, PNG, or WebP image.')
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('The image must be smaller than 5 MB.')
  }

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch('/.netlify/functions/admin-profile-image', {
    method: 'POST',
    body: formData,
  })
  const responseBody = await response.text()
  let result

  try {
    result = responseBody ? JSON.parse(responseBody) : null
  } catch {
    throw new Error(
      `The profile image service returned an invalid response (HTTP ${response.status}). ` +
        'For local development, use the Netlify Dev URL from "npm run dev"; on Netlify, redeploy to publish the function.'
    )
  }

  if (!response.ok) {
    throw new Error(
      result?.error || `Could not upload the profile photo (HTTP ${response.status}).`
    )
  }
  if (typeof result?.filename !== 'string' || !result.filename) {
    throw new Error('The profile image service did not return the uploaded image filename.')
  }

  await update(adminProfileRef(), {
    id: 1,
    image: result.filename,
  })

  return {
    filename: result.filename,
    photoURL: adminProfileImageUrl(result.filename),
  }
}
