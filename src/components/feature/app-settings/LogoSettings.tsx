'use client'

import Spinner from '@/components/reusable/Spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetAdminSettingsQuery, useUpdateAdminSettingsMutation } from '@/redux/api/adminSettingApi'
import { Loader2, Save, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import ImageUploadItem from './components/ImageUploadItem'
import { ApiError } from '@/types'

const LogoSettings = () => {
  const { t } = useTranslation()
  const { data: settingsData, isLoading: isFetching } = useGetAdminSettingsQuery(undefined)
  const [updateSettings, { isLoading: isUpdating }] = useUpdateAdminSettingsMutation()

  const [files, setFiles] = useState<Record<string, File | 'null' | null>>({})
  const [saveVersion, setSaveVersion] = useState(0)

  const handleFileSelect = (key: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }))
  }

  const handleRemove = (key: string) => {
    setFiles((prev) => ({ ...prev, [key]: 'null' }))
  }

  const onSubmit = async () => {
    try {
      const formData = new FormData()

      Object.entries(files).forEach(([key, value]) => {
        if (value === 'null') {
          formData.append(key, 'null')
        } else if (value instanceof File) {
          formData.append(key, value)
        }
      })

      if (Array.from(formData.entries()).length === 0) {
        toast.info(t('no_changes_to_save', { defaultValue: 'No changes to save' }))
        return
      }

      const res = await updateSettings(formData).unwrap()
      
      toast.success(
        res.message || t('logos_updated_successfully', { defaultValue: 'Logo settings updated successfully' }),
      )
      setFiles({})
      setSaveVersion((v) => v + 1)
    } catch (error) {
      const apiError = error as ApiError
      toast.error(apiError?.data?.message || t('failed_to_update_logos'))
    }
  }

  if (isFetching) {
    return <Spinner className="h-auto py-20" size="md" />
  }

  const settings = settingsData?.settings || {}
  

  const logoItems = [
    {
      key: 'favicon',
      label: 'Favicon',
      description: 'Address bar icon (multi-size .ico or .png)',
      url: settings.favicon_url,
    },
    {
      key: 'logo_dark',
      label: 'Dark Logo',
      description: 'Main logo for dark mode backgrounds',
      url: settings.logo_dark_url,
    },
    {
      key: 'logo_light',
      label: 'Light Logo',
      description: 'Main logo for light mode backgrounds',
      url: settings.logo_light_url,
    },
    {
      key: 'sidebar_logo',
      label: 'Sidebar Dark Logo',
      description: 'Small logo used in condensed sidebar for dark mode',
      url: settings.sidebar_logo_url,
    },
    {
      key: 'sidebar_light_logo',
      label: 'Sidebar Light Logo',
      description: 'Small logo used in condensed sidebar for light mode',
      url: settings.sidebar_light_logo_url,
    }
  ]

  const hasChanges = Object.keys(files).length > 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <Card className="border-glass-border glass-dark-card rounded-border-radius overflow-hidden bg-white dark:bg-white/3">
        <CardHeader className="sm:p-6 p-4 pb-4">
          <div className='space-y-1 group flex gap-2 items-start'>
            <div className='p-1.5 rounded-lg bg-primary-light-blue'>
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div>
                <CardTitle className="text-xl font-medium text-title-color dark:text-white">
                  {t('logo_branding', { defaultValue: 'Visual Identity' })}
                </CardTitle>
              </div>
              <CardDescription className="text-sm font-medium text-subtitle-color">
                {t('manage_logos_desc', {
                  defaultValue: 'Customize your brands appearance across all platforms and themes',
                })}
              </CardDescription>
            </div>

          </div>
        </CardHeader>
        <CardContent className="sm:p-6 p-4 pt-0!">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
            {logoItems.map((item) => (
              <ImageUploadItem
                key={`${item.key}-${saveVersion}`}
                label={item.label}
                description={item.description}
                currentUrl={files[item.key] === 'null' ? null : files[item.key] instanceof File ? null : item.url}
                onFileSelect={(file) => handleFileSelect(item.key, file)}
                onRemove={() => handleRemove(item.key)}
                isUploading={isUpdating}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4 pb-10">
        <Button
          onClick={onSubmit}
          disabled={isUpdating || !hasChanges}
          variant="premium"
          className="sm:h-12 h-10  font-medium text-base text-white! primary-btn shadow-none"
        >
          <div className="absolute inset-0" />
          {isUpdating ? (
            <>
              <Loader2 className="w-5 h-5" />
              {t('updating_brand')}
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {t('save_settings')}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default LogoSettings
