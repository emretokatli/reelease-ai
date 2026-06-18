'use client'

import { AISwitch } from '@/components/feature/ai-common/AISwitch'
import { AspectRatioBox } from '@/components/feature/ai-common/AspectRatioBox'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { catalogueAspectRatios } from '@/data/ecommerceCatalogue'
import { cn } from '@/lib/utils'
import { CatalogueVideoSettingsProps } from '@/types/ecommerceCatalogue'
import { useTranslation } from 'react-i18next'

export function CatalogueVideoSettings({
  stepNumber = 4,
  title,
  description,
  duration,
  aspectRatio,
  sound,
  addWatermark,
  addBackgroundMusicToggle,
  customMusicUrl,
  onDurationChange,
  onAspectRatioChange,
  onSoundChange,
  onAddWatermarkChange,
  onAddBackgroundMusicToggleChange,
  onCustomMusicUrlChange,
}: CatalogueVideoSettingsProps) {
  const { t } = useTranslation()

  return (
    <div className="dark:bg-white/3 bg-white border border-glass-border rounded-border-radius p-4 sm:p-6 space-y-5">
      {/* Duration */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full primary-btn text-white font-bold text-base shrink-0">
            {stepNumber}
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-sm text-subtitle-color mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-title">{t('duration', { defaultValue: 'Duration' })}</h4>
          <span className="text-xs font-bold text-secondary">{duration}s</span>
        </div>
        <Slider
          value={[duration]}
          onValueChange={(v) => onDurationChange(v[0])}
          min={3}
          max={30}
          step={1}
          className="py-2"
        />
        <div className="flex justify-between text-[12px] text-slate-600 dark:text-white/80">
          <span>3s</span>
          <span>30s</span>
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-title">{t('aspect_ratio', { defaultValue: 'Aspect Ratio' })}</h4>
        <div className="flex flex-wrap gap-2">
          {catalogueAspectRatios.map((ar) => (
            <Button
              key={ar}
              type="button"
              onClick={() => onAspectRatioChange(ar)}
              className={cn(
                'group/btn h-12 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all',
                aspectRatio === ar
                  ? 'bg-primary/20! border-primary! text-primary! hover:bg-primary/5!'
                  : 'dark:bg-black/30! bg-black/5 border-glass-border! dark:bg-white/3! text-slate-500! hover:bg-white/5!',
              )}
            >
              <AspectRatioBox ratio={ar} />
              {ar}
              {ar === '16:9'}
            </Button>
          ))}
        </div>
      </div>

      {/* Sound Toggle */}
      <div className="pt-5 border-t border-glass-border">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-title">
                {t('enable_sound', { defaultValue: 'Enable Sound' })}
              </span>
            </div>
            <AISwitch checked={sound} onChange={onSoundChange} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-title">
              {t('add_watermark', { defaultValue: 'Add Watermark' })}
            </span>
            <AISwitch checked={addWatermark} onChange={onAddWatermarkChange} />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-title">
              {t('add_music', { defaultValue: 'Add Background Music' })}
            </span>
            <AISwitch checked={addBackgroundMusicToggle} onChange={onAddBackgroundMusicToggleChange} />
          </div>

          {addBackgroundMusicToggle && (
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-semibold text-title">{t('music_url', { defaultValue: 'Music URL' })}</h4>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-[10px] font-bold text-slate-400">URL</span>
                </div>
                <Input
                  type="url"
                  value={customMusicUrl}
                  onChange={(e) => onCustomMusicUrlChange(e.target.value)}
                  placeholder="Or paste a direct audio URL (.mp3, .wav)"
                  className="w-full h-10 pl-10 border   border-glass-border rounded-xl text-xs text-white outline-hidden placeholder:text-slate-400 focus:border-purple-500/50"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
