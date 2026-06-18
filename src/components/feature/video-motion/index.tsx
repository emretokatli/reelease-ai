'use client'

import MediaPickerModal from '@/components/feature/media-library/MediaPickerModal'
import { PageHeader } from '@/components/reusable/PageHeader'
import { useGenerateMediaMutation, useSaveToMediaMutation } from '@/redux/api/aiApi'
import { useGetDashboardStatsQuery } from '@/redux/api/dashboardApi'
import { useAppSelector } from '@/redux/hooks'
import type { RootState } from '@/redux/store'
import { socket } from '@/services/socketSetup'
import { Attachments, MediaTaskProp } from '@/types/components/features'
import { Clapperboard } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { getDownloadUrl } from '@/utils'
import PromptLibraryModal from '../ai-common/PromptLibraryModal'
import { MotionParametersPanel } from './MotionParametersPanel'
import { PreviewStage } from './PreviewStage'
import { PromptConsole } from './PromptConsole'
import { ReferenceMediaPanel } from './ReferenceMediaPanel'

const VideoMotionContent = () => {
  const { t } = useTranslation()
  const user = useAppSelector((state: RootState) => state.auth.user)

  const [prompt, setPrompt] = useState('')
  const [selectedVideo, setSelectedVideo] = useState<Attachments | null>(null)
  const [selectedImage, setSelectedImage] = useState<Attachments | null>(null)
  const [mediaPickerType, setMediaPickerType] = useState<'video' | 'image'>('video')
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPromptLibraryOpen, setIsPromptLibraryOpen] = useState(false)

  // Generation State
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null)
  const [resultVideo, setResultVideo] = useState<string | null>(null)

  // Settings State
  const [quality, setQuality] = useState('1080p')
  const [ratio, setRatio] = useState('16:9')
  const [mode] = useState('pro')
  const [sound, setSound] = useState(false)

  const { data: stats } = useGetDashboardStatsQuery()
  const credits = stats?.aiFeatures?.find((f) => f.feature_key === 'video_motion')?.credits

  const [generateMedia] = useGenerateMediaMutation()
  const [saveToMedia, { isLoading: isSaving }] = useSaveToMediaMutation()

  // Socket Listener for AI Task
  useEffect(() => {
    if (!user) return

    const handleTaskUpdate = (payload:MediaTaskProp) => {
      if (payload.taskId === currentTaskId) {
        if (payload.status === 'completed') {
          setIsGenerating(false)
          setResultVideo(payload.resultUrl ?? null)
          toast.success(t('video_generated_successfully', { defaultValue: 'Motion video generated successfully!' }))
        } else if (payload.status === 'failed') {
          setIsGenerating(false)
          toast.error(payload.message || t('generation_failed', { defaultValue: 'Motion generation failed' }))
        }
      }
    }

    const eventName = `ai-task-${(user)._id || (user).id}`
    socket.on(eventName, handleTaskUpdate)

    return () => {
      socket.off(eventName, handleTaskUpdate)
    }
  }, [user, currentTaskId, t])

  const handleGenerate = async () => {
    if (!selectedVideo && !selectedImage) {
      toast.error(t('select_media_first', { defaultValue: 'Please select reference media' }))
      return
    }
    if (!prompt.trim()) {
      toast.error(t('enter_prompt_first', { defaultValue: 'Please enter a creative prompt' }))
      return
    }

    try {
      setIsGenerating(true)
      setResultVideo(null)
      setCurrentTaskId(null)

      const res = await generateMedia({
        serviceType: 'video_motion',
        prompt,
        attachmentId: selectedImage?.id || selectedImage?._id,
        videoAttachmentId: selectedVideo?.id || selectedVideo?._id,
        aspectRatio: ratio,
        resolution: quality,
        mode,
        sound,
        duration: 5, // Default duration
      }).unwrap()

      if (res.taskId) {
        setCurrentTaskId(res.taskId)
        toast.info(t('motion_gen_started', { defaultValue: `Video Motion processing started...` }))
      } else {
        setIsGenerating(false)
        toast.error(t('failed_to_start_generation', { defaultValue: 'Failed to start generation task' }))
      }
    } catch (error: unknown) {
      setIsGenerating(false)
      toast.error(
        (error as { data?: { message?: string } })?.data?.message ||
        t('something_went_wrong', { defaultValue: 'Something went wrong' }),
      )
    }
  }

  const handleSaveToMedia = async () => {
    if (!currentTaskId) return
    try {
      await saveToMedia({ taskId: currentTaskId }).unwrap()
      toast.success(t('saved_to_media_success', { defaultValue: 'Saved to media library successfully!' }))
    } catch (error: unknown) {
      toast.error(
        (error as { data?: { message?: string } })?.data?.message ||
        t('failed_to_save_media', { defaultValue: 'Failed to save to media' }),
      )
    }
  }

  const handleDownload = async () => {
    if (!resultVideo) return
    try {
      const url = getDownloadUrl(resultVideo)
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `motion-video-${Date.now()}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch {
      toast.error(t('failed_to_download_video', { defaultValue: 'Failed to download video' }))
    }
  }

  const openMediaPicker = (type: 'video' | 'image') => {
    setMediaPickerType(type)
    setIsMediaPickerOpen(true)
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        icon={<Clapperboard className="w-6 h-6 text-primary animate-pulse" />}
        title={t('video_motion', { defaultValue: 'Video Motion' })}
        subtitle={t('video_motion_desc', { defaultValue: 'Manage your video Motion' })}
        showBackButton={false}
      />

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <ReferenceMediaPanel
          selectedVideo={selectedVideo}
          selectedImage={selectedImage}
          onOpenPicker={openMediaPicker}
        />

        {/* Column 2: Stage & Prompt */}
        <main className="lg:col-span-5 flex flex-col gap-6 order-2 lg:order-2 min-w-0">
          <PromptConsole
            prompt={prompt}
            setPrompt={setPrompt}
            isGenerating={isGenerating}
            credits={credits}
            onGenerate={handleGenerate}
            onOpenPromptLibrary={() => setIsPromptLibraryOpen(true)}
            disabled={isGenerating || (!selectedVideo && !selectedImage) || !prompt.trim()}
          />

          <PreviewStage
            isGenerating={isGenerating}
            resultVideo={resultVideo}
            isSaving={isSaving}
            onSave={handleSaveToMedia}
            onDownload={handleDownload}
          />
        </main>

        <MotionParametersPanel
          ratio={ratio}
          setRatio={setRatio}
          quality={quality}
          setQuality={setQuality}
          sound={sound}
          setSound={setSound}
        />
      </div>

      <PromptLibraryModal
        isOpen={isPromptLibraryOpen}
        onClose={() => setIsPromptLibraryOpen(false)}
        onSelect={(p) => setPrompt(p)}
        mode="video_motion"
      />

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(media) => {
          const selectedMedia = Array.isArray(media) ? media[0] : media
          if (mediaPickerType === 'video') setSelectedVideo(selectedMedia)
          else setSelectedImage(selectedMedia)
          setIsMediaPickerOpen(false)
        }}
        type={mediaPickerType}
      />
    </div>
  )
}

export default VideoMotionContent
