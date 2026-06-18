'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { QuickActionsCardProps } from '@/types/socialMedia'
import { Download, Plus, RefreshCw, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'



const QuickActionsCard = ({
  onConnectNew,
  onReconnectAll,
  onExport,
  onChannelGroups,
  isReconnectingAll = false,
  className,
}: QuickActionsCardProps) => {
  const { t } = useTranslation()

  const items = [
    {
      key: 'connect',
      label: t('connect_new_account', { defaultValue: 'Connect New Account' }),
      description: t('connect_new_account_desc', {
        defaultValue: 'Link a new social profile to your workspace.',
      }),
      icon: Plus,
      onClick: onConnectNew,
    },
    {
      key: 'reconnect',
      label: t('reconnect_all', { defaultValue: 'Reconnect All' }),
      description: t('reconnect_all_desc', {
        defaultValue: 'Refresh tokens and sync metrics for every channel.',
      }),
      icon: RefreshCw,
      onClick: onReconnectAll,
      loading: isReconnectingAll,
    },
    {
      key: 'export',
      label: t('export_channels', { defaultValue: 'Export Channels' }),
      description: t('export_channels_desc', {
        defaultValue: 'Download your channel list and stats as JSON.',
      }),
      icon: Download,
      onClick: onExport,
    },
  ]

  return (
    <div className={cn('glass-card rounded-border-radius bg-white dark:bg-white/3 border border-glass-border p-5 h-full flex flex-col', className)}>
      <h3 className="font-bold text-title-color text-base  dark:text-white mb-4">
        {t('quick_actions', { defaultValue: 'Quick Actions' })}
      </h3>
      <div className="space-y-2 flex-1">
        {items.map((item) => (
          <Button
            key={item.key}
            variant="ghost"
            onClick={item.onClick}
            disabled={item.loading}
            className="w-full justify-start items-start h-auto min-h-10 py-2.5 px-0 rounded-xl text-left hover:bg-unset hover:text-primary gap-3"
          >
            <div className='w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-primary/20'>
              <item.icon className={cn('w-4 h-4 shrink-0', item.loading && 'animate-spin')} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground leading-tight">{item.label}</p>
              <p className="text-[12px] text-subtitle-color font-normal mt-0.5 break-all whitespace-normal leading-snug">{item.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}

export default QuickActionsCard
