'use client'

import MediaPickerModal from '@/components/feature/media-library/MediaPickerModal'
import TextAreaField from '@/components/shared/form-fields/TextAreaField'
import TextInput from '@/components/shared/form-fields/TextInput'
import { Button } from '@/components/ui/button'
import Label from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '@/redux/api/categoryApi'
import { CategoryFormProps } from '@/types'
import { Form, Formik } from 'formik'
import { ImageIcon, Loader2, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import * as Yup from 'yup'



// Helper to safely extract ID from string | Object unions
const getId = (v: any): string => (v && typeof v === 'object' ? v._id || v.id || '' : v || '')
const getFilePath = (v: any): string | null => (v && typeof v === 'object' ? v.file_path || null : null)

export default function CategoryForm({ category, availableCategories, onSuccess, onCancel }: CategoryFormProps) {
  const { t } = useTranslation()
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation()
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation()

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)
  const [mediaTarget, setMediaTarget] = useState<'image' | 'meta_image'>('image')
  const [imagePreview, setImagePreview] = useState<string | null>(getFilePath(category?.image_id))
  const [metaImagePreview, setMetaImagePreview] = useState<string | null>(getFilePath(category?.meta_image_id))

  useEffect(() => {
    if (category) {
      setImagePreview(getFilePath(category.image_id))
      setMetaImagePreview(getFilePath(category.meta_image_id))
    } else {
      setImagePreview(null)
      setMetaImagePreview(null)
    }
  }, [category])

  const isEditing = !!category
  const isLoading = isCreating || isUpdating

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t('name_required')),
    slug: Yup.string().required(t('slug_required')),
    status: Yup.boolean(),
  })

  const initialValues = {
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    parent_id: getId(category?.parent_id),
    image_id: getId(category?.image_id),
    meta_title: category?.meta_title || '',
    meta_description: category?.meta_description || '',
    meta_image_id: getId(category?.meta_image_id),
    status: category?.status ?? true,
  }

  const handleSubmit = async (values: typeof initialValues, { resetForm }: any) => {
    try {
      const payload: Record<string, any> = {
        name: values.name,
        slug: values.slug,
        description: values.description,
        meta_title: values.meta_title,
        meta_description: values.meta_description,
        status: values.status,
      }
      if (values.parent_id) payload.parent_id = values.parent_id
      else payload.parent_id = null

      if (values.image_id) payload.image_id = values.image_id
      else payload.image_id = null

      if (values.meta_image_id) payload.meta_image_id = values.meta_image_id
      else payload.meta_image_id = null

      if (isEditing && category) {
        await updateCategory({ id: category._id || category.id, data: payload }).unwrap()
        toast.success(t('category_updated_successfully'))
      } else {
        await createCategory(payload).unwrap()
        toast.success(t('category_created_successfully'))
        resetForm()
        setImagePreview(null)
        setMetaImagePreview(null)
      }
      onSuccess()
    } catch (error: any) {
      toast.error(error?.data?.message || t('something_went_wrong'))
    }
  }

  return (
    <div className="glass-card dark:bg-white/3 bg-white border border-glass-border rounded-border-radius sm:p-6 p-4">
      <h3 className="font-bold text-lg mb-6 ">
        {isEditing ? t('edit_category') : t('add_category')}
      </h3>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue, values, handleReset }) => (
          <Form className="space-y-6">
            <TextInput
              name="name"
              label={t('name')}
              placeholder={t('enter_category_name')}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.value
                setFieldValue('name', val)
                if (!isEditing) {
                  setFieldValue('slug', val.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''))
                }
              }}
            />

            <TextInput
              name="slug"
              label={t('slug')}
              placeholder={t('enter_category_slug')}
            />

            <TextAreaField
              name="description"
              label={t('description')}
              placeholder={t('enter_category_description')}
            />

            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground/80 mb-2!">{t('parent_category')}</Label>
              <Select
                value={values.parent_id || 'none'}
                onValueChange={(val) => setFieldValue('parent_id', val === 'none' ? '' : val)}
              >
                <SelectTrigger className="h-11 bg-white/3 border-glass-border">
                  <SelectValue placeholder={t('select_parent')} />
                </SelectTrigger>
                <SelectContent className="max-h-60 bg-white dark:bg-black border-glass-border">
                  <SelectItem value="none">{t('none')}</SelectItem>
                  {availableCategories.map((c: any) => (
                    <SelectItem key={c._id || c.id} value={c._id || c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-foreground/80">{t('cover_image')}</span>
              {!values.image_id ? (
                <div
                  onClick={() => { setMediaTarget('image'); setIsMediaPickerOpen(true); }}
                  className="h-24 rounded-xl border border-dashed border-glass-border bg-white/3 flex items-center justify-center gap-2 cursor-pointer hover:border-primary/50 text-muted-foreground hover:text-primary transition-all text-sm"
                >
                  <ImageIcon className="w-5 h-5" />
                  {t('select_image')}
                </div>
              ) : (
                <div className="relative h-24 rounded-border-radius border border-glass-border overflow-hidden group">
                  {imagePreview && (
                    <Image width={500} height={500} unoptimized src={process.env.NEXT_PUBLIC_STORAGE_URL + "/" + imagePreview} alt="Cover" className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="h-8 rounded-lg text-xs"
                      onClick={() => { setFieldValue('image_id', ''); setImagePreview(null); }}
                    >
                      <X className="w-3 h-3 mr-1" /> {t('remove')}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-glass-border space-y-4">
              <h4 className="font-semibold text-sm text-primary">{t('seo_meta_data')}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <TextInput
                  name="meta_title"
                  label={t('meta_title')}
                  placeholder={t('enter_meta_title')}
                />
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-foreground/80">{t('meta_image')}</span>
                  {!values.meta_image_id ? (
                    <div
                      onClick={() => { setMediaTarget('meta_image'); setIsMediaPickerOpen(true); }}
                      className="h-11 rounded-xl border border-dashed border-glass-border bg-white/3 flex items-center justify-center gap-2 cursor-pointer hover:border-primary/50 text-muted-foreground hover:text-primary transition-all text-sm"
                    >
                      <ImageIcon className="w-4 h-4" />
                      {t('select_meta_image')}
                    </div>
                  ) : (
                    <div className="relative h-20 rounded-border-radius border border-glass-border overflow-hidden group">
                      {metaImagePreview && (
                        <Image width={500} height={500} unoptimized src={process.env.NEXT_PUBLIC_STORAGE_URL + "/" + metaImagePreview} alt="Meta Image" className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="h-8 rounded-lg text-xs"
                          onClick={() => { setFieldValue('meta_image_id', ''); setMetaImagePreview(null); }}
                        >
                          <X className=" mr-1" /> {t('remove')}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <TextAreaField
                name="meta_description"
                label={t('meta_description')}
                placeholder={t('enter_meta_description')}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">{t('status')}</span>
              <Switch
                checked={values.status}
                onCheckedChange={(checked) => setFieldValue('status', checked)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  className=" h-12 leading-1 dark:bg-white/3 bg-black/3  border border-glass-border hover:bg-destructive"
                  onClick={() => {
                    handleReset()
                    if (onCancel) onCancel();
                  }}
                >
                  {t('cancel')}
                </Button>
              )}
              <Button className=" primary-btn h-12 text-white! text-base" type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEditing ? t('update_category') : t('add_category')}
              </Button>
            </div>

            <MediaPickerModal
              isOpen={isMediaPickerOpen}
              onClose={() => setIsMediaPickerOpen(false)}
              onSelect={(attachment) => {
                const singleAttachment = Array.isArray(attachment) ? attachment[0] : attachment
                if (!singleAttachment) return
                const id = singleAttachment._id || singleAttachment.id
                setFieldValue(mediaTarget === 'image' ? 'image_id' : 'meta_image_id', id)
                if (mediaTarget === 'image') setImagePreview(singleAttachment.file_path)
                if (mediaTarget === 'meta_image') setMetaImagePreview(singleAttachment.file_path)
              }}
              type="image"
            />
          </Form>
        )}
      </Formik>
    </div>
  )
}
