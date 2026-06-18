'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
import { ChartNetwork, Facebook, Instagram, Linkedin, Plus, ImageIcon, Users, TrendingUp, Clock, MoreHorizontal } from 'lucide-react'
import { XIcon as Twitter } from '@/components/ui/XIcon'
import { ROUTES } from '@/constants/routes'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { ConnectedAccountsProps } from '@/types/socialMedia'
import { platformColors, platformIcons } from '@/data/socialMedia'





export const ConnectedAccounts = ({ accounts }: ConnectedAccountsProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <Card className="p-px rounded-border-radius dark:bg-white/3! border-none glass-card overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <ChartNetwork className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-title-color dark:text-white">
                {t('latest_connected_accounts', { defaultValue: 'Latest Connected Accounts' })}
              </h3>
              <p className="text-base text-subtitle-color">
                {t('manage_your_social_profiles', { defaultValue: 'Manage your connected social media profiles' })}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(ROUTES.SOCIAL_MEDIA.CHANNELS)}
            className="gap-2 rounded-xl primary-btn  text-white! hover:text-primary text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            {t('add_channel', { defaultValue: 'Add Channel' })}
          </Button>
        </div>

        {accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ChartNetwork className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-title-color dark:text-white font-semibold text-lg">{t('no_connected_accounts', { defaultValue: 'No connected accounts yet' })}</p>
            <p className="text-base text-subtitle-color mt-1">{t('connect_first_account', { defaultValue: 'Connect your first social media account to get started' })}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 max-h-[475px] overflow-auto no-scrollbar">
            {accounts.map((account: any) => {
              const IconComponent = platformIcons[account.platform] || ChartNetwork
              const color = platformColors[account.platform] || 'var(--primary)'
              const accountId = account.id || account._id

              return (
                <div
                  key={accountId}
                  className="flex-shrink-0 p-3 sm:p-4 rounded-2xl bg-black/3 dark:bg-white/3 border border-black/5 dark:border-white/5 hover:border-primary/20 transition-all duration-300 group"
                >
                  {/* Header & Info */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3 min-w-0">
                      {account.profile_picture ? (
                        <Image src={account.profile_picture} alt={account.account_name} width={44} height={44} className="w-11 h-11 rounded-full border-2 border-white/10 group-hover:border-primary/30 transition-colors shrink-0" unoptimized />
                      ) : (
                        <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}20` }}>
                          <IconComponent className="w-5 h-5" style={{ color }} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-[16px] font-bold text-title-color dark:text-white truncate">{account.account_name}</h4>
                        <p className="text-[14px] text-subtitle-color truncate">@{account.account_username || account.account_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <Badge className="text-[10px] capitalize px-2 py-0.5 bg-emerald-400/10 text-emerald-400 border-emerald-400/20 font-semibold">
                        {t('active', { defaultValue: 'Active' })}
                      </Badge>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid sm:grid-cols-3 grid-cols-2 gap-3 mb-3">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-subtitle-color mb-0.5">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[16px] font-bold text-title-color dark:text-white">{account.postCount || 0}</span>
                      <p className="text-[13px] text-muted-foreground">{t('posts', { defaultValue: 'posts' })}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-subtitle-color mb-0.5">
                        <Users className="w-5 h-5" />
                      </div>
                      <span className="text-[16px] font-bold text-title-color dark:text-white">
                        {account.followerCount >= 1000 ? `${(account.followerCount / 1000).toFixed(1)}K` : account.followerCount}
                      </span>
                      <p className="text-[13px] text-muted-foreground">{t('followers', { defaultValue: 'followers' })}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-subtitle-color mb-0.5">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <span className="text-[16px] font-bold text-title-color dark:text-white">{account.engagementRate || '0'}%</span>
                      <p className="text-[13px] text-muted-foreground">{t('engagement', { defaultValue: 'engagement' })}</p>
                    </div>
                  </div>

                  {/* Platform & Connected Time */}
                  <div className="flex items-center justify-between pt-4 border-t border-glass-border">
                    <Badge
                      className="text-[14px] capitalize px-2 py-0.5"
                      style={{ backgroundColor: `${color}20`, color, borderColor: `${color}40` }}
                      variant="outline"
                    >
                      <IconComponent className="w-4 h-4 mr-1" />
                      {account.platform}
                    </Badge>
                    <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {account.connectedDaysAgo > 0
                        ? t('connected_days_ago', { defaultValue: '{{days}}d ago', days: account.connectedDaysAgo })
                        : t('connected_today', { defaultValue: 'Today' })
                      }
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </Card>
  )
}
