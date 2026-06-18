'use client'

import Input from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pagination } from './Pagination'
import Spinner from './Spinner'
import { DataCardGridProps } from '@/types'


export function DataCardGrid<T>({
  data,
  renderCard,
  currentPage = 1,
  totalPages = 1,
  totalResults = 0,
  onPageChange,
  isLoading = false,
  emptyMessage,
  onRowsPerPageChange,
  rowsPerPage,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  gridClassName,
}: DataCardGridProps<T>) {
  const { t } = useTranslation()
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const defaultEmptyMessage = emptyMessage || t('no_results')
  const showToolbar = !!(onSearchChange || onRowsPerPageChange)

  return (
    <div className="space-y-6">
      {showToolbar && (
        <div className="flex items-center justify-between gap-3 mb-0 flex-wrap">
          <div className="flex flex-row gap-3 flex-1">
            {onSearchChange && (
              <div
                className={cn(
                  'relative transition-all duration-300 ease-in-out',
                  isSearchFocused ? 'w-full sm:max-w-md' : 'w-full sm:max-w-sm',
                )}
              >
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder={searchPlaceholder || t('search')}
                  value={searchValue || ''}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="ps-9 h-11 w-full bg-white/3 border border-glass-border rounded-xl focus:ring-primary/20 transition-all"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center min-h-100">
          <Spinner size="lg" />
        </div>
      ) : data.length > 0 ? (
        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6", gridClassName)}>
          {data.map((item, index) => (
            <div key={index} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 50}ms` }}>
              {renderCard(item)}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-90 dark:bg-white/3 bg-white rounded-border-radius border-2 border-dashed border-glass-border sm:p-12 p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-title-color dark:text-white mb-2">{t('no_results_found')}</h3>
          <p className="text-subtitle-color max-w-sm">{defaultEmptyMessage}</p>
        </div>
      )}

      {onPageChange && totalPages > 0 && (
        <div className="pt-6 border-t border-glass-border">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={onRowsPerPageChange}
            showRowsPerPage={true}
            totalResults={totalResults || (totalPages <= 1 ? data.length : 0)}
          />
        </div>
      )}
    </div>
  )
}
