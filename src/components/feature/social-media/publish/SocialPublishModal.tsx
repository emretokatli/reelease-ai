'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textArea'
import { cn } from '@/lib/utils'
import { useGetSocialAccountsQuery } from '@/redux/api/socialApi'
import { usePublishContentMutation } from '@/redux/api/socialPublishApi'
import { AlertCircle, Facebook, Info, Instagram, Loader2, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import Label from '@/components/ui/label'
import { ROUTES } from '@/constants/routes'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { SocialPublishModalProps } from '@/types/socialMedia'

const SocialPublishModal = ({ isOpen, onClose, attachment, contentType }: SocialPublishModalProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [caption, setCaption] = useState('')
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([])
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([contentType])

  const { data: accountsData, isLoading: isLoadingAccounts } = useGetSocialAccountsQuery(undefined)
  const [publishContent, { isLoading: isPublishing }] = usePublishContentMutation()

  const accounts = accountsData?.data || []

  // Reset state when modal opens or attachment changes
  useEffect(() => {
    if (isOpen) {
      setSelectedContentTypes([contentType])
      setSelectedAccountIds([])
      setCaption('')
    }
  }, [isOpen, attachment, contentType])

  const toggleAccount = (id: string) => {
    setSelectedAccountIds(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const toggleContentType = (type: string) => {
    setSelectedContentTypes(prev =>
      prev.includes(type)
        ? (prev.length > 1 ? prev.filter(t => t !== type) : prev)
        : [...prev, type]
    )
  }

  const handlePublish = async () => {
    if (selectedAccountIds.length === 0) {
      toast.error(t('select_at_least_one_account'))
      return
    }

    try {
      await publishContent({
        accountIds: selectedAccountIds,
        attachmentIds: [attachment.id || attachment._id],
        caption,
        contentTypes: selectedContentTypes
      }).unwrap()

      toast.success(t('publishing_started'))
      onClose()
      setCaption('')
      setSelectedAccountIds([])

      // Redirect to Social Activity history
      router.push(ROUTES.SOCIAL_MEDIA.ACTIVITY)
    } catch (error: any) {
      toast.error(error.data?.message || t('failed_to_publish'))
    }
  }

  const fileUrl = attachment?.file_path?.startsWith('http')
    ? attachment.file_path
    : `/api/${attachment?.file_path?.replace(/^\//, '')}`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl! max-w-[calc(100%-2rem)]! w-full rounded-border-radius! glass-card border-glass-border overflow-hidden p-0">
        <div className="flex h-full max-h-[90vh] md:min-h-125 flex-col md:flex-row">
          {/* Left Side: Preview */}
          <div className="w-full md:w-5/12 flex flex-col items-center justify-center ">
            <div className="w-full max-w-[300px] md:max-w-none mx-auto aspect-4/5 relative rounded-xl overflow-hidden shadow-2xl group">
              {attachment?.mime_type?.startsWith('video/') ? (
                <video src={fileUrl} className="w-full h-full object-cover" controls />
              ) : (
                <Image src={fileUrl} alt="Preview" width={400} height={500} unoptimized className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                <div className="flex flex-wrap gap-1 mb-1">
                  {selectedContentTypes.map(type => (
                    <span key={type} className="text-xs  text-white/80 bg-primary/20 backdrop-blur-md border bg-white/10 border-white/10 px-3 py-0.5 rounded">
                      {t(type, { defaultValue: type.charAt(0).toUpperCase() + type.slice(1) })}
                    </span>
                  ))}
                </div>
                <p className="text-white text-xs line-clamp-2 italic opacity-90 font-medium">
                  {caption || t('no_caption_yet')}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-end w-full gap-2 text-base text-muted-foreground">
              <Info className="w-3 h-3 text-primary shrink-0" />
              <span className='text-right'>{t('preview_not_exact')}</span>
            </div>
          </div>

          {/* Right Side: Configuration */}
          <div className="w-full md:w-7/12 flex flex-col overflow-hidden sm:pl-6 pl-4">
            <DialogHeader className="mb-4 md:mb-6 text-left">
              <div className="flex items-center gap-3 mb-1">
                <div>
                  <DialogTitle className="text-lg md:text-xl font-bold">{t('share_media', { defaultValue: 'Share Media' })}</DialogTitle>
                  <DialogDescription className="text-xs md:text-sm font-medium text-muted-foreground mt-1">
                    {t('publishing_as', { defaultValue: 'Publishing as' })} {selectedContentTypes.map(type => t(type, { defaultValue: type.charAt(0).toUpperCase() + type.slice(1) })).join(', ')}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="flex-1 space-y-5 md:space-y-6 overflow-y-auto pr-1 md:pr-2 no-scrollbar">
              {/* Content Type Selection */}
              <div className="space-y-3">
                <Label className="text-xs md:text-sm font-bold text-foreground/80 dark:text-white/80 flex items-center justify-between">
                  {t('publish_as', { defaultValue: 'Publish as' })}
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 font-medium">
                    {selectedContentTypes.length} {t('types', { defaultValue: 'Types' })}
                  </span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {['post', 'story', 'reel'].map((type) => (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      onClick={() => toggleContentType(type)}
                      className={cn(
                        "rounded-xl h-8 px-4 text-xs font-bold transition-all flex-1 md:flex-none",
                        selectedContentTypes.includes(type)
                          ? "primary-btn text-white"
                          : "border-glass-border dark:bg-white/3 text-muted-foreground hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/10"
                      )}
                    >
                      {t(type, { defaultValue: type.charAt(0).toUpperCase() + type.slice(1) })}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Account Selection */}
              <div className="space-y-3">
                <Label className="text-xs md:text-sm font-bold text-foreground/80 dark:text-white/80 flex items-center justify-between">
                  {t('select_accounts')}
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20 font-medium">
                    {selectedAccountIds.length} {t('selected')}
                  </span>
                </Label>

                {isLoadingAccounts ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : accounts.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 text-amber-400 text-xs flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{t('no_accounts_connected_desc')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {accounts.map((account: any) => (
                      <div
                        key={account.id}
                        onClick={() => toggleAccount(account.id)}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer group",
                          selectedAccountIds.includes(account.id)
                            ? "primary-btn text-white"
                            : "dark:bg-white/5 border-border/30 dark:border-white/5 hover:bg-foreground/10 dark:hover:bg-white/10"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="w-9 h-9 md:w-10 md:h-10 border border-border/30 dark:border-white/10">
                              <AvatarImage src={account.profile_picture} />
                              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                                {account.account_name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className={cn(
                              "absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border-2 border-background shadow-lg",
                              account.platform === 'facebook' ? "bg-facebook" : "bg-gradient-to-tr from-[#FFB700] via-[#FF006B] to-[#AD00FF]"
                            )}>
                              {account.platform === 'facebook' ? (
                                <Facebook className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                              ) : (
                                <Instagram className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">{account.account_name}</span>
                            <span className="text-[9px] md:text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                              {account.platform}
                            </span>
                          </div>
                        </div>
                        <Checkbox
                          checked={selectedAccountIds.includes(account.id)}
                          onCheckedChange={() => toggleAccount(account.id)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Caption */}
              <div className="space-y-3 flex flex-col">
                <Label className="text-xs md:text-sm font-bold text-foreground/80 dark:text-white">{t('caption')}</Label>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder={t('write_a_caption')}
                  className="min-h-24 md:min-h-30 border-glass-border dark:bg-white/3 rounded-border-radius resize-none focus:ring-primary/20 text-sm"
                />
              </div>
            </div>

            <DialogFooter className="mt-6 md:mt-8 gap-2 md:gap-3 flex-col sm:flex-row">
              <Button
                variant="ghost"
                onClick={onClose}
                className="rounded-radius bg-foreground/5 dark:bg-white/3 hover:bg-destructive! hover:text-white w-full border border-border/30 dark:border-white/5 h-11 md:h-12 text-sm order-2 sm:order-1"
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isPublishing || selectedAccountIds.length === 0}
                className="rounded-radius primary-btn w-full text-white! font-bold h-11 md:h-12 text-sm order-1 sm:order-2"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t('publishing')}...
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 mr-2" />
                    {t('post_now')}
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SocialPublishModal
