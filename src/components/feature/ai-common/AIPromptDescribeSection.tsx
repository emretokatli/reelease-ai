'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textArea'
import { AIPromptDescribeSectionProps } from '@/types/ecommerceCatalogue'
import { ChevronDown, Clock, Loader2, Plus, Sparkle, Wand2 } from 'lucide-react'

export function AIPromptDescribeSection({
  stepNumber = 1,
  title,
  description,
  placeholder,
  prompt,
  onPromptChange,
  maxLength = 1000,
  isEnhancingPrompt = false,
  onImprovePrompt,
  onAddDetails,
  onSurpriseMe,
  onOpenPromptLibrary,
  improveLabel = 'Improve Prompt',
  addDetailsLabel = 'Add Details',
  surpriseLabel = 'Surprise Me',
  promptLibraryLabel = 'Prompt Library',
}: AIPromptDescribeSectionProps) {
  return (
    <div className="bg-white dark:bg-white/3 border border-glass-border dark:border-glass-border rounded-border-radius p-4 sm:p-6 space-y-4">
      <div className="flex items-start gap-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-full primary-btn text-white font-bold text- mt-0.5 shrink-0">
          {stepNumber}
        </span>
        <div>
          <h3 className="text-base font-bold text-title-color">{title}</h3>
          <p className="text-sm text-subtitle-color mt-0.5">{description}</p>
        </div>
      </div>

      <div className="relative">
        <Textarea
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-32 sm:min-h-40 bg-black/3 dark:bg-white/3 border border-glass-border dark:border-glass-border focus:border-[#7c3aed]/40 rounded-border-radius p-4 text-sm sm:text-base leading-relaxed text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none outline-hidden"
        />
        <div className="absolute bottom-3 right-3 text-right">
          <span className="text-3xs font-semibold text-subtitle-color/70 bg-black/3 dark:bg-white/3 px-2 py-0.5 rounded-md">
            {prompt.length} / {maxLength}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={onImprovePrompt}
            disabled={isEnhancingPrompt}
            variant="outline"
            className="h-8 px-3 rounded-lg bg-black/3 dark:bg-white/3 border border-glass-border dark:border-glass-border hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 gap-1.5 font-bold text-"
          >
            {isEnhancingPrompt ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-secondary" />
            ) : (
              <Wand2 className="w-3.5 h-3.5 text-secondary" />
            )}
            {improveLabel}
          </Button>
          <Button
            type="button"
            onClick={onAddDetails}
            variant="outline"
            className="h-8 px-3 rounded-lg bg-black/3 dark:bg-white/3 border border-glass-border dark:border-white/5  gap-1.5 font-bold text-"
          >
            <Plus className="w-3.5 h-3.5 text-primary" />
            {addDetailsLabel}
          </Button>
          <Button
            type="button"
            onClick={onSurpriseMe}
            variant="outline"
            className="h-8 px-3 rounded-lg bg-black/3 dark:bg-white/3 border border-glass-border dark:border-white/5  gap-1.5 font-bold text-"
          >
            <Sparkle className="w-3.5 h-3.5 text-pink-400" />
            {surpriseLabel}
          </Button>
        </div>

        <Button
          type="button"
          onClick={onOpenPromptLibrary}
          variant="ghost"
          className="h-8 px-3 rounded-lg bg-black/3 dark:bg-white/3 border border-glass-border dark:border-white/5  gap-1.5 font-bold text-"
        >
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          {promptLibraryLabel}
          <ChevronDown className="w-3 h-3 opacity-60" />
        </Button>
      </div>
    </div>
  )
}
