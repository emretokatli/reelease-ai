'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { useGetCaptionsQuery, useDeleteCaptionMutation } from '@/redux/api/captionApi'
import { toast } from 'sonner'
import { Loader2, Sparkles, Plus, Search, Filter, RotateCcw, LayoutGrid, List, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import Input from '@/components/ui/input'
import { CaptionModal } from './CaptionModal'
import { CaptionCard } from './CaptionCard'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Caption } from '@/types'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants/routes'
import { PageHeader } from '@/components/reusable/PageHeader'
import { useDebounce } from '@/hooks/useDebounce'

export default function SocialCaptions() {
  const { t } = useTranslation()
  const router = useRouter()

  // States
  const [search, setSearch] = useState('')
  const [source, setSource] = useState('all')
  const [status, setStatus] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingCaption, setEditingCaption] = useState<Caption | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Queries
  const debouncedSearch = useDebounce(search, 500)
  const { data, isLoading, isFetching } = useGetCaptionsQuery({
    search: debouncedSearch,
    source,
    status
  })

  const [deleteCaption, { isLoading: isDeleting }] = useDeleteCaptionMutation()

  const handleDeleteClick = (id: string) => {
    setDeletingId(id)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingId) return
    try {
      await deleteCaption(deletingId).unwrap()
      toast.success(t('caption_deleted_successfully'))
      setIsDeleteModalOpen(false)
      setDeletingId(null)
    } catch (error: any) {
      toast.error(error.data?.message || t('failed_to_delete_caption'))
    }
  }

  const handleEdit = (caption: Caption) => {
    setEditingCaption(caption)
    setIsModalOpen(true)
  }

  const resetFilters = () => {
    setSearch('')
    setSource('all')
    setStatus('all')
  }

  const captions = data?.captions || []

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <PageHeader
        icon={<Sparkles className="w-6 h-6 text-primary animate-pulse" />}
        title={t('captions_workspace')}
        subtitle={t('captions_workspace_desc', { defaultValue: 'Manage your captions' })}
        showBackButton={false}
        endContent={
          <div className="sm:justify-end  sm:items-end sm:w-auto w-full flex-wrap gap-3 flex">
            <Button
              onClick={() => router.push(ROUTES.SOCIAL_MEDIA.COMPOSER)}
              variant="ghost"
              className="rounded-border-radius w-full sm:w-fit px-6 border border-glass-border bg-black/3! dark:bg-white/3! font-bold  transition-all gap-2"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              {t('open_ai_studio', { defaultValue: 'Open AI Studio' })}
            </Button>
            <Button
              onClick={() => {
                setEditingCaption(null)
                setIsModalOpen(true)
              }}
              className="rounded-border-radius w-full sm:w-fit px-8 primary-btn text-white! font-bold  transition-all gap-2"
            >
              <Plus className="w-5 h-5" />
              {t('create_caption')}
            </Button>
          </div>
        }
      />

      {/* Stats / Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'total_saved', value: data?.total || 0, icon: LayoutGrid, color: 'text-primary' },
          {
            label: 'ai_generated',
            value: captions.filter((c: any) => c.source === 'ai').length,
            icon: Sparkles,
            color: 'text-secondary',
          },
          {
            label: 'manual_written',
            value: captions.filter((c: any) => c.source === 'manual').length,
            icon: List,
            color: 'text-blue-400',
          },
          {
            label: 'active_ready',
            value: captions.filter((c: any) => c.status === 'active').length,
            icon: Filter,
            color: 'text-green-400',
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="glass-card border-glass-border hover-gradient-border dark:bg-white/3! rounded-border-radius overflow-hidden group hover:border-primary/20 transition-all bg-white dark:bg-transparent"
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-black text-muted-foreground">{t(stat.label)}</p>
                <p className="text-3xl font-black">{stat.value}</p>
              </div>
              <div
                className={cn(
                  'p-3 rounded-2xl bg-muted/60 dark:bg-white/3 border border-glass-border group-hover:scale-110 transition-transform',
                  stat.color,
                )}
              >
                <stat.icon className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Bar */}

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 rtl:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-subtitle-color" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search_captions_placeholder', { defaultValue: 'Search by name, caption, or notes...' })}
            className="w-full ps-11 rtl:pl-4 rtl:pr-11 bg-white dark:bg-white/3 border-glass-border rounded-border-radius focus:ring-primary/20"
          />
        </div>

        <div className="flex items-center flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto">
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className=" bg-white dark:bg-white/3 border border-glass-border rounded-border-radius px-4 text-sm font-bold text-foreground focus:ring-primary/20 outline-none min-w-[140px]">
              <SelectValue placeholder={t('all_sources')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all_sources')}</SelectItem>
              <SelectItem value="manual">{t('manual')}</SelectItem>
              <SelectItem value="ai">{t('ai')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className=" bg-white dark:bg-white/3 border border-glass-border rounded-border-radius px-4 text-sm font-bold text-foreground focus:ring-primary/20 outline-none min-w-[140px]">
              <SelectValue placeholder={t('all_statuses')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all_statuses')}</SelectItem>
              <SelectItem value="active">{t('active')}</SelectItem>
              <SelectItem value="inactive">{t('inactive')}</SelectItem>
              <SelectItem value="draft">{t('draft')}</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={resetFilters}
            variant="ghost"
            className="h-9! w-12 p-0 rounded-xl bg-white dark:bg-white/3 border border-glass-border hover:bg-muted dark:hover:bg-white/10"
            title={t('reset_filters')}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>


      {/* Results Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-sm font-bold uppercase  text-primary animate-pulse">
            {t('loading_captions')}
          </p>
        </div>
      ) : captions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 px-6 glass-card rounded-border-radius border-dashed border-glass-border text-center bg-white/80 dark:bg-white/3">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-title-color  mb-2">{t('no_captions_found')}</h3>
          <p className="text-subtitle-color text-base mb-8">
            {t('no_captions_desc', {
              defaultValue: 'Try adjusting your filters or create your first reusable caption block.',
            })}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {captions.map((caption: any) => (
            <CaptionCard
              key={caption.id || (caption as any)._id}
              caption={caption}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CaptionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCaption(null)
        }}
        caption={editingCaption}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={t('confirm_delete_caption')}
        description={t('delete_confirmation_message')}
      />
    </div>
  )
}
