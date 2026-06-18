'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { TrendingUp, Heart, MessageCircle, Facebook, Instagram, Linkedin, ExternalLink } from 'lucide-react'
import { XIcon as Twitter } from '@/components/ui/XIcon'
import Image from 'next/image'
import { ROUTES } from '@/constants/routes'
import { getMediaUrl } from '@/utils'
import { TopEngagementPostsProps } from '@/types/socialMedia'
import { platformColors, platformIcons } from '@/data/socialMedia'





export const TopEngagementPosts = ({ posts }: TopEngagementPostsProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  const formatCount = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return String(num)
  }

  return (
    <Card className="p-px rounded-border-radius dark:bg-white/3! border-none glass-card overflow-hidden h-full">
      <div className="p-4 sm:p-5 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-full bg-pink-400/10">
            <TrendingUp className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-title-color dark:text-white">
              {t('top_engagement_posts', { defaultValue: 'Top Engagement Posts' })}
            </h3>
            <p className="text-base text-subtitle-color">
              {t('your_top_performing_posts', { defaultValue: 'Your top performing content' })}
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
            <TrendingUp className="w-10 h-10 text-muted-foreground mb-2" />
            <p className="text-subtitle-color font-semibold text-lg">
              {t('no_engagement_data', { defaultValue: 'No engagement data yet' })}
            </p>
            <p className="text-base text-muted-foreground mt-1">
              {t('publish_to_see_engagement', { defaultValue: 'Publish content to see engagement metrics' })}
            </p>
          </div>
        ) : (
          <>
            <div className="h-[320px] w-full flex flex-col">
              <div className="flex-1 space-y-2 sm:space-y-2.5 overflow-auto no-scrollbar">
                {posts.map((post: any, index: number) => {
                const IconComponent = platformIcons[post.platform] || TrendingUp
                const color = platformColors[post.platform] || 'var(--pink)'
                const accountUsername = post.account?.account_username || ''
                const likes = post.likeCount || 0
                const comments = post.commentCount || 0
                const platformLabel = post.platform ? post.platform.charAt(0).toUpperCase() + post.platform.slice(1) : ''

                return (
                  <div
                    key={post.id || post._id}
                    className="flex items-start gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-border-radius bg-black/2 dark:bg-white/2 border border-black/5 dark:border-white/5 hover:border-pink-400/30 transition-all duration-300 group relative"
                  >
                    {/* Rank + Platform Indicator Strip */}
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{
                          backgroundColor: `${color}25` || 'rgba(255,255,255,0.05)',
                          color: color || 'var(--muted-foreground)',
                        }}
                      >
                        {index + 1}
                      </div>
                    </div>

                    {/* Thumbnail */}
                    {post.media_urls?.[0] ? (
                      <Image
                        src={getMediaUrl(post.media_urls[0])}
                        alt=""
                        width={52}
                        height={52}
                        className="rounded-xl h-[52px] object-cover shrink-0 border border-black/5 dark:border-white/5"
                        unoptimized
                      />
                    ) : (
                      <div
                        className="w-[52px] h-[52px] rounded-xl flex items-center justify-center shrink-0 border border-white/5"
                        style={{ backgroundColor: `${color}12` }}
                      >
                        <IconComponent className="w-5 h-5" style={{ color }} />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-title-color dark:text-white line-clamp-1 leading-snug">
                        {post.caption || t('no_caption', { defaultValue: 'No caption' })}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <IconComponent className="w-4 h-4 shrink-0" style={{ color }} />
                        <span className="text-[13px] text-subtitle-color capitalize">{platformLabel}</span>
                        {accountUsername && (
                          <>
                            <span className="text-[10px] text-muted-foreground">·</span>
                            <span className="text-[13px] text-muted-foreground truncate">@{accountUsername}</span>
                          </>
                        )}
                      </div>

                      {/* Engagement stats inline */}
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
                          <Heart className="w-4 h-4 text-rose-400" />
                          <span className="font-medium text-subtitle-color">{formatCount(likes)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
                          <MessageCircle className="w-4 h-4 text-blue-400" />
                          <span className="font-medium text-subtitle-color">{formatCount(comments)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              </div>
              
              {/* View All Analytics Link */}
              <div className="mt-2.5 sm:mt-3 pt-2.5 sm:pt-3 border-t border-white/5 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(ROUTES.SOCIAL_MEDIA.ACTIVITY)}
                  className="w-full gap-2 hover:bg-[unset]! rounded-xl text-xs font-semibold text-pink-400 transition-colors"
                >
                  {t('view_all_analytics', { defaultValue: 'View All Analytics' })}
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
