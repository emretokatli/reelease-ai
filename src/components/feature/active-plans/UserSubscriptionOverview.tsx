'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { UserSubscriptionOverviewProps } from '@/types'
import { formatDate } from '@/utils'
import { ROUTES } from '@/constants/routes'
import { useGetProfileQuery } from '@/redux/api/authApi'
import { aiFeatureKeys, featureStyles, iconMap} from '@/data/plan'
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Check, 
  X, 
  Calendar, 
  CalendarDays,
  ShieldCheck, 
  Gem, 
  Info, 
  Layout, 
  ChevronRight,
  Coins,
  Ban,
  AlertCircle,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const UserSubscriptionOverview = ({
  sub,
  amountPaid,
  daysRemaining,
  isCancelDialogOpen,
  setIsCancelDialogOpen,
  handleCancel,
  isCancelling,
  t,
}: UserSubscriptionOverviewProps) => {
  const { data: profileData } = useGetProfileQuery()

  if (!sub) return null

  // Safely extract the plan object if it's populated
  const plan = typeof sub.plan_id === 'object' ? sub.plan_id : null
  const user = profileData?.user || {}

  // Prioritize user's actual credits, fallback to plan only if user data not loaded
  const totalCredits = user.total_credits !== undefined ? user.total_credits : (plan?.total_credits || 0)
  const captionCredits = user.caption_credits !== undefined ? user.caption_credits : (plan?.caption_credits || 0)
  const usedCredits = user.used_credits || 0
  const remainingCredits = Math.max(0, totalCredits - usedCredits)
  const usagePercentage = totalCredits > 0 ? Math.min(100, (usedCredits / totalCredits) * 100) : 0

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top Banner alert for pending cancellations */}
      {sub.cancel_at_period_end && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">
            {t('cancel_at_period_end_desc', {
              date: formatDate(sub.current_period_end),
            })}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Plan Card */}
        <div className="lg:col-span-1 glass-card sm:p-6 p-4 rounded-border-radius border border-glass-border flex flex-col justify-between relative overflow-hidden bg-linear-to-br from-primary/5 via-transparent to-transparent dark:bg-white/3">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-xs font-black text-primary px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                  {t('active_plan', { defaultValue: 'Active Plan' })}
                </span>
                <h2 className="text-3xl font-black text-title-color dark:text-white pt-2 leading-none">
                  {plan?.name || t('standard_plan')}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Layout className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-subtitle-color">$</span>
                <span className="text-4xl font-black text-title-color dark:text-white tracking-tighter">
                  {amountPaid || plan?.amount || 0}
                </span>
                <span className="text-xs font-bold text-subtitle-color">/{t(plan?.plan_type || 'month')}</span>
              </div>

              <p className="text-sm text-subtitle-color font-medium">
                {plan?.description ||
                  t('active_plan_standard_desc', {
                    defaultValue: 'Access premium features, AI generation suites, and robust content creation tools.',
                  })}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 space-y-4 relative z-10">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-subtitle-color flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary/70" />
                  {t('subscription_date', { defaultValue: 'Subscription Date' })}
                </span>
                <span className="text-title-color dark:text-white">{formatDate(sub.current_period_start)}</span>
              </div>

              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-subtitle-color flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-primary/70" />
                  {t('expiry_date', { defaultValue: 'Expiry Date' })}
                </span>
                <span className="text-title-color dark:text-white">{formatDate(sub.current_period_end)}</span>
              </div>

              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-subtitle-color flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary/70" />
                  {plan?.plan_type === 'prepaid' || plan?.plan_type === 'lifetime'
                    ? t('validity_days')
                    : t('days_remaining')}
                </span>
                <span className="text-title-color dark:text-white">
                  {plan?.plan_type === 'prepaid' || plan?.plan_type === 'lifetime'
                    ? t('days_count', { count: plan?.validity_days || 0, defaultValue: '{{count}} days' })
                    : t('days_count', { count: daysRemaining, defaultValue: '{{count}} days' })}
                </span>
              </div>
            </div>

            {/* Cancel Button dialog trigger inside layout */}
            {!sub.cancel_at_period_end && (sub.status === 'active' || sub.status === 'incomplete') && (
              <div className="pt-2">
                <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="h-10 rounded-xl font-bold text-sm gap-2 px-5 flex ml-auto cursor-pointer"
                    >
                      <Ban className="w-4 h-4" />
                      {t('cancel_subscription')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                      <DialogTitle>{t('cancel_subscription')}</DialogTitle>
                      <DialogDescription>
                        {t('retain_access_until', {
                          date: formatDate(sub.current_period_end),
                        })}
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsCancelDialogOpen(false)}
                        className="rounded-[8px] bg-light-gray font-medium p-button-padding text-base sm:h-12 h-10"
                      >
                        {t('keep_subscription')}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        disabled={isCancelling}
                        className="rounded-[8px] font-medium bg-primary! text-white text-base sm:h-12 h-10"
                      >
                        {isCancelling ? `${t('cancelling')}...` : t('confirm_cancellation')}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>

        {/* Credit Usage Progress Card */}
        <div className="lg:col-span-1 glass-card sm:p-6 p-4 rounded-border-radius border border-glass-border flex flex-col justify-between dark:bg-white/3">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">
                  <Coins className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-title-color dark:text-white text-sm">
                  {t('credits_usage', { defaultValue: 'Credit Usage' })}
                </h3>
              </div>
              <div className="text-[10px] bg-secondary/10 text-secondary px-2.5 py-1 rounded-full font-bold border border-secondary/20">
                {usagePercentage.toFixed(0)}%
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-subtitle-color font-semibold">
                  {t('credits_consumed', { defaultValue: 'Consumed' })}
                </span>
                <span className="text-title-color dark:text-white font-black">
                  {usedCredits.toLocaleString()} / {totalCredits.toLocaleString()}
                </span>
              </div>
              <Progress value={usagePercentage} className="h-3 bg-secondary/10 [&>div]:bg-secondary" />
              <p className="text-sm text-subtitle-color flex items-center gap-1.5">
                <Info className="w-4 h-4 text-purple-400" />
                {t('credits_reset_desc', {
                  defaultValue: 'Credits reset automatically with your monthly billing cycle.',
                })}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
            <div>
              <p className="text-3xl font-black text-secondary tracking-tight leading-none mb-1">
                {remainingCredits.toLocaleString()}
              </p>
              <p className="text-sm text-subtitle-color font-bold">
                {t('credits_available', { defaultValue: 'Credits Available' })}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <Gem className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Plan Limits Card */}
        <div className="lg:col-span-1 glass-card sm:p-6 p-4 rounded-border-radius border border-glass-border flex flex-col justify-between dark:bg-white/3">
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-title-color dark:text-white text-sm">
                {t('plan_limits', { defaultValue: 'Plan Limits' })}
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/3 dark:bg-white/3 border border-glass-border">
                <span className="text-xs text-subtitle-color font-semibold">
                  {t('caption_credits', { defaultValue: 'Caption Credits' })}
                </span>
                <span className="text-xs font-bold text-title-color dark:text-white">{captionCredits}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/[0.02] border border-glass-border">
                <span className="text-xs text-subtitle-color font-semibold">
                  {t('channel_limit', { defaultValue: 'Channel Limit' })}
                </span>
                <span className="text-xs font-bold text-title-color dark:text-white">
                  {plan?.channel_limit
                    ? `${plan.channel_limit} Channels`
                    : t('unlimited', { defaultValue: 'Unlimited' })}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/5 dark:bg-white/[0.02] border border-glass-border">
                <span className="text-xs text-subtitle-color font-semibold">
                  {t('watermark_removal', { defaultValue: 'Watermark Removal' })}
                </span>
                <span className="text-xs font-bold text-title-color dark:text-white flex items-center gap-1.5">
                  {plan?.remove_watermark ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500" />
                      {t('enabled', { defaultValue: 'Enabled' })}
                    </>
                  ) : (
                    <>
                      <X className="w-3.5 h-3.5 text-red-500" />
                      {t('disabled', { defaultValue: 'Disabled' })}
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-subtitle-color border-t border-glass-border pt-4 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>{t('limits_renew_info', { defaultValue: 'Limits apply to each active billing cycle.' })}</span>
          </div>
        </div>
      </div>

      {/* Included AI Features Card */}
      {plan?.ai_features && (
        <div className="glass-card sm:p-6 p-4 rounded-border-radius border border-glass-border dark:bg-white/3">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-title-color dark:text-white text-sm">
              {t('included_ai_features', { defaultValue: 'Included AI Features' })}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {aiFeatureKeys.map((f) => {
              const isEnabled = plan.ai_features?.[f.key as keyof typeof plan.ai_features]
              const style = featureStyles[f.key]
              const iconPath = iconMap[f.key]

              return (
                <div
                  key={f.key}
                  className={cn(
                    'flex items-center gap-3.5 p-3 rounded-2xl border border-glass-border transition-all duration-300',
                    isEnabled
                      ? 'bg-primary/5 border-primary/20 opacity-100'
                      : 'bg-black/5 dark:bg-white/3 opacity-40 grayscale scale-95',
                  )}
                >
                  <div
                    className={cn(
                      'p-2.5 rounded-full relative overflow-hidden shrink-0',
                      !isEnabled && 'dark:bg-white/20! bg-black/20!',
                    )}
                    style={
                      isEnabled
                        ? {
                            background: style?.gradient || 'var(--primary)',
                            boxShadow: `0 0 10px ${style?.glow || 'rgba(var(--primary-rgb), 0.1)'}`,
                          }
                        : {}
                    }
                  >
                    <Image
                      width={20}
                      height={20}
                      unoptimized
                      className="w-5 h-5 object-contain relative z-10"
                      src={iconPath}
                      alt={f.key}
                    />
                    {isEnabled && (
                      <div
                        className="absolute inset-0 rounded-full blur-md opacity-40"
                        style={{ background: style?.gradient || 'var(--primary)' }}
                      />
                    )}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span
                      className={cn(
                        'text-sm font-bold truncate',
                        isEnabled ? 'text-title-color dark:text-white' : 'text-gray-500 dark:text-gray-400',
                      )}
                    >
                      {t(f.label)}
                    </span>
                    <span className="text-xs text-subtitle-color font-semibold">
                      {isEnabled
                        ? t('unlimited', { defaultValue: 'Unlimited' })
                        : t('locked', { defaultValue: 'Locked' })}
                    </span>
                  </div>
                  {isEnabled && (
                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Manage Subscription Action Cards */}
      {!sub.cancel_at_period_end && (sub.status === 'active' || sub.status === 'trial') && (
        <div className="space-y-6 pt-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-title-color dark:text-white">
              {t('subscription_actions', { defaultValue: 'Manage Subscription' })}
            </h3>
            <p className="text-sm text-subtitle-color">
              {t('subscription_actions_desc', {
                defaultValue:
                  'Select one of the actions below to upgrade, downgrade, or add top-up credits to your current plan.',
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Upgrade Card */}
            <Link href={`${ROUTES.PLANS}?mode=upgrade`} className="block">
              <div
                className={cn(
                  'group relative glass-card sm:p-6 p-4 dark:bg-white/3 rounded-border-radius border border-glass-border hover:border-primary/50 bg-white/2 cursor-pointer transition-all duration-300 hover:-translate-y-1 select-none flex flex-col justify-between min-h-50',
                )}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-black text-title-color dark:text-white group-hover:text-primary transition-colors">
                      {t('upgrade_plan', { defaultValue: 'Upgrade Plan' })}
                    </h4>
                  </div>
                  <p className="text-sm text-subtitle-color font-medium">
                    {t('upgrade_action_desc', {
                      defaultValue:
                        'Scale your operations. View and select higher tier plans with more credits and features.',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-primary pt-4">
                  {t('view_upgrade_options', { defaultValue: 'View Upgrade Options' })}
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Downgrade Card */}
            <Link href={`${ROUTES.PLANS}?mode=downgrade`} className="block">
              <div
                className={cn(
                  'group relative glass-card sm:p-6 p-4 rounded-border-radius dark:bg-white/3 border border-glass-border hover:border-red-500/50 bg-white/2 cursor-pointer transition-all duration-300 hover:-translate-y-1 select-none flex flex-col justify-between min-h-50',
                )}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                      <TrendingDown className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-black text-title-color dark:text-white group-hover:text-red-500 transition-colors">
                      {t('downgrade_plan', { defaultValue: 'Downgrade Plan' })}
                    </h4>
                  </div>
                  <p className="text-sm text-subtitle-color font-medium">
                    {t('downgrade_action_desc', {
                      defaultValue:
                        'Switch to a lighter tier. Your current plan details will remain active until the end of your billing cycle.',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-red-500 pt-4">
                  {t('view_downgrade_options', { defaultValue: 'View Downgrade Options' })}
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>

            {/* Top-up Card */}
            <Link href={`${ROUTES.PLANS}?mxode=topup`} className="block">
              <div
                className={cn(
                  'group relative glass-card sm:p-6 p-4 rounded-border-radius border border-glass-border hover:border-yellow-500/50 bg-white/2 cursor-pointer transition-all duration-300 hover:-translate-y-1 select-none flex flex-col justify-between min-h-50 dark:bg-white/3',
                )}
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                      <Zap className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-black text-title-color dark:text-white group-hover:text-yellow-500 transition-colors">
                      {t('top_up_recharge', { defaultValue: 'Top-up / Recharge' })}
                    </h4>
                  </div>
                  <p className="text-sm text-subtitle-color font-medium">
                    {t('topup_action_desc', {
                      defaultValue:
                        'Instantly add extra credits to your active balance without changing your subscription billing cycle.',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-yellow-500 pt-4">
                  {t('view_topup_options', { defaultValue: 'View Top-up Options' })}
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserSubscriptionOverview
