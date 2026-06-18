'use client'

import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useUpdateAdminSettingsMutation } from '@/redux/api/adminSettingApi'
import { SocialConfigFormProps } from '@/types/socialMedia'
import { getSocialConfigSchema } from '@/utils/validation-schemas/socialMedia'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { Facebook, Info, Linkedin, Loader2, Settings2 } from 'lucide-react'
import { XIcon as Twitter } from '@/components/ui/XIcon'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import * as Yup from 'yup'

const ConfigCard = ({ title, icon: Icon, children, color }: any) => (
  <div className=" rounded-border-radius border border-glass-border overflow-hidden bg-black/2 dark:bg-white/3 transition-all duration-500 group">
    <div className="sm:p-6 p-4 border-b border-glass-border flex items-center gap-4">
      <div className={cn(
        "w-11 h-11 rounded-full flex items-center justify-center border transition-transform duration-500 shrink-0",
        color === 'meta' ? "bg-facebook/10 border-facebook/20 text-facebook" :
          color === 'linkedin' ? "bg-linkedin/10 border-linkedin/20 text-linkedin" :
            color === 'twitter' ? "bg-twitter/10 border-twitter/20 text-twitter" :
              "bg-primary/10 border-primary/20 text-primary"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-xl font-semibold text-title-color dark:text-white">{title}</h3>
    </div>
    <div className="sm:p-6 p-4 space-y-6">
      {children}
    </div>
  </div>
)

const SocialConfigForm = ({ initialValues, onSuccess }: SocialConfigFormProps) => {
  const { t } = useTranslation()

  const SocialConfigSchema = getSocialConfigSchema(t)
  const [updateSettings, { isLoading }] = useUpdateAdminSettingsMutation()



  const handleSubmit = async (values: any) => {
    try {
      await updateSettings(values).unwrap()
      toast.success(t('settings_updated_successfully'))
      if (onSuccess) onSuccess()
    } catch (error: any) {
      toast.error(error.data?.message || t('failed_to_update_settings'))
    }
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <Formik
        initialValues={{
          facebook_app_id: initialValues?.facebook_app_id || '',
          facebook_app_secret: initialValues?.facebook_app_secret || '',
          facebook_api_version: initialValues?.facebook_api_version || 'v19.0',
          linkedin_client_id: initialValues?.linkedin_client_id || '',
          linkedin_client_secret: initialValues?.linkedin_client_secret || '',
          twitter_consumer_key: initialValues?.twitter_consumer_key || '',
          twitter_consumer_secret: initialValues?.twitter_consumer_secret || '',
          twitter_oauth_token: initialValues?.twitter_oauth_token || '',
          twitter_oauth_token_secret: initialValues?.twitter_oauth_token_secret || '',
          twitter_client_id: initialValues?.twitter_client_id || '',
          twitter_client_secret: initialValues?.twitter_client_secret || '',
        }}
        validationSchema={SocialConfigSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, dirty }) => (
          <Form className="space-y-8">
            <div className="rounded-border-radius border border-glass-border overflow-hidden bg-white dark:bg-white/3 p-4 sm:p-6">
              <div className='sm:pb-6 pb-4'>
                <div className="flex items-start gap-2">
                  <div className="w-10 h-10 rounded-full  flex items-center justify-center text-primary shrink-0">
                    <Settings2 className="w-5 h-5" />
                  </div>

                  <div>
                    <h2 className="tracking-normal text-xl font-medium text-title-color dark:text-white">
                      {t('social_integration_settings', {
                        defaultValue: 'Social Integration Settings'
                      })}
                    </h2>

                    <p className="text-sm font-medium text-subtitle-color tracking line-clamp-2">
                      {t('social_integration_settings_desc', {
                        defaultValue:
                          'Configure global social media API credentials for Facebook, LinkedIn, and Twitter/X. These will be used by all users to connect their social channels.'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Meta & LinkedIn */}
                <div className="space-y-8">
                  {/* Meta Section */}
                  <ConfigCard title="Facebook / Instagram (Meta)" icon={Facebook} color="meta">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2 flex flex-col">
                        <Label className="text-sm font-semibold text-subtitle-color">{t('meta_app_id')}</Label>
                        <Field name="facebook_app_id">
                          {({ field }: any) => (
                            <Input {...field} type="text" className="bg-muted/10 border-glass-border focus:border-primary" placeholder="123456789012345" />
                          )}
                        </Field>
                        <ErrorMessage name="facebook_app_id" component="div" className="text-[10px] font-bold text-destructive ml-1" />
                      </div>
                      <div className="space-y-2 flex flex-col">
                        <Label className="text-sm font-semibold text-subtitle-color">{t('meta_app_secret')}</Label>
                        <Field name="facebook_app_secret">
                          {({ field }: any) => (
                            <Input {...field} type="password" autoSave='off' className="bg-muted/10 border-glass-border focus:border-primary" placeholder="••••••••••••••••••••••••••••••••" />
                          )}
                        </Field>
                        <ErrorMessage name="facebook_app_secret" component="div" className="text-[10px] font-bold text-destructive ml-1" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-sm font-semibold text-subtitle-color ml-1">{t('meta_api_version')}</Label>
                        <Field name="facebook_api_version">
                          {({ field }: any) => (
                            <Input {...field} type="text" className="bg-muted/10 border-glass-border focus:border-primary max-w-xs" placeholder="v19.0" />
                          )}
                        </Field>
                        <ErrorMessage name="facebook_api_version" component="div" className="text-[10px] font-bold text-destructive ml-1" />
                      </div>
                    </div>
                  </ConfigCard>

                  {/* LinkedIn Section */}
                  <ConfigCard title="LinkedIn" icon={Linkedin} color="linkedin">
                    <div className="space-y-6">
                      <div className="space-y-2 flex flex-col">
                        <Label className="text-sm font-semibold text-subtitle-color">{t('linkedin_client_id')}</Label>
                        <Field name="linkedin_client_id">
                          {({ field }: any) => (
                            <Input {...field} type="text" className="bg-muted/10 border-glass-border focus:border-primary" placeholder="linkedin_client_id" />
                          )}
                        </Field>
                      </div>
                      <div className="space-y-2 flex flex-col">
                        <Label className="text-sm font-semibold text-subtitle-color">{t('linkedin_client_secret')}</Label>
                        <Field name="linkedin_client_secret">
                          {({ field }: any) => (
                            <Input {...field} type="password" autoSave='off' className="bg-muted/10 border-glass-border focus:border-primary" placeholder="••••••••••••••••" />
                          )}
                        </Field>
                      </div>
                    </div>
                  </ConfigCard>
                </div>

                {/* Right Column: Twitter / X */}
                <div className="space-y-8">
                  {/* Twitter Section */}
                  <ConfigCard title="Twitter / X" icon={Twitter} color="twitter">
                    <div className="space-y-6">
                      {/* OAuth 2.0 */}
                      <div className="sm:p-5 p-4 rounded-border-radius  border border-primary/10">
                        <p className="text-sm tracking-normal font-semibold text-primary mb-4">{t('oauth2_required')}</p>
                        <div className="space-y-4">
                          <div className="space-y-2 flex flex-col">
                            <Label className="text-sm font-bold text-subtitle-color ">{t('twitter_client_id')}</Label>
                            <Field name="twitter_client_id">
                              {({ field }: any) => (
                                <Input {...field} type="text" className="bg-white/10 border-glass-border focus:border-primary" placeholder="U1U2Zks..." />
                              )}
                            </Field>
                          </div>
                          <div className="space-y-2 flex flex-col">
                            <Label className="text-sm font-semibold text-subtitle-color">{t('twitter_client_secret')}</Label>
                            <Field name="twitter_client_secret">
                              {({ field }: any) => (
                                <Input {...field} type="password" autoSave='off' className="bg-muted/10 border-glass-border focus:border-primary" placeholder="••••••••" />
                              )}
                            </Field>
                          </div>
                        </div>
                      </div>

                      {/* OAuth 1.0a */}
                      <div className="sm:p-5 p-4 rounded-border-radius border border-glass-border">
                        <p className="text-sm  font-black text-primary mb-4">{t('oauth1_required')}</p>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2 flex flex-col">
                              <Label className="text-sm font-bold text-subtitle-color">{t('twitter_consumer_key')}</Label>
                              <Field name="twitter_consumer_key">
                                {({ field }: any) => (
                                  <Input {...field} type="text" className="bg-muted/10 border-glass-border focus:border-primary text-xs" placeholder="api_key" />
                                )}
                              </Field>
                            </div>
                            <div className="space-y-2 flex flex-col">
                              <Label className="text-sm font-bold text-subtitle-color">{t('twitter_consumer_secret')}</Label>
                              <Field name="twitter_consumer_secret">
                                {({ field }: any) => (
                                  <Input {...field} type="password" autoSave='off' className="bg-muted/10 border-glass-border focus:border-primary text-xs" placeholder="••••••••" />
                                )}
                              </Field>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2 flex flex-col">
                              <Label className="text-sm font-bold text-subtitle-color">{t('twitter_access_token')}</Label>
                              <Field name="twitter_oauth_token">
                                {({ field }: any) => (
                                  <Input {...field} type="text" className="bg-muted/10 border-glass-border focus:border-primary text-xs" placeholder="access_token" />
                                )}
                              </Field>
                            </div>
                            <div className="space-y-2 flex flex-col">
                              <Label className="text-sm font-bold text-subtitle-color">{t('twitter_access_token_secret')}</Label>
                              <Field name="twitter_oauth_token_secret">
                                {({ field }: any) => (
                                  <Input {...field} type="password" autoSave='off' className="bg-muted/10 border-glass-border focus:border-primary text-xs" placeholder="••••••••" />
                                )}
                              </Field>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ConfigCard>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex flex-col md:flex-row items-center gap-6 sm:pt-6 pt-4">
                <div className="flex-1 flex items-start gap-3 sm:p-6 p-4 rounded-border-radius bg-primary/5 border border-primary/10">
                  <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-primary leading-relaxed font-medium">
                    {t('social_security_desc')}
                  </p>
                </div>

                <div className="w-full md:w-auto min-w-[240px]">
                  <Button
                    type="submit"
                    disabled={isLoading || isSubmitting || !dirty}
                    className="w-full primary-btn text-white! text-sm hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 h-12"
                  >
                    {(isLoading || isSubmitting) ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Settings2 className="w-4 h-4" />
                        {t('save_config')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SocialConfigForm
