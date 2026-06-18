'use client'

import { DataCardGrid } from "@/components/reusable/DataCardGrid"
import { DeleteConfirmationModal } from "@/components/reusable/DeleteConfirmationModal"
import { PageHeader } from "@/components/reusable/PageHeader"
import Input from "@/components/ui/input"
import { PERMISSIONS } from "@/constants/permissions"
import { useDebounce } from "@/hooks/useDebounce"
import { usePermission } from "@/hooks/usePermission"
import {
  useCreateTestimonialMutation,
  useDeleteTestimonialsMutation,
  useGetTestimonialsQuery,
  useUpdateTestimonialMutation,
  useUpdateTestimonialStatusMutation,
} from "@/redux/api/testimonialApi"
import { Plus, Quote, Search } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import TestimonialCard from "./TestimonialCard"
import TestimonialFormModal from "./TestimonialFormModal"
import { Testimonial } from "@/types/testimonial"

const AdminTestimonialPage = () => {
  const { t } = useTranslation()
  const { hasPermission } = usePermission()

  const canCreate = hasPermission(PERMISSIONS.CREATE_TESTIMONIALS)
  const canUpdate = hasPermission(PERMISSIONS.UPDATE_TESTIMONIALS)
  const canDelete = hasPermission(PERMISSIONS.DELETE_TESTIMONIALS)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(12)
  const [search, setSearch] = useState("")
  const [sortColumn, setSortColumn] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const debouncedSearch = useDebounce(search, 500)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null)

  const { data: response, isLoading } = useGetTestimonialsQuery({
    page,
    limit,
    search: debouncedSearch,
    sort_by: sortColumn,
    sort_order: sortOrder.toUpperCase(),
  })

  const [createTestimonial, { isLoading: isCreating }] = useCreateTestimonialMutation()
  const [updateTestimonial, { isLoading: isUpdating }] = useUpdateTestimonialMutation()
  const [updateStatus] = useUpdateTestimonialStatusMutation()
  const [deleteTestimonials, { isLoading: isDeleting }] = useDeleteTestimonialsMutation()

  const testimonials = response?.testimonials || []
  const totalPages = response?.totalPages || 0
  const totalResults = response?.total || 0

  const handleCreateOpen = () => {
    setSelectedTestimonial(null)
    setIsFormModalOpen(true)
  }

  const handleEditOpen = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial)
    setIsFormModalOpen(true)
  }

  const handleDeleteOpen = (testimonial: Testimonial) => {
    setTestimonialToDelete(testimonial._id || testimonial.id || null)
    setIsDeleteModalOpen(true)
  }

  const handleSave = async (formData: FormData) => {
    // console.log("🚀 ~ handleSave ~ formData:", formData)
    try {
      if (selectedTestimonial) {
        const res = await updateTestimonial({
          id: selectedTestimonial._id || selectedTestimonial.id || "",
          data: formData,
        }).unwrap()
        console.log("🚀 ~ handleSave ~ res:", res)
        toast.success(t("testimonial_updated_successfully", { defaultValue: 'Testimonial updated successfully' }))
      } else {
        await createTestimonial(formData).unwrap()
        toast.success(t("testimonial_created_successfully", { defaultValue: 'Testimonial created successfully' }))
      }
      setIsFormModalOpen(false)
    } catch (error: any) {
      toast.error(error?.data?.message || t("something_went_wrong"))
    }
  }

  const handleDeleteConfirm = async () => {
    if (!testimonialToDelete) return
    try {
      await deleteTestimonials({ ids: [testimonialToDelete] }).unwrap()
      toast.success(t("testimonial_deleted_successfully", { defaultValue: 'Testimonial deleted successfully' }))
      setIsDeleteModalOpen(false)
      setTestimonialToDelete(null)
    } catch (error: any) {
      toast.error(error?.data?.message || t("something_went_wrong"))
    }
  }

  const handleToggleStatus = async (testimonial: Testimonial) => {
    try {
      await updateStatus({
        id: testimonial._id || testimonial.id || "",
        status: !testimonial.status,
      }).unwrap()
      toast.success(t("status_updated_successfully", { defaultValue: 'Status updated successfully' }))
    } catch (error: any) {
      toast.error(error?.data?.message || t("something_went_wrong"))
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<Quote className="w-6 h-6 text-primary animate-pulse" />}
        showBackButton={false}
        title={t('testimonials_management', { defaultValue: 'Testimonials' })}
        subtitle={t('manage_user_testimonials_desc', {
          defaultValue: 'Manage feedback and testimonials for your application',
        })}
        primaryAction={
          canCreate
            ? {
                label: t('add_testimonial', { defaultValue: 'Add Testimonial' }),
                onClick: handleCreateOpen,
                icon: <Plus className="w-5 h-5" />,
                className: 'bg-primary hover:bg-primary/90 text-white rounded-xl h-11 px-6',
              }
            : undefined
        }
        endContent={
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 rtl:right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder={t('search_testimonials', { defaultValue: 'Search testimonials...' })}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rtl:pr-9 dark:bg-white/3! bg-black/3 border-glass-border focus:ring-primary/20 rounded-xl h-11"
            />
          </div>
        }
      />

      <DataCardGrid
        data={testimonials}
        isLoading={isLoading}
        currentPage={page}
        totalPages={totalPages}
        totalResults={totalResults}
        onPageChange={setPage}
        onRowsPerPageChange={setLimit}
        rowsPerPage={limit}
        renderCard={(testimonial) => (
          <TestimonialCard
            testimonial={testimonial}
            onEdit={handleEditOpen}
            onDelete={handleDeleteOpen}
            onToggleStatus={handleToggleStatus}
            canUpdate={canUpdate}
            canDelete={canDelete}
          />
        )}
      />

      <TestimonialFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSave}
        testimonial={selectedTestimonial}
        isLoading={isCreating || isUpdating}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title={t('delete_testimonial_title', { defaultValue: 'Delete Testimonial' })}
        description={t('delete_testimonial_desc', {
          defaultValue: 'Are you sure you want to delete this testimonial? This action cannot be undone.',
        })}
      />
    </div>
  )
}

export default AdminTestimonialPage
