'use client'

import { NoDataFound } from '@/components/reusable/NoDataFound'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { Share2, Clock, Facebook, Instagram, ImagePlus, Linkedin, X } from 'lucide-react'
import { XIcon as Twitter } from '@/components/ui/XIcon'
import { useTranslation } from 'react-i18next'
import { getResolvedImageUrl } from '@/utils/image'
import Image from 'next/image'

export const RecentSocialActivity = ({ activities }: { activities: any[] }) => {
  const { t } = useTranslation()

  const getPlatformIcon = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'facebook':
        return <Facebook className="w-3.5 h-3.5" />
      case 'instagram':
        return <Instagram className="w-3.5 h-3.5" />
      case 'linkedin':
        return <Linkedin className="w-3.5 h-3.5" />
      case 'twitter':
        return <X className="w-3.5 h-3.5" />
      default:
        return <Share2 className="w-3.5 h-3.5" />
    }
  }

  return (
    <Card className="p-px rounded-border-radius border-none glass-card glass-dark-card shadow-none overflow-hidden group/activities w-full h-full transition-all duration-300 dark:bg-white/3">
      <div className="sm:p-6 p-4 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <ImagePlus className="text-primary w-5 h-5" />
            </div>
            <div>
              <div className="space-y-1">
                <h3 className="sm:text-xl text-lg font-extrabold text-title-color mb-0 tracking-tight flex items-center gap-2 dark:text-white">
                  {t('recent_social_activity', { defaultValue: 'Recent Social Activity' })}
                </h3>
              </div>
              <p className="text-base font-medium text-subtitle-color">
                {t('latest_published_posts', { defaultValue: 'Your recently published posts' })}
              </p>
            </div>
          </div>
          <Badge className="bg-white/20 text-subtitle-color text-center border-none rounded-full py-1 font-semibold text-sm">
            {activities.length}
          </Badge>
        </div>

        <div className="space-y-3 no-scrollbar h-[375px] overflow-auto pt-3">
          {activities && activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity._id || activity.id}
                className="flex flex-row items-start gap-3 p-3 sm:p-4 rounded-border-radius shadow-none! border border-glass-border hover:border-primary! hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:bg-primary/5 transition-all duration-300 group hover:border-primary/40"
              >
                {activity.media_urls?.[0] && (
                  <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                    <Image
                      src={getResolvedImageUrl(activity.media_urls[0])}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold line-clamp-2 transition-colors text-title-color dark:text-white group-hover:text-primary/90">
                        {activity.caption ||
                          activity.content ||
                          (activity.content_type
                            ? `${activity.platform} ${activity.content_type}`
                            : t('no_content', { defaultValue: 'No content' }))}
                      </p>
                      {activity.post_url && (
                        <a
                          href={activity.post_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary/60 hover:text-primary transition-colors mt-1 inline-flex items-center gap-1"
                        >
                          <Share2 className="w-3 h-3" />
                          {t('view_post', { defaultValue: 'View Post' })}
                        </a>
                      )}
                    </div>
                    <div className="flex flex-col items-end shrink-0 gap-1.5 mt-0.5">
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] uppercase font-bold py-1 flex items-center gap-1.5">
                        {getPlatformIcon(activity.platform)}
                        {activity.platform || t('social', { defaultValue: 'Social' })}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                        <Clock className="h-3 w-3" />
                        {activity.published_at
                          ? formatDistanceToNow(new Date(activity.published_at), { addSuffix: true })
                          : t('recently', { defaultValue: 'Recently' })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <NoDataFound icon={Share2} height="h-[375px]" />
          )}
        </div>
      </div>
    </Card>
  )
}
