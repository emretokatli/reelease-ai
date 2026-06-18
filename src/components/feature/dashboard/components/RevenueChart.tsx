'use client'

import { NoDataFound } from '@/components/reusable/NoDataFound'
import { Card } from '@/components/ui/card'
import { getCommonChartOptions } from '@/data/dashboard'
import { ClipboardMinus, TrendingUp } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export const RevenueChart = ({ data, isDark }: { data: any[]; isDark: boolean }) => {
  const { t } = useTranslation()

  const options: any = {
    ...getCommonChartOptions(isDark, t),
    chart: {
      ...getCommonChartOptions(isDark, t).chart,
      type: 'area',
    },
    colors: ['var(--primary)'], // Base color, but we'll use gradient in stroke
    stroke: {
      curve: 'smooth',
      width: 4,
      dashArray: 0,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.2,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    grid: {
      show: true,
      borderColor: isDark
        ? 'rgba(156, 163, 175, 0.25)'
        : 'rgba(107, 114, 128, 0.15)',
      strokeDashArray: 4,
      padding: {
        left: 10,
        right: 10,
        bottom: 0,
      },
      row: {
        colors: isDark
          ? ['rgba(255,255,255,0.02)']
          : ['rgba(0,0,0,0.01)'],
        opacity: 1,
      },
    },
    markers: {
      size: 5,
      colors: ['var(--white)'],
      strokeColors: 'var(--primary)',
      strokeWidth: 3,
      hover: {
        size: 7,
      },
    },
    xaxis: {
      categories: (data || []).map((item) => item.month),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: isDark ? '#9CA3AF' : '#6B7280',
          fontSize: '11px',
          fontWeight: 400,
        },
        offsetY: 5,
      },
      crosshairs: {
        show: true,
        width: 1,
        position: 'back',
        stroke: {
          color: 'var(--primary)',
          width: 1,
          dashArray: 4,
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val),
        style: {
          colors: isDark ? '#9CA3AF' : '#6B7280',
          fontSize: '11px',
          fontWeight: 400,
        },
      },
    },
  }

  return (
    <Card className="p-px rounded-[2rem] border-none shadow-none relative overflow-hidden group w-full h-full transition-all duration-300 dark:bg-white/3 ">
      <div className="p-4 sm:p-6 h-full relative z-10">
        <div className="flex flex-col xl:flex-row items-start justify-between mb-4 lg:mb-6 gap-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary/10">
              <ClipboardMinus  className='text-primary w-5 h-5' />
            </div>
            <div className="space-y-1">
              <h3 className="sm:text-xl text-lg mb-0 font-extrabold text-title-color dark:text-white flex items-center gap-2">
                {t('revenue_overview', { defaultValue: 'Revenue Reports' })}
              </h3>
              <p className="text-base font-medium text-subtitle-color">
                {t('revenue_overview_desc', { defaultValue: 'Real-time financial activity and trends' })}
              </p>
            </div>
          </div>
        </div>

        <div className="h-[320px] w-full mt-2">
          {data && data.length > 0 ? (
            <Chart
              options={options}
              series={[
                {
                  name: t('revenue', { defaultValue: 'Sales' }),
                  data: data.map((d) => d.amount ?? d.totalRevenue ?? 0),
                },
              ]}
              type="area"
              height="100%"
            />
          ) : (
            <NoDataFound icon={TrendingUp} height="h-[300px]" />
          )}
        </div>
      </div>
    </Card>
  )
}
