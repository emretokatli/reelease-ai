'use client'

import { Button } from '@/components/ui/button'
import { platformsConfig } from '@/data/socialMedia'
import { PlatformFilterBarProps } from '@/types/socialMedia'
import { X } from 'lucide-react'

export function PlatformFilterBar({
  selectedPlatforms,
  togglePlatformFilter,
  selectedContentTypes,
  selectedStatus,
  search,
  clearAllFilters,
}: PlatformFilterBarProps) {
  const hasActiveFilters =
    selectedPlatforms.length > 0 || selectedContentTypes.length > 0 || selectedStatus !== 'all' || search

  return (
    <div className=" dark:bg-white/3 border border-glass-border rounded-border-radius p-4 glass-card flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold text-subtitle-color">Platforms:</span>
      <div className="flex flex-wrap gap-4">
        {platformsConfig.map((platform) => {
          const active = selectedPlatforms.includes(platform.id)
          const Icon = platform.icon
          return (
            <Button
              key={platform.id}
              onClick={() => togglePlatformFilter(platform.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-border-radius text-xs font-bold border transition-all duration-300 ${active
                ? 'bg-primary/10 dark:bg-white/10 border-primary text-primary! scale-105'
                : 'bg-black/5 dark:bg-white/3!  text-title-color! '
                }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${platform.bg}`}>
                <Icon className="w-2.5 h-2.5 text-white" />
              </div>
              <span>{platform.label}</span>
            </Button>
          )
        })}
      </div>
      {hasActiveFilters && (
        <Button
          onClick={clearAllFilters}
          className="text-sm h-10   ml-auto font-black rounded-full flex items-center gap-1  bg-destructive! text-white! border-0">
          < X className="w-3 h-3" /> Clear All filters
        </Button>
      )
      }
    </div >
  )
}
