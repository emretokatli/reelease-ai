'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ROUTES } from '@/constants/routes'
import { dashboardItemVariants } from '@/data/dashboard'
import { PlanCardProps } from '@/types/components/campaignHub'
import { motion } from 'framer-motion'
import { Rocket, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export const DashboardPlanCard = ({ currentPurchasePlan, t }: PlanCardProps) => {
  const router = useRouter()

  const calculateDaysLeft = (plan: any) => {
    const expiryDate = plan?.current_period_end || plan?.expires_at
    const now = new Date()

    if (expiryDate) {
      const expiry = new Date(expiryDate)
      const diffTime = expiry.getTime() - now.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return diffDays > 0 ? diffDays : 0
    }

    if (!plan?.created_at) return 0
    const created = new Date(plan.created_at)
    const expiry = new Date(created)
    const cycle = plan.plan_id?.billing_cycle

    if (cycle === 'monthly') {
      expiry.setDate(expiry.getDate() + 30)
    } else if (cycle === 'yearly') {
      expiry.setDate(expiry.getDate() + 365)
    } else {
      return 0
    }

    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const daysLeft = currentPurchasePlan ? calculateDaysLeft(currentPurchasePlan) : 0

  return (
    <motion.section className="col-span-1" variants={dashboardItemVariants}>
      <div className="h-full rounded-border-radius gradient-border  transition-all duration-500">
        <Card
          onClick={() => router.push(ROUTES.PLANS)}
          className="h-full glass-card rounded-border-radius transition-all duration-700 relative overflow-hidden cursor-pointer"
        // style={{
        //   background: `radial-gradient(at 100% 0%, color-mix(in srgb, var(--primary) 15%, transparent) 0%, color-mix(in srgb, var(--secondary) 10%, transparent) 50%, transparent 100%)`,
        // }}
        >
          <div className="relative z-10 sm:p-5 p-4 flex flex-col h-full space-y-6">
            <div className="flex items-center gap-4 mb-10">
              <div
                className="p-3.5 rounded-full w-fit group-hover/card:scale-110 transition-transform duration-500 relative"
                style={{
                  background: 'linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)',
                }}
              >
                <Rocket className="w-6 h-6 text-white relative z-10 rtl:-scale-x-100" />
                <div
                  className="absolute inset-0 rounded-full opacity-40 group-hover/card:opacity-80 transition-opacity"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 50%, var(--primary) 100%)',
                  }}
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-medium text-title-color dark:text-white mb-0 tracking-tight">
                  {t('active_plan', { defaultValue: 'Subscribed Plan' })}
                </h3>
                <div className="flex gap-4">
                  <p className="text-xs text-subtitle-color font-medium leading-relaxed line-clamp-1">
                    {currentPurchasePlan?.plan_id?.name || t('no_plan', { defaultValue: 'No active plan' })}
                  </p>
                  {currentPurchasePlan && (
                    <Badge className="bg-green-500/20 text-green-600 tracking-widest text-[10px] font-medium ">
                      {t('active')}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 flex-1 flex flex-col justify-between">
              {currentPurchasePlan ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-title-color dark:text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {t('total_credits')}:{' '}
                    {currentPurchasePlan.plan_id?.total_credits === -1
                      ? t('unlimited', { defaultValue: 'Unlimited' })
                      : currentPurchasePlan.plan_id?.total_credits || 0}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-title-color dark:text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {t('billing_cycle')}:{' '}
                    <span className="capitalize">{currentPurchasePlan.plan_id?.billing_cycle}</span>
                  </div>
                </div>
              ) : (
                <div className="py-2 flex justify-center items-center flex-1 min-h-[60px] w-full">
                  <Image
                    src="/images/plan.png"
                    alt="No Plan Image"
                    width={100}
                    height={100}
                    unoptimized
                    className="max-h-20 object-contain opacity-80"
                  />
                </div>
              )}

              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                {currentPurchasePlan ? (
                  <>
                    <div className="flex flex-col">
                      <span className="text-xl font-medium text-title-color dark:text-white tabular-nums tracking-tighter">
                        {currentPurchasePlan.plan_id?.currency === 'INR' ? '₹' : '$'}
                        {currentPurchasePlan.plan_id?.amount}
                      </span>
                      <span className="text-xs capitalize tracking-widest text-subtitle-color">
                        /{currentPurchasePlan.plan_id?.billing_cycle === 'monthly' ? t('month') : t('year')}
                      </span>
                    </div>
                    <div className="text-end">
                      <span className="text-xs font-bold text-rose-500 capitalize block mb-0">
                        {daysLeft} {t('days_left')}
                      </span>
                      <span className="text-xs text-subtitle-color capitalize">{t('remaining')}</span>
                    </div>
                  </>
                ) : (
                  <div className="w-full">
                    <Link href={ROUTES.PLANS} className="w-full block" onClick={(e) => e.stopPropagation()}>
                      <Button variant="premium" className="w-full h-10 text-sm font-semibold primary-btn text-white!">
                        {t('get_plan', { defaultValue: 'Get a Plan' })}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </motion.section>
  )
}
