'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { RefreshCw, CheckCircle2, Loader2, ShieldCheck, ShieldAlert, TextInitial, Menu, Settings2, ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import MediaPickerModal from '@/components/feature/media-library/MediaPickerModal'
import { Attachment } from '@/types'
import { watermarkDefaults } from '@/data/watermark'
import { WatermarkPreview } from './WatermarkPreview'
import { WatermarkLeftPanel } from './WatermarkLeftPanel'
import { WatermarkRightPanel } from './WatermarkRightPanel'
import { useGetUserSettingsQuery, useUpdateUserSettingsMutation } from '@/redux/api/userSettingsApi'
import { useGetAdminSettingsQuery, useUpdateAdminSettingsMutation } from '@/redux/api/adminSettingApi'
import { useAppSelector } from '@/redux/hooks'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import Spinner from '@/components/reusable/Spinner'
import Label from '@/components/ui/label'
import { PageHeader } from '@/components/reusable/PageHeader'
import { watermarkBlendMode, watermarkPosition } from '@/types/components/features'

export const WatermarkView = () => {
  const { t } = useTranslation()

  const user = useAppSelector((s) => s.auth.user)
  const isSuperAdmin = useMemo(() => {
    const roleName = typeof user?.role === 'object' && user?.role ? (user.role as any).name : user?.role
    const roleIdName = typeof user?.roleId === 'object' && user?.roleId ? (user.roleId as any).name : user?.roleId
    return roleName === 'super_admin' || roleIdName === 'super_admin'
  }, [user])

  const { data: userSettingsData, isLoading: isFetchingUser } = useGetUserSettingsQuery({}, { skip: isSuperAdmin })
  const [updateUserSettings, { isLoading: isUpdatingUser }] = useUpdateUserSettingsMutation()

  const { data: adminSettingsData, isLoading: isFetchingAdmin } = useGetAdminSettingsQuery({}, { skip: !isSuperAdmin })
  const [updateAdminSettings, { isLoading: isUpdatingAdmin }] = useUpdateAdminSettingsMutation()

  const settingsData = isSuperAdmin ? adminSettingsData?.settings : userSettingsData?.userSettings
  const isFetching = isSuperAdmin ? isFetchingAdmin : isFetchingUser
  const isUpdating = isSuperAdmin ? isUpdatingAdmin : isUpdatingUser

  const [enabled, setEnabled] = useState<boolean>(false)
  const [watermarkType, setWatermarkType] = useState<'image' | 'text'>(watermarkDefaults.type)
  const [position, setPosition] = useState<watermarkPosition>(watermarkDefaults.position)
  const [scale, setScale] = useState<number[]>([...watermarkDefaults.scale])
  const [opacity, setOpacity] = useState<number[]>([...watermarkDefaults.opacity])
  const [rotation, setRotation] = useState<number[]>([...watermarkDefaults.rotation])
  const [padding, setPadding] = useState<number[]>([...watermarkDefaults.padding])
  const [blendMode, setBlendMode] = useState<watermarkBlendMode>(watermarkDefaults.blendMode)
  const [tiling, setTiling] = useState<boolean>(watermarkDefaults.tiling)
  const [text, setText] = useState<string>(watermarkDefaults.text)
  const [textStyle, setTextStyle] = useState<string>(watermarkDefaults.textStyle)
  const [fontWeight, setFontWeight] = useState<string>(watermarkDefaults.fontWeight)
  const [textColor, setTextColor] = useState<string>(watermarkDefaults.textColor)
  const [fontFamily, setFontFamily] = useState<string>(watermarkDefaults.fontFamily)
  const [isItalic, setIsItalic] = useState<boolean>(watermarkDefaults.isItalic)
  const [isUnderline, setIsUnderline] = useState<boolean>(watermarkDefaults.isUnderline)
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [mobileLeftOpen, setMobileLeftOpen] = useState(false)
  const [mobileRightOpen, setMobileRightOpen] = useState(false)

  useEffect(() => {
    if (settingsData) {
      const s = settingsData
      setTimeout(() => {
        setEnabled(s.watermark_enabled ?? false)
        setWatermarkType(s.watermark_type === 'image' || s.watermark_type === 'text' ? s.watermark_type : watermarkDefaults.type)
        setPosition((s.watermark_position as watermarkPosition) || watermarkDefaults.position)
        setScale([s.watermark_scale ?? watermarkDefaults.scale[0]])
        setOpacity([s.watermark_opacity ?? watermarkDefaults.opacity[0]])
        setRotation([s.watermark_rotation ?? watermarkDefaults.rotation[0]])
        setPadding([s.watermark_padding ?? watermarkDefaults.padding[0]])
        setBlendMode((s.watermark_blend_mode as watermarkBlendMode) || watermarkDefaults.blendMode)
        setTiling(s.watermark_tiling ?? watermarkDefaults.tiling)

        setText(s.watermark_text || watermarkDefaults.text)
        setTextStyle((s.watermark_style || watermarkDefaults.textStyle).toLowerCase())
        setFontWeight((s.watermark_font_weight || watermarkDefaults.fontWeight).toLowerCase())
        setTextColor((s.watermark_color || watermarkDefaults.textColor).toLowerCase())
        setFontFamily((s.watermark_font || watermarkDefaults.fontFamily).toLowerCase())
        setIsItalic(s.watermark_italic ?? watermarkDefaults.isItalic)
        setIsUnderline(s.watermark_underline ?? watermarkDefaults.isUnderline)
        setSelectedImage(s.watermark_image_url || null)
      }, 0)
    }
  }, [settingsData])

  const handleMediaSelect = (attachment: Attachment | Attachment[]) => {
    const selectedAttachment = Array.isArray(attachment) ? attachment[0] : attachment
    setSelectedImage(selectedAttachment?.file_path ?? null)
  }

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedImage(null)
  }

  const handleReset = () => {
    setEnabled(false)
    setWatermarkType(watermarkDefaults.type)
    setPosition(watermarkDefaults.position)
    setScale([...watermarkDefaults.scale])
    setOpacity([...watermarkDefaults.opacity])
    setRotation([...watermarkDefaults.rotation])
    setPadding([...watermarkDefaults.padding])
    setBlendMode(watermarkDefaults.blendMode)
    setTiling(watermarkDefaults.tiling)
    setText(watermarkDefaults.text)
    setTextStyle(watermarkDefaults.textStyle)
    setFontWeight(watermarkDefaults.fontWeight)
    setTextColor(watermarkDefaults.textColor)
    setFontFamily(watermarkDefaults.fontFamily)
    setIsItalic(watermarkDefaults.isItalic)
    setIsUnderline(watermarkDefaults.isUnderline)
    setSelectedImage(null)
  }

  const buildWatermarkPayload = () => ({
    watermark_enabled: enabled,
    watermark_type: watermarkType,
    watermark_text: text,
    watermark_image_url: selectedImage,
    watermark_position: position,
    watermark_opacity: opacity[0],
    watermark_scale: scale[0],
    watermark_rotation: rotation[0],
    watermark_font: fontFamily,
    watermark_font_weight: fontWeight,
    watermark_italic: isItalic,
    watermark_underline: isUnderline,
    watermark_style: textStyle,
    watermark_color: textColor,
    watermark_blend_mode: blendMode,
    watermark_tiling: tiling,
    watermark_padding: padding[0],
  })

  const toAdminFormData = (payload: ReturnType<typeof buildWatermarkPayload>) => {
    const formData = new FormData()
    Object.entries(payload).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        if (key === 'watermark_image_url') formData.append(key, 'null')
        return
      }
      formData.append(key, String(value))
    })
    return formData
  }

  const handleSave = async () => {
    try {
      const payload = buildWatermarkPayload()

      if (isSuperAdmin) {
        await updateAdminSettings(toAdminFormData(payload)).unwrap()
      } else {
        await updateUserSettings(payload).unwrap()
      }
      toast.success(t('watermark_settings_updated', { defaultValue: 'Watermark settings updated successfully' }))
    } catch (error: unknown) {
      const errMsg = (error as { data?: { message?: string } })?.data?.message
      toast.error(errMsg || t('failed_to_update_settings'))
    }
  }

  if (isFetching) {
    return <Spinner className="h-auto py-20" size="md" />
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <PageHeader
        icon={<TextInitial className="w-6 h-6 text-primary animate-pulse" />}
        title={t('watermark', { defaultValue: 'Watermark Settings' })}
        subtitle={t('watermark_desc', {
          defaultValue:
            'Design your brand identity overlay. Apply custom text or image watermarks to protect your published media.',
        })}
        showBackButton={false}
      />

      {/* Mobile Toolbar — visible only below 1400px */}
      <div className="min-[1400px]:hidden flex items-center justify-between px-1 py-2">
        {/* Left: Menu icon → opens Left Panel */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => { setMobileLeftOpen(true); setMobileRightOpen(false) }}
          className="h-10 w-10 rounded-xl border-glass-border bg-white/5 dark:bg-white/3"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Right: Refine Overlay title → opens Right Panel */}
        <Button
          variant="outline"
          onClick={() => { setMobileRightOpen(true); setMobileLeftOpen(false) }}
          className="h-10 px-4 rounded-xl border-glass-border bg-white/5 dark:bg-white/3 gap-2 text-sm font-bold"
        >
          <Settings2 className="w-4 h-4 text-primary" />
          {t('refine_overlay', { defaultValue: 'Refine Overlay' })}
        </Button>
      </div>

      {/* 3-Column Editor Layout */}
      <div
        className={`relative grid grid-cols-1 min-[1400px]:grid-cols-12 gap-6 items-start transition-all duration-500 ${!enabled ? 'opacity-50 pointer-events-none grayscale-[0.5]' : ''}`}
      >
        {/* Mobile Left Panel Drawer */}
        {mobileLeftOpen && (
          <div className="min-[1400px]:hidden absolute inset-0 z-50 flex">
            <div className="w-full max-w-sm bg-white dark:bg-light-body backdrop-blur-xl  border border-glass-border shadow-2xl overflow-hidden flex flex-col">
              {/* Drawer Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-glass-border shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileLeftOpen(false)}
                  className="h-9 w-9 rounded-xl hover:bg-white/5"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h3 className="text-sm font-bold text-title-color dark:text-white">
                  {t('content_source', { defaultValue: 'Content Source' })}
                </h3>
              </div>
              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <WatermarkLeftPanel
                  transparent
                  watermarkType={watermarkType}
                  text={text}
                  selectedImage={selectedImage}
                  textStyle={textStyle}
                  fontWeight={fontWeight}
                  textColor={textColor}
                  fontFamily={fontFamily}
                  isItalic={isItalic}
                  isUnderline={isUnderline}
                  onTypeChange={setWatermarkType}
                  onTextChange={setText}
                  onTextStyleChange={setTextStyle}
                  onFontWeightChange={setFontWeight}
                  onItalicChange={setIsItalic}
                  onUnderlineChange={setIsUnderline}
                  onTextColorChange={setTextColor}
                  onFontFamilyChange={setFontFamily}
                  onOpenPicker={() => setIsMediaPickerOpen(true)}
                  onClearImage={handleClearImage}
                />
              </div>
            </div>
            {/* Backdrop */}
            <div
              className="flex-1 bg-black/40 backdrop-blur-sm cursor-pointer"
              onClick={() => setMobileLeftOpen(false)}
            />
          </div>
        )}

        {/* Mobile Right Panel Drawer */}
        {mobileRightOpen && (
          <div className="min-[1400px]:hidden absolute inset-0 z-50 flex flex-row-reverse">
            <div className="w-full max-w-sm bg-white dark:bg-light-body  border border-glass-border shadow-2xl overflow-hidden flex flex-col">
              {/* Drawer Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-glass-border shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileRightOpen(false)}
                  className="h-9 w-9 rounded-xl hover:bg-white/5"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h3 className="text-sm font-bold text-title-color dark:text-white">
                  {t('refine_overlay', { defaultValue: 'Refine Overlay' })}
                </h3>
              </div>
              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <WatermarkRightPanel
                  transparent
                  hideHeader
                  opacity={opacity}
                  scale={scale}
                  rotation={rotation}
                  padding={padding}
                  blendMode={blendMode}
                  tiling={tiling}
                  position={position}
                  onOpacityChange={setOpacity}
                  onScaleChange={setScale}
                  onRotationChange={setRotation}
                  onPaddingChange={setPadding}
                  onBlendModeChange={(v) => setBlendMode(v as watermarkBlendMode)}
                  onTilingChange={setTiling}
                  onPositionChange={(v) => setPosition(v as watermarkPosition)}
                />
              </div>
            </div>
            {/* Backdrop */}
            <div
              className="flex-1 bg-black/40 backdrop-blur-sm cursor-pointer"
              onClick={() => setMobileRightOpen(false)}
            />
          </div>
        )}

        {/* Left Panel: Content Source & Type — hidden on mobile */}
        <div className="hidden min-[1400px]:block min-[1400px]:col-span-3">
          <WatermarkLeftPanel
            watermarkType={watermarkType}
            text={text}
            selectedImage={selectedImage}
            textStyle={textStyle}
            fontWeight={fontWeight}
            textColor={textColor}
            fontFamily={fontFamily}
            isItalic={isItalic}
            isUnderline={isUnderline}
            onTypeChange={setWatermarkType}
            onTextChange={setText}
            onTextStyleChange={setTextStyle}
            onFontWeightChange={setFontWeight}
            onItalicChange={setIsItalic}
            onUnderlineChange={setIsUnderline}
            onTextColorChange={setTextColor}
            onFontFamilyChange={setFontFamily}
            onOpenPicker={() => setIsMediaPickerOpen(true)}
            onClearImage={handleClearImage}
          />
        </div>

        {/* Middle: Live Canvas */}
        <div className="min-[1400px]:col-span-6">
          <WatermarkPreview
            watermarkType={watermarkType}
            position={position}
            opacity={opacity}
            scale={scale}
            rotation={rotation}
            padding={padding}
            blendMode={blendMode}
            tiling={tiling}
            text={text}
            textStyle={textStyle}
            fontWeight={fontWeight}
            isItalic={isItalic}
            isUnderline={isUnderline}
            textColor={textColor}
            fontFamily={fontFamily}
            selectedImage={selectedImage}
          />
        </div>

        {/* Right Panel: Adjustments — hidden on mobile */}
        <div className="hidden min-[1400px]:block min-[1400px]:col-span-3">
          <WatermarkRightPanel
            opacity={opacity}
            scale={scale}
            rotation={rotation}
            padding={padding}
            blendMode={blendMode}
            tiling={tiling}
            position={position}
            onOpacityChange={setOpacity}
            onScaleChange={setScale}
            onRotationChange={setRotation}
            onPaddingChange={setPadding}
            onBlendModeChange={(v) => setBlendMode(v as watermarkBlendMode)}
            onTilingChange={setTiling}
            onPositionChange={(v) => setPosition(v as watermarkPosition)}
          />
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="glass-card rounded-border-radius p-4 flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 border border-glass-border">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div
            className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-500 ${enabled ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted/20 border-glass-border text-muted-foreground'}`}
          >
            {enabled ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
            <div className="flex flex-col">
              <Label htmlFor="watermark-toggle" className="text-sm font-bold cursor-pointer">
                {enabled
                  ? t('watermark_active', { defaultValue: 'Watermark Active' })
                  : t('watermark_disabled', { defaultValue: 'Watermark Disabled' })}
              </Label>
            </div>
            <Switch
              id="watermark-toggle"
              checked={enabled}
              onCheckedChange={setEnabled}
              className="data-[state=checked]:bg-primary ml-2"
            />
          </div>

          <Button
            variant="outline"
            onClick={handleReset}
            className="h-11 px-6 rounded-border-radius border-glass-border font-bold text-sm bg-white/5 transition-all hidden md:flex"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> {t('reset_defaults', { defaultValue: 'Reset Defaults' })}
          </Button>
        </div>

        <Button
          onClick={handleSave}
          disabled={isUpdating}
          className="h-11 px-8 rounded-border-radius font-bold text-sm primary-btn text-white! transition-all w-full sm:w-auto min-w-50"
        >
          {isUpdating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
          {t('save_configuration', { defaultValue: 'Save Configuration' })}
        </Button>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        type="image"
      />
    </div>
  )
}
