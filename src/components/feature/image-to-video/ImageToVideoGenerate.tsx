'use client'

import { getDownloadUrl } from '@/utils'
import { VideoGenerationOptions } from '@/components/feature/ai-video/VideoGenerationOptions'
import MediaPickerModal from '@/components/feature/media-library/MediaPickerModal'
import { PageHeader } from '@/components/reusable/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Label from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textArea'
import { useGetTemplatesQuery } from '@/redux/api/aiTemplateApi'
import { useGenerateMediaMutation, useGetUsageLogsQuery, useSaveToMediaMutation } from '@/redux/api/aiApi'
import { useUploadAttachmentsMutation } from '@/redux/api/attachmentApi'
import { useGetDashboardStatsQuery } from '@/redux/api/dashboardApi'
import { useAppSelector } from '@/redux/hooks'
import { socket } from '@/services/socketSetup'
import { AITemplate, Attachment } from '@/types'
import { Film, Loader2, Sparkles, Wand2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { ROUTES } from '@/constants/routes'
import { GenerationLogItem, MediaTaskProp } from '@/types/components/features'
import { ReferenceImages } from './components/ReferenceImages'
import { GenerationOutput } from './components/GenerationOutput'
import PromptLibraryModal from '../ai-common/PromptLibraryModal'

export default function ImageToVideoGenerate() {
  const { t } = useTranslation()
  const router = useRouter()
  const user = useAppSelector((state) => state.auth.user)
  const searchParams = useSearchParams()
  const templateId = searchParams.get('templateId')

  const [prompt, setPrompt] = useState('')
  const [aspectRatio, setAspectRatio] = useState('16:9')
  const [duration, setDuration] = useState(5)
  const [mode, setMode] = useState('std')
  const [sound, setSound] = useState(false)
  const [isMultiShot, setIsMultiShot] = useState(false)
  const [shots, setShots] = useState<{ image: Attachment | null, prompt: string, duration: number }[]>([
    { image: null, prompt: '', duration: 3 }
  ])
  const [startAttachment, setStartAttachment] = useState<Attachment | null>(null)
  const [endAttachment, setEndAttachment] = useState<Attachment | null>(null)
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)
  const [pickingFor, setPickingFor] = useState<{ type: 'start' | 'end' | 'shot', index?: number } | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null)
  const [resultVideo, setResultVideo] = useState<string | null>(null)
  const [isPromptLibraryOpen, setIsPromptLibraryOpen] = useState(false)

  const [uploadAttachment] = useUploadAttachmentsMutation()
  const { data: templatesRaw } = useGetTemplatesQuery({ status: true })
  const { data: stats } = useGetDashboardStatsQuery()
  const credits = stats?.aiFeatures?.find(f => f.feature_key === 'images_to_video')?.credits
  const templates = Array.isArray(templatesRaw) ? templatesRaw : templatesRaw?.templates || []

  useEffect(() => {
    if (templateId && templates.length > 0) {
      const found = templates.find((t: AITemplate) => (t.id || t._id) === templateId)
      if (found && !prompt) {
        setPrompt(found.prompt)

        if (found.attachment_id) {
          const attachmentObj: any = typeof found.attachment_id === 'object' && found.attachment_id !== null
            ? found.attachment_id
            : {
              _id: typeof found.attachment_id === 'string' ? found.attachment_id : undefined,
              file_path: found.file_path || (typeof found.attachment_id === 'string' ? found.attachment_id : undefined),
            };

          if (attachmentObj.file_path || attachmentObj._id || attachmentObj.id) {
            setStartAttachment(attachmentObj)
          }
        }
      }
    }
  }, [templateId, templates])

  const [generateMedia] = useGenerateMediaMutation()
  const [saveToMedia, { isLoading: isSaving }] = useSaveToMediaMutation()

  const { data: usageLogsData, refetch: refetchLogs } = useGetUsageLogsQuery({
    serviceType: 'images_to_video',
    limit: 5,
  })
  const recentLogs = (usageLogsData?.logs || []) as GenerationLogItem[]

  useEffect(() => {
    if (!user) return

    const handleTaskUpdate = (payload: any) => {
      if (payload.taskId === currentTaskId) {
        if (payload.status === 'completed') {
          setIsGenerating(false)
          setResultVideo(payload.resultUrl)
          refetchLogs()
          toast.success(t('video_generated_successfully', { defaultValue: 'Video generated successfully!' }))
        } else if (payload.status === 'failed') {
          setIsGenerating(false)
          toast.error(payload.message || t('generation_failed', { defaultValue: 'Generation failed' }))
        }
      }
    }

    const eventName = `ai-task-${(user as any)._id || user.id}`
    socket.on(eventName, handleTaskUpdate)

    return () => {
      socket.off(eventName, handleTaskUpdate)
    }
  }, [user, currentTaskId, t, refetchLogs])

  const handleGenerate = async () => {
    if (!isMultiShot && !prompt.trim()) {
      toast.error(t('please_enter_prompt', { defaultValue: 'Please enter a prompt' }))
      return
    }

    if (isMultiShot) {
      if (shots.some(s => !s.prompt.trim())) {
        toast.error(t('please_fill_all_shot_prompts', { defaultValue: 'Please fill prompts for all shots' }))
        return
      }
      if (!shots[0].image) {
        toast.error(t('please_select_first_shot_image', { defaultValue: 'Please select an image for the first shot' }))
        return
      }
    } else if (!startAttachment) {
      toast.error(t('please_select_start_image', { defaultValue: 'Please select a start image' }))
      return
    }

    try {
      setIsGenerating(true)
      setResultVideo(null)

      let attachmentIds: string[] = []
      let multiPrompt: any[] = []

      if (isMultiShot) {
        attachmentIds = [shots[0]?.image?.id || (shots[0]?.image as any)?._id].filter(Boolean)
        multiPrompt = shots.map(s => ({
          prompt: s.prompt,
          duration: s.duration
        }))
      } else {
        attachmentIds = [
          startAttachment?.id || (startAttachment as any)?._id,
          endAttachment ? (endAttachment.id || (endAttachment as any)?._id) : null
        ].filter(Boolean) as string[]
      }

      const res = await generateMedia({
        serviceType: 'images_to_video',
        prompt: isMultiShot ? undefined : prompt,
        attachmentIds,
        aspectRatio,
        duration: isMultiShot ? undefined : duration,
        mode,
        sound,
        multiShots: isMultiShot,
        multiPrompt: isMultiShot ? multiPrompt : undefined
      }).unwrap()

      if (res.taskId) {
        setCurrentTaskId(res.taskId)
      } else {
        setIsGenerating(false)
        toast.error(t('failed_to_start_generation', { defaultValue: 'Failed to start generation task' }))
      }
    } catch (error: any) {
      setIsGenerating(false)
      toast.error(error?.data?.message || t('something_went_wrong', { defaultValue: 'Something went wrong' }))
    }
  }

  const handleSaveToMedia = async () => {
    if (!currentTaskId) return
    try {
      await saveToMedia({ taskId: currentTaskId }).unwrap()
      toast.success(t('saved_to_media_success', { defaultValue: 'Saved to media library successfully!' }))
    } catch (error: any) {
      toast.error(error?.data?.message || t('failed_to_save_media', { defaultValue: 'Failed to save to media' }))
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
      link.download = `ai-video-${Date.now()}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      toast.error(t('failed_to_download_video', { defaultValue: 'Failed to download video' }))
    }
  }

  // Handlers for image removal are now internal or passed individually
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        icon={<Film className="w-6 h-6 text-primary animate-pulse" />}
        title={t('image_to_video', { defaultValue: 'Image to Video' })}
        subtitle={t('image_to_video_desc', { defaultValue: 'Manage your ImageTo Video' })}
        showBackButton={false}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Section: Input Area */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="glass-card border-border dark:border-white/10 overflow-hidden rounded-border-radius h-full flex flex-col">
            <CardContent className="p-4 flex-1 flex flex-col overflow-hidden">
              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-6 sm:space-y-8 ">
                {/* Multi-Shot Switch */}
                <div className="flex items-center border-glass-border justify-between p-3 sm:p-4 rounded-border-radius border border-border/30 dark:border-white/10">
                  <div className="space-y-0.5">
                    <Label className=" text-base font-medium text-title-color dark:text-white">
                      {t('multiple_shots', { defaultValue: 'Multiple Shots' })}
                    </Label>
                    <p className="text-sm text-subtitle-color line-clamp-2 whitespace-normal text-wrap dark:text-white/40">
                      {t('multi_shot_desc', {
                        defaultValue: 'Create a sequence of up to 4 scenes with different prompts',
                      })}
                    </p>
                  </div>
                  <Switch checked={isMultiShot} onCheckedChange={setIsMultiShot} />
                </div>

                {/* 1. Prompt Area */}
                {!isMultiShot && (
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between px-1 flex-wrap gap-2">
                      <Label className="text-base font-bold flex items-center gap-2 text-foreground dark:text-white/90">
                        <Sparkles className="w-5 h-5 text-primary" />
                        {t('animation_instructions', { defaultValue: 'Animation Instructions' })}
                      </Label>
                      <Button
                        onClick={() => setIsPromptLibraryOpen(true)}
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-2 bg-primary/10! text-primary hover:bg-primary/20 rounded-radius text-[10px] font-black uppercase tracking-widest border border-primary/20 transition-all"
                      >
                        <Sparkles className="w-3 h-3" />
                        {t('prompt_library', { defaultValue: 'Prompt Library' })}
                      </Button>
                    </div>
                    <div className="relative group flex flex-col">
                      <div className="absolute top-6 left-6 p-2.5 rounded-border-radius bg-primary/10 text-primary z-10 hidden md:flex items-center justify-center border border-secondary/20 shadow-[0_0_15px_rgba(167,139,250,0.2)]">
                        <Sparkles className="w-6 h-6 fill-priamry/20" />
                      </div>
                      <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t('image_to_video_placeholder', {
                          defaultValue:
                            'Describe how the image should animate... e.g., The camera pans left as the water flows gently, cinematic lighting',
                        })}
                        className="flex rounded-border-radius bg-[unset] ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 border w-full min-h-40 sm:min-h-55 border-primary/50 text-foreground text-base sm:text-lg sm:p-6 p-4 md:pl-20 dark:bg-white/3 focus-visible:ring-primary/20 focus-visible:border-primary/80 transition-all placeholder:text-foreground/30 dark:placeholder:text-white/20 resize-none hover:border-primary/70"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Reference Images / Shots Area */}
                <div className="pt-4 border-t  border-glass-border border-border/30 dark:border-white/5">
                  <ReferenceImages
                    isMultiShot={isMultiShot}
                    shots={shots}
                    setShots={setShots}
                    startAttachment={startAttachment}
                    endAttachment={endAttachment}
                    setStartAttachment={setStartAttachment}
                    setEndAttachment={setEndAttachment}
                    onOpenPicker={(type, index) => {
                      setPickingFor({ type, index })
                      setIsMediaPickerOpen(true)
                    }}
                  />
                </div>

                {/* 3. Parameter Fields */}
                <div className="pt-4 border-t border-glass-border border-border/30 dark:border-white/5">
                  <VideoGenerationOptions
                    aspectRatio={aspectRatio}
                    setAspectRatio={setAspectRatio}
                    duration={duration}
                    setDuration={setDuration}
                    mode={mode}
                    setMode={setMode}
                    sound={sound}
                    setSound={setSound}
                    hideDuration={isMultiShot}
                  />
                </div>
              </div>

              {/* Action Bar (Fixed at bottom) */}
              <div className="py-4 border-t border-glass-border text-white">
                <Button
                  onClick={handleGenerate}
                  disabled={
                    isGenerating ||
                    (isMultiShot
                      ? shots.some((s) => !s.prompt.trim() || (s === shots[0] && !s.image))
                      : !prompt.trim() || !startAttachment)
                  }
                  className="gap-3 h-12 text-white! rounded-radius primary-btn  text-sm sm:text-base shadow-[0_0_20px_rgba(147,197,253,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 ml-auto flex rtl:ml-[unset] rtl:mr-auto border-0 justify-center"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                  {isGenerating ? t('generating') : t('generate_video', { defaultValue: 'Generate Video' })}
                  {!isGenerating && credits && (
                    <span className="w-7 h-7  flex items-center gap-1.5 ml-1 px-1 py-1 bg-black/20 rounded-full text-[12px] font-bold border border-black/20">
                      {credits}
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section: Output Area */}
        <div className="lg:col-span-5">
          <GenerationOutput
            isGenerating={isGenerating}
            resultVideo={resultVideo}
            isSaving={isSaving}
            handleSaveToMedia={handleSaveToMedia}
            handleDownload={handleDownload}
            recentLogs={recentLogs}
            onSelectRecentLog={(log: GenerationLogItem) => {
              const logPrompt =
                (log.payload?.prompt as string) ||
                (log.payload?.input as { prompt?: string })?.prompt ||
                (log.payload?.text as string) ||
                ''
              if (logPrompt) setPrompt(logPrompt)
              if (log.result_url && log.task_id) {
                setResultVideo(log.result_url)
                setCurrentTaskId(log.task_id)
              }
            }}
          />
        </div>
      </div>

      <PromptLibraryModal
        isOpen={isPromptLibraryOpen}
        onClose={() => setIsPromptLibraryOpen(false)}
        onSelect={(p) => setPrompt(p)}
        mode="image_to_video"
      />

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => {
          setIsMediaPickerOpen(false)
          setPickingFor(null)
        }}
        onSelect={(attachment) => {
          const singleAttachment = Array.isArray(attachment) ? attachment[0] : attachment
          if (!singleAttachment) return
          if (!pickingFor) return
          if (pickingFor.type === 'start') {
            setStartAttachment(singleAttachment)
          } else if (pickingFor.type === 'end') {
            setEndAttachment(singleAttachment)
          } else if (pickingFor.type === 'shot' && pickingFor.index !== undefined) {
            setShots((prev) => {
              const newShots = [...prev]
              newShots[pickingFor.index!] = { ...newShots[pickingFor.index!], image: singleAttachment }
              return newShots
            })
          }
          setIsMediaPickerOpen(false)
          setPickingFor(null)
        }}
      />
    </div>
  )
}