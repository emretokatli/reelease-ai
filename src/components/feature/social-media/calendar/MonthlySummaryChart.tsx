'use client'

import { getCommonChartOptions } from '@/data/dashboard'
import { useTranslation } from 'react-i18next'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { TrendingUp } from 'lucide-react'
import { MonthlySummaryChartProps } from '@/types/socialMedia'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })



const MonthlySummaryChart = ({
  total,
  changePct,
  engagementRate,
  engagementChangePct,
  dailyCounts,
  prevMonthLabel,
}: MonthlySummaryChartProps) => {
  const { t } = useTranslation()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const options: any = {
    ...getCommonChartOptions(isDark, t),
    chart: {
      ...getCommonChartOptions(isDark, t).chart,
      type: 'bar',
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    plotOptions: {
      bar: {
        borderRadius: 3,
        columnWidth: '60%',
      },
    },
    colors: ['var(--primary)'],
    xaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: false },
    grid: { show: false },
    dataLabels: { enabled: false },
    tooltip: { enabled: false },
  }

  const changeSign = changePct >= 0 ? '+' : ''

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {t('total_posts', { defaultValue: 'Total Posts' })}
          </p>
          <p className="text-2xl font-black text-foreground">{total}</p>
          <p className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {changeSign}
            {changePct}% {t('vs', { defaultValue: 'vs' })} {prevMonthLabel}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {t('engagement_rate', { defaultValue: 'Engagement Rate' })}
          </p>
          <p className="text-2xl font-black text-foreground">{engagementRate}%</p>
          <p className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +{engagementChangePct}%
          </p>
        </div>
      </div>
      <Chart options={options} series={[{ name: t('posts', { defaultValue: 'Posts' }), data: dailyCounts }]} type="bar" height={80} />
    </div>
  )
}

export default MonthlySummaryChart
