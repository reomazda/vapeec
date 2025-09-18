import { SUPPORTED_LOCALES } from './config'

export function getLocaleStaticPaths() {
  return SUPPORTED_LOCALES.map((locale) => ({ params: { locale } }))
}

