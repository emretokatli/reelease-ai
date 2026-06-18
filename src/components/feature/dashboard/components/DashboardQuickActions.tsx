'use client'

import { Card } from '@/components/ui/card'
import { dashboardItemVariants, featureRoutes } from '@/data/dashboard'
import { iconMap } from '@/data/plan'
import { ROUTES } from '@/constants/routes'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useMemo } from 'react'

export const DashboardQuickActions = ({ aiFeatures, subscription, t }: any) => {
  const permittedFeatures = useMemo(() => {
    if (!aiFeatures || !Array.isArray(aiFeatures)) return []
    return aiFeatures.filter((feature: any) => {
      const aiFeaturesAccess = subscription?.plan_id?.ai_features
      if (!aiFeaturesAccess) return false
      return aiFeaturesAccess[feature.feature_key] !== false
    }).slice(0, 3)
  }, [aiFeatures, subscription])

  return (
    <motion.section className="h-full" variants={dashboardItemVariants}>
      <Card className="relative h-full glass-card glass-dark-card overflow-hidden rounded-border-radius bg-card/60 gradient-border border border-glass-border p-4 sm:p-5 flex flex-col gap-5 glass-card">
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full primary-btn border border-primary/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-title-color dark:text-white mb-0 tracking-tight flex items-center gap-2">
                {t('quick_actions', { defaultValue: 'Quick Actions' })}
              </h3>
              <p className="text-sm text-subtitle-color font-medium leading-relaxed line-clamp-1">
                {t('quick_actions_desc', { defaultValue: 'Jump straight into your daily tasks.' })}
              </p>
            </div>
          </div>
        </div>

        <div className="grid   grid-cols-1 xl:grid-cols-2 gap-3  relative z-10 justify-center mt-2">
          {permittedFeatures.length > 0 ? (
            permittedFeatures.map((feature: any, index: number) => {
              const iconData = iconMap[feature.feature_key] || Zap
              const href = featureRoutes[feature.feature_key] || ROUTES.AI_TEMPLATES

              return (
                <Link key={index} href={href}>
                  <div className="flex  backdrop-blur-3xl  items-center justify-between p-2 rounded-xl border border-glass-border dark:bg-white/5 hover:border-primary/20 transition-all duration-300 group cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full primary-btn flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        {typeof iconData === 'string' ? (
                          <Image
                            src={iconData}
                            width={20}
                            height={20}
                            unoptimized
                            className="w-5 h-5 object-contain"
                            alt={feature.display_name}
                          />
                        ) : (
                          React.createElement(iconData, { className: 'w-5 h-5' })
                        )}
                      </div>
                      <span className="text-sm font-bold text-title-color dark:text-white group-hover:text-primary transition-colors">
                        {feature.display_name}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-subtitle-color group-hover:text-primary transition-all group-hover:translate-x-1" />
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="text-center py-6 bg-black/5 dark:bg-white/5 rounded-xl border border-dashed border-glass-border">
              <p className="text-sm text-subtitle-color">
                {t('no_quick_actions', { defaultValue: 'No quick actions available.' })}
              </p>
            </div>
          )}
        </div>
      </Card>
    </motion.section>
  )
}
