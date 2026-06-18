'use client'

import { BarChart3, ExternalLink, Facebook, Instagram, Linkedin, Loader2, MoreHorizontal, Pause, Play, RefreshCw, Trash2 } from 'lucide-react'
import { XIcon as Twitter } from '@/components/ui/XIcon'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu'
import { cn } from '@/lib/utils'
import { ChannelCardProps } from '@/types/components/features'
import { formatEngagementCount, getPlatformLabel } from '@/utils/channelHelpers'
import { getMediaUrl } from '@/utils'

const getPlatformConfig = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'facebook':
      return { icon: Facebook, bg: 'bg-[#1877F2]' }
    case 'instagram':
      return { icon: Instagram, bg: 'bg-gradient-to-tr from-[#FFB700] via-[#FF006B] to-[#AD00FF]' }
    case 'twitter':
      return { icon: Twitter, bg: 'bg-foreground' }
    case 'linkedin':
    case 'linkedin_page':
      return { icon: Linkedin, bg: 'bg-[#0A66C2]' }
    default:
      return { icon: MoreHorizontal, bg: 'bg-muted' }
  }
}

const CardActionBar = ({
  channelId,
  isPaused,
  onOpen,
  onAnalytics,
  onReconnect,
  onReauth,
  onPause,
  onDelete,
  isMetricsLoading,
  isPauseLoading,
  viewMode,
}: {
  channelId: string
  isPaused: boolean
  onOpen: (id: string) => void
  onAnalytics: (id: string) => void
  onReconnect: (id: string) => void
  onReauth: (id: string) => void
  onPause: (id: string) => void
  onDelete: (id: string) => void
  isMetricsLoading?: boolean
  isPauseLoading?: boolean
  viewMode: 'grid' | 'list'
}) => {
  const { t } = useTranslation()
  const iconBtnClass =
    'h-10 w-10 shrink-0 rounded-lg border border-glass-border bg-black/5 dark:bg-white/3 hover:bg-primary/10 hover:border-primary/30 hover:text-primary'

  return (
    <div
      className={`flex items-center justify-center gap-2   ${viewMode === 'grid' ? 'border-t border-glass-border pt-3 mt-auto' : ''}`}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => onOpen(channelId)}
        className={iconBtnClass}
        title={t('open_channel', { defaultValue: 'Open Channel' })}
      >
        <ExternalLink className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onReconnect(channelId)}
        disabled={isMetricsLoading}
        className={iconBtnClass}
        title={t('refresh_data', { defaultValue: 'Refresh Data' })}
      >
        {isMetricsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onAnalytics(channelId)}
        className={iconBtnClass}
        title={t('analytics', { defaultValue: 'Analytics' })}
      >
        <BarChart3 className="w-4 h-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className={iconBtnClass} title={t('more', { defaultValue: 'More' })}>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="glass-card border-glass-border rounded-border-radius">
          <DropdownMenuItem
            onClick={() => onReauth(channelId)}
            className="gap-2 font-medium text-xs"
          >
            <RefreshCw className="w-4 h-4" />
            {t('reconnect_profile', { defaultValue: 'Reconnect Profile' })}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onPause(channelId)}
            disabled={isPauseLoading}
            className="gap-2 font-medium text-xs"
          >
            {isPauseLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPaused ? (
              <Play className="w-4 h-4" />
            ) : (
              <Pause className="w-4 h-4" />
            )}
            {isPaused
              ? t('resume', { defaultValue: 'Resume Channel' })
              : t('pause', { defaultValue: 'Pause Channel' })}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(channelId)}
            className="gap-2 text-destructive focus:text-destructive font-medium text-xs"
          >
            <Trash2 className="w-4 h-4" />
            {t('delete', { defaultValue: 'Delete' })}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export const ChannelCard = ({
  channel,
  viewMode,
  onOpen,
  onAnalytics,
  onReconnect,
  onReauth,
  onPause,
  onDelete,
  metrics,
  isMetricsLoading,
  isPauseLoading,
}: ChannelCardProps) => {
  const { t } = useTranslation()
  const isActive = channel.status === 'ACTIVE'
  const config = getPlatformConfig(channel.platform)
  const PlatformIcon = config.icon

  const postsDisplay = String(metrics?.postsThisMonth ?? 0)
  const engagementDisplay = formatEngagementCount(metrics?.engagement ?? 0)

  if (viewMode === 'list') {
    return (
      <div className="glass-card rounded-border-radius bg-white/50 dark:bg-white/3 border border-glass-border p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary/30 transition-all duration-300">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="relative shrink-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-glass-border bg-black/5 dark:bg-white/5">
              {channel.profile_picture ? (
                <Image
                  src={getMediaUrl(channel.profile_picture) || channel.profile_picture}
                  alt={channel.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                  {channel.name.charAt(0)}
                </div>
              )}
            </div>
            <span
              className={cn(
                'absolute -bottom-1 -right-1 w-5 h-5 rounded-md flex items-center justify-center border border-background',
                config.bg,
              )}
            >
              <PlatformIcon className="w-3 h-3 text-white" />
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-sm text-foreground truncate">{channel.name}</h4>
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border',
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    : 'bg-orange-500/10 text-orange-500 border-orange-500/20',
                )}
              >
                {t(channel.status.toLowerCase(), { defaultValue: channel.status })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate">
              @{channel.username} · {getPlatformLabel(channel.platform)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 sm:gap-10 px-0 sm:px-2">
          <div className="text-center min-w-[72px]">
            <p className="text-[13px] font-bold text-subtitle-color">
              {t('posts_this_month', { defaultValue: 'Posts This Month' })}
            </p>
            <p className="text-lg font-black text-foreground tabular-nums">
              {isMetricsLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : postsDisplay}
            </p>
          </div>
          <div className="text-center min-w-[72px]">
            <p className="text-[13px] font-bold text-subtitle-color">
              {t('engagement', { defaultValue: 'Engagement' })}
            </p>
            <p className="text-lg font-black text-foreground tabular-nums">
              {isMetricsLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : engagementDisplay}
            </p>
          </div>
        </div>

        <CardActionBar
          viewMode={viewMode}
          channelId={channel.id}
          isPaused={channel.status === 'PAUSED'}
          onOpen={onOpen}
          onAnalytics={onAnalytics}
          onReconnect={onReconnect}
          onReauth={onReauth}
          onPause={onPause}
          onDelete={onDelete}
          isMetricsLoading={isMetricsLoading}
          isPauseLoading={isPauseLoading}
        />
      </div>
    )
  }

  return (
    <div className="glass-card rounded-border-radius border border-glass-border bg-white/50 dark:bg-white/3 p-4 flex flex-col min-h-[260px] hover:border-primary/30 hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl overflow-hidden border border-glass-border shrink-0">
          {channel.profile_picture ? (
            <Image
              src={getMediaUrl(channel.profile_picture) || channel.profile_picture}
              alt={channel.name}
              width={44}
              height={44}
              className="w-full h-full object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
              {channel.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm text-foreground truncate leading-tight">{channel.name}</h4>
          <span
            className={cn(
              'inline-flex mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border',
              isActive
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                : 'bg-orange-500/10 text-orange-500 border-orange-500/20',
            )}
          >
            {t(channel.status.toLowerCase(), { defaultValue: channel.status })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs mb-4 min-w-0">
        <span className={cn('w-8 h-8 rounded-md flex items-center justify-center shrink-0', config.bg)}>
          <PlatformIcon className="w-3.5 h-3.5 text-white" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-[14px] text-foreground truncate">
            {channel.username ? `@${channel.username}` : channel.name}
          </p>
          <p className="text-[12px] text-subtitle-color truncate">{getPlatformLabel(channel.platform)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-1">
        <div className="rounded-border-radius bg-black/3 dark:bg-white/3 border border-glass-border px-2 py-2.5 text-center">
          <p className="text-[11px] font-bold text-subtitle-color leading-tight mb-1">
            {t('posts_this_month', { defaultValue: 'Posts This Month' })}
          </p>
          <p className="text-lg font-black text-foreground tabular-nums leading-none">
            {isMetricsLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : postsDisplay}
          </p>
        </div>
        <div className="rounded-border-radius bg-black/3 dark:bg-white/3 border border-glass-border px-2 py-2.5 text-center">
          <p className="text-[11px] font-bold text-subtitle-color leading-tight mb-1">
            {t('engagement', { defaultValue: 'Engagement' })}
          </p>
          <p className="text-lg font-black text-foreground tabular-nums leading-none">
            {isMetricsLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : engagementDisplay}
          </p>
        </div>
      </div>

      <CardActionBar
        viewMode={viewMode}
        channelId={channel.id}
        isPaused={channel.status === 'PAUSED'}
        onOpen={onOpen}
        onAnalytics={onAnalytics}
        onReconnect={onReconnect}
        onReauth={onReauth}
        onPause={onPause}
        onDelete={onDelete}
        isMetricsLoading={isMetricsLoading}
        isPauseLoading={isPauseLoading}
      />
    </div>
  )
}
