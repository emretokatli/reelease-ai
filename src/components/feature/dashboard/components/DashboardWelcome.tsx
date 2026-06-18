'use client'

import { Card } from '@/components/ui/card'
import { dashboardItemVariants } from '@/data/dashboard'
import { useAppSelector } from '@/redux/hooks'
import { motion } from 'framer-motion'
import { Sparkles, Wand2, Zap, Star } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { usePermission } from '@/hooks/usePermission'

export const DashboardWelcome = () => {
  const { t } = useTranslation()
  const { user } = useAppSelector((state) => state.auth)
  const { isAdmin } = usePermission()

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t('good_morning', { defaultValue: 'Good Morning' })
    if (hour < 17) return t('good_afternoon', { defaultValue: 'Good Afternoon' })
    if (hour < 21) return t('good_evening', { defaultValue: 'Good Evening' })
    return t('good_night', { defaultValue: 'Good Night' })
  }

  return (
    <motion.section className="h-full" variants={dashboardItemVariants}>
      {/* Gradient border wrapper — 2px padding creates the border illusion */}
      <div
        className="h-full rounded-border-radius gradient-border transition-all duration-500"
        style={{
          background:
            'linear-gradient(to left, color-mix(in srgb, var(--primary) 10%, transparent) 0%, color-mix(in srgb, var(--secondary) var(--secondary-opacity), transparent) 40%, transparent 100%)',
        }}
      >
        <Card className="relative h-full overflow-hidden rounded-border-radius bg-card/60  border-0 p-5 sm:p-7 flex flex-col justify-between gap-6">
          <Image
            src={'/welcome-images-1.png'}
            alt={'Welcome'}
            width={500}
            height={500}
            unoptimized
            className="object-cover absolute bottom-0 -top-6 -right-33 rtl:right-[unset] rtl:-left-33 opacity-20 sm:opacity-100"
          />
          {/* ── Soft glow orbs (themed to primary/secondary) ── */}
          <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full opacity-20 blur-3xl pointer-events-none dark:bg-secondary bg-primary" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full opacity-15 blur-3xl pointer-events-none bg-secondary" />

          {/* ── Dot grid ── */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none "
            style={{
              backgroundImage: 'radial-gradient(circle, var(--primary) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />

          {/* ── Main content ── */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 h-auto md:h-full">
            {/* Left */}
            <div className="md:space-y-5 space-y-3 flex-1 w-full">
              {/* Badge pill */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border"
                style={{
                  background:
                    'linear-gradient(135deg, color-mix(in srgb, var(--primary) 15%, transparent), color-mix(in srgb, var(--secondary) 10%, transparent))',
                  borderColor: 'color-mix(in srgb, var(--primary) 40%)',
                  color: 'var(--primary)',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-3xs">{t('ai_power_enabled', { defaultValue: 'Neural Active' })}</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg md:text-2xl font-bold flex text-foreground leading-tight  flex flex-wrap">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient">
                    {getGreeting()},
                  </span>
                  <span className="text-mix-primary block box-decoration-clone bg-clip-text">{user?.name}!</span>
                </h2>
                <p className="text-sm text-title-color dark:text-white/80 font-medium leading-relaxed max-w-[390px] whitespace-break-spaces line-clamp-4 trancking">
                  {isAdmin()
                    ? t('admin_dashboard_promo', {
                      defaultValue: 'Empower your team with the ultimate AI-driven business suite. Streamline workflows, automate repetitive tasks, and unlock deep business insights with our unified platform.',
                    })
                    : t('user_dashboard_promo_unique', {
                      defaultValue: 'Unify AI agents, human expertise, and marketing automation on one intelligent platform. Empower teams to collaborate effectively, automate complex workflows, and scale campaigns with greater speed, accuracy, and efficiency.',
                    })
                  }
                </p>
              </div>
            </div>

            {/* Right: decorative orb */}
            {/* <Image
              src={"/welcome-images.png"}
              alt={"Welcome"}
              width={400}
              height={400}
              unoptimized
              className="object-cover"
            /> */}
          </div>
        </Card>
      </div>
    </motion.section>
  )
}
