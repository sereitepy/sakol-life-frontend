
/**
 * Upload a file to Cloudinary using an unsigned upload preset.
 *
 * Set these in your .env.local:
 *   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
 *   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
 *
 * In Cloudinary Dashboard:
 *   Settings → Upload → Upload Presets → Add unsigned preset
 *   Set folder to "sakollife/avatars" and restrict to images only.
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

export type CloudinaryUploadResult = {
  secure_url: string
  public_id: string
  width: number
  height: number
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

export type UploadValidationError = 'FILE_TOO_LARGE' | 'INVALID_TYPE'

export function validateImageFile(file: File): UploadValidationError | null {
  if (!ALLOWED_TYPES.includes(file.type)) return 'INVALID_TYPE'
  if (file.size > MAX_SIZE_BYTES) return 'FILE_TOO_LARGE'
  return null
}

export async function uploadToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET'
    )
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'sakollife/avatars')

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(
      'POST',
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    )

    if (onProgress) {
      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100))
        }
      })
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText) as CloudinaryUploadResult)
      } else {
        reject(new Error(`Cloudinary upload failed: ${xhr.status}`))
      }
    }

    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.send(formData)
  })
}
