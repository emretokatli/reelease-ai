'use client'

import { Card } from '@/components/ui/card'
import { statItems } from '@/data/socialMedia'
import { StatsCardsProps } from '@/types/socialMedia'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

function getTrendFor(key: string, stats: StatsCardsProps['stats']): { value: number; isUp: boolean; isNeutral: boolean } {
  switch (key) {
    case 'totalAccounts': return { value: stats.accountsTrend, isUp: stats.accountsTrend > 0, isNeutral: stats.accountsTrend === 0 }
    case 'totalPosts': return { value: stats.postsTrend, isUp: stats.postsTrend > 0, isNeutral: stats.postsTrend === 0 }
    case 'publishedToday': return { value: 0, isUp: false, isNeutral: true }
    case 'scheduledCount': return { value: 0, isUp: false, isNeutral: true }
    case 'engagement30d': return { value: stats.engagementTrend, isUp: stats.engagementTrend > 0, isNeutral: stats.engagementTrend === 0 }
    default: return { value: 0, isUp: false, isNeutral: true }
  }
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {statItems.map((item) => {
        const Icon = item.icon
        const rawValue = (stats as any)[item.key] ?? 0
        const value = item.format ? item.format(rawValue) : String(rawValue)
        const trend = getTrendFor(item.key, stats)

        return (
          <Card
            key={item.key}
            className="p-3 sm:p-5 glass-card gradient-border transition-all duration-500 group relative overflow-hidden flex flex-col gap-2 sm:gap-3 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.15)] hover:bg-white/80 dark:hover:bg-transparent "
          >
            <div className="flex items-start justify-between ">
              <div className='flex items-center gap-3'>
                <div className={`p-2.5 rounded-xl ${item.bg} transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <span className="text-base font-bold text-title">
                    {t(item.labelKey, { defaultValue: item.defaultLabel })}
                  </span>
                  <span className="text-lg sm:text-2xl font-bold text-title-color dark:text-white block">{value}</span>
                </div>
              </div>
              {!trend.isNeutral && (
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${trend.isUp ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {trend.isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {trend.isUp ? '+' : ''}{trend.value}{item.key === 'engagement30d' ? '%' : ''}
                </span>
              )}
              {trend.isNeutral && (
                <span className="flex items-center gap-0.5 text-xs font-semibold text-primary">
                  {/* <ArrowRight className="w-3 h-3" /> */}
                  0%
                </span>
              )}

            </div>

          </Card>
        )
      })}
    </div>
  )
}
