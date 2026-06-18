'use client'

import type { ComponentType } from 'react'
import { CheckCircle2, Link2, PauseCircle, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ChannelStatsProps } from '@/types/components/features'
import { cn } from '@/lib/utils'
import { StatCardProps } from '@/types/socialMedia'



const StatCard = ({
  title,
  description,
  value,
  icon: Icon,
  iconClassName,
  iconGlowClassName,
}: StatCardProps) => (
  <div className="glass-card rounded-border-radius hover-gradient-border border border-glass-border p-5 hover:border-primary/20 transition-all duration-300 group flex flex-col bg-white/50 dark:bg-white/3 min-h-30">
    <div className="flex justify-between items-start flex-1">
      <div className="flex flex-col">
        <p className="text-[14px] font-medium text-title-color dark:text-white mb-1">{title}</p>
        <h3 className="text-3xl font-black text-foreground tabular-nums tracking-tight">{value}</h3>
      </div>
      <div
        className={cn(
          'w-11 h-11 rounded-full flex items-center justify-center shrink-0',
          iconGlowClassName,
        )}
      >
        <Icon className={cn('w-5 h-5', iconClassName)} />
      </div>
    </div>
    <p className="text-[12px] text-subtitle-color mt-3">{description}</p>
  </div>
)

export const ChannelStats = ({ total, active, paused, recent }: ChannelStatsProps) => {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        title={t('total_channels', { defaultValue: 'Total Channels' })}
        description={t('total_channels_desc', { defaultValue: 'All connected channels' })}
        value={total}
        icon={Link2}
        iconClassName="text-primary"
        iconGlowClassName="bg-primary/20 "
      />
      <StatCard
        title={t('active_channels', { defaultValue: 'Active Channels' })}
        description={t('active_channels_desc', { defaultValue: 'Ready to publish' })}
        value={active}
        icon={CheckCircle2}
        iconClassName="text-emerald-400"
        iconGlowClassName="bg-emerald-500/20 "
      />
      <StatCard
        title={t('paused_channels', { defaultValue: 'Paused Channels' })}
        description={t('paused_channels_desc', { defaultValue: 'Temporarily paused' })}
        value={paused}
        icon={PauseCircle}
        iconClassName="text-orange-400"
        iconGlowClassName="bg-orange-500/20 "
      />
      <StatCard
        title={t('recently_connected', { defaultValue: 'Recently Connected' })}
        description={t('recently_connected_desc', { defaultValue: 'In last 30 days' })}
        value={recent}
        icon={Sparkles}
        iconClassName="text-sky-400"
        iconGlowClassName="bg-sky-500/20 "
      />
    </div>
  )
}
