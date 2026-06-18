'use client'

import { Lightbulb } from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { AIProTipsCardProps } from '@/types/components/features'



export function AIProTipsCard({ tips, learnMoreMessage }: AIProTipsCardProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-white dark:bg-white/3 border border-slate-200 dark:border-white/5 rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2 text-amber-400">
        <Lightbulb className="w-4 h-4" />
        <h4 className="text-base font-bold">Pro Tips</h4>
      </div>
      <p className="text-sm text-subtitle-color leading-relaxed font-medium">{tips}</p>
      {/* <Button
        type="button"
        onClick={() => {
          toast.info(
            learnMoreMessage || t('learning_more', { defaultValue: 'Explore prompt guides in the Knowledge Base!' }),
          )
        }}
        className="text-base bg-[unset]! font-bold! text-purple-400! hover:text-purple-300! p-0! transition-colors flex items-center gap-1"
      >
        Learn more <span className="text-base leading-none">→</span>
      </Button> */}
    </div>
  )
}
