'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Facebook, Instagram, Linkedin, Share2, Video, Clock, Eye, ExternalLink, Edit3, Trash2, Camera, ImageIcon, ImagePlay } from 'lucide-react'
import { XIcon as Twitter } from '@/components/ui/XIcon'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getMediaUrl, formatDateTime } from '@/utils'
import { SocialPostCardProps } from '@/types/socialMedia'

export function SocialPostCard({ post, t, getPostLink, onViewDetails, onDelete }: SocialPostCardProps) {
  const isDraft = post.status === 'draft'
  const isScheduled = !isDraft && (post.status === 'scheduled' || (post.status === 'pending' && post.scheduled_at))
  const postUrl = getPostLink(post)
  const isStory = post.content_type === 'story'

  // For stories, link to the profile page where stories are visible (same logic as SocialPostReviewModal)
  const profileUrl = post.platform === 'instagram'
    ? `https://instagram.com/${post.account?.account_username || post.account?.account_name}`
    : post.platform === 'facebook'
      ? `https://facebook.com/${post.account?.account_username || post.account?.account_name}`
      : post.platform === 'linkedin'
        ? `https://linkedin.com`
        : `https://twitter.com/${post.account?.account_username || post.account?.account_name}`

  const targetUrl = isStory ? profileUrl : postUrl

  let displayStatus = post.status
  if (isScheduled) displayStatus = 'scheduled'

  let badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline'
  if (displayStatus === 'published') badgeVariant = 'default'
  if (displayStatus === 'failed') badgeVariant = 'destructive'
  if (displayStatus === 'scheduled') badgeVariant = 'secondary'
  if (displayStatus === 'deleted') badgeVariant = 'destructive'
  if (isDraft) badgeVariant = 'outline'

  const accountInfo = post.account || (post.accountIds && post.accountIds[0])
  const platformName = post.platform || accountInfo?.platform || 'facebook'

  return (
    <div className="flex flex-col justify-between rounded-border-radius border border-glass-border bg-black/3 dark:bg-white/3 overflow-hidden hover:border-primary/30 transition-all duration-300 group glass-card relative">
      <div className="sm:p-5 p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {accountInfo?.profile_picture ? (
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/10">
                  <Image src={accountInfo.profile_picture} alt="" fill className="object-cover" unoptimized />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ImagePlay className="w-5 h-5 text-primary" />
                </div>
              )}
              <div
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-md ${platformName === 'facebook'
                  ? 'bg-[#1877F2]'
                  : platformName === 'linkedin'
                    ? 'bg-[#0A66C2]'
                    : platformName === 'twitter' || platformName === 'x'
                      ? 'bg-black border border-white/10'
                      : 'bg-gradient-to-tr from-[#FFB700] via-[#FF006B] to-[#AD00FF]'
                  }`}
              >
                {platformName === 'facebook' ? (
                  <Facebook className="w-2.5 h-2.5 text-white" />
                ) : platformName === 'linkedin' ? (
                  <Linkedin className="w-2.5 h-2.5 text-white" />
                ) : platformName === 'twitter' || platformName === 'x' ? (
                  <Twitter className="w-2.5 h-2.5 text-white" />
                ) : (
                  <Instagram className="w-2.5 h-2.5 text-white" />
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-title-color dark:text-white line-clamp-1">
                {accountInfo?.account_name || accountInfo?.account_username || 'Draft Post'}
              </span>
              <span className="text-sm text-subtitle-color font-black tracking-widest">
                {post.content_type || (post.contentTypes && post.contentTypes[0]) || 'Post'}
              </span>
            </div>
          </div>

          <Badge
            variant={badgeVariant}
            className={`capitalize rounded-md px-2 py-0.5 text-[10px] font-bold ${displayStatus === 'published' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''
              } ${displayStatus === 'deleted' ? 'bg-red-500/10 text-red-500 border-red-500/20' : ''} ${displayStatus === 'scheduled' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : ''
              } ${isDraft ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : ''}`}
          >
            {t(displayStatus || 'pending', { defaultValue: displayStatus || 'pending' })}
          </Badge>
        </div>

        {/* Media & Caption Preview */}
        <div className="relative aspect-video rounded-border-radius overflow-hidden border border-glass-border bg-black/3 dark:bg-white/3 flex items-center justify-center">
          {((post.media_urls && post.media_urls.length > 0) || (post.attachmentIds && post.attachmentIds.length > 0)) ? (
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="w-full activity-swiper"
              style={{ height: '100%', position: 'absolute', inset: 0 }}
            >
              {((post.media_urls || []).concat((post.attachmentIds || []).map((att: any) => att.file_path))).map((mediaUrl: string, idx: number) => {
                const isVid = mediaUrl.includes('.mp4')
                return (
                  <SwiperSlide key={idx} style={{ height: '100%', position: 'relative' }}>
                    {isVid ? (
                      <div className="relative w-full h-full group/video">
                        <video
                          src={getMediaUrl(mediaUrl)}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/video:scale-105"
                          muted
                          playsInline
                          onMouseEnter={(e) => e.currentTarget.play().catch(() => { })}
                          onMouseLeave={(e) => {
                            e.currentTarget.pause()
                            e.currentTarget.currentTime = 0
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none group-hover/video:opacity-0 transition-opacity duration-300">
                          <Video className="w-8 h-8 text-white/60" />
                        </div>
                      </div>
                    ) : (
                      <Image
                        src={getMediaUrl(mediaUrl) || ''}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-700"
                        unoptimized
                      />
                    )}
                  </SwiperSlide>
                )
              })}
            </Swiper>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5 p-4 text-center">
              <Share2 className="w-8 h-8 text-title-color/60 dark:text-white" />
              <span className="text-xs text-muted-foreground">
                {t('text_only_post', { defaultValue: 'Text only post' })}
              </span>
            </div>
          )}
        </div>

        <p className="text-sm text-subtitle-color line-clamp-2 leading-relaxed">
          {post.caption || t('no_caption', { defaultValue: 'No caption content' })}
        </p>

        {/* Keyword Scheduled Banner */}
        {isScheduled && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-yellow-500/5 border border-yellow-500/10 text-xs text-yellow-400 font-semibold">
            <Clock className="w-3.5 h-3.5 animate-pulse text-yellow-400" />
            <span>
              {t('scheduled_keyword', { defaultValue: 'Scheduled' })}: {formatDateTime(post.scheduled_at)}
            </span>
          </div>
        )}
      </div>

      {/* Actions footer */}
      <div className="flex items-center justify-between sm:px-5 px-4 py-4 bg-white/2 border-t border-glass-border rounded-b-2xl">
        <span className="text-[12px] text-subtitle-color font-semibold">
          {isDraft
            ? `${t('updated_at', { defaultValue: 'Updated' })}: ${formatDateTime(post.updated_at || post.created_at)}`
            : isScheduled
              ? `${t('scheduled_keyword', { defaultValue: 'Scheduled' })}: ${formatDateTime(post.scheduled_at)}`
              : formatDateTime(post.published_at || post.created_at)}
        </span>

        <div className="flex items-center gap-1.5">
          {/* View details - disabled/hidden for drafts since they're just edited */}
          {!isDraft && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-primary/10 hover:bg-primary hover:text-white text-primary rounded-lg"
              onClick={() => onViewDetails(post)}
              title={t('view_details', { defaultValue: 'View Details' })}
            >
              <Eye className="w-4 h-4" />
            </Button>
          )}

          {/* View Live Post on its platform */}
          {!isDraft && post.status === 'published' && targetUrl && (
            <a href={targetUrl} target="_blank" rel="noopener noreferrer">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary hover:text-primary-hover hover:bg-primary/10 rounded-lg"
                title={isStory
                  ? t('view_live_story', { defaultValue: 'View Live Story' })
                  : t('view_live_post', { defaultValue: 'View Live Post' })}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          )}

          {/* Edit Scheduled Post */}
          {isScheduled && post.status !== 'deleted' && (
            <Link href={`/social-media/composer?postId=${post.id || post._id}`}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-edit-color/10 hover:text-white text-text-edit hover:bg-edit-color"
                title={t('edit_scheduled_post', { defaultValue: 'Edit Scheduled Post' })}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </Link>
          )}

          {/* Edit Draft Post */}
          {isDraft && (
            <Link href={`/social-media/composer?draftId=${post.id || post._id}`}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded-lg"
                title={t('edit_draft', { defaultValue: 'Edit Draft' })}
              >
                <Edit3 className="w-4 h-4" />
              </Button>
            </Link>
          )}

          {/* Delete History or Draft */}
          {post.status !== 'deleted' && (
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive! h-8 w-8 bg-destructive/10 hover:bg-destructive hover:text-white!"
              onClick={() => onDelete(post.id || post._id)}
              title={t('delete', { defaultValue: 'Delete' })}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
