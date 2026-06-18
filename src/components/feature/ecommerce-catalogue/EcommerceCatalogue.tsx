'use client'

import PromptLibraryModal from '@/components/feature/ai-common/PromptLibraryModal'
import MediaPickerModal from '@/components/feature/media-library/MediaPickerModal'
import CharacterPickerModal from '@/components/feature/characters/CharacterPickerModal'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { PageHeader } from '@/components/reusable/PageHeader'
import { videoDetailEnhancements, videoSurprisePrompts } from '@/data/aiPromptPresets'
import { catalogueAspectDuration } from '@/data/ecommerceCatalogue'
import { useGetCharactersQuery } from '@/redux/api/characterApi'
import {
  useDeleteCatalogueVideoMutation,
  useGenerateCatalogueVideoMutation,
  useGetCatalogueVideosQuery,
} from '@/redux/api/ecommerceCatalogueApi'
import { useGenerateCaptionMutation } from '@/redux/api/socialPublishApi'
import { useAppSelector } from '@/redux/hooks'
import { socket } from '@/services/socketSetup'
import type { Character } from '@/types/character'
import { normalizeUploadPath } from '@/utils'
import { Plus, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import {
  CatalogueModelItem,
  CataloguePickerMode,
  CatalogueProductItem,
  CatalogueView,
} from '@/types/ecommerceCatalogue'
import { CatalogueCreateView } from './CatalogueCreateView'
import { CatalogueEmptyState } from './CatalogueEmptyState'
import { CatalogueVideoCard } from './CatalogueVideoCard'
import { CatalogueVideoPlayer } from './CatalogueVideoPlayer'

export default function EcommerceCatalogue() {
  const { t } = useTranslation()
  const user = useAppSelector((state) => state.auth.user)

  // View state
  const [view, setView] = useState<CatalogueView>('library')

  // Create-form state
  const [selectedModel, setSelectedModel] = useState<CatalogueModelItem | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<CatalogueProductItem | null>(null)
  const [promptText, setPromptText] = useState('')
  const [aspectRatio, setAspectRatio] = useState('9:16')
  const [duration, setDuration] = useState(catalogueAspectDuration)
  const [sound, setSound] = useState(false)
  const [addWatermark, setAddWatermark] = useState(false)
  const [addBackgroundMusicToggle, setAddBackgroundMusicToggle] = useState(false)
  const [customMusicUrl, setCustomMusicUrl] = useState('')
  const [isPromptLibraryOpen, setIsPromptLibraryOpen] = useState(false)

  // Modal/UI state
  const [pickerMode, setPickerMode] = useState<CataloguePickerMode>(null)
  const [playingVideoUrl, setPlayingVideoUrl] = useState<string | null>(null)
  const [playingTaskPrompt, setPlayingTaskPrompt] = useState<string | null>(null)
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  // API hooks
  const { data: catalogueData, refetch } = useGetCatalogueVideosQuery()
  const { data: charactersData, isLoading: isLoadingCharacters } = useGetCharactersQuery({
    page: 1,
    limit: 50,
    status: 'active',
  })
  const [generateVideo, { isLoading: isGenerating }] = useGenerateCatalogueVideoMutation()
  const [deleteVideo, { isLoading: isDeleting }] = useDeleteCatalogueVideoMutation()
  const [generateCaption, { isLoading: isEnhancingPrompt }] = useGenerateCaptionMutation()

  const catalogueTasks = catalogueData?.data || []
  const characters: Character[] = charactersData?.data?.characters || []

  // Socket listener for task completion
  useEffect(() => {
    if (!user) return
    const handleTaskUpdate = (payload: { taskId?: string; status?: string; message?: string }) => {
      if (payload.taskId && payload.taskId === currentTaskId) {
        refetch()
        if (payload.status === 'completed') {
          setCurrentTaskId(null)
          toast.success(
            t('showcase_ready_toast', { defaultValue: 'Your product video showcase is generated and ready to watch!' }),
          )
        } else if (payload.status === 'failed') {
          setCurrentTaskId(null)
          toast.error(
            payload.message ||
              t('showcase_failed_toast', { defaultValue: 'Failed to generate product showcase video' }),
          )
        }
      }
    }
    const eventName = `ai-task-${(user as { _id?: string; id?: string })._id || user.id}`
    socket.on(eventName, handleTaskUpdate)
    return () => {
      socket.off(eventName, handleTaskUpdate)
    }
  }, [user, currentTaskId, refetch, t])

  // Helpers
  const resetCreateForm = () => {
    setSelectedModel(null)
    setSelectedProduct(null)
    setPromptText('')
    setAspectRatio('9:16')
    setDuration(catalogueAspectDuration)
    setSound(false)
    setAddWatermark(false)
    setAddBackgroundMusicToggle(false)
    setCustomMusicUrl('')
  }

  const handleGoCreate = () => {
    resetCreateForm()
    setView('create')
  }

  // Media / Character picker callback
  const handleMediaSelected = (attachment: any) => {
    const raw = Array.isArray(attachment) ? attachment[0] : attachment
    if (!raw?.file_path && !raw?.image_url) return
    const asset = {
      id: raw._id || raw.id || '',
      name: raw.name || 'Selected Asset',
      image_url: raw.image_url || normalizeUploadPath(raw.file_path),
    }
    if (pickerMode === 'otherCharacter') {
      setSelectedModel({
        ...asset,
        description: t('library_character_desc', { defaultValue: 'Character selected from media library' }),
        isFromLibrary: true,
      })
    } else if (pickerMode === 'product') {
      setSelectedProduct(asset)
    }
    setPickerMode(null)
  }

  // Prompt helpers
  const handleImprovePrompt = async () => {
    if (!promptText.trim()) {
      toast.warning(t('enter_prompt_first', { defaultValue: 'Please enter a prompt first' }))
      return
    }
    try {
      const res = await generateCaption({
        platform: 'instagram',
        purpose: 'image_prompt',
        custom_prompt: `Refine this product showcase video prompt with motion and presentation details. One line under 220 chars: "${promptText}"`,
        num_captions: 1,
      }).unwrap()
      if (res.success && res.data?.captions?.length > 0) {
        setPromptText(res.data.captions[0])
        toast.success(t('prompt_enhanced', { defaultValue: 'Prompt enhanced!' }))
      } else throw new Error('Empty response')
    } catch {
      setPromptText((prev) => `${prev}, cinematic product demo, smooth camera motion, professional lighting`)
      toast.warning(
        t('ai_unavailable_local_enhance', { defaultValue: 'AI unavailable — added basic keywords locally.' }),
      )
    }
  }

  const handleAddDetails = () => {
    if (!promptText.trim()) { toast.warning(t('enter_prompt_first', { defaultValue: 'Please enter a prompt first' })); return }
    const detail = videoDetailEnhancements[Math.floor(Math.random() * videoDetailEnhancements.length)]
    setPromptText((prev) => (prev.includes(detail) ? prev : `${prev}, ${detail}`))
    toast.success(t('details_added', { defaultValue: 'Visual details added!' }))
  }

  const handleSurpriseMe = () => {
    setPromptText(videoSurprisePrompts[Math.floor(Math.random() * videoSurprisePrompts.length)])
    toast.success(t('surprise_prompt_applied', { defaultValue: 'Random prompt applied!' }))
  }

  // Generation
  const handleStartGeneration = async () => {
    if (!selectedModel) {
      toast.error(t('select_model_error', { defaultValue: 'Please select an influencer model.' }))
      return
    }
    if (!selectedProduct) {
      toast.error(t('select_product_error', { defaultValue: 'Please select a product image.' }))
      return
    }
    if (!promptText.trim()) {
      toast.error(t('enter_prompt_error', { defaultValue: 'Please provide a prompt for the scene.' }))
      return
    }

    try {
      const res = await generateVideo({
        character: {
          id: selectedModel.id,
          name: selectedModel.name,
          image_url: selectedModel.image_url,
          description: selectedModel.description || '',
        },
        product: { id: selectedProduct.id, name: selectedProduct.name, image_url: selectedProduct.image_url },
        prompt: promptText,
        aspectRatio,
        duration: `${duration}s`,
        sound,
        addWatermark,
        addBackgroundMusic: addBackgroundMusicToggle || !!customMusicUrl.trim(),
        backgroundMusicUrl: customMusicUrl.trim() || undefined,
      }).unwrap()

      if (res.success) {
        if (res.taskId) setCurrentTaskId(res.taskId)
        toast.success(
          t('generation_started_success', {
            defaultValue: 'Creative processing started! Your product showcase is being generated.',
          }),
        )
        setView('library')
        resetCreateForm()
        refetch()
      }
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          t('gen_failed_error', { defaultValue: 'Failed to initiate video generation' }),
      )
    }
  }

  // Delete
  const handleDeleteTask = async () => {
    if (!confirmDeleteId) return
    try {
      await deleteVideo(confirmDeleteId).unwrap()
      toast.success(t('item_deleted_success', { defaultValue: 'Showcase item removed successfully.' }))
      refetch()
    } catch (err: unknown) {
      toast.error(
        (err as { data?: { message?: string } })?.data?.message ||
          t('delete_failed', { defaultValue: 'Failed to delete' }),
      )
    } finally {
      setConfirmDeleteId(null)
    }
  }

  const handleHistorySelect = (log: any) => {
    const payload = log.payload
    if (payload) {
      if (payload.prompt) setPromptText(payload.prompt)
      if (payload.aspectRatio) setAspectRatio(payload.aspectRatio)
      if (payload.duration) setDuration(parseInt(payload.duration.replace('s', ''), 10) || catalogueAspectDuration)
      if (payload.sound !== undefined) setSound(payload.sound)
      if (payload.character) setSelectedModel(payload.character)
      if (payload.product) setSelectedProduct(payload.product)
      if (payload.addWatermark !== undefined) setAddWatermark(payload.addWatermark)
      if (payload.backgroundMusicUrl) {
        setCustomMusicUrl(payload.backgroundMusicUrl)
        setAddBackgroundMusicToggle(true)
      } else if (payload.addBackgroundMusic !== undefined) {
        setAddBackgroundMusicToggle(payload.addBackgroundMusic)
      }
    }
  }

  return (
    <div className="space-y-6 animate-in">
      {view === 'library' ? (
        <>
          <PageHeader
            title={t('ecommerce_catalogue', { defaultValue: 'Ecommerce Catalogue' })}
            subtitle={t('ecommerce_catalogue_subtitle', {
              defaultValue:
                'Bring your products to life with AI influencer showcase videos combining characters, products, and creative prompts.',
            })}
            showBackButton={false}
            icon={<ShoppingBag className="w-6 h-6 text-primary animate-pulse" />}
            primaryAction={{
              label: t('create_catalogue', { defaultValue: 'Create Catalogue' }),
              onClick: handleGoCreate,
              icon: <Plus className="w-4 h-4" />,
            }}
          />

          <div className="space-y-6">
            {catalogueTasks.length === 0 ? (
              <CatalogueEmptyState onCreateClick={handleGoCreate} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {catalogueTasks.map((task, index) => (
                  <CatalogueVideoCard
                    key={task._id || task.id || index}
                    task={task}
                    onPlay={(url, prompt) => {
                      setPlayingVideoUrl(url)
                      setPlayingTaskPrompt(prompt)
                    }}
                    onDelete={(id) => setConfirmDeleteId(id)}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <CatalogueCreateView
          selectedModel={selectedModel}
          selectedProduct={selectedProduct}
          promptText={promptText}
          aspectRatio={aspectRatio}
          duration={duration}
          isGenerating={isGenerating}
          isEnhancingPrompt={isEnhancingPrompt}
          isLoadingCharacters={isLoadingCharacters}
          characters={characters}
          catalogueTasks={catalogueTasks}
          onBack={() => setView('library')}
          onPickCharacterFromLibrary={() => setPickerMode('otherCharacter')}
          onPickProduct={() => setPickerMode('product')}
          onClearProduct={() => setSelectedProduct(null)}
          onPromptChange={setPromptText}
          onImprovePrompt={handleImprovePrompt}
          onAddDetails={handleAddDetails}
          onSurpriseMe={handleSurpriseMe}
          onOpenPromptLibrary={() => setIsPromptLibraryOpen(true)}
          onDurationChange={setDuration}
          onAspectRatioChange={setAspectRatio}
          sound={sound}
          onSoundChange={setSound}
          addWatermark={addWatermark}
          onAddWatermarkChange={setAddWatermark}
          addBackgroundMusicToggle={addBackgroundMusicToggle}
          onAddBackgroundMusicToggleChange={setAddBackgroundMusicToggle}
          customMusicUrl={customMusicUrl}
          onCustomMusicUrlChange={setCustomMusicUrl}
          onGenerate={handleStartGeneration}
          onSelectHistory={handleHistorySelect}
        />
      )}

      {/* Modals */}
      <DeleteConfirmationModal
        isOpen={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={handleDeleteTask}
        title={t('confirm_delete_title', { defaultValue: 'Delete Showcase Video?' })}
        description={t('confirm_delete_desc', { defaultValue: 'This action cannot be undone.' })}
        isLoading={isDeleting}
      />

      <MediaPickerModal
        isOpen={pickerMode === 'product'}
        onClose={() => setPickerMode(null)}
        onSelect={handleMediaSelected}
        type="image"
        multiSelect={false}
      />

      <CharacterPickerModal
        isOpen={pickerMode === 'otherCharacter'}
        onClose={() => setPickerMode(null)}
        onSelect={handleMediaSelected}
      />

      <PromptLibraryModal
        isOpen={isPromptLibraryOpen}
        onClose={() => setIsPromptLibraryOpen(false)}
        onSelect={(p) => setPromptText(p)}
        mode="text_to_video"
      />

      {playingVideoUrl && (
        <CatalogueVideoPlayer
          videoUrl={playingVideoUrl}
          prompt={playingTaskPrompt}
          onClose={() => {
            setPlayingVideoUrl(null)
            setPlayingTaskPrompt(null)
          }}
        />
      )}
    </div>
  )
}
