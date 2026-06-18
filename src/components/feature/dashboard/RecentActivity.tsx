'use client'

import { CopyEmailCell } from '@/components/reusable/CopyEmailCell'
import { NoDataFound } from '@/components/reusable/NoDataFound'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn, getAvatarColorClass } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { Calendar, Users, Users as UsersIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const RecentActivity = ({ recentUsers }: { recentUsers: any[] }) => {
  const { t } = useTranslation()

  return (
    <Card className="p-px rounded-border-radius dark:bg-white/3 border-none glass-card glass-dark-card shadow-none overflow-hidden group/users w-full h-full flex flex-col">
      <div className="sm:p-6 p-4 relative flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Users className="text-primary w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="sm:text-xl text-lg font-extrabold text-title-color mb-0 tracking-tight flex items-center gap-2 dark:text-white">
                  {t('recent_users')}
                </h3>
                <p className="text-base font-medium text-subtitle-color">{t('new_registrations')}</p>
              </div>
            </div>
          </div>
          <Badge className="bg-white/20 text-subtitle-color text-center border-none rounded-full py-1 font-semibold text-sm">
            {recentUsers.length}
          </Badge>
        </div>

        <div className="space-y-3 no-scrollbar flex-1 overflow-auto min-h-0 pb-2">
          <div className="grid grid-cols-1 2xl:grid-cols-2 gap-3 group py-2 px-1">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-start bg-white dark:bg-black/10 gap-3 sm:gap-4 p-3 sm:p-5 rounded-border-radius shadow-none! glass-card transition-all duration-300 cursor-pointer hover:border-primary! hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:bg-primary/5 relative overflow-hidden group/user hover-full-gradient-border"
                >
                  <div className="absolute inset-0 dark:bg-gradient-to-l from-primary/10 via-secondary/5 to-transparent opacity-0 group-hover/user:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <div className="flex items-start gap-3 sm:gap-4 w-full relative z-10">
                    <div className="relative shrink-0">
                      <Avatar className="h-10 min-w-10 sm:h-12 sm:min-w-12 rounded-radius group-hover:scale-105 transition-transform duration-500">
                        <AvatarImage src={user.avatar || undefined} />
                        <AvatarFallback className={cn('font-medium uppercase text-xl', getAvatarColorClass(user.name))}>
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-start justify-between gap-2 mb-0">
                        <p className="text-[16px] font-medium truncate transition-colors text-title-color dark:text-white">
                          {user.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-subtitle-color font-medium text-right shrink-0 mt-1">
                          <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                        </div>
                      </div>
                      <div className="flex text-sm sm:items-center items-start justify-between  flex-row gap-1.5 sm:gap-2">
                        {user.email ? (
                          <div className="text-subtitle-color font-medium">
                            <CopyEmailCell email={user.email} truncate={false} />
                          </div>
                        ) : null}
                        {(() => {
                          const getRoleStyle = (role: string) => {
                            const r = (role || 'user').toLowerCase()
                            if (r.includes('admin'))
                              return 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-500/20'
                            if (r.includes('assigner'))
                              return 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/20'
                            if (r.includes('user'))
                              return 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/20'
                            if (r.includes('member'))
                              return 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-blue-500/20'
                            return 'bg-primary/10 text-primary border border-primary/20'
                          }
                          return (
                            <Badge
                              className={`text-[11px] font-medium px-2 py-0.5 mt-1 rounded shadow-none capitalize ${getRoleStyle(user.role)}`}
                            >
                              {user.role || 'User'}
                            </Badge>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <NoDataFound icon={UsersIcon} height="h-[375px]" />
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
