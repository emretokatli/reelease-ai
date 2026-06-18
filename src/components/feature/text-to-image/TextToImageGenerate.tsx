'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textArea'
import { ROUTES } from '@/constants/routes'
import { localDetailEnhancements } from '@/data/aiPromptPresets'
import { aspectRatioOptions, surprisePrompts } from '@/data/features'
import { cn } from '@/lib/utils'
import { useGenerateMediaMutation, useGetUsageLogsQuery, useSaveToMediaMutation } from '@/redux/api/aiApi'
import { useGetPromptsQuery } from '@/redux/api/aiPromptApi'
import { useGetDashboardStatsQuery } from '@/redux/api/dashboardApi'
import { useGenerateCaptionMutation } from '@/redux/api/socialPublishApi'
import { useAppSelector } from '@/redux/hooks'
import { socket } from '@/services/socketSetup'
import { AiPrompt } from '@/types/components/ai-prompts'
import { getDownloadUrl, getMediaUrl } from '@/utils'
import {
  Briefcase,
  ChevronDown,
  Clock,
  Crown,
  Dices,
  Download,
  FileType,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  Lightbulb,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Sparkle,
  Sparkles,
  Wand2,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AIFeaturePageHeader } from '../ai-common/AIFeaturePageHeader'
import PromptLibraryModal from '../ai-common/PromptLibraryModal'

// Custom Switch component for toggles
const Switch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden',
        checked ? 'bg-[#5850EC] dark:bg-[#6875F5]' : 'bg-black/40 dark:bg-white/10',
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
          checked ? 'translate-x-4' : 'translate-x-0',
        )}
      />
    </button>
  )
}

// Visual Aspect Ratio display boxes
const AspectRatioBox = ({ ratio }: { ratio: string }) => {
  let style = {}
  switch (ratio) {
    case '16:9':
      style = { width: '24px', height: '14px' }
      break
    case '9:16':
      style = { width: '14px', height: '24px' }
      break
    case '1:1':
      style = { width: '18px', height: '18px' }
      break
    default:
      style = { width: '18px', height: '18px' }
  }
  return (
    <div
      className="border border-current rounded-xs opacity-80 group-hover/btn:opacity-100 transition-opacity"
      style={style}
    />
  )
}

// Preset prompts for the "Surprise Me" feature


export default function TextToImageGenerate() {
  const { t } = useTranslation()
  const router = useRouter()
  const user = useAppSelector((state) => state.auth.user)
  const searchParams = useSearchParams()
  const templateId = searchParams.get('templateId')

  // Core Generation State
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null)
  const [resultItems, setResultItems] = useState<{ taskId: string; url: string }[]>([])
  const [expectedImageCount, setExpectedImageCount] = useState(1)
  const pendingTaskIdsRef = useRef<Set<string>>(new Set())
  const [isPromptLibraryOpen, setIsPromptLibraryOpen] = useState(false)

  // Image Settings States
  const [ratio, setRatio] = useState('1:1')
  const [resolution, setResolution] = useState('1K')

  // Custom Option States
  const [style, setStyle] = useState('Photorealistic')
  const [isStyleOpen, setIsStyleOpen] = useState(false)

  const [colorLighting, setColorLighting] = useState('Natural')
  const [isColorOpen, setIsColorOpen] = useState(false)

  const [numImages, setNumImages] = useState(2)

  // Advanced Options States
  const [, setRemoveBackground] = useState(false)
  const [, setEnhancePrompt] = useState(true)
  const [addWatermark, setAddWatermark] = useState(false)
  const [negativePrompt, setNegativePrompt] = useState('blurry, low quality, text, watermark')
  const [seed, setSeed] = useState('')

  const [outputDestination, setOutputDestination] = useState('Media Library')
  const [isOutputOpen, setIsOutputOpen] = useState(false)

  const { data: promptsData } = useGetPromptsQuery({ page: 1, limit: 100 })
  const { data: stats } = useGetDashboardStatsQuery()
  const creditsPerImage = stats?.aiFeatures?.find((f) => f.feature_key === 'text_to_image')?.credits || 2
  const totalGenerationCredits = creditsPerImage * numImages
  
  // Dynamic Recent Prompts API integration
  const { data: usageLogsData, refetch: refetchLogs } = useGetUsageLogsQuery({
    serviceType: 'text_to_image',
    limit: 5,
  })
  const recentLogs = usageLogsData?.logs || []
  
  useEffect(() => {
    const prompts = promptsData?.prompts || []
    if (templateId && prompts.length > 0) {
      const found = prompts.find((t: AiPrompt) => (t.id || t._id) === templateId)
      if (found) {
        setPrompt(found.prompt)
      }
    }
  }, [templateId])

  const [generateMedia] = useGenerateMediaMutation()
  const [saveToMedia] = useSaveToMediaMutation()
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null)
  const [generateCaption, { isLoading: isEnhancingPrompt }] = useGenerateCaptionMutation()

  useEffect(() => {
    if (!user) return

    const handleTaskUpdate = async (payload: any) => {
      const taskId = payload?.taskId
      if (!taskId || !pendingTaskIdsRef.current.has(taskId)) return

      if (payload.status === 'completed' && payload.resultUrl) {
        setResultItems((prev) => {
          if (prev.some((item) => item.taskId === taskId)) return prev
          return [...prev, { taskId, url: payload.resultUrl }]
        })
        pendingTaskIdsRef.current.delete(taskId)

        try {
          await saveToMedia({ taskId }).unwrap()
        } catch (err) {
          console.error('Auto save to media error:', err)
        }

        if (pendingTaskIdsRef.current.size === 0) {
          setIsGenerating(false)
          toast.success(
            `${expectedImageCount} ${t('image_generated_successfully', { defaultValue: 'image(s) generated successfully!' })}`,
          )
          refetchLogs?.()
        }
      } else if (payload.status === 'failed') {
        pendingTaskIdsRef.current.delete(taskId)
        if (pendingTaskIdsRef.current.size === 0) {
          setIsGenerating(false)
        }
        toast.error(payload.message || t('generation_failed', { defaultValue: 'Generation failed' }))
      }
    }

    const eventName = `ai-task-${(user)._id || user.id}`
    socket.on(eventName, handleTaskUpdate)

    return () => {
      socket.off(eventName, handleTaskUpdate)
    }
  }, [user, expectedImageCount, t, saveToMedia, refetchLogs])

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error(t('please_enter_prompt', { defaultValue: 'Please enter a prompt' }))
      return
    }

    try {
      const imageCount = Math.max(1, Math.min(4, numImages))
      setIsGenerating(true)
      setResultItems([])
      setCurrentTaskId(null)
      pendingTaskIdsRef.current = new Set()
      setExpectedImageCount(imageCount)

      let finalPrompt = prompt.trim()
      if (style && style !== 'None' && style !== 'Photorealistic') {
        finalPrompt += `, in ${style} style`
      }
      if (colorLighting && colorLighting !== 'None' && colorLighting !== 'Natural') {
        finalPrompt += `, with ${colorLighting} lighting`
      }

      const requestBody = {
        serviceType: 'text_to_image' as const,
        prompt: finalPrompt,
        aspectRatio: ratio,
        resolution,
        addWatermark,
        allowWatermark: addWatermark,
        negativePrompt,
      }

      // Provider returns one image per job — start one task per selected count
      const startResults = await Promise.all(
        Array.from({ length: imageCount }, () =>
          generateMedia(requestBody)
            .unwrap()
            .then((res) => res.taskId as string | undefined)
            .catch(() => undefined),
        ),
      )

      const taskIds = startResults.filter((id): id is string => Boolean(id))
      if (!taskIds.length) {
        setIsGenerating(false)
        toast.error(t('failed_to_start_generation', { defaultValue: 'Failed to start generation' }))
        return
      }

      taskIds.forEach((id) => pendingTaskIdsRef.current.add(id))
      setCurrentTaskId(taskIds[0])

      if (taskIds.length < imageCount) {
        setExpectedImageCount(taskIds.length)
        toast.warning(
          t('partial_generation_started', {
            defaultValue: 'Only {{started}} of {{requested}} generations started. Check your credits.',
            started: taskIds.length,
            requested: imageCount,
          }),
        )
      }
    } catch (error: any) {
      setIsGenerating(false)
      toast.error(error?.data?.message || t('something_went_wrong', { defaultValue: 'Something went wrong' }))
    }
  }

  const handleSaveToMedia = async (taskId?: string) => {
    const id = taskId || currentTaskId
    if (!id) return
    setSavingTaskId(id)
    try {
      await saveToMedia({ taskId: id }).unwrap()
      toast.success(t('saved_to_media_success', { defaultValue: 'Saved to media library successfully!' }))
    } catch (error: any) {
      toast.error(error?.data?.message || t('failed_to_save_media', { defaultValue: 'Failed to save to media' }))
    } finally {
      setSavingTaskId(null)
    }
  }

  const handleDownload = async (imagePath?: string) => {
    const path = imagePath || resultItems[0]?.url
    if (!path) return
    try {
      const url = getDownloadUrl(path)
      if (!url) return
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
    } catch {
      toast.error(t('failed_to_download_image', { defaultValue: 'Failed to download image' }))
    }
  }

  const handleSurpriseMe = () => {
    const randomIndex = Math.floor(Math.random() * surprisePrompts.length)
    setPrompt(surprisePrompts[randomIndex])
    toast.success(t('surprise_prompt_applied', { defaultValue: 'Random prompt applied!' }))
  }

  // Handle Dynamic Improve Prompt using AI caption endpoint
  const handleImprovePrompt = async () => {
    if (!prompt.trim()) {
      toast.warning(t('enter_prompt_first', { defaultValue: 'Please enter a prompt first' }))
      return
    }
    try {
      const res = await generateCaption({
        platform: 'instagram',
        purpose: 'image_prompt',
        custom_prompt: `Refine this image-generation prompt with richer visual detail, lighting, and composition. Keep it under 200 characters as one line: "${prompt}"`,
        num_captions: 1,
      }).unwrap()

      if (res.success && res.data?.captions?.length > 0) {
        setPrompt(res.data.captions[0])
        toast.success(t('prompt_enhanced', { defaultValue: 'Prompt enhanced with descriptive details!' }))
      } else {
        throw new Error('Empty response')
      }
    } catch (error: any) {
      console.error('Enhance prompt error:', error)
      const apiMessage = error?.data?.message as string | undefined
      if (apiMessage) {
        toast.error(apiMessage)
        return
      }
      setPrompt((prev) => `${prev}, photorealistic, dramatic lighting, highly detailed, 8k resolution`)
      toast.warning(
        t('ai_unavailable_local_enhance', {
          defaultValue: 'AI is unavailable — added basic enhancement keywords locally.',
        }),
      )
    }
  }

  const handleAddDetails = () => {
    if (!prompt.trim()) {
      toast.warning(t('enter_prompt_first', { defaultValue: 'Please enter a prompt first' }))
      return
    }
    const detail = localDetailEnhancements[Math.floor(Math.random() * localDetailEnhancements.length)]
    setPrompt((prev) => (prev.includes(detail) ? prev : `${prev}, ${detail}`))
    toast.success(t('details_added', { defaultValue: 'Visual details added to your prompt!' }))
  }

  // Handle Reset All options
  const handleResetAll = () => {
    setPrompt('')
    setRatio('1:1')
    setResolution('1K')
    setStyle('Photorealistic')
    setColorLighting('Natural')
    setNumImages(2)
    setRemoveBackground(false)
    setEnhancePrompt(true)
    setAddWatermark(false)
    setNegativePrompt('blurry, low quality, text, watermark')
    setSeed('')
    setOutputDestination('Media Library')
    toast.info(t('settings_reset', { defaultValue: 'All settings reset to defaults.' }))
  }

  // Dynamic seed generator
  const handleRandomizeSeed = () => {
    const randSeed = Math.floor(Math.random() * 89999 + 10000).toString()
    setSeed(randSeed)
    toast.success(t('seed_randomized', { defaultValue: 'Random seed generated!' }))
  }

  // Quality options - 1K and 2K only as requested
  const qualities = [
    { label: '1K', resolution: '1K' },
    { label: '2K', resolution: '2K' },
  ]

  // dropdown options lists
  const styleOptions = ['Photorealistic', 'Anime', 'Cartoon', '3D Render', 'Cyberpunk', 'Oil Painting', 'Watercolor']
  const colorOptions = ['Natural', 'Warm', 'Cool', 'Studio', 'Dramatic', 'Vibrant', 'Black & White']
  const destinationOptions = ['Media Library']

  const actionFooter = (
    <>
      <Button
        onClick={handleResetAll}
        variant="outline"
        className="h-11 px-4 rounded-xl bg-slate-50 dark:bg-white/3 border border-glass-border hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 gap-2 font-bold text-xs"
      >
        <RotateCcw className="w-4 h-4 text-slate-400" />
        Reset All
      </Button>

      <div className="flex flex-col">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="h-11 sm:h-12 px-6 rounded-xl primary-btn hover:opacity-95 text-white! font-bold gap-2 text-xs sm:text-sm flex items-center border-0"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white fill-white/10" />
          )}
          {isGenerating ? t('generating') : t('create_image', 'Create Image')}

          {!isGenerating && (
            <span className="w-7 h-7 flex items-center gap-1.5 ml-1 justify-center bg-black/20 rounded-full text-[12px] font-bold border border-glass-border">
              {totalGenerationCredits}
            </span>
          )}
        </Button>
        <span className="text-[12px] text-slate-500 font-medium mt-1">
          {t('generation_credit_cost', {
            defaultValue: 'Uses {{credits}} credits ({{perImage}} per image × {{count}} images)',
            credits: totalGenerationCredits,
            perImage: creditsPerImage,
            count: numImages,
          })}
        </span>
      </div>
    </>
  )

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Header section with rich aesthetics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <AIFeaturePageHeader
          icon={<FileType className="w-6 h-6 text-primary animate-pulse" />}
          title={t('text_to_image', { defaultValue: 'Text to Image' })}
          subtitle={t('text_to_image_subtitle', {
            defaultValue: 'Transform your ideas into stunning visuals with AI',
          })}
        />
      </div>

      {/* Glassmorphic tags bar under header */}
      <div className="flex flex-wrap gap-2 py-1">
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/3 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300">
          <Sparkle className="w-3.5 h-3.5 text-blue-400" /> High Quality Output
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/3 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300">
          <Layers className="w-3.5 h-3.5 text-purple-400" /> Multiple Styles
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/3 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300">
          <Briefcase className="w-3.5 h-3.5 text-pink-400" /> Commercial Use
        </span>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/3 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300">
          <Zap className="w-3.5 h-3.5 text-amber-400" /> Fast Generation
        </span>
      </div>

      {/* Main 2-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Section: Inputs & Parameters (takes 8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: Describe your image */}
          <div className="bg-white dark:bg-white/3 border border-glass-border rounded-border-radius p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-[11px] shadow-[0_0_10px_rgba(139,92,246,0.5)] mt-0.5 shrink-0">
                1
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Describe your image</h3>
                <p className="text-sm text-subtitle-color mt-0.5">
                  Write a detailed prompt. The more details, the better the result.
                </p>
              </div>
            </div>

            <div className="relative">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A majestic lion standing in a lush green forest, sunlight filtering through trees, ultra realistic, high detail..."
                className="w-full min-h-32 sm:min-h-40 bg-slate-50 dark:bg-white/3 border border-glass-border focus:border-[#7c3aed]/40 rounded-border-radius p-4 text-sm sm:text-base leading-relaxed text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none outline-hidden"
              />
              <div className="absolute bottom-3 right-3 text-right">
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-200 dark:bg-black/50 px-2 py-0.5 rounded-md">
                  {prompt.length} / 1000
                </span>
              </div>
            </div>

            {/* Prompt tools row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleImprovePrompt}
                  disabled={isEnhancingPrompt}
                  variant="outline"
                  className="h-8 px-3 rounded-lg bg-slate-50 dark:bg-white/3 border-glass-border hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 gap-1.5 font-bold text-[11px]"
                >
                  {isEnhancingPrompt ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  ) : (
                    <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                  )}
                  Improve Prompt
                </Button>
                <Button
                  onClick={handleAddDetails}
                  variant="outline"
                  className="h-8 px-3 rounded-lg bg-slate-50 dark:bg-white/3 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 gap-1.5 font-bold text-[11px]"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-400" />
                  Add Details
                </Button>
                <Button
                  onClick={handleSurpriseMe}
                  variant="outline"
                  className="h-8 px-3 rounded-lg bg-slate-50 dark:bg-white/3 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 gap-1.5 font-bold text-[11px]"
                >
                  <Sparkle className="w-3.5 h-3.5 text-pink-400" />
                  Surprise Me
                </Button>
              </div>

              <Button
                onClick={() => setIsPromptLibraryOpen(true)}
                variant="ghost"
                className="h-8 px-3 rounded-lg bg-slate-50 dark:bg-white/3 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 gap-1.5 font-bold text-[11px]"
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Prompt Library
                <ChevronDown className="w-3 h-3 opacity-60" />
              </Button>
            </div>
          </div>

          {/* Grid for Steps 2 and 3 side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* STEP 2: Image Settings */}
            <div className="bg-white dark:bg-white/3 border border-glass-border rounded-border-radius p-4 sm:p-6 space-y-5">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-[11px] shadow-[0_0_10px_rgba(139,92,246,0.5)] mt-0.5 shrink-0">
                  2
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Image Settings</h3>
                </div>
              </div>

              {/* Aspect Ratio selector */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-title">Aspect Ratio</h4>
                <div className="grid grid-cols-3 gap-4">
                  {aspectRatioOptions.map((item) => (
                    <Button
                      key={item.value}
                      type="button"
                      onClick={() => setRatio(item.value)}
                      className={cn(
                        'group/btn relative h-12! rounded-xl border flex! items-center! justify-center! gap-2! transition-all duration-300',
                        ratio === item.value
                          ? 'text-primary dark:text-primary border-primary shadow-[0_0_15px_rgba(167,139,250,0.15)] font-bold'
                          : 'bg-slate-50 dark:bg-white/3 border-glass-border text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-300 dark:hover:border-white/10',
                      )}
                    >
                      <AspectRatioBox ratio={item.value} />
                      <span className="text-xs uppercase tracking-wider">{item.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quality selector */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-title">Quality</h4>
                <div className="flex p-1 bg-black/3 dark:bg-white/3 rounded-xl border border-glass-border gap-1">
                  {qualities.map((item) => (
                    <Button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setResolution(item.resolution)
                      }}
                      className={cn(
                        'flex-1 py-2 rounded-lg text-[10px] sm:text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-all duration-200',
                        resolution === item.resolution
                          ? 'primary-btn text-white! shadow-md'
                          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/3',
                      )}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom selectors (Style and Color/Lighting) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 relative">
                  <h4 className="text-sm font-semibold text-title">Style</h4>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsStyleOpen(!isStyleOpen)
                      setIsColorOpen(false)
                    }}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-white/3 border border-glass-border rounded-xl text-xs flex items-center justify-between text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-white/10 transition-colors"
                  >
                    <span>{style}</span>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </Button>
                  {isStyleOpen && (
                    <div className="absolute top-16 left-0 w-full bg-white dark:bg-[#0F111E] border border-glass-border rounded-xl py-1 shadow-2xl z-50 max-h-48 no-scrollbar overflow-y-auto">
                      {styleOptions.map((opt) => (
                        <Button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setStyle(opt)
                            setIsStyleOpen(false)
                          }}
                          className={cn(
                            'w-full h-8 px-3 text-left text-xs transition-colors block hover:bg-slate-100 dark:hover:bg-white/5',
                            style === opt
                              ? 'text-purple-600 dark:text-purple-400 font-bold bg-slate-50 dark:bg-white/3'
                              : 'text-slate-700 dark:text-slate-300',
                          )}
                        >
                          {opt}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2 relative">
                  <h4 className="text-sm font-semibold text-title">Color & Lighting</h4>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsColorOpen(!isColorOpen)
                      setIsStyleOpen(false)
                    }}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-white/3 border border-glass-border rounded-xl text-xs flex items-center justify-between text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-white/10 transition-colors"
                  >
                    <span>{colorLighting}</span>
                    <ChevronDown className="w-4 h-4 opacity-50" />
                  </Button>
                  {isColorOpen && (
                    <div className="absolute top-16 left-0 w-full bg-white dark:bg-[#0F111E] border border-slate-200 dark:border-white/10 rounded-xl py-1 shadow-2xl z-50 max-h-48 no-scrollbar overflow-y-auto">
                      {colorOptions.map((opt) => (
                        <Button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setColorLighting(opt)
                            setIsColorOpen(false)
                          }}
                          className={cn(
                            'w-full h-8 px-3 text-left text-xs transition-colors block hover:bg-slate-100 dark:hover:bg-white/5',
                            colorLighting === opt
                              ? 'text-purple-600 dark:text-purple-400 font-bold bg-slate-50 dark:bg-white/3'
                              : 'text-slate-700 dark:text-slate-300',
                          )}
                        >
                          {opt}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Number of Images selector */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-title mb-0">Number of Images</h4>
                <p className="text-[12px] text-slate-500 leading-snug">
                  {t('num_images_hint', {
                    defaultValue: 'Each image runs as its own generation job (one result per job).',
                  })}
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <Button
                      key={num}
                      type="button"
                      onClick={() => setNumImages(num)}
                      className={cn(
                        'h-9 rounded-xl border text-xs font-semibold flex items-center justify-center ',
                        numImages === num
                          ? ' border-primary text-primary '
                          : 'bg-slate-50 dark:bg-black/30 border-glass-border text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5',
                      )}
                    >
                      {num}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    onClick={() => {
                      setNumImages(4)
                    }}
                    className="h-9 rounded-xl border border-dashed border-primary text-primary bg-slate-50 dark:bg-black/30 text-xs font-semibold flex items-center justify-center gap-1 hover:bg-purple-100 dark:hover:bg-purple-900/20 transition-all"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    PRO
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-white/3 border border-glass-border rounded-border-radius p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-[11px] shadow-[0_0_10px_rgba(139,92,246,0.5)] mt-0.5 shrink-0">
                  3
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Advanced Options</h3>
                </div>
              </div>

              {/* Toggle Switches */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    Add Watermark
                  </span>
                  <Switch checked={addWatermark} onChange={setAddWatermark} />
                </div>
              </div>

              {/* Negative Prompt field */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-semibold text-title">Negative Prompt</h4>
                  <span title="Things you do not want in the image" className="inline-flex">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-600 hover:text-slate-400 cursor-pointer" />
                  </span>
                </div>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="blurry, low quality, text, watermark..."
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-white/3 border border-glass-border0 rounded-xl text-xs text-slate-900 dark:text-white outline-hidden placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>

              {/* Seed field with Randomize icon */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-title">Seed (Optional)</h4>
                <div className="relative">
                  <input
                    type="text"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder="Enter a number (e.g. 12345)"
                    className="w-full h-10 pl-3 pr-10 bg-slate-50 dark:bg-white/3 border border-glass-border rounded-xl text-xs text-slate-900 dark:text-white outline-hidden placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  />
                  <Button
                    type="button"
                    onClick={handleRandomizeSeed}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-purple-400 transition-colors"
                    title="Generate Random Seed"
                  >
                    <Dices className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Outputs will be saved to */}
              <div className="space-y-2 relative">
                <h4 className="text-sm font-semibold text-title">Outputs will be saved to</h4>
                <Button
                  type="button"
                  onClick={() => setIsOutputOpen(!isOutputOpen)}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-white/3 border border-glass-border rounded-xl text-xs flex items-center justify-between text-slate-900 dark:text-white hover:border-slate-300 dark:hover:border-white/10 transition-colors"
                >
                  <span>{outputDestination}</span>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                </Button>
                {isOutputOpen && (
                  <div className="absolute top-16 left-0 w-full bg-white dark:bg-[#0F111E] border border-slate-200 dark:border-white/10 rounded-xl py-1 shadow-2xl z-50">
                    {destinationOptions.map((opt) => (
                      <Button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setOutputDestination(opt)
                          setIsOutputOpen(false)
                        }}
                        className={cn(
                          'w-full h-8 px-3 text-left text-xs transition-colors block hover:bg-white/5',
                          outputDestination === opt ? 'text-purple-400 font-bold bg-white/3' : 'text-slate-300',
                        )}
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Bar for Reset & Generation Trigger (Desktop) */}
          <div className="hidden lg:flex items-center justify-between w-full">{actionFooter}</div>
        </div>

        {/* Right Section: Output area, recent prompts, and helpful Tips (takes 4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Generation Result Card */}
          <Card className="bg-white dark:bg-white/3 border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden  flex flex-col min-h-[350px] sm:min-h-115">
            <div className="p-4 border-b border-slate-200 dark:border-white/5 flex flex-col">
              <div className="text-base font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <Sparkles className="w-5 h-5 text-purple-400" />
                {t('generation_result', { defaultValue: 'Generation Result' })}
              </div>
              <p className="text-sm text-subtitle-color mt-0.5">Your AI generated images will appear here</p>
            </div>

            <CardContent className="p-6 flex-1 flex flex-col justify-center items-center relative">
              {isGenerating && resultItems.length < expectedImageCount ? (
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-purple-500/10" />
                    <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
                    <Wand2 className="absolute inset-0 m-auto w-5 h-5 sm:w-6 sm:h-6 text-purple-400 animate-pulse" />
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-purple-400 animate-pulse tracking-tight text-center">
                    {t('crafting_masterpiece', {
                      defaultValue: 'Generating {{done}} of {{total}}...',
                      done: resultItems.length,
                      total: expectedImageCount,
                    })}
                  </p>
                </div>
              ) : resultItems.length > 0 ? (
                <div className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto animate-in fade-in duration-500">
                  {resultItems.map((item, index) => (
                    <div
                      key={item.taskId}
                      className="relative group aspect-square w-full rounded-xl overflow-hidden shadow-2xl border border-white/5 bg-black/5"
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_STORAGE_URL || ''}/${item.url}`}
                        alt={`Generated result ${index + 1}`}
                        fill
                        unoptimized
                        className="object-contain"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-xs p-3">
                        <Button
                          onClick={() => handleSaveToMedia(item.taskId)}
                          disabled={savingTaskId === item.taskId}
                          className="gap-2 rounded-xl primary-btn h-9 w-40 text-white! font-bold text-xs"
                        >
                          {savingTaskId === item.taskId ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Save className="w-3.5 h-3.5" />
                          )}
                          {t('save_to_library', { defaultValue: 'Save to Library' })}
                        </Button>
                        <Button
                          onClick={() => handleDownload(item.url)}
                          className="gap-2 rounded-xl h-9 w-9 p-2! bg-primary!  border border-white/10 text-white! font-bold text-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      {resultItems.length > 1 && (
                        <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-md">
                          {index + 1}/{resultItems.length}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 w-full animate-in fade-in duration-500">
                  {/* <div className="relative w-full rounded-xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-inner"> */}
                  <Image
                    src="/images/text-to-image.png"
                    alt="Text to Image preview"
                    width={150}
                    height={150}
                    className="w-[150px] h-[150px] opacity-[0.5] object-cover"
                    unoptimized
                  />
                  <div className="space-y-1.5 text-center">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {t('no_images_generated', { defaultValue: 'No images generated yet' })}
                    </p>
                    <p className="text-xs text-slate-500 leading-normal">
                      {t('image_appear_here_desc', {
                        defaultValue: 'Enter a prompt and click generate to create your first image.',
                      })}
                    </p>
                  </div>
                  {/* </div> */}
                  {/* <p className="text-xs text-slate-500 text-center leading-normal">
                    {t('image_appear_here_desc', {
                      defaultValue: 'Enter a prompt and click generate to create your first image.',
                    })}
                  </p> */}
                </div>
              )}
            </CardContent>

            {/* Recent Prompts area inside Result Card */}
            <div className="p-4 border-t border-slate-200 dark:border-white/5 space-y-3">
              <h4 className="text-sm font-semibold text-title">Recent Prompts</h4>

              <div className="space-y-2">
                {recentLogs.slice(0, 3).map((log) => {
                  const logPromptText =
                    log.payload?.prompt || log.payload?.input?.prompt || log.payload?.text || 'AI Generated Image'
                  const dateStr = log.created_at ? new Date(log.created_at).toLocaleDateString() : 'Recently'
                  const thumbnail = log.result_url
                    ? `${process.env.NEXT_PUBLIC_STORAGE_URL || ''}/${log.result_url}`
                    : null

                  return (
                    <Button
                      key={log._id || log.id}
                      type="button"
                      onClick={() => {
                        setPrompt(logPromptText)
                        if (log.result_url && log.task_id) {
                          setResultItems([{ taskId: log.task_id, url: log.result_url }])
                          setCurrentTaskId(log.task_id)
                          setExpectedImageCount(1)
                        }
                        toast.success(t('prompt_loaded', { defaultValue: 'Prompt loaded from history!' }))
                      }}
                      className="w-full text-left p-2.5 rounded-border-radius bg-slate-50 dark:bg-white/3! hover:bg-slate-100 dark:hover:bg-white/3 border border-slate-200 dark:border-white/5 flex items-center justify-between gap-3 group transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate leading-tight  transition-colors">
                          {logPromptText}
                        </p>
                        <p className="text-sm text-subtitle-color mt-1">
                          {log.status === 'completed' ? '1 image' : log.status} • {dateStr}
                        </p>
                      </div>
                      <div className="w-9 h-9 rounded-lg bg-purple-900/10 border border-white/5 shrink-0 flex items-center justify-center text-slate-600 group-hover:border-purple-500/20 transition-all overflow-hidden relative">
                        {thumbnail ? (
                          <Image src={thumbnail} alt="Thumbnail" fill unoptimized className="object-cover" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-purple-500/30" />
                        )}
                      </div>
                    </Button>
                  )
                })}
                {recentLogs.length === 0 && (
                  <p className="text-xs text-slate-600 text-center py-4">No recent prompts found.</p>
                )}
              </div>

              <Button
                type="button"
                onClick={() => router.push(ROUTES.USAGE_LOGS)}
                className="w-full py-2 primary-btn border border-dashed border-glass-border hover:border-white/10 rounded-xl text-center text-white! text-xs font-semibold transition-colors block mt-2"
              >
                View All History
              </Button>
            </div>
          </Card>

          {/* Pro Tips Card */}
          <div className="bg-white dark:bg-white/3 border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400">
              <Lightbulb className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Pro Tips</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Use specific details about lighting, composition, and style for better results. Include descriptive
              keywords like &lsquo;golden hour&rsquo;, &lsquo;cinematic lighting&rsquo;, or &lsquo;cyberpunk digital art&rsquo;.
            </p>
            <Button
              type="button"
              onClick={() => {
                toast.info(t('learning_more', { defaultValue: 'Explore prompt guides in the Knowledge Base!' }))
              }}
              className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
            >
              Learn more <span className="text-[14px] leading-none">→</span>
            </Button>
          </div>
        </div>

        {/* Footer Bar for Reset & Generation Trigger (Mobile) */}
        <div className="flex lg:hidden flex-wrap gap-4 lg:col-span-12 items-center justify-between w-full">
          {actionFooter}
        </div>
      </div>

      <PromptLibraryModal
        isOpen={isPromptLibraryOpen}
        onClose={() => setIsPromptLibraryOpen(false)}
        onSelect={(p) => setPrompt(p)}
        mode="text_to_image"
      />
    </div>
  )
}
