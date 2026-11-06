function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}

export default async function handler(request) {
  if (request.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed.' }, 405)
  }

  let payload

  try {
    payload = await request.json()
  } catch {
    return jsonResponse({ error: 'Invalid request body.' }, 400)
  }

  const token = typeof payload?.token === 'string' ? payload.token.trim() : ''

  if (!token) {
    return jsonResponse({ error: 'Captcha token is required.' }, 400)
  }

  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    return jsonResponse(
      {
        success: false,
        error: 'Turnstile secret key is missing. Add TURNSTILE_SECRET_KEY to your Netlify environment variables.',
      },
      500
    )
  }

  const forwardedFor = request.headers.get('x-forwarded-for')
  const remoteIp = forwardedFor ? forwardedFor.split(',')[0].trim() : request.headers.get('x-real-ip')

  const formData = new URLSearchParams({
    secret,
    response: token,
  })

  if (remoteIp) {
    formData.set('remoteip', remoteIp)
  }

  const verificationResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  })

  const verificationData = await verificationResponse.json().catch(() => ({ success: false }))

  if (!verificationResponse.ok || !verificationData.success) {
    const errorCode = Array.isArray(verificationData['error-codes'])
      ? verificationData['error-codes'][0]
      : 'captcha_verification_failed'

    return jsonResponse(
      {
        success: false,
        error: errorCode === 'missing-input-response'
          ? 'Captcha response is missing.'
          : 'Captcha verification failed.',
      },
      403
    )
  }

  return jsonResponse({ success: true })
}
