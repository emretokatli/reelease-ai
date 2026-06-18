'use client'

import MediaPickerModal from '@/components/feature/media-library/MediaPickerModal'
import { PageHeader } from '@/components/reusable/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Label from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { aiVideoTools } from '@/data/features'
import { cn } from '@/lib/utils'
import { useGenerateMediaMutation, useSaveToMediaMutation, useGetUsageLogsQuery } from '@/redux/api/aiApi'
import { useGetTemplatesQuery } from '@/redux/api/aiTemplateApi'
import { useUploadAttachmentsMutation } from '@/redux/api/attachmentApi'
import { useGetDashboardStatsQuery } from '@/redux/api/dashboardApi'
import { useAppSelector } from '@/redux/hooks'
import { socket } from '@/services/socketSetup'
import { AITemplate, Attachment } from '@/types'
import { getDownloadUrl } from '@/utils'
import {
  Image,
  Layout,
  Loader2,
  Monitor,
  Sparkles,
  Wand2,
  Clock,
  ChevronDown
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import PromptLibraryModal from '../ai-common/PromptLibraryModal'
import { ImageToImageOutput } from './components/ImageToImageOutput'
import { ReferenceImageUpload } from './components/ReferenceImageUpload'

export default function ImageToImageGenerate() {
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.auth.user)
  const searchParams = useSearchParams()
  const templateId = searchParams.get('templateId')

  const [prompt, setPrompt] = useState('')
  const [selectedAttachments, setSelectedAttachments] = useState<Attachment[]>([])
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [isPromptLibraryOpen, setIsPromptLibraryOpen] = useState(false)

  // Parameter State
  const [ratio, setRatio] = useState('1:1')
  const [resolution, setResolution] = useState('1K')

  const { data: templatesRaw, isLoading: isLoadingTemplates } = useGetTemplatesQuery({ status: true })
  const { data: stats } = useGetDashboardStatsQuery()
  const credits = stats?.aiFeatures?.find((f) => f.feature_key === 'image_to_image')?.credits
  const templates = Array.isArray(templatesRaw) ? templatesRaw : templatesRaw?.templates || []

  useEffect(() => {
    if (templateId && templates.length > 0) {
      const found = templates.find((t: AITemplate) => (t.id || t._id) === templateId)
      if (found && !prompt) {
        setPrompt(found.prompt)

        if (found.attachment_id) {
          const attachments = Array.isArray(found.attachment_id)
            ? found.attachment_id
            : [
              typeof found.attachment_id === 'object'
                ? found.attachment_id
                : {
                  _id: typeof found.attachment_id === 'string' ? found.attachment_id : undefined,
                  file_path:
                    found.file_path || (typeof found.attachment_id === 'string' ? found.attachment_id : undefined),
                },
            ]

          const validAttachments = attachments.filter((a: any) => a.file_path || a._id || a.id)
          if (validAttachments.length > 0) {
            setSelectedAttachments(validAttachments)
          }
        }
      }
    }
  }, [templateId, templates])

  // Dynamic Recent Prompts API integration
  const { data: usageLogsData, refetch: refetchLogs } = useGetUsageLogsQuery({
    serviceType: 'image_to_image',
    limit: 5,
  })
  const recentLogs = usageLogsData?.logs || []

  const [generateMedia] = useGenerateMediaMutation()
  const [saveToMedia, { isLoading: isSaving }] = useSaveToMediaMutation()

  useEffect(() => {
    if (!user) return

    const handleTaskUpdate = (payload: any) => {
      if (payload.taskId === currentTaskId) {
        if (payload.status === 'completed') {
          setIsGenerating(false)
          setResultImage(payload.resultUrl)
          toast.success(t('image_generated_successfully', { defaultValue: 'Image generated successfully!' }))
          refetchLogs?.()
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

  const handleRecentLogSelect = (log: any) => {
    const logPromptText =
      log.payload?.prompt || log.payload?.input?.prompt || log.payload?.text || 'AI Generated Image'
    setPrompt(logPromptText)
    
    if (log.result_url && log.task_id) {
      setResultImage(log.result_url)
      setCurrentTaskId(log.task_id)
    }
    
    const payloadAttachments = log.payload?.attachmentIds || log.payload?.input?.attachmentIds
    if (Array.isArray(payloadAttachments) && payloadAttachments.length > 0) {
      const attachments = payloadAttachments.map((att: any) => {
        if (typeof att === 'string') {
          return { id: att, file_path: '' }
        }
        return {
          id: att.id || att._id,
          file_path: att.file_path || att.url || '',
        }
      })
      setSelectedAttachments(attachments as any)
    }
    
    toast.success(t('prompt_loaded', { defaultValue: 'Prompt loaded from history!' }))
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error(t('please_enter_prompt', { defaultValue: 'Please enter a prompt' }))
      return
    }

    if (selectedAttachments.length === 0) {
      toast.error(
        t('please_select_reference_image', { defaultValue: 'Please select or upload at least one reference image' }),
      )
      return
    }

    try {
      setIsGenerating(true)
      setResultImage(null)

      const res = await generateMedia({
        serviceType: 'image_to_image',
        prompt,
        aspectRatio: ratio,
        resolution,
        attachmentIds: selectedAttachments.map((a) => a.id || (a as any)._id),
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
    if (!resultImage) return
    try {
      const url = getDownloadUrl(resultImage)
      const response = await fetch(url)
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `ai-image-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      toast.error(t('failed_to_download_image', { defaultValue: 'Failed to download image' }))
    }
  }

  const handleTemplateClick = (template: AITemplate) => {
    setPrompt(template.prompt)

    if (template.attachment_id) {
      const attachments = Array.isArray(template.attachment_id)
        ? template.attachment_id
        : [
          typeof template.attachment_id === 'object'
            ? template.attachment_id
            : {
              _id: typeof template.attachment_id === 'string' ? template.attachment_id : undefined,
              file_path:
                template.file_path ||
                (typeof template.attachment_id === 'string' ? template.attachment_id : undefined),
            },
        ]

      const validAttachments = attachments.filter((a: any) => a.file_path || a._id || a.id)
      if (validAttachments.length > 0) {
        setSelectedAttachments(validAttachments)
      }
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        icon={<Image className="w-6 h-6 text-primary animate-pulse" />}
        title={t('image_to_image', { defaultValue: 'Image to Image' })}
        subtitle={t('image_to_image_desc', { defaultValue: 'Manage your ' })}
        showBackButton={false}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Section: Input Area */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Describe your transformation */}
          <div className="bg-white dark:bg-white/3 border border-glass-border rounded-border-radius p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-[11px] shadow-[0_0_10px_rgba(139,92,246,0.5)] mt-0.5 shrink-0">
                1
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('transformation_prompt', { defaultValue: 'Transformation Prompt' })}
                </h3>
                <p className="text-sm text-subtitle-color mt-0.5">
                  {t('image_to_image_desc_sub', {
                    defaultValue: 'Describe how you want to transform this image... e.g. make it cyberpunk',
                  })}
                </p>
              </div>
            </div>

            <div className="relative">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t('image_to_image_placeholder', {
                  defaultValue: 'Describe how you want to transform this image... e.g. make it cyberpunk, add neon glow',
                })}
                className="w-full min-h-32 sm:min-h-40 bg-slate-50 dark:bg-white/3 border border-glass-border focus:border-[#7c3aed]/40 rounded-border-radius p-4 text-sm sm:text-base leading-relaxed text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none outline-hidden"
              />
              <div className="absolute bottom-3 right-3 text-right">
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-200 dark:bg-black/50 px-2 py-0.5 rounded-md">
                  {prompt.length} / 1000
                </span>
              </div>
            </div>

            {/* Prompt tools row */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
              <Button
                onClick={() => setIsPromptLibraryOpen(true)}
                variant="ghost"
                className="h-8 px-3 rounded-lg bg-slate-50 dark:bg-white/3 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 gap-1.5 font-bold text-[11px]"
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {t('prompt_library', { defaultValue: 'Prompt Library' })}
                <ChevronDown className="w-3 h-3 opacity-60" />
              </Button>
            </div>
          </div>

          {/* STEP 2: Reference Image */}
          <div className="bg-white dark:bg-white/3 border border-glass-border rounded-border-radius p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-[11px] shadow-[0_0_10px_rgba(139,92,246,0.5)] mt-0.5 shrink-0">
                2
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('reference_image', { defaultValue: 'Reference Image' })}
                </h3>
                <p className="text-sm text-subtitle-color mt-0.5">
                  {t('reference_image_desc_sub', {
                    defaultValue: 'Select or upload a base image to guide the transformation',
                  })}
                </p>
              </div>
            </div>
            <ReferenceImageUpload
              selectedAttachments={selectedAttachments}
              setSelectedAttachments={setSelectedAttachments}
              setIsMediaPickerOpen={setIsMediaPickerOpen}
            />
          </div>

          {/* STEP 3: Image Settings */}
          <div className="bg-white dark:bg-white/3 border border-glass-border rounded-border-radius p-4 sm:p-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-[11px] shadow-[0_0_10px_rgba(139,92,246,0.5)] mt-0.5 shrink-0">
                3
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t('image_settings', { defaultValue: 'Image Settings' })}
                </h3>
                <p className="text-sm text-subtitle-color mt-0.5">
                  {t('image_settings_desc_sub', {
                    defaultValue: 'Adjust the output format and details',
                  })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/30">
              {/* Aspect Ratio */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <div className=" flex items-center gap-2 text-sm font-semibold text-title">
                    <Layout className="w-5 h-5 text-primary" />
                    {t('aspect_ratio')}
                  </div>
                  <span className="text-[10px] font-bold text-primary/60 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    {ratio}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 dark:bg-black/40 rounded-border-radius border border-glass-card dark:border-white/5 backdrop-blur-md shadow-inner">
                  {aiVideoTools.map((option) => (
                    <Button
                      key={option.value}
                      onClick={() => setRatio(option.value)}
                      className={cn(
                        'group/btn h-12 rounded-xl border px-2 py-px text-xs font-semibold flex items-center justify-center gap-2 transition-all',
                        ratio === option.value
                          ? 'text-primary dark:text-primary border-primary shadow-[0_0_15px_rgba(167,139,250,0.15)] font-bold'
                          : 'bg-foreground/5 dark:bg-white/4 border-border  hover:bg-foreground/10 dark:hover:bg-white/10 hover:border-border/50 dark:hover:border-white/10',
                      )}
                    >
                      {ratio === option.value && (
                        <div className="absolute inset-0" />
                      )}
                      <option.icon
                        className={cn(
                          'w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover/btn:scale-110',
                          ratio === option.value ? 'text-primary' : 'text-foreground/40 dark:text-white/40',
                        )}
                      />
                      <span
                        className={cn(
                          'text-xs font-medium uppercase tracking-tighter transition-colors',
                          ratio === option.value ? 'text-primary' : 'text-foreground/40 dark:text-white/40',
                        )}
                      >
                        {option.label}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Resolution */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1 ">
                  <div className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-primary" />
                    {t('quality')}
                  </div>
                  <span className="text-[10px] font-bold text-primary/60 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                    {resolution}
                  </span>
                </div>

                <div className="flex gap-2 p-2 dark:bg-black/40 rounded-border-radius border border-glass-card dark:border-white/5 backdrop-blur-md shadow-inner">
                  {['1K', '2K'].map((res) => (
                    <Button
                      key={res}
                      onClick={() => setResolution(res)}
                      className={cn(
                        'relative flex-1 h-10 sm:h-12 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border font-bold text-[11px] sm:text-[12px] uppercase tracking-widest overflow-hidden',
                        resolution === res
                          ? 'primary-btn border-primary/30 dark:border-white/20 text-white! shadow-[0_0_20px_rgba(167,139,250,0.1)]'
                          : 'bg-foreground/5 dark:bg-white/5 border-border/30 dark:border-white/5 text-foreground/40 dark:text-white/40 hover:bg-foreground/10 dark:hover:bg-white/10',
                      )}
                    >
                      {resolution === res && (
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-secondary/40" />
                      )}

                      <span className="relative z-10">{res}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-2 flex justify-end">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim() || selectedAttachments.length === 0}
              className="gap-3 h-12 font-medium text-sm sm:text-base sm:px-6 px-4 rounded-radius primary-btn text-white! flex shadow-[0_0_20px_rgba(147,197,253,0.3)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 border-0 justify-center"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
              {isGenerating ? t('generating') : t('transform_image', { defaultValue: 'Transform Image' })}
              {!isGenerating && credits && (
                <span className="w-7 h-7 flex items-center gap-1.5 ml-1 px-2 py-1 bg-black/20 rounded-full text-[12px] font-bold border border-black/20">
                  {credits}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Right Section: Output Area */}
        <div className="lg:col-span-5">
          <ImageToImageOutput
            isGenerating={isGenerating}
            resultImage={resultImage}
            isSaving={isSaving}
            handleSaveToMedia={handleSaveToMedia}
            handleDownload={handleDownload}
            recentLogs={recentLogs}
            onSelectRecentLog={handleRecentLogSelect}
          />
        </div>
      </div>

      <PromptLibraryModal
        isOpen={isPromptLibraryOpen}
        onClose={() => setIsPromptLibraryOpen(false)}
        onSelect={(p, item) => handleTemplateClick(item)}
        mode="image_to_image"
      />

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(attachment) => {
          const newAttachments = Array.isArray(attachment) ? attachment : [attachment]
          setSelectedAttachments((prev) => {
            if (prev.length + newAttachments.length > 8) {
              toast.error(t('max_8_images', { defaultValue: 'You can only add up to 8 images' }))
              return prev
            }
            return [...prev, ...newAttachments]
          })
          setIsMediaPickerOpen(false)
        }}
      />
    </div>
  )
}
