'use client'

import { useRef, useState } from 'react'
import { Camera, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { uploadToCloudinary, validateImageFile } from '@/lib/cloudinary/upload'
import { updateProfile } from '@/lib/profile/action'
import { ProfileResponse } from '@/lib/profile/action'

type UploadState =
  | { status: 'idle' }
  | { status: 'uploading'; progress: number }
  | { status: 'success' }
  | { status: 'error'; message: string }

type Props = {
  displayName: string
  profilePictureUrl: string | null
  role: ProfileResponse['role']
  accessToken: string
  /** Called after a successful upload so parent can update its state */
  onUploaded?: (newUrl: string) => void
}

export function AvatarUpload({
  displayName,
  profilePictureUrl,
  role,
  accessToken,
  onUploaded,
}: Props) {
  const t = useTranslations('profile.settings')
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
  })
  // Local preview URL while uploading
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const displayUrl = previewUrl ?? profilePictureUrl

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset input so same file can be re-selected
    e.target.value = ''

    // Validate
    const validationError = validateImageFile(file)
    if (validationError === 'FILE_TOO_LARGE') {
      setUploadState({ status: 'error', message: t('photoSizeError') })
      setTimeout(() => setUploadState({ status: 'idle' }), 4000)
      return
    }
    if (validationError === 'INVALID_TYPE') {
      setUploadState({ status: 'error', message: t('photoTypeError') })
      setTimeout(() => setUploadState({ status: 'idle' }), 4000)
      return
    }

    // Optimistic local preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setUploadState({ status: 'uploading', progress: 0 })

    try {
      // 1. Upload to Cloudinary
      const result = await uploadToCloudinary(file, progress => {
        setUploadState({ status: 'uploading', progress })
      })

      // 2. Persist the URL to your backend
      await updateProfile(accessToken, {
        profilePictureUrl: result.secure_url,
      })

      setUploadState({ status: 'success' })
      onUploaded?.(result.secure_url)

      // Clean up the object URL now that we have the real URL
      URL.revokeObjectURL(objectUrl)
      setPreviewUrl(null)

      setTimeout(() => setUploadState({ status: 'idle' }), 2500)
    } catch {
      setUploadState({ status: 'error', message: t('photoUploadError') })
      setPreviewUrl(null)
      URL.revokeObjectURL(objectUrl)
      setTimeout(() => setUploadState({ status: 'idle' }), 4000)
    }
  }

  const isUploading = uploadState.status === 'uploading'

  return (
    <div className='flex items-center gap-4 mb-6'>
      {/* Avatar */}
      <div className='relative shrink-0'>
        {displayUrl ? (
          <Image
            src={displayUrl}
            alt={displayName}
            width={64}
            height={64}
            className='w-16 h-16 rounded-full object-cover ring-2 ring-border'
            unoptimized={!!previewUrl} // blob URLs can't be optimized
          />
        ) : (
          <div className='w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center ring-2 ring-border'>
            <span className='text-xl font-bold text-primary'>{initials}</span>
          </div>
        )}

        {/* Upload progress overlay */}
        {isUploading && (
          <div className='absolute inset-0 rounded-full bg-black/50 flex items-center justify-center'>
            <span className='text-[10px] font-bold text-white'>
              {uploadState.progress}%
            </span>
          </div>
        )}

        {/* Camera button */}
        <button
          type='button'
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className='absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-opacity'
          aria-label={displayUrl ? t('changePhoto') : t('uploadPhoto')}
        >
          {isUploading ? (
            <Loader2
              size={11}
              className='text-primary-foreground animate-spin'
            />
          ) : (
            <Camera size={11} className='text-primary-foreground' />
          )}
        </button>

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type='file'
          accept='image/jpeg,image/png,image/webp'
          className='hidden'
          onChange={handleFileChange}
        />
      </div>

      {/* Info */}
      <div className='min-w-0'>
        <p className='font-bold text-sm text-foreground truncate'>
          {displayName}
        </p>
        <p className='text-xs text-muted-foreground mt-0.5'>
          {role === 'ADMIN' ? `${t('administrator')}` : `${t('student')}`}
        </p>

        {/* Status feedback */}
        <div className='mt-1 h-4'>
          {uploadState.status === 'uploading' && (
            <p className='text-[10px] text-muted-foreground flex items-center gap-1'>
              <Loader2 size={9} className='animate-spin' />
              {t('uploadingPhoto')}
            </p>
          )}
          {uploadState.status === 'success' && (
            <p className='text-[10px] text-emerald-600 flex items-center gap-1'>
              <CheckCircle2 size={9} />
              {t('photoUploaded')}
            </p>
          )}
          {uploadState.status === 'error' && (
            <p className='text-[10px] text-destructive flex items-center gap-1'>
              <AlertCircle size={9} />
              {uploadState.message}
            </p>
          )}
          {uploadState.status === 'idle' && (
            <button
              type='button'
              onClick={() => inputRef.current?.click()}
              className='text-[10px] text-primary hover:underline cursor-pointer'
            >
              {displayUrl ? t('changePhoto') : t('uploadPhoto')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
