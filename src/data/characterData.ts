import { StyleOption, ResolutionOption } from '@/types/character'

export const characterStyles: StyleOption[] = [
  { value: 'realistic', label: 'character_style_realistic' },
  { value: 'anime', label: 'character_style_anime' },
  { value: 'cartoon', label: 'character_style_cartoon' },
  { value: '3d', label: 'character_style_3d' },
  { value: 'illustration', label: 'character_style_illustration' },
  { value: 'pixel-art', label: 'character_style_pixel_art' },
]

export const characterResolutions: ResolutionOption[] = [
  { value: '1024x1024', label: 'character_resolution_1024_1024' },
  { value: '768x768', label: 'character_resolution_768_768' },
  { value: '512x512', label: 'character_resolution_512_512' },
  { value: '512x768', label: 'character_resolution_512_768' },
  { value: '768x512', label: 'character_resolution_768_512' },
]
