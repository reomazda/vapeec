import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'

// SITE URL should be set in env or vercel project settings
const site = process.env.SITE_URL || 'https://example.com'

export default defineConfig({
  site,
  integrations: [
    react(),
    tailwind({ applyBaseStyles: true }),
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'ja',
        locales: {
          'ja': 'ja',
          'en': 'en',
          'zh-CN': 'zh-CN',
          'ko': 'ko'
        }
      }
    })
  ],
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en', 'zh-CN', 'ko'],
    routing: {
      prefixDefaultLocale: true
    }
  },
  server: {
    host: true
  }
})
