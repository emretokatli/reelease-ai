'use client'

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useGetPublicSettingsQuery } from '@/redux/api/adminSettingApi'
import { useGetSocialAccountsQuery } from '@/redux/api/socialApi'
import { useGetUserSubscriptionQuery } from '@/redux/api/subscriptionApi'
import { useAppSelector } from '@/redux/hooks'
import { resolveChannelLimit } from '@/utils/channelLimit'
import { ChannelsPageHeaderActionsProps } from '@/types/socialMedia'

const ChannelsPageHeaderActions = ({ onAddChannels }: ChannelsPageHeaderActionsProps) => {
  const { t } = useTranslation()
  const { data: accountsData } = useGetSocialAccountsQuery(undefined)
  const user = useAppSelector((s) => s.auth.user)
  const isSuperAdmin =
    user?.role === 'super_admin' ||
    (user?.roleId as any)?.name === 'super_admin' ||
    (user?.role as any)?.name === 'super_admin'
  const { data: subscriptionResp } = useGetUserSubscriptionQuery(undefined, { skip: isSuperAdmin })
  const { data: publicSettingsResp } = useGetPublicSettingsQuery(undefined)

  const isAdmin = useMemo(() => {
    const roleName = typeof user?.role === 'object' && user?.role ? (user.role as any).name : user?.role
    const roleIdName = typeof user?.roleId === 'object' && user?.roleId ? (user.roleId as any).name : user?.roleId

    return roleName === 'super_admin' || roleIdName === 'super_admin' || roleName === 'admin' || roleIdName === 'admin'
  }, [user])

  const connectedCount = accountsData?.data?.length ?? 0

  const channelLimit = useMemo(
    () => resolveChannelLimit(subscriptionResp, publicSettingsResp?.data),
    [subscriptionResp, publicSettingsResp],
  )

  return (
    <>
      <Badge
        variant="outline"
        className="rounded-full dark:bg-white/3 px-3 py-1.5 text-xs font-bold border-glass-border h-10 flex items-center"
      >
        {connectedCount} {t('total', { defaultValue: 'Total' })}
      </Badge>
      {!isAdmin && (
        <Badge className="rounded-full px-3 py-1.5 text-xs font-bold bg-primary/15 text-primary border border-primary/30 h-10 flex items-center">
          {connectedCount}/{channelLimit} {t('channels_limit_label', { defaultValue: 'channels' })}
        </Badge>
      )}
      <Button onClick={onAddChannels} className="h-10 px-5 rounded-xl text-white! font-bold gap-2 primary-btn shrink-0">
        <Plus className="w-4 h-4" />
        {t('add_channels', { defaultValue: 'Add Channels' })}
      </Button>
    </>
  )
}

export default ChannelsPageHeaderActions
