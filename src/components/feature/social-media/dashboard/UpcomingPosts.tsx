'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { CalendarClock, Clock, Facebook, Instagram, Linkedin, Plus } from 'lucide-react'
import { XIcon as Twitter } from '@/components/ui/XIcon'
import { format } from 'date-fns'
import { ROUTES } from '@/constants/routes'
import Image from 'next/image'
import { getMediaUrl } from '@/utils'
import { UpcomingPostsProps } from '@/types/socialMedia'
import { platformColors, platformIcons } from '@/data/socialMedia'





export const UpcomingPosts = ({ posts }: UpcomingPostsProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <Card className="p-px rounded-border-radius dark:bg-white/3! border-none glass-card overflow-hidden h-full">
      <div className="p-4 sm:p-5 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-full bg-amber-400/10">
            <CalendarClock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-title-color dark:text-white">
              {t('upcoming_posts', { defaultValue: 'Upcoming Posts' })}
            </h3>
            <p className="text-base text-subtitle-color">
              {t('scheduled_content', { defaultValue: 'Your scheduled content' })}
            </p>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
            <div className="p-4 rounded-full bg-amber-400/5 mb-3">
              <CalendarClock className="w-8 h-8 text-amber-400/50" />
            </div>
            <p className="text-lg font-semibold text-subtitle-color mb-1">
              {t('no_upcoming_posts', { defaultValue: 'No upcoming scheduled posts' })}
            </p>
            <p className="text-sm text-muted-foreground mb-4 max-w-[200px]">
              {t('schedule_first_post_desc', { defaultValue: 'Schedule your first post to start building your content calendar' })}
            </p>
            <Button
              onClick={() => router.push(ROUTES.SOCIAL_MEDIA.COMPOSER)}
              className="gap-2 primary-btn rounded-xl text-white! text-xs font-semibold h-9 px-4"
            >
              <Plus className="w-3.5 h-3.5" />
              {t('create_new_post', { defaultValue: 'Create New Post' })}
            </Button>
          </div>
        ) : (
          <div className="space-y-2.5 sm:space-y-3 overflow-auto h-[320px] w-full no-scrollbar">
            {posts.map((post: any) => {
              const IconComponent = platformIcons[post.platform] || CalendarClock
              const color = platformColors[post.platform] || 'var(--amber)'
              const accountName = post.account?.account_name || 'Unknown'

              return (
                <div key={post.id || post._id} className="flex items-start gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-border-radius bg-black/3 dark:bg-white/3 border border-black/5 dark:border-white/5 hover:border-amber-400/30 transition-all duration-300">
                  {post.media_urls?.[0] ? (
                    <Image src={getMediaUrl(post.media_urls[0])} alt="" width={48} height={48} className="rounded-lg h-[48px] object-cover shrink-0" unoptimized />
                  ) : (
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
                      <IconComponent className="w-5 h-5" style={{ color }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-title-color dark:text-white line-clamp-1">
                      {post.caption || t('no_caption', { defaultValue: 'No caption' })}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5">
                      <Badge className="text-[13px] capitalize px-1.5 py-0" style={{ backgroundColor: `${color}20`, color, borderColor: `${color}40` }} variant="outline">
                        <IconComponent className="w-3 h-3 mr-1" />{accountName}
                      </Badge>
                      {post.scheduled_at && (
                        <span className="text-[13px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />{format(new Date(post.scheduled_at), 'MMM dd, HH:mm')}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge className="text-[10px] bg-amber-400/10 text-amber-400 border-amber-400/20 shrink-0">{post.content_type || 'post'}</Badge>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Card>
  )
}
