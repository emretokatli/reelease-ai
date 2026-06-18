'use client'

import { connectorAngles, platformNodes } from '@/data/socialMedia'
import { cn } from '@/lib/utils'
import { ChannelPreviewPlaceholderProps } from '@/types/socialMedia'
import { Facebook, Instagram, Music2, Share2, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'





export function ChannelPreviewPlaceholder({ message }: ChannelPreviewPlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="relative mx-auto h-[236px] w-[260px]">
        {/* orbit ring */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[178px] -translate-x-1/2 -translate-y-1/2 rounded-full " />

        {/* dashed connectors */}
        <div className="absolute left-1/2 top-1/2 z-0 size-0">
          {connectorAngles.map((deg) => (
            <span
              key={deg}
              className="absolute left-0 top-0 block h-0 w-[92px] origin-left border-t border-dashed border-[#1e4976]/55"
              style={{ transform: `rotate(${deg}deg)` }}
              aria-hidden
            />
          ))}
        </div>

        {/* center glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 size-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.45)_0%,rgba(99,102,241,0.18)_45%,transparent_70%)]" />

        {/* center hub — Share2 kept as-is */}
        <div className="absolute left-1/2 top-1/2 z-20 flex size-[68px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 via-blue-500 to-violet-600 shadow-[0_0_40px_rgba(59,130,246,0.65),0_0_70px_rgba(99,102,241,0.35)] ring-1 ring-sky-300/40">
          <Share2 className="size-7 text-white" strokeWidth={2} />
        </div>

        {/* platform nodes */}
        {platformNodes.map(({ id, position, Icon, iconClassName }) => (
          <div
            key={id}
            className={cn(
              'absolute z-10 flex size-11 items-center justify-center rounded-full border border-white/[0.08] bg-black/3 dark:bg-white/3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
              position,
            )}
          >
            <Icon className={cn('text-title-color dark:text-white', iconClassName ?? 'size-[18px]')} strokeWidth={1.6} />
          </div>
        ))}
      </div>

      <p className="mt-1 max-w-[220px] text-sm leading-relaxed text-muted-foreground">{message}</p>
    </div>
  )
}
