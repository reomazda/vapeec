import React from 'react'

type Props = {
  title?: string
  description?: string
  image?: string
  schema?: Record<string, any>
}

export default function SEO({ title, description, image, schema }: Props) {
  return (
    <>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      <meta property="og:type" content="website" />
      {schema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      )}
    </>
  )
}

