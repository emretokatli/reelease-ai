'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { useTranslation } from 'react-i18next'
import { BarChart3, ChevronDown } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ChannelWiseChartProps } from '@/types/socialMedia'
import { periods, platformColors } from '@/data/socialMedia'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export const ChannelWiseChart = ({ channelData }: ChannelWiseChartProps) => {
  const { t } = useTranslation()
  const [period, setPeriod] = useState('month')

  const hasData = channelData && channelData.some((d) => d.total > 0)

  const options: any = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: 'transparent',
      foreColor: '#9CA3AF',
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '50%',
        distributed: true,
        dataLabels: { position: 'top' },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => (val > 0 ? val : ''),
      offsetY: -20,
      style: { fontSize: '12px', colors: ['#9CA3AF'] },
    },
    grid: {
      show: true,
      borderColor: 'rgba(156, 163, 175, 0.12)',
      strokeDashArray: 4,
      padding: { top: 30, bottom: 0 },
    },
    xaxis: {
      categories: channelData?.map((d) => d.platform.charAt(0).toUpperCase() + d.platform.slice(1)) || [],
      labels: { style: { colors: '#9CA3AF', fontSize: '11px', fontWeight: 500 } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: '#9CA3AF', fontSize: '11px' } },
      min: 0,
    },
    colors: channelData?.map((d) => platformColors[d.platform] || 'var(--primary)') || [],
    legend: { show: false },
    tooltip: {
      theme: 'dark',
      y: { formatter: (val: number) => `${val} ${t('posts', { defaultValue: 'posts' })}` },
    },
  }

  const series = [{
    name: t('total_posts', { defaultValue: 'Total Posts' }),
    data: channelData?.map((d) => d.total) || [],
  }]

  const selectedPeriod = periods.find((p) => p.value === period)

  return (
    <Card className="p-px rounded-border-radius border-none dark:bg-white/3 glass-card overflow-hidden h-full">
      <div className="p-4 sm:p-5 h-full flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-purple-400/10">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-title-color dark:text-white">
                {t('channel_wise_posts', { defaultValue: 'Channel Wise Posts' })}
              </h3>
              <p className="text-base text-subtitle-color">
                {t('posts_per_platform', { defaultValue: 'Posts distribution per platform' })}
              </p>
            </div>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5 rounded-xl border-white/10 text-xs font-semibold primary-btn text-white! h-8 px-3 ">
                {selectedPeriod ? t(selectedPeriod.labelKey, { defaultValue: selectedPeriod.defaultLabel }) : t('this_month', { defaultValue: 'This Month' })}
                <ChevronDown className="w-3 h-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-36 px-2 py-2 border-glass-border bg-white dark:bg-white/3 backdrop-blur-3xl rounded-xl " align="end">
              {periods.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${period === p.value ? 'bg-primary/10 text-primary' : 'text-subtitle-color hover:text-primary! hover:bg-primary/10!'}`}
                >
                  {t(p.labelKey, { defaultValue: p.defaultLabel })}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>

        <div className="h-[320px] w-full">
          {hasData ? (
            <div className="w-full h-full">
              <Chart options={options} series={series} type="bar" height="100%" width="100%" />
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-center">
              <BarChart3 className="w-10 h-10 text-muted-foreground mb-2" />
              <p className="text-base text-muted-foreground">{t('no_post_data', { defaultValue: 'No post data available yet' })}</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
