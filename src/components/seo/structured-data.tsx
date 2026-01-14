import { createStructuredData } from '@/lib/seo'

export function StructuredData() {
  const { organizationLD, softwareLD } = createStructuredData()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationLD),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareLD),
        }}
      />
    </>
  )
}