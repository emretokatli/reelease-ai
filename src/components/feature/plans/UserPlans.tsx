'use client'

import { PageHeader } from '@/components/reusable/PageHeader'
import { useGetActivePlansQuery } from '@/redux/api/planApi'
import { useGetUserSubscriptionQuery } from '@/redux/api/subscriptionApi'
import { Plan } from '@/types'
import {
  expandPlansForDisplay,
  filterPlansByMode,
  getCurrentPlanAmount,
  getCurrentPlanId,
  hasActiveSubscription,
  PlanChangeMode,
} from '@/utils/planChange'
import { 
  Package, 
  Loader2,
  TrendingUp,
  TrendingDown,
  Zap,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { PlanCard } from './components/PlanCard'
import PaymentModal from './PaymentModal'
import PlanChangeActions from './PlanChangeActions'
import { useAppSelector } from '@/redux/hooks'
import { RootState } from '@/redux/store'
import { differenceInDays } from 'date-fns'
import { Button } from '@/components/ui/button'

const UserPlans = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: plansResponse, isLoading } = useGetActivePlansQuery()
  const { user } = useAppSelector((state) => state.auth)
  const isSuperAdmin =
    user?.role === 'super_admin' ||
    (user?.roleId as any)?.name === 'super_admin' ||
    (user?.role as any)?.name === 'super_admin'
  const { data: subscriptionResp } = useGetUserSubscriptionQuery(undefined, { skip: isSuperAdmin })


  const activeSubscription = subscriptionResp?.data
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [planChangeMode, setPlanChangeMode] = useState<PlanChangeMode>(null)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [confirmedBillingCycle, setConfirmedBillingCycle] = useState<'monthly' | 'yearly' | 'one-time'>('monthly')

  const plans = (plansResponse as any)?.data || []
  const userHasActiveSub = hasActiveSubscription(activeSubscription)
  const currentPlanAmount = getCurrentPlanAmount(activeSubscription)
  const currentPlanId = getCurrentPlanId(activeSubscription)
  const hasTopUpPlans = plans.some((p: Plan) => p.plan_type === 'top_up')

  const currentPlan = useMemo(() => {
    if (!activeSubscription) return null
    if (activeSubscription.plan) return activeSubscription.plan as Plan
    if (typeof activeSubscription.plan_id === 'object' && activeSubscription.plan_id) return activeSubscription.plan_id as Plan
    const targetId = (activeSubscription.plan_id as any)?.id || (activeSubscription.plan_id as any)?._id || activeSubscription.plan_id
    if (targetId) {
      return plans.find((p: Plan) => p.id === targetId || p._id === targetId) || null
    }
    return null
  }, [activeSubscription, plans])

  const daysRemaining = activeSubscription?.current_period_end
    ? Math.max(0, differenceInDays(new Date(activeSubscription.current_period_end), new Date()))
    : null

  const filteredPlans = useMemo(
    () => {
      if (userHasActiveSub) {
        if (planChangeMode === null) {
          return plans
        }
        return filterPlansByMode(plans, currentPlanAmount, currentPlanId, planChangeMode)
      }
      return plans.filter((p: Plan) => p.plan_type !== 'top_up')
    },
    [plans, userHasActiveSub, currentPlanAmount, currentPlanId, planChangeMode],
  )

  const displayedPlans = useMemo(() => expandPlansForDisplay(filteredPlans), [filteredPlans])

  const replaceExistingOnPurchase = userHasActiveSub && (planChangeMode === 'upgrade' || planChangeMode === 'downgrade')

  useEffect(() => {
    const modeParam = searchParams.get('mode')
    if (modeParam === 'upgrade' || modeParam === 'downgrade' || modeParam === 'topup') {
      setPlanChangeMode(modeParam)
    }
  }, [searchParams])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  const handleSubscribeClick = (plan: Plan) => {
    setSelectedPlan(plan)
    const initialCycle = plan.plan_type === 'subscription' ? (plan as any)._display_billing : 'one-time'
    setConfirmedBillingCycle(initialCycle)
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false)
    setSelectedPlan(null)
    setPlanChangeMode(null)
    router.push('/subscriptions')
  }

  const isPlanActive = (planId: string) => {
    if (!activeSubscription) return false
    const isActiveStatus = activeSubscription.status === 'active' || activeSubscription.status === 'trialing'
    const subscriptionPlanId =
      activeSubscription.plan?.id ||
      activeSubscription.plan?._id ||
      (typeof activeSubscription.plan_id === 'string'
        ? activeSubscription.plan_id
        : (activeSubscription.plan_id as any)?.id || (activeSubscription.plan_id as any)?._id)
    return isActiveStatus && subscriptionPlanId === planId
  }

  const sectionTitle = () => {
    if (!userHasActiveSub) return t('choose_your_plan', { defaultValue: 'Choose Your Plan' })
    if (planChangeMode === 'upgrade') return t('upgrade_plan', { defaultValue: 'Upgrade Plan' })
    if (planChangeMode === 'downgrade') return t('downgrade_plan', { defaultValue: 'Downgrade Plan' })
    if (planChangeMode === 'topup') return t('top_up_recharge', { defaultValue: 'Top-up / Recharge' })
    return t('manage_your_plan', { defaultValue: 'Manage Your Plan' })
  }

  const sectionDescription = () => {
    if (!userHasActiveSub) {
      return t('flexible_plans_desc', {
        defaultValue: 'Select the perfect plan for your business needs. Upgrade or downgrade at any time.',
      })
    }
    if (!planChangeMode) {
      return t('plan_change_select_action', {
        defaultValue: 'You have an active plan. Choose to upgrade, downgrade, or top-up your credits.',
      })
    }
    if (planChangeMode === 'upgrade') {
      return t('upgrade_plans_desc', {
        defaultValue: 'Plans with a higher price than your current plan. Your new plan will replace the current one after payment.',
      })
    }
    if (planChangeMode === 'downgrade') {
      return t('downgrade_plans_desc', {
        defaultValue: 'Plans with a lower price than your current plan. Your new plan will replace the current one after payment.',
      })
    }
    return t('top_up_plans_desc', {
      defaultValue: 'Add extra credits to your account. Requires an active subscription.',
    })
  }

  const getSubscribeButtonText = (plan: Plan) => {
    if (planChangeMode === 'topup') return t('recharge_now', { defaultValue: 'Recharge Now' })
    if (planChangeMode === 'upgrade') return t('upgrade_now', { defaultValue: 'Upgrade Now' })
    if (planChangeMode === 'downgrade') return t('downgrade_now', { defaultValue: 'Downgrade Now' })

    if (userHasActiveSub) {
      if (plan.plan_type === 'top_up') {
        return t('topup_now', { defaultValue: 'Top-up' })
      }
      const planAmount = plan.amount ?? plan.price ?? 0
      if (planAmount > currentPlanAmount) {
        return t('upgrade_now', { defaultValue: 'Upgrade' })
      } else if (planAmount < currentPlanAmount) {
        return t('downgrade_now', { defaultValue: 'Downgrade' })
      }
    }
    return undefined
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <PageHeader
        icon={planChangeMode === null ? <Package className="w-6 h-6 text-primary animate-pulse" /> : undefined}
        title={t(sectionTitle())}
        subtitle={t(sectionDescription())}
        showBackButton={planChangeMode !== null}
        onBack={() => setPlanChangeMode(null)}
      />

      {planChangeMode === null ? (
        <div className="space-y-12">
          {displayedPlans.length === 0 ? (
            <div className="px-4 text-center py-20 glass-card glass-dark-card rounded-border-radius border border-glass-border">
              <p className="text-xl font-medium text-subtitle-color">
                {t('no_plans_available', { defaultValue: 'No plans available for this billing cycle.' })}
              </p>
            </div>
          ) : (
            <div className="px-4 w-full relative px-1 group/swiper">
              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                grabCursor={true}
                watchSlidesProgress={true}
                observer={true}
                observeParents={true}
                breakpoints={{
                  480: { slidesPerView: 1.2, spaceBetween: 20 },
                  640: { slidesPerView: 2, spaceBetween: 24 },
                  1024: { slidesPerView: 3, spaceBetween: 24 },
                  1536: { slidesPerView: 4, spaceBetween: 24 },
                }}
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                className="pb-16 overflow-visible plan-swiper"
              >
                {displayedPlans.map((plan: any) => {
                  const isPro = plan.is_default
                  const price = plan.amount
                  let billingCycleLabel = 'mo'
                  if (plan.plan_type === 'subscription' && plan._display_billing === 'yearly') billingCycleLabel = 'yr'
                  if (plan.plan_type === 'lifetime') billingCycleLabel = t('lifetime')
                  if (plan.plan_type === 'prepaid' || plan.plan_type === 'top_up') billingCycleLabel = t('one_time')
                  const isActive = isPlanActive(plan.id)

                  return (
                    <SwiperSlide key={plan.unique_id} className="!h-auto flex flex-col box-border">
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
                        <PlanCard
                          plan={plan}
                          price={price || 0}
                          billingCycleLabel={billingCycleLabel}
                          isPro={isPro}
                          isActive={isActive}
                          isDisabled={false}
                          onSubscribe={() => handleSubscribeClick(plan)}
                          buttonText={getSubscribeButtonText(plan)}
                          t={t}
                        />
                      </div>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
          )}

        </div>
      ) : displayedPlans.length === 0 ? (
        <div className="px-4 text-center py-20 glass-card glass-dark-card rounded-border-radius border border-glass-border">
          <p className="text-xl font-medium text-subtitle-color">
            {planChangeMode === 'upgrade'
              ? t('no_upgrade_plans_available', { defaultValue: 'No higher-tier plans available to upgrade.' })
              : planChangeMode === 'downgrade'
                ? t('no_downgrade_plans_available', { defaultValue: 'No lower-tier plans available to downgrade.' })
                : planChangeMode === 'topup'
                  ? t('no_topup_plans_available', { defaultValue: 'No top-up plans available at the moment.' })
                  : t('no_plans_available', { defaultValue: 'No plans available for this billing cycle.' })}
          </p>
        </div>
      ) : (
        <div className="px-4 w-full relative py-6 group/swiper " >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            grabCursor={true}
            watchSlidesProgress={true}
            observer={true}
            observeParents={true}
            breakpoints={{
              480: { slidesPerView: 1.2, spaceBetween: 20 },
              640: { slidesPerView: 2, spaceBetween: 24 },
              1024: { slidesPerView: 3, spaceBetween: 24 },
              1536: { slidesPerView: 4, spaceBetween: 24 },
            }}
            pagination={{ clickable: true, dynamicBullets: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            className="pb-16 overflow-visible plan-swiper"
          >
            {displayedPlans.map((plan: any) => {
              const isPro = plan.is_default
              const price = plan.amount
              let billingCycleLabel = 'mo'
              if (plan.plan_type === 'subscription' && plan._display_billing === 'yearly') billingCycleLabel = 'yr'
              if (plan.plan_type === 'lifetime') billingCycleLabel = t('lifetime')
              if (plan.plan_type === 'prepaid' || plan.plan_type === 'top_up') billingCycleLabel = t('one_time')
              const isActive = isPlanActive(plan.id)

              return (
                <SwiperSlide key={plan.unique_id} className="!h-auto flex flex-col box-border">
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
                    <PlanCard
                      plan={plan}
                      price={price || 0}
                      billingCycleLabel={billingCycleLabel}
                      isPro={isPro}
                      isActive={isActive}
                      isDisabled={false}
                      onSubscribe={() => handleSubscribeClick(plan)}
                      buttonText={getSubscribeButtonText(plan)}
                      t={t}
                    />
                  </div>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>
      )}

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false)
          setSelectedPlan(null)
        }}
        plan={selectedPlan}
        billingCycle={confirmedBillingCycle}
        replaceExisting={replaceExistingOnPurchase}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}

export default UserPlans
