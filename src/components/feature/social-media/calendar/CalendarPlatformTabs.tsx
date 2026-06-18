'use client'

import { Button } from '@/components/ui/button'
import { platformsConfig } from '@/data/socialMedia'
import { cn } from '@/lib/utils'
import { CalendarPlatformTabsProps } from '@/types/socialMedia'
import { CalendarPlatformId } from '@/utils/calendarHelpers'
import { LayoutGrid } from 'lucide-react'
import { useTranslation } from 'react-i18next'



const CalendarPlatformTabs = ({ activePlatform, onPlatformChange }: CalendarPlatformTabsProps) => {
  const { t } = useTranslation()

  const tabs: { id: CalendarPlatformId; label: string; icon?: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: t('all_platforms', { defaultValue: 'All Platforms' }), icon: LayoutGrid },
    ...platformsConfig.map((p) => ({ id: p.id as CalendarPlatformId, label: p.label, icon: p.icon })),
  ]

  return (
    <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
      <div className="flex items-center gap-2 p-1 rounded-2xl border border-glass-border bg-black/3 dark:bg-white/3 min-w-max sm:min-w-0 sm:flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activePlatform === tab.id
          const platformCfg = platformsConfig.find((p) => p.id === tab.id)

          return (
            <Button
              key={tab.id}
              onClick={() => onPlatformChange(tab.id)}
              variant="ghost"
              className={cn(
                'h-9 px-4 rounded-xl text-xs font-bold gap-2 transition-all duration-300 shrink-0',
                isActive
                  ? 'bg-primary/15 border border-primary/40 text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent',
              )}
            >
              {Icon && (
                <span
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
                    tab.id === 'all' ? 'bg-primary/40' : platformCfg?.bg,
                  )}
                >
                  <Icon className="w-3 h-3 text-white" />
                </span>
              )}
              {tab.label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarPlatformTabs
