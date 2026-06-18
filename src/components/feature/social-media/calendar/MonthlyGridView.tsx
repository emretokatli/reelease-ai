'use client'

import { Button } from '@/components/ui/button'
import { platformsConfig, weekdayLabelsFull, weekdayLabelsShort } from '@/data/socialMedia'
import { cn } from '@/lib/utils'
import { MonthlyGridViewProps } from '@/types/socialMedia'
import { getUniquePlatformsFromPosts } from '@/utils/calendarHelpers'
import { getLocalDateString } from '@/utils/socialMedia'
import { Share2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'



export function MonthlyGridView({
  monthDays,
  selectedDate,
  setSelectedDate,
  setView,
  postsByDate,
  setSelectedPost,
}: MonthlyGridViewProps) {
  const { t } = useTranslation()

  return (
    <div className="glass-card rounded-2xl border border-glass-border overflow-hidden">
      <div className="grid grid-cols-7 border-b border-glass-border bg-black/3 dark:bg-white/3">
        {weekdayLabelsFull.map((w, i) => (
          <div
            key={w + i}
            className="py-3 text-center text-[10px] font-black uppercase text-muted-foreground tracking-widest"
          >
            <span className="hidden sm:inline">{w}</span>
            <span className="sm:hidden">{weekdayLabelsShort[i]}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 grid-rows-6">
        {monthDays.map((day, idx) => {
          const dayStr = getLocalDateString(day)
          const posts = postsByDate[dayStr] || []
          const platforms = getUniquePlatformsFromPosts(posts)
          const isCurrentMonth = day.getMonth() === selectedDate.getMonth()
          const isToday = new Date().toDateString() === day.toDateString()

          return (
            <div
              key={idx}
              className={cn(
                'min-h-[80px] sm:min-h-[120px] border-b border-r border-glass-border p-1.5 sm:p-2.5 flex flex-col transition-all duration-300',
                isCurrentMonth ? 'bg-transparent' : 'bg-black/10 opacity-40',
                isToday && 'bg-primary/5 ring-1 ring-inset ring-primary/30',
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <span
                  className={cn(
                    'text-xs font-black w-7 h-7 flex items-center justify-center rounded-full',
                    isToday
                      ? 'bg-primary text-primary-foreground'
                      : isCurrentMonth
                        ? 'text-foreground'
                        : 'text-muted-foreground',
                  )}
                >
                  {day.getDate()}
                </span>
              </div>

              {posts.length > 0 && (
                <Button
                  onClick={() => {
                    if (posts.length === 1) {
                      setSelectedPost(posts[0])
                    } else {
                      setSelectedDate(day)
                      setView('week')
                    }
                  }}
                  variant="ghost"
                  className="w-full h-auto p-0 hover:bg-transparent justify-start"
                >
                  <div className="w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-glass-border hover:border-primary/30 transition-colors">
                    <span className="text-[10px] font-bold text-foreground whitespace-nowrap">
                      {posts.length === 1
                        ? t('post_count_one', { defaultValue: '1 post' })
                        : t('posts_count', {
                            count: posts.length,
                            defaultValue: '{{count}} posts',
                          })}
                    </span>
                    <div className="flex items-center -space-x-1">
                      {platforms.slice(0, 4).map((platformId) => {
                        const cfg = platformsConfig.find((p) => p.id === platformId)
                        const Icon = cfg?.icon || Share2
                        return (
                          <span
                            key={platformId}
                            className={cn(
                              'w-5 h-5 rounded-full flex items-center justify-center border-2 border-background shrink-0',
                              cfg?.bg || 'bg-muted',
                            )}
                          >
                            <Icon className="w-2.5 h-2.5 text-white" />
                          </span>
                        )
                      })}
                    </div>
                  </div>
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
