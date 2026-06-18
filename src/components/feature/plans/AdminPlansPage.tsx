'use client'

import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { PageHeader } from '@/components/reusable/PageHeader'
import { ROUTES } from '@/constants/routes'
import {
  useDeletePlanMutation,
  useGetPlansQuery,
  useSyncPlansToGatewaysMutation,
} from '@/redux/api/planApi'
import { ApiError, Plan } from '@/types'
import { Clock, Package, Plus, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import AdminPlanCard from './AdminPlanCard'
import TrialConfigModal from './plan-modal/TrialConfigModal'
import { Button } from '@/components/ui/button'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import Input from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'

const AdminPlansPage = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(12)
  const [search, setSearch] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const debouncedSearch = useDebounce(search, 500)
  const [sortColumn, setSortColumn] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)
  const [plansToDelete, setPlansToDelete] = useState<string[]>([])

  const { data: plansResponse } = useGetPlansQuery({
    page,
    limit,
    search: debouncedSearch,
    sort_by: sortColumn,
    sort_order: sortOrder.toUpperCase(),
  })

  const [deletePlan, { isLoading: isDeleting }] = useDeletePlanMutation()
  const [syncToGateways, { isLoading: isSyncing }] = useSyncPlansToGatewaysMutation()

  const plans = plansResponse?.data || []
  console.log("la laa la",plans);
  

  const handleDeleteConfirm = async () => {
    if (plansToDelete.length === 0) return
    try {
      if (plansToDelete.length === 1) {
        await deletePlan(plansToDelete[0]).unwrap()
      } else {
        // Fallback if bulk delete is added later
      }
      toast.success(t('plan_deleted_successfully'))
      setIsDeleteModalOpen(false)
      setPlansToDelete([])
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('something_went_wrong'))
    }
  }

  const handleSyncGateways = async () => {
    try {
      await syncToGateways().unwrap()
      toast.success(t('synced_to_gateways_successfully'))
    } catch (error) {
      console.error('Sync failed:', error)
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('sync_to_gateways_failed'))
    }
  }

  const handleEdit = (plan: Plan) => {
    router.push(`${ROUTES.PLANS}/edit/${plan._id || plan.id}`)
  }

  const handleDelete = (plan: Plan) => {
    setPlansToDelete([plan._id || plan.id])
    setIsDeleteModalOpen(true)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className=" backdrop-blur-md">
        <PageHeader
          icon={<Package className="w-6 h-6 text-primary animate-pulse" />}
          title={t('plans_management')}
          subtitle={t('manage_subscription_plans_and_pricing', {
            defaultValue:
              'Manage subscription plans, pricing, usage limits, and AI feature access for your platform users.',
          })}
          showBackButton={false}
          primaryAction={{
            label: t('add_plan'),
            onClick: () => router.push(`${ROUTES.PLANS}/create`),
            icon: <Plus className="w-5 h-5" />,
          }}
          endContent={
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={handleSyncGateways}
                disabled={isSyncing}
                className="rounded-[12px] h-10 px-4 rounded-border-radius text-sm border-white/10 bg-white/5 hover:bg-white/10 transition-all font-medium gap-2"
              >
                <RefreshCw className={`w-4 h-4 text-primary ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? t('syncing_gateways') : t('sync_to_gateways')}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsTrialModalOpen(true)}
                className="rounded-[12px] h-10 px-4 text-sm rounded-border-radius border-white/10 bg-white/5 hover:bg-white/10 transition-all font-medium gap-2"
              >
                <Clock className="w-4 h-4 text-primary" />
                {t('trial_period')}
              </Button>
            </div>
          }
        />
      </div>

      <div className="px-1 space-y-6">
        {/* <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex flex-row gap-3 flex-1">
            <div className={cn('relative transition-all duration-300 ease-in-out w-full sm:max-w-sm')}>
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder={t('search_plans')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-9 h-11 w-full bg-white/3 border border-glass-border rounded-xl focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </div> */}
        <div className="flex w-full justify-between gap-3">
          {
            <div
              className={cn(
                'relative transition-all duration-300 ease-in-out',
                isSearchFocused ? 'w-full sm:w-[1000px]' : 'w-full sm:w-[700px]',
              )}
            >
              <Search className="absolute rtl:right-3! left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder={t('search_plans')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="pl-9 rtl:pr-9!  h-10 sm:h-12 w-full bg-white/3 border border-glass-border rounded-radius text-left rtl:text-right"
              />
            </div>
          }
        </div>

        <div className="w-full relative group/swiper">
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
            {plans.map((plan: any) => (
              <SwiperSlide key={plan._id || plan.id} className="!h-auto flex flex-col">
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
                  <AdminPlanCard plan={plan} onEdit={handleEdit} onDelete={handleDelete} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <TrialConfigModal isOpen={isTrialModalOpen} onClose={() => setIsTrialModalOpen(false)} />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setPlansToDelete([])
        }}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title={t('delete_plan_title')}
        description={t('delete_plan_description')}
      />
    </div>
  )
}

export default AdminPlansPage

