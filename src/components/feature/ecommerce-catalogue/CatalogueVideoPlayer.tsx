'use client'

import { CatalogueVideoPlayerProps } from '@/types/ecommerceCatalogue'
import { getMediaUrl, normalizeUploadPath } from '@/utils'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function CatalogueVideoPlayer({ videoUrl, prompt, onClose }: CatalogueVideoPlayerProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Prevent background scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose()
  }

  const resolvedUrl = getMediaUrl(normalizeUploadPath(videoUrl))

  const modal = (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/10 transition-colors z-10"
        aria-label="Close video player"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="w-full max-w-4xl flex flex-col gap-4">
        <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
          <video
            src={resolvedUrl || undefined}
            className="w-full h-full"
            controls
            autoPlay
            playsInline
          />
        </div>

        {prompt && (
          <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <p className="text-xs text-slate-400 uppercase font-bold mb-1 tracking-wider">Prompt</p>
            <p className="text-sm text-white/80 italic leading-relaxed">&ldquo;{prompt}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  )

  return modal
}
