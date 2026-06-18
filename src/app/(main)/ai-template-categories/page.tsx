'use client'

import { DataCardGrid } from '@/components/reusable/DataCardGrid'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { PageHeader } from '@/components/reusable/PageHeader'
import { AITemplateCategoryModal } from '@/components/feature/ai-template-categories/AITemplateCategoryModal'
import { CategoryCard } from '@/components/feature/ai-template-categories/CategoryCard'
import { useDebounce } from '@/hooks/useDebounce'
import { useDeleteCategoryMutation, useGetCategoriesQuery, useUpdateCategoryMutation } from '@/redux/api/aiTemplateCategoryApi'
import { ApiError, AITemplateCategory } from '@/types'
import { Layers, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { usePermission } from '@/hooks/usePermission'
import { PERMISSIONS } from '@/constants/permissions'
import Input from '@/components/ui/input'

export default function AITemplateCategoriesPage() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()

  const canCreate = hasPermission(PERMISSIONS.CREATE_TEMPLATE_CATEGORIES)
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_TEMPLATE_CATEGORIES)
  const canDelete = hasPermission(PERMISSIONS.DELETE_TEMPLATE_CATEGORIES)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(12)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data, isLoading } = useGetCategoriesQuery({
    page,
    limit,
    search: debouncedSearch,
    sort_by: sortColumn,
    sort_order: sortOrder,
  })

  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<AITemplateCategory | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<string | null>(null)

  const handleEdit = (category: AITemplateCategory) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setIdToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!idToDelete) return
    try {
      const res = await deleteCategory(idToDelete).unwrap()
      toast.success(((res as any).message as string) || t('category_deleted_successfully'))
      setIsDeleteModalOpen(false)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_delete_category'))
    }
  }

  const handleStatusChange = async (id: string, currentStatus: boolean, categoryData: any) => {
    try {
      const res = await updateCategory({ id, data: { ...categoryData, status: !currentStatus } }).unwrap()
      toast.success((res as any).message || t(!currentStatus ? 'category_activated' : 'category_deactivated'))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_status'))
    }
  }
  const categoriesData = Array.isArray(data) ? data : data?.categories || []
  const totalPages = (data as any)?.totalPages || 1
  const totalResults = (data as any)?.total || categoriesData.length

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Layers className="w-6 h-6 text-primary animate-pulse" />}
        showBackButton={false}
        title={t('categories_title', { defaultValue: 'Categories' })}
        subtitle={t('categories_desc', { defaultValue: 'Manage AI template categories' })}
        primaryAction={canCreate ? {
          label: t('add_category', { defaultValue: 'Add Category' }),
          onClick: handleCreate,
          icon: <Plus className="w-5 h-5" />,
          className: "bg-primary hover:bg-primary/90 text-white rounded-xl p-button-padding",
        } : undefined}
        endContent={
          <div className="relative w-full">
            <Search className="absolute left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={t('search_categories', { defaultValue: 'Search categories...' })}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rtl:pr-9 bg-white/3! border-glass-border focus:ring-primary/20 rounded-xl"
            />
          </div>
        }
      />

      <DataCardGrid
        data={categoriesData}
        isLoading={isLoading}
        currentPage={page}
        totalPages={totalPages}
        totalResults={totalResults}
        onPageChange={setPage}
        onRowsPerPageChange={(l) => { setLimit(l); setPage(1) }}
        rowsPerPage={limit}
        gridClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        renderCard={(category) => (
          <CategoryCard
            category={category}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            canUpdate={canUpdate}
            canDelete={canDelete}
          />
        )}
      />

      <AITemplateCategoryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} category={selectedCategory} />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('delete_category')}
        description={t('delete_category_description')}
        isLoading={isDeleting}
      />
    </div>
  )
}
