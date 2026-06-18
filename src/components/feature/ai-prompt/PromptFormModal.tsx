'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { Textarea } from '@/components/ui/textArea'
import { useGetPromptCategoriesQuery } from '@/redux/api/aiPromptApi'
import { PromptFormModalProps } from '@/types/components/ai-prompts'
import { Form, Formik } from 'formik'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'

const PromptFormModal = ({ isOpen, onClose, onSave, prompt, isLoading }: PromptFormModalProps) => {
  const { t } = useTranslation()
  const { data: categorySuggestions = [] } = useGetPromptCategoriesQuery()

  const validationSchema = Yup.object({
    category: Yup.string().required(t('category_is_required', { defaultValue: 'Category is required' })),
    prompt: Yup.string().required(t('prompt_is_required', { defaultValue: 'Prompt is required' })),
  })

  const handleSubmit = async (values: { category: string; prompt: string }) => {
    await onSave({ category: values.category.trim(), prompt: values.prompt.trim() })
  }

  const isEditing = !!prompt

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg! max-w-[calc(100%-2rem)]! bg-light-body dark:bg-modal-bg-color rounded-border-radius overflow-auto">
        <div className="pb-3 border-b border-border/50">
          <DialogTitle className="text-lg font-bold text-foreground">
            {isEditing
              ? t('edit_prompt', { defaultValue: 'Edit Prompt' })
              : t('add_prompt', { defaultValue: 'Add Prompt' })}
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-0.5 text-start rtl:text-end">
            {isEditing
              ? t('update_prompt_desc', { defaultValue: 'Update the category and content of this prompt.' })
              : t('create_prompt_desc', { defaultValue: 'Add a reusable AI prompt to your library.' })}
          </p>
        </div>

        <Formik
          initialValues={{
            category: prompt?.category || '',
            prompt: prompt?.prompt || '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, setFieldValue, dirty }) => (
            <Form className="space-y-5">
              {/* Category */}
              <div className="space-y-2 flex flex-col">
                <Label className="text-sm font-semibold text-foreground text-start rtl:text-end">
                  {t('category')} <span className="text-destructive">*</span>
                </Label>
                <Input
                  name="category"
                  value={values.category}
                  onChange={(e) => setFieldValue('category', e.target.value)}
                  placeholder={t('enter_category', { defaultValue: 'e.g. Marketing, SEO, Blog...' })}
                  className={errors.category && touched.category ? 'border-destructive' : ''}
                />
                {/* Quick-select chips */}
                {categorySuggestions.categories?.length > 0 && (
                  <div className="flex flex-wrap rtl:flex-row-reverse gap-1.5 pt-1">
                    {categorySuggestions?.categories?.map((c: any) => (
                      <Button
                        key={c._id || c.name || c}
                        type="button"
                        onClick={() => setFieldValue('category', c.name || c)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all ${values.category === (c.name || c)
                          ? 'bg-primary text-primary border-primary dark:text-primary'
                          : 'border-border text-muted-foreground dark:text-white/50 dark:border-white/20  hover:border-primary/50 hover:text-foreground'
                          }`}
                      >
                        {c.name || c}
                      </Button>
                    ))}
                  </div>
                )}
                {errors.category && touched.category && <p className="text-xs text-destructive">{errors.category}</p>}
              </div>

              {/* Prompt */}
              <div className="space-y-2 flex flex-col">
                <Label className="text-sm font-semibold text-foreground text-start rtl:text-end">
                  {t('prompt', { defaultValue: 'Prompt' })} <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  name="prompt"
                  value={values.prompt}
                  onChange={(e: any) => setFieldValue('prompt', e.target.value)}
                  placeholder={t('enter_prompt_placeholder', { defaultValue: 'Write a detailed AI prompt...' })}
                  rows={5}
                  className={`resize-none ${errors.prompt && touched.prompt ? 'border-destructive' : ''}`}
                />
                <div className="flex justify-between items-center">
                  {errors.prompt && touched.prompt ? (
                    <p className="text-xs text-destructive">{errors.prompt}</p>
                  ) : (
                    <span />
                  )}
                  <span className="text-xs text-muted-foreground">{values.prompt.length} char</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex rtl:flex-row-reverse gap-3 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 rounded-full font-bold!   sm:h-12 h-10 text-base dark:bg-white/3 bg-black/3 hover:bg-destructive! hover:text-white! "
                  disabled={isLoading}
                >
                  {t('cancel')}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 sm:h-12 h-10 primary-btn text-white! text-base"
                  disabled={isLoading || (isEditing && !dirty)}
                >
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isEditing ? t('update', { defaultValue: 'Update' }) : t('create')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default PromptFormModal
