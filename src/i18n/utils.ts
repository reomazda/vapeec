import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from './config'

// Eager import all locale JSON files
const modules = import.meta.glob('./locales/*/*.json', { eager: true }) as Record<string, any>

type Dict = Record<string, any>
const dictionaries: Record<Locale, Record<string, Dict>> = {
  'ja': {}, 'en': {}, 'zh-CN': {}, 'ko': {}
}

for (const path in modules) {
  const m = path.match(/\.\/locales\/(ja|en|zh-CN|ko)\/(.+)\.json$/)
  if (!m) continue
  const [, locale, ns] = m
  dictionaries[locale as Locale][ns] = modules[path]?.default ?? modules[path]
}

export function isLocale(v: string | undefined | null): v is Locale {
  return !!v && (SUPPORTED_LOCALES as readonly string[]).includes(v)
}

export function getLocaleFromParams(params: Record<string, string | undefined>): Locale {
  const l = params.locale
  return isLocale(l) ? l : DEFAULT_LOCALE
}

export function getI18n(locale: Locale) {
  const dict = dictionaries[locale]
  const t = (ns: string, key: string, fallback?: string) => {
    const obj = dict[ns] || {}
    const val = key.split('.').reduce<any>((a, k) => (a ? a[k] : undefined), obj)
    return (val ?? fallback ?? key) as string
  }
  return { t, dict }
}

export function localizePath(pathname: string, target: Locale): string {
  const segs = pathname.split('?')[0].split('#')[0].split('/').filter(Boolean)
  if (segs.length === 0) return `/${target}`
  segs[0] = target
  return `/${segs.join('/')}`
}

export function altLocaleHrefs(site: URL, pathname: string) {
  const segs = pathname.split('/').filter(Boolean)
  const rest = segs.slice(1).join('/')
  const hrefs = SUPPORTED_LOCALES.map((l) => ({
    lang: l,
    href: new URL(`/${l}${rest ? '/' + rest : ''}`, site).toString()
  }))
  return [
    ...hrefs,
    { lang: 'x-default', href: new URL(`/${DEFAULT_LOCALE}${rest ? '/' + rest : ''}`, site).toString() }
  ]
}

