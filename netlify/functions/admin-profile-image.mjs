import { getStore } from '@netlify/blobs'

const store = getStore('admin-profile-images')
const allowedContentTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const maxFileSize = 5 * 1024 * 1024
const extensionByType = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}
const filenamePattern = /^admin-[a-zA-Z0-9-]+\.(jpg|png|webp)$/

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  })
}

export default async function handler(request) {
  if (request.method === 'POST') {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return jsonResponse({ error: 'Select an image to upload.' }, 400)
    }
    if (!allowedContentTypes.has(file.type)) {
      return jsonResponse({ error: 'Choose a JPG, PNG, or WebP image.' }, 415)
    }
    if (file.size > maxFileSize) {
      return jsonResponse({ error: 'The image must be smaller than 5 MB.' }, 413)
    }

    const filename = `admin-${crypto.randomUUID()}.${extensionByType[file.type]}`

    await store.set(filename, await file.arrayBuffer(), {
      metadata: { contentType: file.type },
    })

    return jsonResponse({ filename }, 201)
  }

  if (request.method === 'GET') {
    const filename = new URL(request.url).searchParams.get('filename') || ''
    if (!filenamePattern.test(filename)) {
      return jsonResponse({ error: 'Image not found.' }, 404)
    }

    const image = await store.getWithMetadata(filename, { type: 'arrayBuffer' })
    if (!image) return jsonResponse({ error: 'Image not found.' }, 404)

    return new Response(image.data, {
      headers: {
        'Content-Type': image.metadata?.contentType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=300',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  }

  return jsonResponse({ error: 'Method not allowed.' }, 405)
}
