import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel/server'
import react from '@astrojs/react'
import tailwind from '@astrojs/tailwind'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  // Vercel requires a valid absolute site URL for sitemap/canonical URLs
  site: 'https://smokeport.co',
  // Switch to SSR on Vercel
  output: 'server',
  adapter: vercel(),
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
          'ko': 'ko',
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en', 'zh-CN', 'ko'],
    routing: { prefixDefaultLocale: true },
  },
  server: { host: true },
})
