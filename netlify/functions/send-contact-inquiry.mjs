function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

async function verifyTurnstile(token, request) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    return {
      ok: false,
      data: { 'error-codes': ['missing-secret-key'] },
    }
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

  return {
    ok: verificationResponse.ok && verificationData.success,
    data: verificationData,
  }
}

async function sendResendEmail({ apiKey, fromEmail, to, replyTo, subject, html, text }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to,
      reply_to: replyTo,
      subject,
      html,
      text,
    }),
  })

  const data = await response.json().catch(() => ({}))

  return {
    ok: response.ok,
    data,
  }
}

export default async function handler(request) {
  if (request.method !== 'POST') {
    return jsonResponse({ success: false, error: 'Method not allowed.' }, 405)
  }

  let payload
  try {
    payload = await request.json()
  } catch {
    return jsonResponse({ success: false, error: 'Invalid request body.' }, 400)
  }

  const name = String(payload?.name || '').trim()
  const email = String(payload?.email || '').trim()
  const subject = String(payload?.subject || '').trim()
  const message = String(payload?.message || '').trim()
  const token = String(payload?.token || '').trim()

  if (!name || !email || !subject || !message || !token) {
    return jsonResponse({ success: false, error: 'All fields and captcha are required.' }, 400)
  }

  const captchaCheck = await verifyTurnstile(token, request)
  if (!captchaCheck.ok) {
    const errorCode = Array.isArray(captchaCheck.data['error-codes'])
      ? captchaCheck.data['error-codes'][0]
      : 'captcha_verification_failed'

    const message = errorCode === 'missing-secret-key'
      ? 'Turnstile secret key is missing. Add TURNSTILE_SECRET_KEY to your Netlify environment variables.'
      : errorCode === 'missing-input-response'
        ? 'Captcha response is missing.'
        : 'Captcha verification failed.'

    return jsonResponse(
      {
        success: false,
        error: message,
      },
      403
    )
  }

  const apiKey = process.env.RESEND_API_KEY
  const adminEmail = process.env.ADMIN_EMAIL || 'bhargavlabakamna@gmail.com'
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

  if (!apiKey) {
    return jsonResponse(
      {
        success: false,
        error: 'Email service is not configured. Add RESEND_API_KEY to your Netlify environment variables.',
      },
      500
    )
  }

  const escapedMessage = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br />')

  const userEmailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 12px;">Thanks for reaching out, ${name}!</h2>
      <p>Your message has been received. I'll get back to you as soon as possible.</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br />${escapedMessage}</p>
    </div>
  `

  const adminEmailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
      <h2 style="margin-bottom: 12px;">New Contact Inquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong><br />${escapedMessage}</p>
    </div>
  `

  const emailResults = await Promise.all([
    sendResendEmail({
      apiKey,
      fromEmail,
      to: [email],
      replyTo: adminEmail,
      subject: `Thanks for contacting Bhargav — ${subject}`,
      html: userEmailHtml,
      text: `Thanks for reaching out, ${name}!\n\nYour message has been received.\n\nSubject: ${subject}\n\nMessage:\n${message}`,
    }),
    sendResendEmail({
      apiKey,
      fromEmail,
      to: [adminEmail],
      replyTo: email,
      subject: `New contact inquiry: ${subject}`,
      html: adminEmailHtml,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
    }),
  ])

  const failedEmail = emailResults.find((result) => !result.ok)
  if (failedEmail) {
    const errorMessage = failedEmail.data?.message || 'Email delivery failed.'
    return jsonResponse({ success: false, error: errorMessage }, 500)
  }

  return jsonResponse({ success: true })
}
