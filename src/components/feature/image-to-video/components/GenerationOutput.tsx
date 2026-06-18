'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GenerationOutputProps } from '@/types/components/features'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants/routes'
import { Download, Film, Loader2, Save } from 'lucide-react'

export function GenerationOutput({
  isGenerating,
  resultVideo,
  isSaving,
  handleSaveToMedia,
  handleDownload,
  recentLogs = [],
  onSelectRecentLog,
}: GenerationOutputProps) {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <Card className="glass-card border-border dark:border-white/10 overflow-hidden rounded-border-radius backdrop-blur-xl h-full flex flex-col min-h-75 sm:min-h-125">
      <div className="sm:p-6 p-4 border-b border-border/30 dark:border-white/5 flex items-center justify-between">
        <div className="text-base font-bold flex items-center gap-2 text-foreground dark:text-white/90">
          <Film className="w-5 h-5 text-primary" />
          {t('generation_result', { defaultValue: 'Generation Result' })}
        </div>
        {resultVideo && (
          <div className="flex gap-2">
            <Button
              onClick={handleSaveToMedia}
              disabled={isSaving}
              size="sm"
              variant="ghost"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-radius text-foreground/40 dark:text-white/40 hover:text-primary hover:bg-primary/10 transition-colors"
            >
              {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            </Button>
            <Button
              onClick={handleDownload}
              size="sm"
              variant="ghost"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-radius text-foreground/40 dark:text-white/40 hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <Download className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
      <CardContent className="p-6 sm:p-8 flex-1 flex flex-col justify-center items-center relative">
        {isGenerating && !resultVideo ? (
          <div className="flex flex-col items-center gap-8 py-10 sm:py-20">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32">
              <div className="absolute inset-0 rounded-full border-4 border-primary/10" />
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <div className="absolute inset-0 m-auto flex items-center justify-center">
                <Film className="w-8 h-8 sm:w-10 sm:h-10 text-primary animate-pulse" />
              </div>
            </div>
            <div className="text-center space-y-2 px-4">
              <p className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 animate-pulse">
                {t('crafting_video', { defaultValue: 'Crafting your video masterpiece...' })}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground italic opacity-60">
                {t('this_may_take_a_moment', { defaultValue: 'This may take a minute or two' })}
              </p>
            </div>
          </div>
        ) : resultVideo ? (
          <div className="w-full h-full relative group animate-in fade-in zoom-in-95 duration-500 flex items-center justify-center">
            <div className="relative aspect-video w-full max-w-2xl rounded-[1.5rem] sm:rounded-[24px] overflow-hidden shadow-2xl border border-border dark:border-white/10 bg-foreground/5 dark:bg-black/20">
              <video
                src={`${process.env.NEXT_PUBLIC_STORAGE_URL || ''}${resultVideo}`}
                className="w-full h-full object-contain"
                controls
                autoPlay
              />
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 max-w-70 py-10">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-border/20 dark:border-white/5">
              <Film className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-lg sm:text-xl font-bold text-foreground dark:text-white/90">
                {t('ready_to_create', { defaultValue: 'Ready to Create?' })}
              </p>
              <p className="text-xs sm:text-sm text-foreground/50 dark:text-white/30 leading-relaxed font-medium px-4">
                {t('video_appear_here', {
                  defaultValue: 'Your generated video will appear here once the generation is complete.',
                })}
              </p>
            </div>
          </div>
        )}
      </CardContent>

      {/* Recent Prompts area inside Result Card */}
      <div className="p-4 border-t border-slate-200 dark:border-white/5 space-y-3">
        <h4 className="text-sm font-semibold text-title">{t('recent_prompts', { defaultValue: 'Recent Prompts' })}</h4>

        <div className="space-y-2">
          {recentLogs.slice(0, 3).map((log) => {
            const logPromptText =
              log.payload?.prompt || log.payload?.input?.prompt || log.payload?.text || 'AI Generated Video'
            const dateStr = log.created_at ? new Date(log.created_at).toLocaleDateString() : 'Recently'
            const thumbnail = log.result_url
              ? `${process.env.NEXT_PUBLIC_STORAGE_URL || ''}/${log.result_url}`
              : null

            return (
              <button
                key={log._id || log.id}
                type="button"
                onClick={() => onSelectRecentLog?.(log)}
                className="w-full text-left p-2.5 rounded-border-radius bg-slate-50 dark:bg-white/3! hover:bg-slate-100 dark:hover:bg-white/3 border border-slate-200 dark:border-white/5 flex items-center justify-between gap-3 group transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate leading-tight group-hover:text-primary transition-colors">
                    {logPromptText}
                  </p>
                  <p className="text-sm text-subtitle-color mt-1">
                    {log.status === 'completed' ? '1 video' : log.status} • {dateStr}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-purple-900/10 border border-white/5 shrink-0 flex items-center justify-center text-slate-600 group-hover:border-purple-500/20 transition-all overflow-hidden relative">
                  {thumbnail ? (
                    <video src={thumbnail} className="w-full h-full object-cover" muted playsInline />
                  ) : (
                    <Film className="w-4 h-4 text-purple-500/30" />
                  )}
                </div>
              </button>
            )
          })}
          {recentLogs.length === 0 && (
            <p className="text-xs text-slate-600 text-center py-4">{t('no_recent_prompts', { defaultValue: 'No recent prompts found.' })}</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => router.push(ROUTES.USAGE_LOGS)}
          disabled={recentLogs.length === 0}
          className="w-full py-2 primary-btn border border-dashed border-glass-border hover:border-white/10 rounded-xl text-center text-white! text-xs font-semibold transition-colors block mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
        >
          {t('view_all_history', { defaultValue: 'View All History' })}
        </button>
      </div>
    </Card>
  )
}
