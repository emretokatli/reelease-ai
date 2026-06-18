'use client'

import { NoDataFound } from '@/components/reusable/NoDataFound'
import { Card } from '@/components/ui/card'
import { getCommonChartOptions } from '@/data/dashboard'
import { TriangleAlert, Zap, Bot } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useTranslation } from 'react-i18next'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export const PopularFeaturesChart = ({ data, isDark }: { data: any[]; isDark: boolean }) => {
  const { t } = useTranslation()

  const series = data?.map((d) => d.count) || []
  const labels = data?.map((d) => d.service) || []

  const options: any = {
    ...getCommonChartOptions(isDark, t),
    chart: {
      ...getCommonChartOptions(isDark, t).chart,
      type: 'donut',
    },
    labels: labels,
    colors: [
      'var(--primary)',
      'var(--indigo-light)',
      'var(--role-color-1)',
      'var(--role-color-2)',
      'var(--green-success)',
      'var(--amber-accent)',
    ],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          background: 'transparent',
        },
        expandOnClick: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      colors: isDark ? ['var(--gray-900)'] : ['var(--white)'],
      width: 2,
    },
    legend: {
      show: true,
      position: 'bottom',
      labels: {
        colors: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
      },
    },
    tooltip: {
      ...getCommonChartOptions(isDark, t).tooltip,
      y: {
        formatter: function (val: number) {
          return val + ' ' + t('uses', { defaultValue: 'Uses' })
        },
      },
    },
  }

  return (
    <Card className="p-px rounded-[2rem] border-none shadow-none relative overflow-hidden group w-full h-full dark:bg-white/3">
      <div className="p-4 sm:p-6 h-full flex flex-col relative z-10">
        <div className="flex items-start justify-between mb-4 lg:mb-6 gap-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className='p-2 rounded-full bg-primary/10'>
              <Bot className="text-primary" size={28} />
            </div>
            <div className="space-y-1">
              <h3 className="sm:text-xl text-lg mb-0 font-extrabold text-title-color dark:text-white tracking-tight flex items-center gap-2">
                {t('popular_features', { defaultValue: 'Popular AI Features' })}
              </h3>
              <p className="text-base font-medium text-subtitle-color">
                {t('popular_features_desc', { defaultValue: 'Most used AI templates and generators' })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-[300px] w-full flex items-center justify-center relative">
          {series.length > 0 && series.some((s: number) => s > 0) ? (
            <div className="w-full flex justify-center">
              <Chart options={options} series={series} type="donut" height="320" width="100%" />
            </div>
          ) : (
            <NoDataFound icon={TriangleAlert} height="h-[200px]" />
          )}
        </div>
      </div>
    </Card>
  )
}
