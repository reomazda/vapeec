export const SUPPORTED_LOCALES = ['ja', 'en', 'zh-CN', 'ko'] as const
export type Locale = typeof SUPPORTED_LOCALES[number]
export const DEFAULT_LOCALE: Locale = 'ja'

export const LOCALE_LABELS: Record<Locale, string> = {
  'ja': '日本語',
  'en': 'English',
  'zh-CN': '简体中文',
  'ko': '한국어'
}

