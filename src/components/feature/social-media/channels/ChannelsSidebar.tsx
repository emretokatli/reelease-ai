'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Channel, ChannelStatsPeriod } from '@/types/components/features'
import { formatEngagementCount } from '@/utils/channelHelpers'
import { getMediaUrl } from '@/utils'
import { BarChart3, Link2 } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { Facebook, Instagram, Linkedin } from 'lucide-react'
import { XIcon as Twitter } from '@/components/ui/XIcon'
import ChannelHealthCard from './ChannelHealthCard'
import QuickActionsCard from './QuickActionsCard'
import { ChannelsSidebarProps } from '@/types/socialMedia'
import { periodLabelKeys } from '@/data/socialMedia'



const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'facebook':
      return Facebook
    case 'instagram':
      return Instagram
    case 'twitter':
      return Twitter
    case 'linkedin':
    case 'linkedin_page':
      return Linkedin
    default:
      return Link2
  }
}



const ChannelsSidebar = ({
  topChannels,
  performancePeriod,
  onPerformancePeriodChange,
  total,
  active,
  paused,
  expired = 0,
  onConnectNew,
  onReconnectAll,
  onExport,
  onChannelGroups,
  onViewAnalytics,
  onViewHealthDetails,
  isReconnectingAll,
}: ChannelsSidebarProps) => {
  const { t } = useTranslation()

  return (
    <aside className="w-full 2xl:w-[300px] shrink-0 space-y-4">
      <QuickActionsCard
        onConnectNew={onConnectNew}
        onReconnectAll={onReconnectAll}
        onExport={onExport}
        onChannelGroups={onChannelGroups}
        isReconnectingAll={isReconnectingAll}
      />

      <div className="glass-card  rounded-border-radius bg-white dark:bg-white/3 border border-glass-border p-5 space-y-4">
        <div className="flex flex-col gap-y-3 items-start justify-between">
          <h3 className="text-sm font-bold text-foreground shrink-0">
            {t('top_performing_channels', { defaultValue: 'Top Performing Channels' })}
          </h3>
          <div className="flex items-center justify-between w-full">
            <Select
              value={performancePeriod}
              onValueChange={(v) => onPerformancePeriodChange(v as ChannelStatsPeriod)}
            >
              <SelectTrigger className="h-8 w-[125px] rounded-lg border-glass-border bg-black/5 dark:bg-white/3 text-xs font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">{t('today', { defaultValue: 'Today' })}</SelectItem>
                <SelectItem value="week">{t('this_week', { defaultValue: 'This Week' })}</SelectItem>
                <SelectItem value="month">{t('this_month', { defaultValue: 'This Month' })}</SelectItem>
                <SelectItem value="year">{t('this_year', { defaultValue: 'This Year' })}</SelectItem>
                <SelectItem value="all">{t('all_time', { defaultValue: 'All Time' })}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-subtitle-color -mt-2">
              {t(periodLabelKeys[performancePeriod], { defaultValue: performancePeriod })}
            </p>
          </div>
        </div>


        {topChannels.length === 0 ? (
          <p className="text-sm text-title-color text-center py-4">
            {t('no_channel_stats_yet', { defaultValue: 'No performance data for this period.' })}
          </p>
        ) : (
          <div className="space-y-3">
            {topChannels.map((channel, index) => {
              const PlatformIcon = getPlatformIcon(channel.platform)
              const handle = channel.username ? `@${channel.username}` : channel.name
              return (
                <div
                  key={channel.id}
                  className="flex items-center gap-3 p-2 rounded-xl transition-colors"
                >
                  <span className="text-xs font-black text-muted-foreground w-4">{index + 1}</span>
                  <div className="relative w-10 h-10 shrink-0">
                    <div className="w-full h-full rounded-full overflow-hidden border border-glass-border relative">
                      {channel.profile_picture ? (
                        <Image
                          src={getMediaUrl(channel.profile_picture) || channel.profile_picture}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-sm">
                          {channel.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-background border border-glass-border flex items-center justify-center z-10">
                      <PlatformIcon className="w-2.5 h-2.5 text-primary" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{channel.name}</p>
                    <p className="text-[13px] text-muted-foreground truncate">{handle}</p>
                  </div>
                  <span className="text-sm font-bold text-primary tabular-nums">
                    {formatEngagementCount(channel.engagement)}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        <Button
          variant="outline"
          onClick={onViewAnalytics}
          className="w-full h-10 rounded-xl primary-btn text-white border-glass-border font-bold text-xs gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          {t('view_all_analytics', { defaultValue: 'View All Analytics' })}
        </Button>
      </div>

      <ChannelHealthCard
        total={total}
        active={active}
        paused={paused}
        expired={expired}
        onViewDetails={onViewHealthDetails}
      />
    </aside>
  )
}

export default ChannelsSidebar
