'use client'

import { AITemplateModal } from '@/components/feature/ai-templates/AITemplateModal'
import { DataCardGrid } from '@/components/reusable/DataCardGrid'
import { DeleteConfirmationModal } from '@/components/reusable/DeleteConfirmationModal'
import { PageHeader } from '@/components/reusable/PageHeader'
import { useDebounce } from '@/hooks/useDebounce'
import {  useDeleteTemplateMutation, useGetTemplatesQuery, useUpdateTemplateMutation } from '@/redux/api/aiTemplateApi'
import { useGetCategoriesQuery } from '@/redux/api/aiTemplateCategoryApi'
import { AITemplate, ApiError } from '@/types'
import { Plus, Search, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { usePermission } from '@/hooks/usePermission'
import { PERMISSIONS } from '@/constants/permissions'
import { TemplateCard } from './TemplateCard'
import { CategoryFilter } from '@/components/reusable/CategoryFilter'
import Input from '@/components/ui/input'

export default function AITemplateManagement() {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()

  const canCreate = hasPermission(PERMISSIONS.CREATE_AI_TEMPLATES)
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_AI_TEMPLATES)
  const canDelete = hasPermission(PERMISSIONS.DELETE_AI_TEMPLATES)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(12)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [sortColumn, setSortColumn] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data: templatesRaw, isLoading } = useGetTemplatesQuery({
    page,
    limit,
    search: debouncedSearch,
    category: categoryFilter || undefined,
    sort_by: sortColumn,
    sort_order: sortOrder,
  })

  const { data: categoriesRaw } = useGetCategoriesQuery({})
  const categories = Array.isArray(categoriesRaw)
    ? categoriesRaw
    : categoriesRaw?.categories || (categoriesRaw as any)?.data || []

  // Normalize API response array
  const templatesData: AITemplate[] = Array.isArray(templatesRaw) ? templatesRaw : templatesRaw?.templates || []
  const totalItems = templatesRaw?.total || templatesData.length
  const totalPages = templatesRaw?.totalPages || 1

  const [deleteTemplate, { isLoading: isDeleting }] = useDeleteTemplateMutation()
  const [updateTemplate] = useUpdateTemplateMutation()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<AITemplate | null>(null)

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [idToDelete, setIdToDelete] = useState<string | null>(null)

  const handleEdit = (template: AITemplate) => {
    setSelectedTemplate(template)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedTemplate(null)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setIdToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!idToDelete) return
    try {
      const res = await deleteTemplate(idToDelete).unwrap()
      toast.success(res.message || 'Template deleted successfully')
      setIsDeleteModalOpen(false)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || 'Failed to delete template')
    }
  }

  const handleStatusChange = async (id: string, currentStatus: boolean, _data: any) => {
    try {
      const res = await updateTemplate({ id, data: { status: !currentStatus } }).unwrap()
      toast.success(res.message || (!currentStatus ? 'Template activated' : 'Template deactivated'))
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || 'Failed to update status')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        showBackButton={false}
        icon={<Sparkles className="w-6 h-6 text-primary animate-pulse" />}
        title={t('prompts_templates', { defaultValue: 'AI Templates' })}
        subtitle={t('manage_ai_prompt_templates', { defaultValue: 'Manage AI prompt templates' })}
        primaryAction={
          canCreate
            ? {
              label: t('add_template', { defaultValue: 'Add Template' }),
              onClick: handleCreate,
              icon: <Plus className="w-5 h-5" />,
              className: 'bg-primary hover:bg-primary/90 text-white rounded-xl p-button-padding',
            }
            : undefined
        }
        endContent={
          <div className="relative w-full">
            <Search className="absolute left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={t('search_templates_placeholder', { defaultValue: 'Search templates...' })}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rtl:pr-9 bg-white/3! border-glass-border focus:ring-primary/20 rounded-xl"
            />
          </div>
        }
      />

      <CategoryFilter
        categories={categories}
        activeCategory={categoryFilter}
        onCategoryChange={(val) => {
          setCategoryFilter(val)
          setPage(1)
        }}
        allLabel={t('all_templates', { defaultValue: 'All Templates' })}
      />

      <DataCardGrid
        data={templatesData}
        isLoading={isLoading}
        currentPage={page}
        totalPages={totalPages}
        totalResults={totalItems}
        onPageChange={setPage}
        onRowsPerPageChange={(l) => {
          setLimit(l)
          setPage(1)
        }}
        rowsPerPage={limit}
        gridClassName="lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4"
        renderCard={(template) => (
          <TemplateCard
            template={template}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            canUpdate={canUpdate}
            canDelete={canDelete}
          />
        )}
      />

      <AITemplateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} template={selectedTemplate} />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('delete_template_title', { defaultValue: 'Delete Template' })}
        description={t('delete_template_description', {
          defaultValue: 'Are you sure you want to delete this template? This action cannot be undone.',
        })}
        isLoading={isDeleting}
      />
    </div>
  )
}
