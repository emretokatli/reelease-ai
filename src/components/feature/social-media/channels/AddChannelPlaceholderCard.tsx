'use client'

import { Button } from '@/components/ui/button'
import { AddChannelPlaceholderCardProps } from '@/types/socialMedia'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'



const AddChannelPlaceholderCard = ({ onClick, viewMode }: AddChannelPlaceholderCardProps) => {
  const { t } = useTranslation()

  if (viewMode === 'list') {
    return (
      <Button
        onClick={onClick}
        variant="ghost"
        className="w-full h-auto glass-card rounded-2xl bg-white/50 dark:bg-white/3 border border-dashed border-glass-border p-6 flex items-center justify-center gap-4 hover:border-primary/40 hover:bg-primary/5 transition-all"
      >
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center">
          <Plus className="w-6 h-6 text-primary" />
        </div>
        <div className="text-left">
          <p className="font-bold text-sm text-title-color dark:text-white">
            {t('add_new_channel', { defaultValue: 'Add New Channel' })}
          </p>
          <p className="text-xs text-subtitle-color break-all whitespace-normal">
            {t('connect_more_accounts', { defaultValue: 'Connect more accounts to get started.' })}
          </p>
        </div>
      </Button>
    )
  }

  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className="w-full h-full min-h-[280px] glass-card rounded-2xl bg-white/50 dark:bg-white/3 border border-dashed border-glass-border p-8 flex flex-col items-center justify-center gap-4 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
    >
      <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center group-hover:scale-110 transition-transform">
        <Plus className="w-8 h-8 text-primary" />
      </div>
      <div className="text-center space-y-1">
        <p className="font-bold text-sm text-title-color dark:text-white">{t('add_new_channel', { defaultValue: 'Add New Channel' })}</p>
        <p className="text-xs text-subtitle-color max-w-[200px] break-all whitespace-normal">
          {t('connect_more_accounts', { defaultValue: 'Connect more accounts to get started.' })}
        </p>
      </div>
    </Button>
  )
}

export default AddChannelPlaceholderCard
