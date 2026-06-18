'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { WeeklyPlannerViewProps } from '@/types/socialMedia'
import { getPostHour } from '@/utils/calendarHelpers'
import { getLocalDateString } from '@/utils/socialMedia'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import WeeklyTimeSlotPost from './WeeklyTimeSlotPost'
import { hourSlots } from '@/data/socialMedia'



function formatHourLabel(hour: number): string {
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h = hour % 12 || 12
  return `${h} ${ampm}`
}

export function WeeklyPlannerView({
  weekDays,
  postsByDate,
  setSelectedPost,
}: WeeklyPlannerViewProps) {
  const { t } = useTranslation()
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinutes = now.getMinutes()

  const postsForDayAndSlot = (dayStr: string, hour: number | null) => {
    const posts = postsByDate[dayStr] || []
    return posts.filter((post) => {
      const postHour = getPostHour(post)
      if (hour === null) return postHour === null || postHour < 8 || postHour > 20
      return postHour === hour
    })
  }

  const isTodayInWeek = weekDays.some((d) => d.toDateString() === now.toDateString())

  return (
    <div className="rounded-2xl border border-glass-border bg-[var(--calendar-surface)] dark:bg-white/3 overflow-hidden shadow-xl">
      {/* Horizontal scroll wrapper */}
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[1100px]">
          {/* Day headers */}
          <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-[var(--calendar-grid-line)] bg-[var(--calendar-header-bg)] dark:bg-white/3 sticky top-0 z-20">
            <div className="p-3" />
            {weekDays.map((day, idx) => {
              const isToday = day.toDateString() === now.toDateString()
              const weekday = day.toLocaleDateString('default', { weekday: 'short' }).toUpperCase()
              const month = day.toLocaleDateString('default', { month: 'short' })

              return (
                <div
                  key={idx}
                  className={cn(
                    'px-2 py-4 text-center border-l border-[var(--calendar-grid-line)]',
                    isToday && 'bg-[var(--calendar-header-highlight)]',
                  )}
                >
                  {isToday ? (
                    <>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#3b82f6]">
                        {weekday}
                      </p>
                      <div className="mt-1.5 flex items-center justify-center gap-1.5">
                        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full bg-[#3b82f6] px-2 text-sm font-bold text-white">
                          {day.getDate()}
                        </span>
                        <span className="text-sm font-semibold text-[var(--calendar-heading)]">{month}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--calendar-label)]">
                        {weekday}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[var(--calendar-heading)]">
                        {day.getDate()} {month}
                      </p>
                    </>
                  )}
                </div>
              )
            })}
          </div>

          {/* All day row */}
          <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-[var(--calendar-grid-line)] min-h-[80px]">
            <div className="p-2 text-[10px] font-medium text-[var(--calendar-label)] flex items-start justify-end pr-2 pt-3">
              {t('all_day', { defaultValue: 'All Day' })}
            </div>
            {weekDays.map((day, idx) => {
              const dayStr = getLocalDateString(day)
              const slotPosts = postsForDayAndSlot(dayStr, null)
              const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate())
              const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
              const isPast = dayStart.getTime() < todayStart.getTime()

              return (
                <div key={idx} className="p-1.5 border-l border-[var(--calendar-grid-line)] space-y-1.5 min-h-18">
                  {slotPosts.map((post) => (
                    <WeeklyTimeSlotPost
                      key={post._id || post.id}
                      post={post}
                      onClick={() => setSelectedPost(post)}
                    />
                  ))}
                  {!isPast && slotPosts.length === 0 && (
                    <Button
                      asChild
                      variant="ghost"
                      className="w-8 h-8 p-0! hover:bg-[#3b82f6] hover:text-white text-[var(--calendar-empty-icon)] opacity-0 hover:opacity-100"
                    >
                      <Link href={`/social-media/composer?date=${dayStr}`}>
                        <Plus className="w-3 h-3" />
                      </Link>
                    </Button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Hour rows */}
          {hourSlots.map((hour) => {
            const isCurrentHourRow = isTodayInWeek && hour === currentHour

            return (
              <div
                key={hour}
                className={cn(
                  'grid grid-cols-[56px_repeat(7,1fr)] border-b border-[var(--calendar-grid-line)] min-h-[72px] relative',
                  isCurrentHourRow && 'bg-[var(--calendar-current-row)]',
                )}
              >
                {isCurrentHourRow && (
                  <div
                    className="pointer-events-none absolute left-0 right-0 z-30 flex items-center"
                    style={{ top: `${(currentMinutes / 60) * 100}%` }}
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#3b82f6]" />
                    <div className="h-px flex-1 border-t border-dashed border-[#3b82f6]" />
                  </div>
                )}

                <div className="p-2 text-[10px] font-medium text-[var(--calendar-label)] flex items-start justify-end pr-2 pt-2 relative z-10">
                  {formatHourLabel(hour)}
                </div>

                {weekDays.map((day, idx) => {
                  const dayStr = getLocalDateString(day)
                  const slotPosts = postsForDayAndSlot(dayStr, hour)
                  const dayStart = new Date(day)
                  dayStart.setHours(0, 0, 0, 0)
                  const todayStart = new Date(now)
                  todayStart.setHours(0, 0, 0, 0)
                  const isPast = dayStart.getTime() < todayStart.getTime()
                  const isTodayCell = day.toDateString() === now.toDateString()

                  return (
                    <div
                      key={idx}
                      className={cn(
                        'p-1.5 border-l border-[var(--calendar-grid-line)] space-y-1.5 max-h-[160px] overflow-auto custom-scrollbar relative z-10',
                        isTodayCell && hour === currentHour && 'bg-[var(--calendar-current-row)]',
                      )}
                    >
                      {slotPosts.map((post) => (
                        <WeeklyTimeSlotPost
                          key={post._id || post.id}
                          post={post}
                          onClick={() => setSelectedPost(post)}
                        />
                      ))}
                      {!isPast && slotPosts.length === 0 && hour === 12 && (
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full h-7 opacity-0 hover:opacity-60 transition-opacity"
                        >
                          <Link href={`/social-media/composer?date=${dayStr}`}>
                            <Plus className="w-3 h-3 mx-auto text-[var(--calendar-empty-icon)]" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
