import { CustomTooltip } from '@/components/reusable/CustomTooltip'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getAiFeaturesList } from '@/data/plan'
import { cn } from '@/lib/utils'
import { BookImage, CreditCard, FilePlay, Film, Image, Info, Layout, Sparkles, Star, Video } from 'lucide-react'

export const PlanCard = ({
  plan,
  price,
  billingCycleLabel,
  isPro,
  isActive,
  isDisabled,
  onSubscribe,
  t,
  buttonText,
  isLanding = false,
}: any) => {
  const translate = t || ((key: string, options?: any) => options?.defaultValue || key)
  const aiFeaturesList = getAiFeaturesList(translate)

  const currencySymbol = plan.currency === 'INR' ? '₹' : plan.currency === 'EUR' ? '€' : plan.currency === 'GBP' ? '£' : '$'

  return (
    <div className="group relative h-full flex flex-col bg-white/3 border dark:border-white/10 border-black/10  rounded-[32px] overflow-hidden transition-all duration-500 ">

      {/* Recommended Ribbon */}
      {(plan.is_featured || plan.is_default) && (
        <div className="absolute top-6 right-[-35px] rtl:right-auto rtl:left-[-35px]  rtl:-rotate-45 rotate-45 bg-primary px-10 py-1 shadow-lg z-20">
          <span className="text-[10px] font-bold text-black uppercase tracking-widest flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-black" />
            {plan.is_default ? translate('most_popular') : translate('popular')}
          </span>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 sm:p-6 p-4 flex flex-col h-full ">
        {/* Header */}
        <div className="flex items-start gap-3 mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-radius flex items-center justify-center transition-all duration-300 ",
                isActive ? "bg-primary/20 text-primary" : "dark:bg-white/5 dark:text-white/70 bg-black/5 text-black/70"
              )}>
                <Layout className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-title-color dark:text-white leading-none mb-2 transition-colors duration-300">
                  {plan.name}
                </h3>
                <div className="flex items-center gap-2 pt-1">
                  {plan.plan_type !== 'subscription' && (
                    <p className="text-xs font-bold text-subtitle-color uppercase tracking-wider">
                      {plan.plan_type === 'top_up'
                        ? translate('top_up', { defaultValue: 'Top-up' })
                        : translate(plan.plan_type, { defaultValue: plan.plan_type })}
                    </p>
                  )}
                  {isActive && (
                    <Badge className="rounded-full px-2 py-0.5 font-bold text-xs border-none shadow-sm flex items-center gap-1 bg-green-500/10 text-green-500">
                      <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                      {translate('active')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Display */}
        <div className="sm:mb-8 mb-4 relative py-6 px-4 rounded-[24px] dark:bg-gradient-to-br from-white/[0.05] to-transparent border border-glass-border dark:border-white/5 transition-all duration-500 overflow-hidden group-hover:border-primary/40">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="relative flex flex-col items-center">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-subtitle-color">{currencySymbol}</span>
              <span className="text-4xl font-black text-title-color dark:text-white tracking-tighter">
                {price}
              </span>
              <span className="text-sm font-semibold text-subtitle-color">/{billingCycleLabel}</span>
            </div>
            {plan.trial_period_days > 0 && plan.plan_type === 'subscription' && (
              <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                <Info className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-primary">
                  {plan.trial_period_days} {translate('days_free_trial')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Feature Sections Wrapper */}
        <div className="space-y-8 mb-8 grow">
          {/* Usage Limits / Features */}
          <div className="space-y-4">
            <h4 className="text-base font-black  dark:text-white/80 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              {translate('usage_limits')}
            </h4>
            <div className="space-y-3">

              <div className=" flex items-center justify-between p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-glass-border dark:border-white/5 transition-all duration-300 ">
                <span className="text-sm text-subtitle-color font-medium group-hover:text-title-color dark:group-hover:text-white/90 transition-colors">{translate('monthly_credits')}</span>
                <span className="text-sm font-bold text-title-color dark:text-white">{plan.total_credits}</span>
              </div>

              {Object.entries(plan.features || {}).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5 transition-all duration-300 group-hover:border-primary/10 hover:border-primary/40 hover:-translate-y-1 hover:shadow-md hover:bg-primary/5 cursor-default">
                  <span className="text-sm text-subtitle-color font-medium capitalize group-hover:text-title-color dark:group-hover:text-white/90 transition-colors">{String(key).replace(/_/g, ' ')}</span>
                  <span className="text-sm font-bold text-title-color dark:text-white">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Capabilities Grid */}
          {plan.ai_features && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold dark:text-white/60 text-black/60 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {translate('ai_capabilities')}
              </h4>
              <div className="grid grid-cols-5 gap-3">
                {aiFeaturesList.map((feature) => {
                  const isEnabled = plan.ai_features?.[feature.key as keyof typeof plan.ai_features];
                  return (
                    <CustomTooltip key={feature.key} title={feature.label}>
                      <div
                        className={cn(
                          'flex items-center justify-center aspect-square rounded-full border transition-all duration-300',
                          isEnabled
                            ? 'bg-primary/10 border-primary/30 group-hover:border-primary/50  cursor-pointer '
                            : 'bg-white/5 border-transparent opacity-40 grayscale scale-95',
                        )}
                      >
                        <feature.icon className={cn('w-5 h-5', isEnabled ? feature.color : 'text-gray-400')} />
                      </div>
                    </CustomTooltip>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-5 border-t border-glass-border ">
          <Button
            onClick={onSubscribe}
            disabled={isDisabled || isActive}
            className={cn(
              'w-full h-12 rounded-radius font-medium text-sm transition-all duration-300 active:scale-95',
              isActive
                ? 'primary-btn text-white!  cursor-not-allowed'
                : 'dark:bg-white/5! text-black dark:text-white hover:bg-primary/90 border border-glass-border '
            )}
          >
            {buttonText
              ? buttonText
              : isActive
                ? translate('subscribed')
                : plan.trial_period_days > 0 && plan.plan_type === 'subscription'
                  ? translate('start_free_trial', { defaultValue: `Start ${plan.trial_period_days}-day free trial` })
                  : translate('subscribe_now')}
          </Button>
        </div>
      </div>
    </div>
  )
}
