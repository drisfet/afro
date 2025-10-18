/**
 * Client-safe AI configuration
 * This file contains only data exports that can be safely bundled for the browser.
 * NO runtime code, NO environment variable access, NO SDK instantiation.
 */

export const AVAILABLE_MODELS = {
  'gemini-2.5-flash': {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Fast and intelligent (default)',
    supportsImages: true,
  },
  'gemini-2.5-flash-image': {
    id: 'gemini-2.5-flash-image',
    name: 'Gemini 2.5 Flash Image',
    description: 'Image generation',
    supportsImages: true,
  },
  'gemini-2.5-pro': {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Most advanced thinking',
    supportsImages: true,
  },
} as const

export const DEFAULT_MODEL_ID = 'gemini-2.5-flash' as const

export type ModelId = keyof typeof AVAILABLE_MODELS
