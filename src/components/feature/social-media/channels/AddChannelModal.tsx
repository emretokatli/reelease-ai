'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useTranslation } from 'react-i18next'
import { availablePlatform } from '@/data/channels'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowRight, Link2, ShieldCheck, Zap } from 'lucide-react'
import { AddChannelModalProps } from '@/types/socialMedia'



const getPlatformGradient = (id: string) => {
  switch (id) {
    case 'facebook':
      return 'linear-gradient(135deg, #1877F2 0%, #0d52b3 100%)'
    case 'instagram':
      return 'linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCB045 100%)'
    case 'twitter':
      return 'linear-gradient(135deg, #1DA1F2 0%, #0d7ec7 100%)'
    case 'linkedin':
      return 'linear-gradient(135deg, #0A66C2 0%, #004182 100%)'
    default:
      return 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)'
  }
}

const getPlatformGlow = (id: string) => {
  switch (id) {
    case 'facebook':
      return 'hover:shadow-[0_8px_25px_rgba(24,119,242,0.45)] dark:hover:shadow-[0_8px_30px_rgba(24,119,242,0.6)]'
    case 'instagram':
      return 'hover:shadow-[0_8px_25px_rgba(228,64,95,0.45)] dark:hover:shadow-[0_8px_30px_rgba(228,64,95,0.6)]'
    case 'twitter':
      return 'hover:shadow-[0_8px_25px_rgba(29,161,242,0.45)] dark:hover:shadow-[0_8px_30px_rgba(29,161,242,0.6)]'
    case 'linkedin':
      return 'hover:shadow-[0_8px_25px_rgba(10,102,194,0.45)] dark:hover:shadow-[0_8px_30px_rgba(10,102,194,0.6)]'
    default:
      return 'hover:shadow-[0_8px_25px_rgba(96,165,250,0.45)]'
  }
}

export const AddChannelModal = ({
  isOpen,
  onClose,
  onConnect,
  isConnecting,
  configuredPlatforms = {},
}: AddChannelModalProps) => {
  const { t } = useTranslation()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl! max-w-[calc(100%-2rem)]! p-0! glass-card border-glass-border lg:overflow-hidden overflow-y-auto max-h-[96vh] rounded-border-radius dark:bg-modal-bg-color">
        <div className="flex flex-col lg:flex-row h-full w-full">
          {/* Left Side: Info & Decorative */}
          <div className="w-full lg:w-[35%] p-4 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-glass-border/30 ">
            <DialogHeader className="text-left space-y-0">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary">
                <Link2 className="w-7 h-7" />
              </div>
              <DialogTitle className="text-3xl font-black text-title-color dark:text-white leading-tight mb-3">
                {t('connect_new_channels')}
              </DialogTitle>
              <DialogDescription className="text-base text-subtitle-color/85 dark:text-subtitle-color/70 font-medium leading-relaxed">
                {t('connect_new_channels_desc')}
              </DialogDescription>
            </DialogHeader>

            <div className="hidden lg:block space-y-6 mt-8">
              {/* Workspace Stats Widget */}
              <div className="rounded-2xl bg-black/3 dark:bg-white/5 border border-glass-border dark:border-white/10 p-5 backdrop-blur-md">
                <p className="text-xs text-subtitle-color/60 font-bold uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  Workspace Stats
                </p>
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-title-color dark:text-white">Auto-Post Ready</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-green-500 dark:text-green-400">Active</span>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-title-color dark:text-white">Sync Channels</span>
                    <span className="text-[10px] font-black bg-gradient-to-r from-primary to-secondary text-white px-2.5 py-0.5 rounded-full shadow-sm">PRO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Platform Selection */}
          <div className="flex-1 p-4 sm:p-6 lg:overflow-y-auto lg:max-h-[80vh] overflow-visible no-scrollbar dark:bg-transparent">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {availablePlatform.map((platform) => {
                const Icon = platform.icon
                const connecting = isConnecting === platform.id
                const isConfigured = configuredPlatforms[platform.id] !== false

                return (
                  <div
                    key={platform.id}
                    className={cn(
                      "group relative flex flex-col sm:p-6 p-4 rounded-border-radius bg-white dark:bg-white/5 border border-glass-border dark:border-white/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden",
                      isConfigured
                        ? "hover:border-primary/50 dark:hover:border-primary/40 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]"
                        : "opacity-85 hover:border-glass-border"
                    )}
                  >
                    {/* Contact Admin Badge */}
                    {!isConfigured && (
                      <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/30 text-amber-500 z-20">
                        {t('contact_admin_badge', { defaultValue: 'Contact Admin' })}
                      </span>
                    )}

                    {/* Background Glow */}
                    {isConfigured && (
                      <div
                        className="absolute -right-6 -top-6 w-32 h-32 blur-[60px] opacity-0 group-hover:opacity-15 dark:group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                        style={{ backgroundColor: platform.color }}
                      />
                    )}

                    <div className="flex items-center gap-4 mb-5 relative z-10">
                      <div
                        className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500 shadow-inner",
                          isConfigured ? "group-hover:scale-105 group-hover:rotate-3" : ""
                        )}
                        style={{
                          backgroundColor: isConfigured ? `${platform.color}15` : 'var(--muted)',
                          color: isConfigured ? platform.color : 'var(--subtitle-color)',
                          borderColor: isConfigured ? `${platform.color}30` : 'var(--glass-border)'
                        }}
                      >
                        <Icon className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-title-color dark:text-white transition-colors">
                          {platform.name}
                        </h4>
                        <span className="text-xs font-semibold text-subtitle-color/60 capitalize">
                          {platform.type} Integration
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-subtitle-color/85 dark:text-subtitle-color/70 mb-6 flex-1 relative z-10 pr-2 leading-relaxed">
                      {platform.description}
                    </p>

                    <Button
                      onClick={() => isConfigured && onConnect(platform.id)}
                      disabled={!!isConnecting || !isConfigured}
                      style={{ background: !isConfigured ? 'var(--muted)' : (connecting ? undefined : getPlatformGradient(platform.id)) }}
                      className={cn(
                        "group/btn w-full h-12 rounded-full font-bold text-xs gap-2 transition-all duration-300 relative z-10 text-white flex items-center justify-center hover:scale-[1.02] active:scale-[0.98]",
                        !isConfigured
                          ? "bg-muted text-subtitle-color/60 cursor-not-allowed border border-glass-border/10 hover:scale-100 active:scale-100 shadow-none!"
                          : connecting
                            ? "bg-muted text-subtitle-color cursor-not-allowed border border-glass-border/10"
                            : cn("bg-primary border-none shadow-md dark:text-white", getPlatformGlow(platform.id))
                      )}
                    >
                      {connecting ? (
                        <div className="w-5 h-5 border-2 border-subtitle-color/30 border-t-subtitle-color rounded-full animate-spin" />
                      ) : !isConfigured ? (
                        t('not_configured_btn', { defaultValue: 'Not Configured' })
                      ) : (
                        <>
                          {t('connect')}
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                        </>
                      )}
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

